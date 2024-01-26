const { server, app } = require("./config/appConfig.js");
const driver = require("./config/neo4jConfig.js");
const { io, handleConnection } = require("./config/socketIoConfig.js");
const argon2 = require("argon2");
const path = require("path");
const { v4 } = require("uuid");
const uuid = v4;

server.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});

io.on("connection", handleConnection);

app.post("/api/new-account", async (req, res) => {
  const session = driver.session();

  try {
    const password = await argon2.hash(req.body.password);
    const user = await session.executeWrite(async (tx) => {
      const existingUser = await tx.run(
        `
                MATCH (u:User {email: $email}) RETURN u
            `,
        { email: req.body.email },
      );
      if (existingUser.records.length !== 0) {
        return "already exists";
      }

      const newUser = await tx.run(
        `
            CREATE (u:User {email: $email, password: $password, name: $name, firstName: $firstName, lastName: $lastName, profileImg: $profileImg, uId: $uId})
            RETURN u.email AS email, u.name AS name, u.firstName AS firstName, u.lastName AS lastName, u.profileImg AS profileImg, u.uId AS uId
            `,
        {
          email: req.body.email,
          password: password,
          name: req.body.name,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          profileImg: req.body.profileImg,
          uId: uuid(),
        },
      );
      const newUserRecord = newUser.records[0];
      return {
        email: newUserRecord.get("email"),
        name: newUserRecord.get("name"),
        firstName: newUserRecord.get("firstName"),
        lastName: newUserRecord.get("lastName"),
        profileImg: newUserRecord.get("profileImg"),
        uId: newUserRecord.get("uId"),
      };
    });
    if (user === "already exists") {
      res.status(422).send({ error: "email already in use" });
    } else {
      req.session.user = user;

      res.status(201).send(user);
    }
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "internal server error" });
  } finally {
    await session.close();
  }
});

app.patch("/api/my-account", async (req, res) => {
  if (!req.session.user) return res.status(401).send({ error: "unauthorized" });

  const selfId = req.session.user.uId;
  const newInfo = req.body.newInfo;
  const session = driver.session();
  try {
    const query = `
            MATCH (u:User {uId: $selfId})
            SET u.firstName = $firstName, u.lastName = $lastName, u.email = $email
            RETURN u.firstName AS firstName, u.lastName AS lastName, u.email AS email
        `;
    const result = await session.executeWrite((tx) =>
      tx.run(query, { ...newInfo, selfId }),
    );

    if (result.records.length !== 0) {
      const updatedInfo = {
        firstName: result.records[0].get("firstName"),
        lastName: result.records[0].get("lastName"),
        email: result.records[0].get("email"),
      };
      res.status(202).send(updatedInfo);
    } else {
      res.status(422).end();
    }
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "internal server error" });
  } finally {
    await session.close();
  }
});

app.patch("/api/update-password", async (req, res) => {
  if (!req.session.user) return res.status(401).send({ error: "unauthorized" });

  const selfId = req.session.user.uId;
  const passwordInfo = req.body.passwordInfo;
  const session = driver.session();

  try {
    const findQuery = `
            MATCH (u:User {uId: $selfId})
            RETURN u.password AS password
        `;
    const user = await session.executeRead((tx) =>
      tx.run(findQuery, { selfId }),
    );

    if (user.records.length === 0)
      return res.status(404).send({ message: "user not found" });

    const passwordHash = user.records[0].get("password");

    const authorized = await argon2.verify(
      passwordHash,
      passwordInfo.currentPassword,
    );

    if (!authorized)
      return res.status(401).send({
        message:
          "Password entered for current password does not match current password.",
      });

    const newPasswordHash = await argon2.hash(passwordInfo.newPassword);

    const updateQuery = `
            MATCH (u:User {uId: $selfId})
            SET u.password = $newPassword
        `;

    await session.executeWrite((tx) =>
      tx.run(updateQuery, { newPassword: newPasswordHash, selfId }),
    );

    res.status(202).end();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "internal server error" });
  } finally {
    await session.close();
  }
});

app.delete("/api/my-account", async (req, res) => {
  if (!req.session.user) return res.status(401).send({ error: "unauthorized" });

  const selfId = req.session.user.uId;
  const session = driver.session();
  try {
    const query = `
            MATCH (u:User {uId: $selfId})
            OPTIONAL MATCH (u) - [:SENT] -> (m:Message)
            DETACH DELETE u, m
        `;

    await session.executeWrite((tx) => tx.run(query, { selfId }));

    res.status(202).end();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "internal server error" });
  } finally {
    await session.close();
  }
});

app.get("/api/my-chats", async (req, res) => {
  if (!req.session.user) return res.status(401).send({ error: "unauthorized" });

  const session = driver.session();
  try {
    const userId = req.session.user.uId;
    const query =
      "MATCH (:User {uId: $userId}) - [:PARTICIPATING] -> (chat:Chat) <- [:PARTICIPATING] - (user:User) RETURN chat, user.firstName AS firstName, user.profileImg AS profileImg, user.uId AS uId";
    const result = await session.executeRead((tx) =>
      tx.run(query, { userId: userId }),
    );

    const chatHash = {};

    for (const record of result.records) {
      const chat = record.get("chat").properties;
      const user = {
        firstName: record.get("firstName"),
        profileImg: record.get("profileImg"),
        uId: record.get("uId"),
      };
      if (!chatHash[chat.uId]) chatHash[chat.uId] = [];
      chatHash[chat.uId].push(user);
    }

    res.status(200).send(chatHash);
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "internal server error" });
  } finally {
    await session.close();
  }
});

app.post("/api/new-chat", async (req, res) => {
  if (!req.session.user) return res.status(401).send({ error: "unauthorized" });

  const participants = [...req.body.participants];
  const uIds = participants.map((participant) => participant.uId);
  const session = driver.session();
  try {
    const result = await session.executeWrite(async (tx) => {
      const existingChat = await tx.run(
        `
                MATCH (chat:Chat)
                WHERE all(uId IN $uIds WHERE (:User {uId: $userId}) - [:PARTICIPATING] -> (chat) <- [:PARTICIPATING] - (:User {uId: uId}))
                WITH chat
                MATCH (chat) <- [p:PARTICIPATING] - ()
                WITH chat, count(p) as count
                WHERE count = size($uIds)
                RETURN chat
            `,
        { uIds: uIds, userId: req.session.user.uId },
      );

      if (existingChat.records.length !== 0) {
        return existingChat.records[0].get("chat").properties;
      }

      const newChat = await tx.run(
        `
                MATCH (user:User {uId: $userId})
                CREATE (user) - [:PARTICIPATING] -> (c:Chat {uId: $chatId})
                WITH c
                UNWIND $uIds AS participantId
                MATCH (u:User {uId: participantId})
                CREATE (u) - [:PARTICIPATING] -> (c)
                RETURN c AS chat
            `,
        { uIds: uIds, userId: req.session.user.uId, chatId: uuid() },
      );

      return newChat.records[0].get("chat").properties;
    });

    res.status(200).send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "internal server error" });
  } finally {
    await session.close();
  }
});

app.delete("/api/leave-chat/:chatId", async (req, res) => {
  if (!req.session.user) return res.status(401).send({ error: "unauthorized" });

  const selfId = req.session.user.uId;
  const chatId = req.params.chatId;
  const session = driver.session();
  try {
    const query = `
            MATCH (u:User {uId: $selfId}) - [p:PARTICIPATING] -> (c:Chat {uId: $chatId})
            DELETE p
            WITH c
            WHERE COUNT {(c) <-[:PARTICIPATING] - () } = 1
            DETACH DELETE c
        `;

    await session.executeWrite((tx) => tx.run(query, { selfId, chatId }));

    res.status(202).end();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "internal server error" });
  } finally {
    await session.close();
  }
});

app.get("/api/my-connections", async (req, res) => {
  if (!req.session.user) return res.status(401).send({ error: "unauthorized" });

  const user = req.session.user;
  const session = driver.session();

  try {
    const query = `
            MATCH (user:User {uId: $userId}) - [:CONNECTED] - (c:User)
            RETURN c.name AS name, c.uId AS uId, c.profileImg AS profileImg
        `;
    const result = await session.executeRead((tx) =>
      tx.run(query, { userId: user.uId }),
    );

    const connections = [];

    for (const record of result.records) {
      const connection = {
        name: record.get("name"),
        uId: record.get("uId"),
        profileImg: record.get("profileImg"),
      };

      connections.push(connection);
    }

    res.status(200).send(connections);
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "internal server error" });
  } finally {
    await session.close();
  }
});

app.get("/api/search-connections/:name", async (req, res) => {
  if (!req.session.user) return res.status(401).send({ error: "unauthorized" });

  const name = req.params.name;
  const userId = req.session.user.uId;
  const session = driver.session();

  try {
    const query = `
            MATCH (u:User {uId: $userId}) - [:CONNECTED] - (:User) - [:CONNECTED] -(c:User)
            WHERE c.name STARTS WITH $name
            AND NOT (c) - [:CONNECTED] - (u)
            AND NOT (c) - [:BLOCKED] - (u)
            AND u <> c
            RETURN c.uId AS uId, c.name AS name, c.profileImg AS profileImg, exists((u) - [:INVITED] -> (c)) AS pending, exists((u) <- [:INVITED] -(c)) AS invited
            UNION
            MATCH (c:User), (u:User {uId: $userId})
            WHERE c.name STARTS WITH $name
            AND NOT (c) - [:CONNECTED] - (u)
            AND NOT (c) - [:BLOCKED] - (u)
            AND c <> u
            RETURN c.uId AS uId, c.name AS name, c.profileImg AS profileImg, exists((u) - [:INVITED] -> (c)) AS pending, exists((u) <- [:INVITED] -(c)) AS invited
            LIMIT 50
        `;
    const result = await session.executeRead((tx) =>
      tx.run(query, { name: name, userId: userId }),
    );

    const searchResults = [];
    for (const record of result.records) {
      const user = {
        uId: record.get("uId"),
        name: record.get("name"),
        pending: record.get("pending"),
        invited: record.get("invited"),
        profileImg: record.get("profileImg"),
      };
      searchResults.push(user);
    }

    res.status(200).send(searchResults);
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "internal server error" });
  } finally {
    await session.close();
  }
});

app.delete("/api/delete-connection/:connectionId", async (req, res) => {
  if (!req.session.user)
    return res.status(401).send({ message: "unauthorized" });
  const connectionId = req.params.connectionId;
  const selfId = req.session.user.uId;
  const session = driver.session();

  try {
    const query = `
            MATCH (s:User {uId: $selfId}) - [c:CONNECTED] - (u:User {uId: $connectionId})
            DELETE c
            RETURN exists((s) - [:CONNECTED] -(u)) AS connected
        `;
    const result = await session.executeWrite((tx) =>
      tx.run(query, { selfId, connectionId }),
    );

    if (!result.records[0].get("connected")) {
      res.status(202).end();
    }
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "internal server error" });
  } finally {
    await session.close();
  }
});

app.get("/api/my-invitations", async (req, res) => {
  if (!req.session.user)
    return res.status(401).send({ message: "unauthorized" });

  const userId = req.session.user.uId;
  const session = driver.session();

  try {
    const query = `
            MATCH (s:User {uId: $userId}) <- [:INVITED] - (u:User)
            WHERE NOT (s) - [:IGNORED] -> (u)
            RETURN u.name AS name, u.profileImg AS profileImg, u.uId AS uId
        `;
    const result = await session.executeRead((tx) =>
      tx.run(query, { userId: userId }),
    );

    const invitations = result.records.map((record) => {
      return {
        name: record.get("name"),
        profileImg: record.get("profileImg"),
        uId: record.get("uId"),
      };
    });

    res.status(200).send(invitations);
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "internal server error" });
  } finally {
    await session.close();
  }
});

app.post("/api/invite-connection", async (req, res) => {
  if (!req.session.user) return res.status(401).send({ error: "unauthorized" });

  const { connectionId } = req.body;
  const userId = req.session.user.uId;
  const session = driver.session();

  try {
    const query = `
            MATCH (u:User {uId: $userId}), (c:User {uId: $connectionId})
            MERGE (u) - [i:INVITED] -> (c)
            RETURN i
        `;
    await session.executeWrite((tx) =>
      tx.run(query, { userId: userId, connectionId: connectionId }),
    );

    res.status(201).end();
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "internal server error" });
  } finally {
    await session.close();
  }
});

app.post("/api/accept-invitation", async (req, res) => {
  if (!req.session.user)
    return res.status(401).send({ message: "unauthorized" });

  const { connectionId } = req.body;
  const userId = req.session.user.uId;
  const session = driver.session();

  try {
    const query = ` 
            MATCH (s:User {uId: $userId}) - [in:INVITED] - (u:User {uId: $connectionId})
            OPTIONAL MATCH (s) - [ig:IGNORED] - (u)
            DELETE in, ig
            MERGE (s) - [c:CONNECTED] -> (u)
            RETURN c AS connected
        `;
    const result = await session.executeWrite((tx) =>
      tx.run(query, { userId: userId, connectionId: connectionId }),
    );

    if (result.records.length !== 0) {
      res.status(201).end();
    } else {
      res.status(422).end();
    }
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "internal server error" });
  } finally {
    await session.close();
  }
});

app.post("/api/ignore-invitation", async (req, res) => {
  if (!req.session.user)
    return res.status(401).send({ message: "unauthorized" });

  const { connectionId } = req.body;
  const selfId = req.session.user.uId;
  const session = driver.session();
  try {
    const query = `
            MATCH (s:User {uId: $selfId}) <- [:INVITED] - (u:User {uId: $connectionId})
            MERGE (s) - [i:IGNORED] -> (u)
            RETURN i
        `;
    const result = await session.executeWrite((tx) =>
      tx.run(query, { selfId, connectionId }),
    );

    res.status(201).end();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "internal server error" });
  } finally {
    await session.close();
  }
});

app.post("/api/block-user", async (req, res) => {
  if (!req.session.user)
    return res.status(401).send({ message: "unauthorized" });

  const userId = req.body.userId;
  const selfId = req.session.user.uId;
  const session = driver.session();
  try {
    const query = `
            MATCH (s:User {uId: $selfId}), (u:User {uId: $userId})
            OPTIONAL MATCH (s) - [in:INVITED] - (u)
            OPTIONAL MATCH (s) - [c:CONNECTED] - (u)
            OPTIONAL MATCH (s) - [ig:IGNORED] - (u)
            DELETE in, c, ig
            MERGE (s) - [b:BLOCKED] - (u)
            RETURN b AS blocked
        `;
    const result = await session.executeWrite((tx) =>
      tx.run(query, { selfId, userId }),
    );

    if (result.records.length !== 0) {
      res.status(201).end();
    } else {
      res.status(422).end();
    }
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "interal server error" });
  } finally {
    await session.close();
  }
});

app.get("/api/blocked-users", async (req, res) => {
  if (!req.session.user)
    return res.status(401).send({ message: "unauthorized" });

  const selfId = req.session.user.uId;
  const session = driver.session();

  try {
    const query = `
            MATCH (s:User {uId: $selfId}) - [:BLOCKED] -> (u:User)
            RETURN u.name AS name, u.uId AS uId, u.profileImg AS profileImg
        `;
    const result = await session.executeRead((tx) => tx.run(query, { selfId }));

    const blockedUsers = result.records.map((user) => {
      return {
        name: user.get("name"),
        uId: user.get("uId"),
        profileImg: user.get("profileImg"),
      };
    });

    res.status(200).send(blockedUsers);
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "internal server error" });
  } finally {
    await session.close();
  }
});

app.delete("/api/unblock-user/:userId", async (req, res) => {
  if (!req.session.user)
    return res.status(401).send({ message: "unauthorized" });

  const userId = req.params.userId;
  const selfId = req.session.user.uId;
  const session = driver.session();

  try {
    const query = `
            MATCH (s:User {uId: $selfId}) - [b:BLOCKED] -> (u:User {uId: $userId})
            DELETE b
            RETURN exists((s) - [:BLOCKED] -> (u)) AS blocked
        `;
    const result = await session.executeWrite((tx) =>
      tx.run(query, { selfId, userId }),
    );

    console.log(result.records);

    if (
      result.records.length !== 0 &&
      result.records[0].get("blocked") === false
    ) {
      res.status(202).end();
    } else {
      res.status(422).end();
    }
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "internal server error" });
  } finally {
    await session.close();
  }
});

app.get("/api/user/:id", async (req, res) => {
  if (!req.session.user) return res.status(401).send({ error: "unauthorized" });

  const selfId = req.session.user.uId;
  const userId = req.params.id;
  const session = driver.session();
  try {
    const query = `
            MATCH (s:User {uId: $selfId}), (u:User {uId: $userId}) 
            WHERE NOT (s) <- [:BLOCKED] - (u)
            RETURN u.profileImg AS profileImg, u.name AS name, exists((s) - [:CONNECTED] - (u)) AS connected, exists((s) - [:INVITED] -> (u)) AS pending, exists((s) <- [:INVITED] - (u)) AS invited, exists((s) - [:BLOCKED] -> (u)) AS blocked, exists((s) - [:IGNORED] -> (u)) AS ignored`;
    const result = await session.executeRead((tx) =>
      tx.run(query, { userId: userId, selfId: selfId }),
    );
    if (result.records.length !== 0) {
      const user = {
        profileImg: result.records[0].get("profileImg"),
        name: result.records[0].get("name"),
        connected: result.records[0].get("connected"),
        invited: result.records[0].get("invited"),
        pending: result.records[0].get("pending"),
        blocked: result.records[0].get("blocked"),
        ignored: result.records[0].get("ignored"),
        uId: userId,
      };

      res.status(200).send(user);
    } else {
      res.status(404).send({ message: "user not found" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "internal server error" });
  } finally {
    await session.close();
  }
});

app.get("*", (req, res) => {
  return res.sendFile(path.resolve(__dirname, "../client/dist/index.html"));
});
