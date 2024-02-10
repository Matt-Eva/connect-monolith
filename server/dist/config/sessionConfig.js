"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_session_1 = __importDefault(require("express-session"));
const connect_neo4j_1 = __importDefault(require("connect-neo4j"));
const neo4jConfig_js_1 = __importDefault(require("./neo4jConfig.js"));
let Neo4jStore = (0, connect_neo4j_1.default)(express_session_1.default);
let sessionSecret = process.env.SESSION_SECRET;
const sessionMiddleware = (0, express_session_1.default)({
    store: new Neo4jStore({
        client: neo4jConfig_js_1.default,
        ttl: 60 * 60 * 1000,
    }),
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
