"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cassandraConfig_1 = __importDefault(require("../config/cassandraConfig"));
const neo4jConfig_1 = __importDefault(require("../config/neo4jConfig"));
const loadAstraMessages = async ({ chatId, }) => {
    try {
        const connect_messages = await cassandraConfig_1.default.collection("connect_messages");
        const result = await connect_messages.find({ chat_id: chatId }).toArray();
        return result;
    }
    catch (error) {
        console.error(error);
    }
};
const loadNeoParticipants = async ({ userId, chatId, }) => {
    const session = neo4jConfig_1.default.session();
    try {
        const participantsQuery = `
      MATCH (:User {uId: $userId}) - [p:PARTICIPATING] -> (c:Chat {uId: $chatId}) <- [:PARTICIPATING] - (u:User)
      SET p.read = $now
      RETURN u.firstName AS firstName, u.uId AS uId, u.name AS name, u.profileImg AS profileImg
      `;
        const participantResults = await session.executeWrite(async (tx) => tx.run(participantsQuery, { userId, chatId, now: Date.now() }));
        const participants = participantResults.records.map((record) => {
            return {
                firstName: record.get("firstName"),
                uId: record.get("uId"),
                name: record.get("name"),
                profileImg: record.get("profileImg"),
            };
        });
        return participants;
    }
    catch (error) {
        console.error(error);
    }
    finally {
        await session.close();
    }
};
const configureMessages = ({ participants, astraMessages, user, }) => {
    const messages = [];
    for (const record of astraMessages) {
        const participant = participants.find((p) => p.uId === record.user_id);
        let messageUser;
        if (participant) {
            messageUser = participant;
        }
        else {
            messageUser = user;
        }
        const createMessage = {
            user: {
                name: messageUser.name,
                profileImg: messageUser.profileImg,
            },
            message: {
                uId: record.id,
                text: record.text,
                userId: record.user_id,
                date: record.date,
            },
        };
        messages.push(createMessage);
    }
    return messages;
};
const loadChat = async ({ socket, chatId, user, }) => {
    try {
        const participants = await loadNeoParticipants({
            chatId,
            userId: user.uId,
        });
        const astraMessages = await loadAstraMessages({
            chatId,
        });
        if (participants && astraMessages) {
            const messages = configureMessages({
                user,
                participants,
                astraMessages,
            });
            socket.join(chatId);
            socket.emit("load", {
                messages,
                participants,
            });
        }
        else {
            throw new Error("could not load chat resources");
        }
    }
    catch (e) {
        console.error(e);
        throw new Error(e);
    }
};
exports.default = loadChat;
