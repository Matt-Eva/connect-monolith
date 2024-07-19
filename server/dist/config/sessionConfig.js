"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const redisConfig_js_1 = __importDefault(require("./redisConfig.js"));
const redisStore = new connect_redis_1.default({
    client: redisConfig_js_1.default,
    prefix: "connect",
});
let sessionSecret = process.env.SESSION_SECRET;
const sessionMiddleware = (0, express_session_1.default)({
    store: redisStore,
    secret: sessionSecret,
    saveUninitialized: false,
    resave: false,
    cookie: {
        httpOnly: true,
        // cannot do secure because Render uses HTTP for their load balancer,
        // which blocks the cookie from being sent, as secure cookies are only
        // deliverable over HTTPS
    },
});
exports.default = sessionMiddleware;
