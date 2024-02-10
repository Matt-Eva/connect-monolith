"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const neo4jConfig_js_1 = __importDefault(require("../config/neo4jConfig.js"));
const uuid_1 = require("uuid");
const uuid = uuid_1.v4;
exports.getChats = async (req, res) => {
    if (!req.session.user)
        return res.status(401).send({ error: "unauthorized" });
    const session = neo4jConfig_js_1.default.session();
    try {
        const userId = req.session.user.uId;
        const query = "MATCH (:User {uId: $userId}) - [:PARTICIPATING] -> (chat:Chat) <- [:PARTICIPATING] - (user:User) RETURN chat, user.firstName AS firstName, user.profileImg AS profileImg, user.uId AS uId";
        const result = await session.executeRead((tx) => tx.run(query, { userId: userId }));
        const chatHash = {};
        for (const record of result.records) {
            const chat = record.get("chat").properties;
            const user = {
                firstName: record.get("firstName"),
                profileImg: record.get("profileImg"),
                uId: record.get("uId"),
            };
            if (!chatHash[chat.uId])
                chatHash[chat.uId] = [];
            chatHash[chat.uId].push(user);
        }
        res.status(200).send(chatHash);
    }
    catch (e) {
        console.error(e);
        res.status(500).send({ error: "internal server error" });
    }
    finally {
        await session.close();
    }
};
exports.createChat = async (req, res) => {
    if (!req.session.user)
        return res.status(401).send({ error: "unauthorized" });
    const participants = [...req.body.participants];
    const userId = req.session.user.uId;
    const uIds = participants.map((participant) => participant.uId);
    const session = neo4jConfig_js_1.default.session();
    try {
        const result = await session.executeWrite(async (tx) => {
            const existingChat = await tx.run(`
                  MATCH (chat:Chat)
                  WHERE all(uId IN $uIds WHERE (:User {uId: $userId}) - [:PARTICIPATING] -> (chat) <- [:PARTICIPATING] - (:User {uId: uId}))
                  WITH chat
                  MATCH (chat) <- [p:PARTICIPATING] - ()
                  WITH chat, count(p) as count
                  WHERE count = size($uIds)
                  RETURN chat
              `, { uIds, userId });
            if (existingChat.records.length !== 0) {
                return existingChat.records[0].get("chat").properties;
            }
            const newChat = await tx.run(`
                  MATCH (user:User {uId: $userId})
                  CREATE (user) - [:PARTICIPATING] -> (c:Chat {uId: $chatId})
                  WITH c
                  UNWIND $uIds AS participantId
                  MATCH (u:User {uId: participantId})
                  CREATE (u) - [:PARTICIPATING] -> (c)
                  RETURN c AS chat
              `, { uIds, userId, chatId: uuid() });
            return newChat.records[0].get("chat").properties;
        });
        res.status(200).send(result);
    }
    catch (e) {
        console.error(e);
        res.status(500).send({ error: "internal server error" });
    }
    finally {
        await session.close();
    }
};
exports.leaveChat = async (req, res) => {
    if (!req.session.user)
        return res.status(401).send({ error: "unauthorized" });
    const selfId = req.session.user.uId;
    const chatId = req.params.chatId;
    const session = neo4jConfig_js_1.default.session();
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
    }
    catch (e) {
        console.error(e);
        res.status(500).send({ message: "internal server error" });
    }
    finally {
        await session.close();
    }
};
