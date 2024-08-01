import { createClient } from "redis";

const address = process.env.REDIS_ADDRESS;
console.log(address);
const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,

  socket: {
    host: address,
    port: 14074,
  },
});

redisClient.connect().catch(console.error);

export default redisClient;
