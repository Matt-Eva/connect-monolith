"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const address = process.env.REDIS_ADDRESS;
console.log(address);
const redisClient = (0, redis_1.createClient)({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: address,
        port: 14074,
    },
});
redisClient.connect().catch(console.error);
exports.default = redisClient;
