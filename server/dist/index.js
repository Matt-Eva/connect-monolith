"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appConfig_1 = require("./config/appConfig");
const socketIoConfig_1 = require("./config/socketIoConfig");
const neo4jConfig_1 = __importDefault(require("./config/neo4jConfig"));
const path_1 = __importDefault(require("path"));
console.log("change");
appConfig_1.server.listen(process.env.PORT, () => {
    console.log(`Server running on ${process.env.PORT}`);
});
socketIoConfig_1.io.on("connection", socketIoConfig_1.handleConnection);
appConfig_1.app.post("/api/notification-subscription", async (req, res) => {
    if (!req.session.user)
        return res.status(401).send({ message: "unauthorized" });
    const subscription = req.body.subscription;
    const user = req.session.user;
    const userId = user.uId;
    if (subscription) {
        const session = neo4jConfig_1.default.session();
        try {
            const query = `
        MATCH (u:User {uId: $userId})
        SET u.subscribed = true, u.subscriptionEndpoint = $endpoint, u.subscriptionp256dh = $p256dh, u.subscriptionAuth = $auth
        RETURN u.subscriptionEndpoint AS endpoint, u.subscriptionp256dh AS p256dh, u.subscriptionAuth AS auth
      `;
            const queryObj = {
                userId,
                endpoint: subscription.endpoint,
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
            };
            const result = await session.executeWrite((tx) => tx.run(query, queryObj));
            const record = result.records[0];
            const newSubscription = {
                endpoint: record.get("endpoint"),
                expirationTime: null,
                keys: {
                    p256dh: record.get("p256dh"),
                    auth: record.get("auth"),
                },
            };
            res.status(201).send(newSubscription);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            await session.close();
        }
    }
});
appConfig_1.app.get("*", (req, res) => {
    return res.sendFile(path_1.default.resolve(__dirname, "../../client/dist/index.html"));
});
