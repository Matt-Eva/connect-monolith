import astraClient from "../config/cassandraConfig";
import neoDriver from "../config/neo4jConfig";
import webPush from "../config/webPushConfig.js";
import { v4 } from "uuid";
const uuid = v4;
import { IncomingMessage, CreatedMessage } from "./socketIoTypes";
import { User } from "../@types/sessionUser";
import { Server } from "socket.io";

const createAstraMessage = async ({
  message,
  chatId,
}: {
  message: IncomingMessage;
  chatId: string;
}) => {
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
  if (result.acknowledged) {
    return newMessage;
  } else {
    throw new Error("could not insert new message");
  }
};

const createMessage = async ({
  message,
  chatId,
  user,
  io,
}: {
  message: IncomingMessage;
  chatId: string;
  user: User;
  io: Server;
}) => {
  try {
    const record = await createAstraMessage({ message, chatId });

    const newMessage: CreatedMessage = {
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
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
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
        title: message.user.name,
        body: message.message.text,
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
  user,
  io,
}: {
  message: IncomingMessage;
  chatId: string;
  user: User;
  io: Server;
}) => {
  const session = neoDriver.session();

  try {
    const newMessage: CreatedMessage = await createMessage({
      user,
      message,
      chatId,
      io,
    });

    await handlePushNotifications({
      message: newMessage,
      chatId,
      userId: user.uId,
    });
  } catch (e) {
    console.error(e);
  } finally {
    await session.close();
  }
};

export default handleMessage;
