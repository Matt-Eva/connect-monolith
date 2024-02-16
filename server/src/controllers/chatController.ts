import neoDriver from "../config/neo4jConfig.js";
import { Request, Response } from "express";
import { v4 } from "uuid";
const uuid = v4;

exports.getChats = async (req: Request, res: Response) => {
  if (!req.session.user) return res.status(401).send({ error: "unauthorized" });

  const session = neoDriver.session();
  try {
    const userId = req.session.user.uId;
    const query = `
    MATCH (:User {uId: $userId}) - [p:PARTICIPATING] -> (chat:Chat) <- [:PARTICIPATING] - (user:User) 
    RETURN chat, user.firstName AS firstName, user.profileImg AS profileImg, user.uId AS uId, p.read < chat.updated AS unread
    ORDER BY chat.updated DESC
    `;
    const result = await session.executeRead((tx) =>
      tx.run(query, { userId: userId }),
    );

    interface User {
      firstName: string;
      profileImg: string;
      uId: string;
    }
    interface ChatHash {
      [key: string]: {
        unread: boolean;
        users: User[];
      };
    }
    const chatHash: ChatHash = {};

    for (const record of result.records) {
      const chat = record.get("chat").properties;
      const unread = record.get("unread");
      const user = {
        firstName: record.get("firstName"),
        profileImg: record.get("profileImg"),
        uId: record.get("uId"),
      };
      if (!chatHash[chat.uId]) chatHash[chat.uId] = { unread, users: [] };
      chatHash[chat.uId].users.push(user);
    }

    res.status(200).send(chatHash);
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "internal server error" });
  } finally {
    await session.close();
  }
};

exports.createChat = async (req: Request, res: Response) => {
  if (!req.session.user) return res.status(401).send({ error: "unauthorized" });

  const participants = [...req.body.participants];
  const userId = req.session.user.uId;
  const uIds = participants.map((participant) => participant.uId);
  const session = neoDriver.session();
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
        { uIds, userId },
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
        { uIds, userId, chatId: uuid() },
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
};

exports.leaveChat = async (req: Request, res: Response) => {
  if (!req.session.user) return res.status(401).send({ error: "unauthorized" });

  const selfId = req.session.user.uId;
  const chatId = req.params.chatId;
  const session = neoDriver.session();
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
};
