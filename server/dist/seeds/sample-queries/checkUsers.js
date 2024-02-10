"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const seedConfig_js_1 = require("../seedConfig.js");
const checkUsers = async () => {
    const session = seedConfig_js_1.driver.session();
    try {
        const checkUsers = "MATCH (u:User) RETURN u AS user";
        const results = await session.executeRead(async (tx) => {
            return await tx.run(checkUsers);
        });
        for (const record of results.records) {
            console.log(record.get("user"));
        }
    }
    catch (error) {
        console.error(error);
    }
    finally {
        (0, seedConfig_js_1.closeDriver)();
    }
};
checkUsers();
