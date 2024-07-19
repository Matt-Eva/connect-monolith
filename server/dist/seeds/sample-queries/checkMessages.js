"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const seedConfig_js_1 = require("../seedConfig.js");
const checkMessages = async () => {
    const session = seedConfig_js_1.driver.session();
    try {
        const checkMessages = "MATCH (m:Message) RETURN m AS message";
        const results = await session.executeRead(async (tx) => {
            return await tx.run(checkMessages);
        });
        for (const record of results.records) {
            console.log(record.get("message"));
        }
    }
    catch (error) {
        console.error(error);
    }
    finally {
        (0, seedConfig_js_1.closeDriver)();
    }
};
checkMessages();
