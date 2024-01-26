const neoDriver = require("../config/neo4jConfig.js");
const { v4 } = require("uuid");
const uuid = v4;

exports.getChats = async (req, res) => {
  if (!req.session.user) return res.status(401).send({ error: "unauthorized" });

  const session = neoDriver.session();
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
};
