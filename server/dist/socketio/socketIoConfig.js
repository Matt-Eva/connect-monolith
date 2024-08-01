"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleConnection = exports.io = void 0;
const redis_adapter_1 = require("@socket.io/redis-adapter");
const sessionConfig_js_1 = __importDefault(require("../config/sessionConfig.js"));
const appConfig_js_1 = require("../config/appConfig.js");
const redisConfig_js_1 = __importDefault(require("../config/redisConfig.js"));
const loadChat_js_1 = __importDefault(require("./loadChat.js"));
const handleMessage_js_1 = __importDefault(require("./handleMessage.js"));
const socket_io_1 = require("socket.io");
let io;
if (process.env.NODE_ENV === "development") {
    exports.io = io = new socket_io_1.Server(appConfig_js_1.server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true,
        },
    });
}
else {
    exports.io = io = new socket_io_1.Server(appConfig_js_1.server);
}
const pubClient = redisConfig_js_1.default;
const subClient = pubClient.duplicate();
pubClient.on("error", (err) => {
    console.log(err.message);
});
subClient.on("error", (err) => {
    console.log(err.message);
});
io.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
io.engine.use(sessionConfig_js_1.default);
const handleConnection = async (socket) => {
    if (!socket.request.session.user)
        return socket.disconnect();
    const chatId = socket.handshake.query.chatId;
    const user = socket.request.session.user;
    try {
        (0, loadChat_js_1.default)({ socket, chatId, user });
        socket.on("message", async (message) => {
            try {
                (0, handleMessage_js_1.default)({ message, chatId, user, io });
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    catch (e) {
        console.error(e);
    }
};
exports.handleConnection = handleConnection;
