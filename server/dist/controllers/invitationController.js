"use strict";
const neoDriver = require("../config/neo4jConfig.js");
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
        const result = await session.executeRead((tx) => tx.run(query, { userId: userId }));
        const invitations = result.records.map((record) => {
            return {
                name: record.get("name"),
                profileImg: record.get("profileImg"),
                uId: record.get("uId"),
            };
        });
        res.status(200).send(invitations);
    }
    catch (e) {
        console.error(e);
        res.status(500).send({ message: "internal server error" });
    }
    finally {
        await session.close();
    }
};
exports.createInvitation = async (req, res) => {
    if (!req.session.user)
        return res.status(401).send({ error: "unauthorized" });
    const { connectionId } = req.body;
    const userId = req.session.user.uId;
    const session = neoDriver.session();
    try {
        const query = `
              MATCH (u:User {uId: $userId}), (c:User {uId: $connectionId})
              MERGE (u) - [i:INVITED] -> (c)
              RETURN i
          `;
        await session.executeWrite((tx) => tx.run(query, { userId: userId, connectionId: connectionId }));
        res.status(201).end();
    }
    catch (e) {
        console.error(e);
        res.status(500).send({ error: "internal server error" });
    }
    finally {
        await session.close();
    }
};
exports.acceptInvitation = async (req, res) => {
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
        const result = await session.executeWrite((tx) => tx.run(query, { userId: userId, connectionId: connectionId }));
        if (result.records.length !== 0) {
            res.status(201).end();
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
exports.ignoreInvitation = async (req, res) => {
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
        const result = await session.executeWrite((tx) => tx.run(query, { selfId, connectionId }));
        res.status(201).end();
    }
    catch (e) {
        console.error(e);
        res.status(500).send({ message: "internal server error" });
    }
    finally {
        await session.close();
    }
};
