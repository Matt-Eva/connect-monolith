import { createClient } from "redis";

const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: "redis-13064.c228.us-central1-1.gce.cloud.redislabs.com",
    port: 13064,
  },
});

redisClient.connect().catch(console.error);

export default redisClient;
