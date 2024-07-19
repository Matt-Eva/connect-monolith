"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: "redis-13064.c228.us-central1-1.gce.cloud.redislabs.com",
        port: 13064,
    },
});
redisClient.connect().catch(console.error);
exports.default = redisClient;
