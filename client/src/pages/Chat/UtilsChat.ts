import { io } from "socket.io-client";

const initializeSocket = ({
  chatId,
  setSocket,
  setMessages,
  setLoading,
  setParticipants,
}) => {
  const socket = io(import.meta.env.VITE_BACKEND_URL, {
    withCredentials: true,
    query: {
      chatId: chatId,
    },
  });

  setSocket(socket);

  socket.on("load", (arg) => {
    setMessages(arg.messages);
    setParticipants(arg.participants);
    setLoading(false);
  });

  socket.on("joined", (arg) => {
    console.log(arg);
  });

  socket.on("new-message", (message) => {
    setMessages((messages) => [...messages, message]);
  });

  return () => {
    socket.disconnect();
  };
};

const handleScroll = ({ scrollRef, setJustLoaded, justLoaded }) => {
  if (scrollRef.current !== null) {
    const messageContainer = scrollRef.current;
    const lastChild = messageContainer.lastChild;

    if (justLoaded === true && lastChild) {
      messageContainer.lastChild.scrollIntoView({ block: "end" });

      setJustLoaded(false);
    } else if (lastChild) {
      messageContainer.lastChild.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }
};

const leaveChat = async ({ navigate, chatId }) => {
  try {
    const res = await fetch(`/api/leave-chat/${chatId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      alert("You have left the chat");
      navigate("/");
    }
  } catch (e) {
    console.error(e);
  }
};

const sendMessage = ({ socket, chatId, userId, input, setInput }) => {
  if (input === "") return;

  const message = {
    userId,
    chatId,
    text: input,
  };

  socket.emit("message", message);

  setInput("");
};

export { initializeSocket, handleScroll, leaveChat, sendMessage };
