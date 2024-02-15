import { AstraMessage, CreatedMessage } from "./socketIoTypes";
import { Socket } from "socket.io";
import { User } from "../@types/sessionUser";
import astraClient from "../config/cassandraConfig";
import neoDriver from "../config/neo4jConfig";

interface Participant {
  firstName: string;
  uId: string;
  name: string;
  profileImg: string;
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

const loadNeoParticipants = async ({
  userId,
  chatId,
}: {
  userId: string;
  chatId: string;
}) => {
  const session = neoDriver.session();
  try {
    const participantsQuery = `
      MATCH (:User {uId: $userId}) - [:PARTICIPATING] -> (c:Chat {uId: $chatId}) <- [:PARTICIPATING] - (u:User)
      RETURN u.firstName AS firstName, u.uId AS uId, u.name AS name, u.profileImg AS profileImg
      `;
    const participantResults = await session.executeRead(async (tx) =>
      tx.run(participantsQuery, { userId, chatId }),
    );

    const participants = participantResults.records.map((record) => {
      return {
        firstName: record.get("firstName"),
        uId: record.get("uId"),
        name: record.get("name"),
        profileImg: record.get("profileImg"),
      };
    });
    return participants;
  } catch (error) {
    console.error(error);
  } finally {
    await session.close();
  }
};

const configureMessages = ({
  participants,
  astraMessages,
  user,
}: {
  participants: Participant[];
  astraMessages: AstraMessage[];
  user: User;
}) => {
  const messages = [];

  for (const record of astraMessages) {
    const participant = participants.find((p) => p.uId === record.user_id);

    let messageUser;
    if (participant) {
      messageUser = participant;
    } else {
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

const loadChat = async ({
  socket,
  chatId,
  user,
}: {
  socket: Socket;
  chatId: string;
  user: User;
}) => {
  try {
    const participants = await loadNeoParticipants({
      chatId,
      userId: user.uId,
    });

    const astraMessages = await loadAstraMessages({
      chatId,
    });

    if (participants && astraMessages) {
      const messages: CreatedMessage[] = configureMessages({
        user,
        participants,
        astraMessages,
      });

      socket.join(chatId);

      socket.emit("load", {
        messages,
        participants,
      });
    } else {
      throw new Error("could not load chat resources");
    }
  } catch (e: any) {
    console.error(e);
    throw new Error(e);
  }
};

export default loadChat;
