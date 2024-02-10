"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const seedConfig_js_1 = require("../seedConfig.js");
const checkChats = async () => {
    const session = seedConfig_js_1.driver.session();
    try {
        const checkUsers = "MATCH (c:Chat) RETURN c AS chat";
        const results = await session.executeRead(async (tx) => {
            return await tx.run(checkUsers);
        });
        for (const record of results.records) {
            console.log(record.get("chat"));
        }
    }
    catch (error) {
        console.error(error);
    }
    finally {
        (0, seedConfig_js_1.closeDriver)();
    }
};
checkChats();
