"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const seedConfig_1 = require("./seedConfig");
const userSeeds_1 = require("./node-seeds/userSeeds");
// import { createMultiples } from "./testCreateMultiple";
const chatSeeds_1 = require("./node-seeds/chatSeeds");
const messageSeeds_1 = require("./node-seeds/messageSeeds");
const clearDatabase = async () => {
    console.log("clearing");
    try {
        const session = seedConfig_1.driver.session();
        await session.executeWrite(async (tx) => {
            await tx.run("MATCH (n) DETACH DELETE n ");
        });
        console.log("cleared");
    }
    catch (e) {
        console.error(e);
    }
};
const seed = async () => {
    await clearDatabase();
    console.log("seeding");
    const users = await (0, userSeeds_1.createUsers)(seedConfig_1.driver);
    console.log("seeded users");
    console.log("seeding chats");
    const chats = await (0, chatSeeds_1.createChats)(seedConfig_1.driver, users);
    console.log("chats seeded");
    console.log("seeding messages");
    const messages = await (0, messageSeeds_1.createMessages)(seedConfig_1.driver, users);
    console.log("messages seeded");
    await (0, seedConfig_1.closeDriver)();
};
seed();
