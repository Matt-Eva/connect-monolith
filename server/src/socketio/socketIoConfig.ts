import { createAdapter } from "@socket.io/redis-adapter";
import sessionMiddleware from "../config/sessionConfig.js";
import { server } from "../config/appConfig.js";
import redisClient from "../config/redisConfig.js";
import loadChat from "./loadChat.js";
import handleMessage from "./handleMessage.js";
import { Server } from "socket.io";
import { IncomingMessage } from "./socketIoTypes.js";

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

const handleConnection = async (socket: any) => {
  if (!socket.request.session.user) return socket.disconnect();

  const chatId = socket.handshake.query.chatId;
  const user = socket.request.session.user;
  try {
    loadChat({ socket, chatId, user });

    socket.on("message", async (message: IncomingMessage) => {
      try {
        handleMessage({ message, chatId, user, io });
      } catch (e) {
        console.error(e);
      }
    });
  } catch (e) {
    console.error(e);
  }
};

export { io, handleConnection };
