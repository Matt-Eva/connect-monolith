const neoDriver = require("../config/neo4jConfig.js");
const { v4 } = require("uuid");
const uuid = v4;

exports.getInvitations = async (req, res) => {
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
};
