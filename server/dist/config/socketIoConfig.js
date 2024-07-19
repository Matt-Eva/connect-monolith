"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleConnection = exports.io = void 0;
const socket_io_1 = require("socket.io");
const sessionConfig_js_1 = __importDefault(require("./sessionConfig.js"));
const cassandraConfig_js_1 = __importDefault(require("./cassandraConfig.js"));
const appConfig_js_1 = require("./appConfig.js");
const neo4jConfig_js_1 = __importDefault(require("./neo4jConfig.js"));
const webPushConfig_js_1 = __importDefault(require("./webPushConfig.js"));
const redisConfig_js_1 = __importDefault(require("./redisConfig.js"));
const redis_adapter_1 = require("@socket.io/redis-adapter");
const uuid_1 = require("uuid");
const uuid = uuid_1.v4;
let io;
if (process.env.NODE_ENV === "development") {
    exports.io = io = new socket_io_1.Server(appConfig_js_1.server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true,
        },
    });
}
else {
    exports.io = io = new socket_io_1.Server(appConfig_js_1.server);
}
io.adapter((0, redis_adapter_1.createAdapter)(redisConfig_js_1.default, redisConfig_js_1.default.duplicate()));
io.engine.use(sessionConfig_js_1.default);
const loadAstraMessages = async ({ chatId, }) => {
    try {
        const connect_messages = await cassandraConfig_js_1.default.collection("connect_messages");
        const result = await connect_messages.find({ chat_id: chatId }).toArray();
        return result;
    }
    catch (error) {
        console.error(error);
    }
};
const loadChat = async ({ socket, chatId, user, }) => {
    console.log("chatId", chatId);
    const session = neo4jConfig_js_1.default.session();
    try {
        const participantsQuery = `
    MATCH (:User {uId: $userId}) - [:PARTICIPATING] -> (c:Chat {uId: $chatId}) <- [:PARTICIPATING] - (u:User)
    RETURN u.firstName AS firstName, u.uId AS uId, u.name AS name, u.profileImg AS profileImg
    `;
        const participantResults = await session.executeRead(async (tx) => tx.run(participantsQuery, { userId: user.uId, chatId: chatId }));
        const participants = participantResults.records.map((record) => {
            return {
                firstName: record.get("firstName"),
                uId: record.get("uId"),
                name: record.get("name"),
                profileImg: record.get("profileImg"),
            };
        });
        const astraMessages = await loadAstraMessages({
            chatId,
        });
        const messages = [];
        if (astraMessages) {
            for (const record of astraMessages) {
                const participant = participants.find((p) => p.uId === record.user_id);
                if (participant) {
                    const createMessage = [
                        {
                            name: participant.name,
                            profileImg: participant.profileImg,
                        },
                        {
                            uId: record.id,
                            text: record.text,
                            userId: record.user_id,
                            date: record.date,
                        },
                    ];
                    messages.push(createMessage);
                }
                else {
                    const createMessage = [
                        {
                            name: user.name,
                            profileImg: user.profileImg,
                        },
                        {
                            uId: record.id,
                            text: record.text,
                            userId: record.user_id,
                            date: record.date,
                        },
                    ];
                    messages.push(createMessage);
                }
            }
        }
        socket.join(chatId);
        io.to(chatId).emit("joined", `joined room ${chatId}`);
        socket.emit("load", {
            messages,
            participants,
        });
    }
    catch (e) {
        console.error(e);
    }
    finally {
        await session.close();
    }
};
const createAstraMessage = async ({ message, chatId, }) => {
    try {
        const connect_messages = await cassandraConfig_js_1.default.collection("connect_messages");
        const newMessage = {
            text: message.text,
            user_id: message.userId,
            chat_id: chatId,
            user_profile_url: "",
            user_name_url: "",
            date: Date.now(),
            id: uuid(),
        };
        const result = await connect_messages.insertOne(newMessage);
        if (result.acknowledged === true) {
            return newMessage;
        }
        return result;
    }
    catch (error) {
        console.error(error);
    }
};
const createMessage = async ({ message, chatId, user, }) => {
    try {
        const messageRecord = await createAstraMessage({ message, chatId });
        const newMessage = [
            {
                name: user.name,
                profileImg: user.profileImg,
            },
            {
                uId: messageRecord.id,
                text: messageRecord.text,
                userId: messageRecord.user_id,
                date: messageRecord.date,
            },
        ];
        io.to(chatId).emit("new-message", newMessage);
        return newMessage;
    }
    catch (error) {
        console.error(error);
        throw new Error(error);
    }
};
const handlePushNotifications = async ({ message, chatId, userId, }) => {
    const session = neo4jConfig_js_1.default.session();
    try {
        const subscriptionQuery = `
      MATCH (c:Chat {uId: $chatId}) <- [:PARTICIPATING] - (u:User)
      WHERE NOT u.uId = $userId
      AND u.subscribed IS NOT NULL
      RETURN u.subscriptionEndpoint AS endpoint, u.subscriptionp256dh AS p256dh, u.subscriptionAuth AS auth, u.name AS name, u.subscribed AS subscribed, u.uId AS uId
    `;
        const subscriptionQueryObj = {
            chatId,
            userId,
        };
        const subscriptionResult = await session.executeRead((tx) => tx.run(subscriptionQuery, subscriptionQueryObj));
        subscriptionResult.records.forEach(async (record) => {
            const subscription = {
                endpoint: record.get("endpoint"),
                expirationTime: null,
                keys: {
                    p256dh: record.get("p256dh"),
                    auth: record.get("auth"),
                },
            };
            const payload = JSON.stringify({
                title: message[0].name,
                body: message[1].text,
            });
            try {
                await webPushConfig_js_1.default.sendNotification(subscription, payload);
            }
            catch (error) {
                if (error.statusCode === 410) {
                    const session = neo4jConfig_js_1.default.session();
                    const userId = record.get("uId");
                    const removeSubscriptionQuery = `
            MATCH (u:User {uId: $userId})
            SET u.subscribed = null
            RETURN u.subscribed AS subscribed
          `;
                    const removeSubscriptionQueryObj = {
                        userId,
                    };
                    await session.executeWrite((tx) => tx.run(removeSubscriptionQuery, removeSubscriptionQueryObj));
                    await session.close();
                }
            }
        });
    }
    catch (error) {
        console.error(error);
    }
    finally {
        await session.close();
    }
};
const handleMessage = async ({ message, chatId, user, }) => {
    const session = neo4jConfig_js_1.default.session();
    try {
        const newMessage = await createMessage({
            user,
            message,
            chatId,
        });
        await handlePushNotifications({
            message: newMessage,
            chatId,
            userId: user.uId,
        });
    }
    catch (e) {
        console.error(e);
    }
    finally {
        await session.close();
    }
};
const handleConnection = async (socket) => {
    if (!socket.request.session.user)
        return socket.disconnect();
    const chatId = socket.handshake.query.chatId;
    const user = socket.request.session.user;
    loadChat({ socket, chatId, user });
    socket.on("message", async (message) => {
        handleMessage({ message, chatId, user });
    });
};
exports.handleConnection = handleConnection;
