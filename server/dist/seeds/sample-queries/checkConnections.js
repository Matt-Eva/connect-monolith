"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// this file checks for the successful creation / existence of [:CONNECTED] relationships
const seedConfig_js_1 = require("../seedConfig.js");
const checkConnections = async () => {
    const session = seedConfig_js_1.driver.session();
    try {
        const checkConnected = "MATCH (u1:User {name: 'Tom'}) - [:CONNECTED] - (u2:User) RETURN u1, u2";
        const results = await session.executeRead(async (tx) => {
            return await tx.run(checkConnected);
        });
        for (const record of results.records) {
            console.log([record.get("u1"), record.get("u2")]);
        }
    }
    catch (error) {
        console.error(error);
    }
    finally {
        (0, seedConfig_js_1.closeDriver)();
    }
};
checkConnections();
