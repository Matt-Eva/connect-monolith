const { server, app } = require("./config/appConfig.js");
const neoDriver = require("./config/neo4jConfig.js");
const { io, handleConnection } = require("./config/socketIoConfig.js");
const path = require("path");
const { v4 } = require("uuid");
const uuid = v4;

server.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});

io.on("connection", handleConnection);

app.get("/api/my-connections", async (req, res) => {
  if (!req.session.user) return res.status(401).send({ error: "unauthorized" });

  const user = req.session.user;
  const session = neoDriver.session();

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
  const session = neoDriver.session();

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
  const session = neoDriver.session();

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
  const session = neoDriver.session();

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
  const session = neoDriver.session();

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
  const session = neoDriver.session();

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
  const session = neoDriver.session();
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
  const session = neoDriver.session();
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
  const session = neoDriver.session();

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
  const session = neoDriver.session();

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
  const session = neoDriver.session();
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
