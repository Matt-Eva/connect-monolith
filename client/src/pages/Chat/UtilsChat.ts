import { io, Socket } from "socket.io-client";

import { MessageState } from "./TypesChat";

const initializeSocket = ({
  chatId,
  setSocket,
  setMessages,
  setLoading,
  setParticipants,
}: {
  chatId: string;
  setSocket: Function;
  setMessages: Function;
  setLoading: Function;
  setParticipants: Function;
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
    setMessages((messages: MessageState) => [...messages, message]);
  });

  return () => {
    socket.disconnect();
  };
};

const handleScroll = ({
  scrollRef,
  setJustLoaded,
  justLoaded,
}: {
  scrollRef: React.RefObject<HTMLElement>;
  setJustLoaded: Function;
  justLoaded: boolean;
}) => {
  if (scrollRef.current !== null) {
    const messageContainer = scrollRef.current;
    const lastChild = messageContainer.lastChild as HTMLElement;

    if (justLoaded === true && lastChild) {
      lastChild.scrollIntoView({ block: "end" });

      setJustLoaded(false);
    } else if (lastChild) {
      lastChild.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }
};

const leaveChat = async ({
  navigate,
  chatId,
}: {
  navigate: Function;
  chatId: string;
}) => {
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

const sendMessage = ({
  socket,
  chatId,
  userId,
  input,
  setInput,
  combinedUsernames,
}: {
  socket: Socket;
  chatId: string;
  userId: string;
  input: string;
  setInput: Function;
  combinedUsernames: string;
}) => {
  console.log(combinedUsernames);
  if (input === "") return;

  const message = {
    userId,
    chatId,
    text: input,
    usernames: combinedUsernames,
  };

  socket.emit("message", message);

  setInput("");
};

export { initializeSocket, handleScroll, leaveChat, sendMessage };
