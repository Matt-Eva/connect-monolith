const neoDriver = require("../config/neo4jConfig.js");

exports.blockUser = async (req, res) => {
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
};
