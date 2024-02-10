"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChats = void 0;
// This file contains functions that seed Chat nodes
const seedConfig_1 = require("../seedConfig");
const createChats = async (driver, users) => {
    const session = driver.session();
    for (let i = 0; i < 1; i++) {
        const user = users[i];
        try {
            await session.executeWrite(async (tx) => {
                const usersResults = await tx.run("MATCH (:User {email: $email}) - [:CONNECTED] - (u:User) RETURN u AS connection", { email: user.email });
                const connections = [user];
                for (const record of usersResults.records) {
                    const connection = record.get("connection").properties;
                    connections.push(connection);
                }
                const existingChat = await tx.run(`
                    MATCH (chat:Chat)
                    WHERE all(connection IN $connections WHERE (:User {uId: connection.uId}) - [:PARTICIPATING] -> (chat))
                    RETURN chat
                `, { connections });
                if (existingChat.records.length !== 0) {
                    const returnArray = [existingChat.records[0].get("chat")];
                    return returnArray;
                }
                const newChat = await tx.run(`
                    CREATE (c:Chat {uId: $uId})
                    WITH c
                    UNWIND $connections AS connection
                    MATCH (u:User {uId: connection.uId})
                    MERGE (u) - [p:PARTICIPATING] -> (c)
                    RETURN c AS chat, p AS participating, u AS user
                `, { uId: (0, seedConfig_1.uuid)(), connections: connections });
                return newChat;
            });
        }
        catch (e) {
            console.error(e);
        }
    }
    await session.close();
};
exports.createChats = createChats;
