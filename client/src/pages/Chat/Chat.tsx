import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../reduxHooks";
import { Socket } from "socket.io-client";

import MessageCard from "../../components/MessageCard/MessageCard";

import { MessageState } from "./TypesChat";

import styles from "./Chat.module.css";

import {
  initializeSocket,
  handleScroll,
  leaveChat,
  sendMessage,
} from "./UtilsChat";

function Chat() {
  const user = useAppSelector((state) => state.user.value);
  const [loading, setLoading] = useState(true);
  const [justLoaded, setJustLoaded] = useState(true);

  const [messages, setMessages] = useState<MessageState>([]);

  type Participant = { firstName: string; uId: string };
  type ParticipantState = Participant[];
  const [participants, setParticipants] = useState<ParticipantState>([]);

  const [input, setInput] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);

  const scrollRef = useRef<HTMLElement>(null);

  const chatId = useParams().id;

  const navigate = useNavigate();

  useEffect(() => {
    if (chatId) {
      return initializeSocket({
        setSocket,
        setMessages,
        setParticipants,
        setLoading,
        chatId,
      });
    }
  }, [user]);

  useEffect(() => {
    handleScroll({ scrollRef, justLoaded, setJustLoaded });
  }, [messages]);

  useEffect(() => {
    return () => {
      console.log("closing");
      try {
        fetch(`/api/update-read/${chatId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error(error);
      }
    };
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  const handleLeaveChat = () => {
    if (chatId) {
      leaveChat({ chatId, navigate });
    }
  };

  const displayMessages = messages.map((message) => {
    const user = message.user;
    const content = message.message;
    return <MessageCard key={content.uId} {...user} {...content} />;
  });

  const usernames = participants.map((p, index) => {
    if (index === participants.length - 1)
      return <span key={p.uId}>{p.firstName}</span>;
    return <span key={p.uId}>{p.firstName}, </span>;
  });

  const combinedUsernames = [...participants, user]
    .map((p) => p.firstName)
    .join(", ");

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (socket && chatId) {
      sendMessage({
        socket,
        chatId,
        userId: user.uId,
        input,
        setInput,
        combinedUsernames,
      });
    }
  };

  return (
    <main className={styles.main}>
      <h2 className={styles.participants} title={combinedUsernames}>
        {usernames}
      </h2>
      <button onClick={handleLeaveChat}>Leave Chat</button>
      <section className={styles.messageContainer} ref={scrollRef}>
        {displayMessages}
      </section>
      <form onSubmit={handleSendMessage} className={styles.textInputForm}>
        <input
          type="text"
          placeholder="Type message here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <input type="submit" value="send" />
      </form>
    </main>
  );
}

export default Chat;
