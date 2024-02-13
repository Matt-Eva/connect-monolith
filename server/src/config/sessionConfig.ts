import session from "express-session";
import RedisStore from "connect-redis";
import redisClient from "./redisConfig.js";
import { RequestHandler } from "express";

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "connect",
});

let sessionSecret = process.env.SESSION_SECRET;

const sessionMiddleware: RequestHandler = session({
  store: redisStore,
  secret: sessionSecret!,
  saveUninitialized: false,
  resave: false,
  cookie: {
    httpOnly: true,
    // cannot do secure because Render uses HTTP for their load balancer,
    // which blocks the cookie from being sent, as secure cookies are only
    // deliverable over HTTPS
  },
});

export default sessionMiddleware;
