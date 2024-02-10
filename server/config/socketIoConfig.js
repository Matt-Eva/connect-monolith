const { Server } = require("socket.io");

const sessionMiddleware = require("./sessionConfig.js");
const { server } = require("./appConfig.js");
const neoDriver = require("./neo4jConfig.js");
const webPush = require("./webPushConfig.js");
const { v4 } = require("uuid");
const uuid = v4;

let io;

if (process.env.NODE_ENV === "development") {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });
} else {
  io = new Server(server);
}

io.engine.use(sessionMiddleware);

const loadChat = async ({ socket, chatId, userId }) => {
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

const createMessage = async ({ message, chatId, userId }) => {
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

    const newMessage = [
      {
        name: messageRecord.get("name"),
        profileImg: messageRecord.get("profileImg"),
      },
      messageRecord.get("message").properties,
    ];

    io.to(chatId).emit("new-message", newMessage);

    return newMessage;
  } catch (error) {
    throw new Error(error);
  } finally {
    await session.close();
  }
};

const handlePushNotifications = async ({ message, chatId, userId }) => {
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
      } catch (error) {
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
    throw new Error(error);
  } finally {
    await session.close();
  }
};

const handleMessage = async ({ message, chatId, userId }) => {
  const session = neoDriver.session();

  try {
    const newMessage = await createMessage({ message, chatId, userId });

    await handlePushNotifications({ message: newMessage, chatId, userId });
  } catch (e) {
    console.error(e);
  } finally {
    await session.close();
  }
};

const handleConnection = async (socket) => {
  if (!socket.request.session.user) return socket.disconnect();

  const chatId = socket.handshake.query.chatId;
  const userId = socket.request.session.user.uId;

  loadChat({ socket, chatId, userId });

  socket.on("message", async (message) => {
    handleMessage({ message, chatId, userId });
  });

  // socket.on("disconnecting", () =>{

  // })

  // socket.on("disconnect", (reason) =>{

  // })
};

module.exports = {
  io,
  handleConnection,
};
