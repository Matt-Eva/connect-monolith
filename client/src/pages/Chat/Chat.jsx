import { useEffect, useState, useRef } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import MessageCard from "../../components/MessageCard/MessageCard";
import styles from "./Chat.module.css";
import {
  initializeSocket,
  handleScroll,
  leaveChat,
  sendMessage,
} from "./UtilsChat";

function Chat() {
  const { user } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [justLoaded, setJustLoaded] = useState(true);
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState({});

  const scrollRef = useRef(null);

  const chatId = useParams().id;

  const navigate = useNavigate();

  useEffect(() => {
    return initializeSocket({
      setSocket,
      setMessages,
      setParticipants,
      setLoading,
      chatId,
    });
  }, [user]);

  useEffect(() => {
    handleScroll({ scrollRef, justLoaded, setJustLoaded });
  }, [messages]);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendMessage({ socket, chatId, userId: user.uId, input, setInput });
  };

  const handleLeaveChat = () => {
    leaveChat({ chatId, navigate });
  };

  const displayMessages = messages.map((message) => {
    const user = message[0];
    const content = message[1];
    return <MessageCard key={content.uId} {...user} {...content} />;
  });

  const usernames = participants.map((p, index) => {
    if (index === participants.length - 1)
      return <span key={p.uId}>{p.firstName}</span>;
    return <span key={p.uId}>{p.firstName}, </span>;
  });

  return (
    <main className={styles.main}>
      <h2 className={styles.participants} title={usernames}>
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
