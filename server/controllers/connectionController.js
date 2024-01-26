const neoDriver = require("../config/neo4jConfig.js");
const { v4 } = require("uuid");
const uuid = v4;

exports.getConnections = async (req, res) => {
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
};
