"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const neo4jConfig_js_1 = __importDefault(require("../config/neo4jConfig.js"));
exports.blockUser = async (req, res) => {
    if (!req.session.user)
        return res.status(401).send({ message: "unauthorized" });
    const userId = req.body.userId;
    const selfId = req.session.user.uId;
    const session = neo4jConfig_js_1.default.session();
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
        const result = await session.executeWrite((tx) => tx.run(query, { selfId, userId }));
        if (result.records.length !== 0) {
            res.status(201).end();
        }
        else {
            res.status(422).end();
        }
    }
    catch (e) {
        console.error(e);
        res.status(500).send({ message: "interal server error" });
    }
    finally {
        await session.close();
    }
};
exports.loadBlockedUsers = async (req, res) => {
    if (!req.session.user)
        return res.status(401).send({ message: "unauthorized" });
    const selfId = req.session.user.uId;
    const session = neo4jConfig_js_1.default.session();
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
    }
    catch (e) {
        console.error(e);
        res.status(500).send({ message: "internal server error" });
    }
    finally {
        await session.close();
    }
};
exports.unblockUser = async (req, res) => {
    if (!req.session.user)
        return res.status(401).send({ message: "unauthorized" });
    const userId = req.params.userId;
    const selfId = req.session.user.uId;
    const session = neo4jConfig_js_1.default.session();
    try {
        const query = `
              MATCH (s:User {uId: $selfId}) - [b:BLOCKED] -> (u:User {uId: $userId})
              DELETE b
              RETURN exists((s) - [:BLOCKED] -> (u)) AS blocked
          `;
        const result = await session.executeWrite((tx) => tx.run(query, { selfId, userId }));
        console.log(result.records);
        if (result.records.length !== 0 &&
            result.records[0].get("blocked") === false) {
            res.status(202).end();
        }
        else {
            res.status(422).end();
        }
    }
    catch (e) {
        console.error(e);
        res.status(500).send({ message: "internal server error" });
    }
    finally {
        await session.close();
    }
};
