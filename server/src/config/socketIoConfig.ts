import { Server, Socket } from "socket.io";
import sessionMiddleware from "./sessionConfig.js";
import astraClient from "./cassandraConfig.js";
import { server } from "./appConfig.js";
import neoDriver from "./neo4jConfig.js";
import webPush from "./webPushConfig.js";
import redisClient from "./redisConfig.js";
import { createAdapter } from "@socket.io/redis-adapter";
import { v4 } from "uuid";
const uuid = v4;

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

interface IncomingMessage {
  userId: string;
  chatId: string;
  text: string;
}

type CreatedMessage = [
  {
    name: string;
    profileImg: string;
  },
  {
    text: string;
    uId: string;
    date: number;
    userId: string;
  },
];

let io: Server;

if (process.env.NODE_ENV === "development") {
  io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });
} else {
  io = new Server(server);
}

io.adapter(createAdapter(redisClient, redisClient.duplicate()));

io.engine.use(sessionMiddleware);

interface AstraMessage {
  chat_id: string;
  user_id: string;
  text: string;
  id: string;
  date: number;
}
const loadAstraMessages = async ({
  chatId,
}: {
  chatId: string;
}): Promise<AstraMessage[] | undefined> => {
  try {
    const connect_messages = await astraClient.collection("connect_messages");
    const result = await connect_messages.find({ chat_id: chatId }).toArray();
    return result;
  } catch (error) {
    console.error(error);
  }
};

const loadChat = async ({
  socket,
  chatId,
  userId,
}: {
  socket: Socket;
  chatId: string;
  userId: string;
}) => {
  const session = neoDriver.session();
  try {
    const participantsQuery = `
    MATCH (c:Chat {uId: $chatId}) <- [:PARTICIPATING] - (u:User)
    RETURN u.firstName AS firstName, u.uId AS uId, u.name AS name, u.profileImg AS
    `;
    const participantResults = await session.executeRead(async (tx) =>
      tx.run(participantsQuery, { userId: userId, chatId: chatId }),
    );

    const participants = participantResults.records.map((record) => {
      return {
        firstName: record.get("firstName"),
        uId: record.get("uId"),
        name: record.get("name"),
        profileImg: record.get("profileImg"),
      };
    });

    const astraMessages: AstraMessage[] | undefined = await loadAstraMessages({
      chatId,
    });

    const messages: CreatedMessage[] = [];

    if (astraMessages) {
      for (const record of astraMessages) {
        const participant = participants.find((p) => p.uId === record.user_id);
        if (participant) {
          const createMessage: CreatedMessage = [
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
      }
    }

    socket.join(chatId);

    io.to(chatId).emit("joined", `joined room ${chatId}`);

    socket.emit("load", {
      messages,
      participants,
    });
  } catch (e) {
    console.error(e);
  } finally {
    await session.close();
  }
};

const createAstraMessage = async ({
  message,
  chatId,
}: {
  message: IncomingMessage;
  chatId: string;
}) => {
  try {
    const connect_messages = await astraClient.collection("connect_messages");

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
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

const createMessage = async ({
  message,
  chatId,
}: {
  message: IncomingMessage;
  chatId: string;
}) => {
  createAstraMessage({ message, chatId });
  const session = neoDriver.session();
  try {
    const messageQuery = `
            MATCH (user:User {uId: $userId}), (c:Chat {uId: $chatId})
            CREATE (user) - [:SENT] -> (message:Message {uId: $uId, text: $text, date: $date, userId: $userId}) - [:SENT_IN_CHAT] ->(c)
            RETURN user.name AS name, user.profileImg AS profileImg, message
            ORDER BY message.date DESC
        `;

    const messageQueryObj = {
      userId: message.userId,
      uId: uuid(),
      text: message.text,
      date: Date.now(),
      chatId: message.chatId,
    };

    const messageResult = await session.executeWrite(async (tx) =>
      tx.run(messageQuery, messageQueryObj),
    );

    const messageRecord = messageResult.records[0];

    const newMessage: CreatedMessage = [
      {
        name: messageRecord.get("name"),
        profileImg: messageRecord.get("profileImg"),
      },
      messageRecord.get("message").properties,
    ];

    io.to(chatId).emit("new-message", newMessage);

    return newMessage;
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  } finally {
    await session.close();
  }
};

const handlePushNotifications = async ({
  message,
  chatId,
  userId,
}: {
  message: CreatedMessage;
  chatId: string;
  userId: string;
}) => {
  const session = neoDriver.session();

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

    const subscriptionResult = await session.executeRead((tx) =>
      tx.run(subscriptionQuery, subscriptionQueryObj),
    );

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
        await webPush.sendNotification(subscription, payload);
      } catch (error: any) {
        if (error.statusCode === 410) {
          const session = neoDriver.session();
          const userId = record.get("uId");

          const removeSubscriptionQuery = `
            MATCH (u:User {uId: $userId})
            SET u.subscribed = null
            RETURN u.subscribed AS subscribed
          `;

          const removeSubscriptionQueryObj = {
            userId,
          };

          await session.executeWrite((tx) =>
            tx.run(removeSubscriptionQuery, removeSubscriptionQueryObj),
          );
          await session.close();
        }
      }
    });
  } catch (error) {
    console.error(error);
  } finally {
    await session.close();
  }
};

const handleMessage = async ({
  message,
  chatId,
  userId,
}: {
  message: IncomingMessage;
  chatId: string;
  userId: string;
}) => {
  const session = neoDriver.session();

  try {
    const newMessage: CreatedMessage = await createMessage({ message, chatId });

    await handlePushNotifications({ message: newMessage, chatId, userId });
  } catch (e) {
    console.error(e);
  } finally {
    await session.close();
  }
};

const handleConnection = async (socket: any) => {
  if (!socket.request.session.user) return socket.disconnect();

  const chatId = socket.handshake.query.chatId;
  const userId = socket.request.session.user.uId;

  loadChat({ socket, chatId, userId });

  socket.on("message", async (message: IncomingMessage) => {
    handleMessage({ message, chatId, userId });
  });
};
export { io, handleConnection };
