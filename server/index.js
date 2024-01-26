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

app.get("*", (req, res) => {
  return res.sendFile(path.resolve(__dirname, "../client/dist/index.html"));
});
