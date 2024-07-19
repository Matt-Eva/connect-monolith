"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cassandraConfig_1 = __importDefault(require("../config/cassandraConfig"));
const neo4jConfig_1 = __importDefault(require("../config/neo4jConfig"));
const webPushConfig_js_1 = __importDefault(require("../config/webPushConfig.js"));
const uuid_1 = require("uuid");
const uuid = uuid_1.v4;
const createAstraMessage = async ({ message, chatId, }) => {
    const connect_messages = await cassandraConfig_1.default.collection("connect_messages");
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
    if (result.acknowledged) {
        return newMessage;
    }
    else {
        throw new Error("could not insert new message");
    }
};
const updateChat = async ({ chatId, userId, }) => {
    const session = neo4jConfig_1.default.session();
    try {
        const query = `
    MATCH (c:Chat {uId: $chatId}), (u: User {uId: $userId})
    SET c.updated = $now, u.read = $now
    `;
        await session.executeWrite((tx) => tx.run(query, { chatId, userId, now: Date.now() }));
    }
    catch (error) {
        console.error(error);
        throw new Error(error);
    }
    finally {
        await session.close();
    }
};
const createMessage = async ({ message, chatId, user, io, }) => {
    try {
        const record = await createAstraMessage({ message, chatId });
        await updateChat({ chatId, userId: user.uId });
        const newMessage = {
            user: {
                name: user.name,
                profileImg: user.profileImg,
            },
            message: {
                uId: record.id,
                text: record.text,
                userId: record.user_id,
                date: record.date,
            },
        };
        io.to(chatId).emit("new-message", newMessage);
        return newMessage;
    }
    catch (error) {
        console.error(error);
        throw new Error(error);
    }
};
const handlePushNotifications = async ({ message, chatId, userId, }) => {
    const session = neo4jConfig_1.default.session();
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
                chatId,
                title: message.participants,
                body: `${message.username}: ${message.text}`,
            });
            try {
                await webPushConfig_js_1.default.sendNotification(subscription, payload);
            }
            catch (error) {
                if (error.statusCode === 410) {
                    const session = neo4jConfig_1.default.session();
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
const handleMessage = async ({ message, chatId, user, io, }) => {
    const session = neo4jConfig_1.default.session();
    try {
        await createMessage({
            user,
            message,
            chatId,
            io,
        });
        const pushMessage = {
            participants: message.usernames,
            username: user.name,
            text: message.text,
        };
        await handlePushNotifications({
            message: pushMessage,
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
exports.default = handleMessage;
