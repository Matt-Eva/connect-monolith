"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const router_1 = __importDefault(require("../router"));
const sessionConfig_1 = __importDefault(require("./sessionConfig"));
const app = (0, express_1.default)();
app.use(sessionConfig_1.default);
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, "../../client/dist")));
app.use("/api", router_1.default);
const server = http_1.default.createServer(app);
module.exports = {
    server,
    app,
    express: express_1.default,
};
