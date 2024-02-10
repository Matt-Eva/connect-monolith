const neoDriver = require("../config/neo4jConfig.js");

exports.getConnections = async (req, res) => {
  if (!req.session.user) return res.status(401).send({ error: "unauthorized" });

  const user = req.session.user;
  const session = neoDriver.session();

  try {
    const query = `
              MATCH (user:User {uId: $userId}) - [:CONNECTED] - (c:User)
              RETURN c.name AS name, c.uId AS uId, c.profileImg AS profileImg, c.firstName AS firstName
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
        firstName: record.get("firstName"),
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
};

exports.search = async (req, res) => {
  if (!req.session.user) return res.status(401).send({ error: "unauthorized" });

  const name = req.params.name;
  const userId = req.session.user.uId;
  const session = neoDriver.session();

  try {
    const query = `
              MATCH (u:User {uId: $userId}) - [:CONNECTED] - (:User) - [:CONNECTED] -(c:User)
              WHERE c.name =~ "(?i)" + $name + ".*"
              AND NOT (c) - [:CONNECTED] - (u)
              AND NOT (c) - [:BLOCKED] - (u)
              AND u <> c
              RETURN c.uId AS uId, c.name AS name, c.profileImg AS profileImg, exists((u) - [:INVITED] -> (c)) AS pending, exists((u) <- [:INVITED] -(c)) AS invited
              UNION
              MATCH (c:User), (u:User {uId: $userId})
              WHERE c.name =~ "(?i)" + $name + ".*"
              AND NOT (c) - [:CONNECTED] - (u)
              AND NOT (c) - [:BLOCKED] - (u)
              AND c <> u
              RETURN c.uId AS uId, c.name AS name, c.firstName AS firstName, c.profileImg AS profileImg, exists((u) - [:INVITED] -> (c)) AS pending, exists((u) <- [:INVITED] -(c)) AS invited
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
        firstName: record.get("firstName"),
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
};

exports.deleteConnection = async (req, res) => {
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
};
