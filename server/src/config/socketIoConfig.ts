import { Server, Socket } from "socket.io";
import sessionMiddleware from "./sessionConfig.js";
import { server } from "./appConfig.js";
import neoDriver from "./neo4jConfig.js";
import webPush from "./webPushConfig.js";
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
    date: string;
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

io.engine.use(sessionMiddleware);

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
    const messageQuery = `
            MATCH (:User {uId: $userId}) - [:PARTICIPATING] -> (c:Chat {uId: $chatId}) <- [:SENT_IN_CHAT] - (m:Message) <- [:SENT] - (u:User)
            RETURN u.name AS name, u.profileImg AS profileImg, u.uId AS userId, m
            ORDER BY m.date
        `;
    const messageResults = await session.executeRead(async (tx) =>
      tx.run(messageQuery, { userId: userId, chatId: chatId }),
    );

    const messages = [];

    for (const record of messageResults.records) {
      const message = record.get("m").properties;
      const user = {
        name: record.get("name"),
        profileImg: record.get("profileImg"),
        uId: record.get("userId"),
      };
      messages.push([user, message]);
    }

    const participantsQuery = `
            MATCH (:User {uId: $userId}) - [:PARTICIPATING] -> (c:Chat {uId: $chatId}) <- [:PARTICIPATING] - (u:User)
            RETURN u.firstName AS firstName, u.uId AS uId
        `;
    const participantResults = await session.executeRead(async (tx) =>
      tx.run(participantsQuery, { userId: userId, chatId: chatId }),
    );

    const participants = participantResults.records.map((record) => {
      return { firstName: record.get("firstName"), uId: record.get("uId") };
    });

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

const createMessage = async ({
  message,
  chatId,
}: {
  message: IncomingMessage;
  chatId: string;
}) => {
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

module.exports = {
  io,
  handleConnection,
};