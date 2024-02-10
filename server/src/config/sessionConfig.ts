import session from "express-session";
import ConnectNeo from "connect-neo4j";
const neoDriver = require("./neo4jConfig.js");

let Neo4jStore = ConnectNeo(session);

let sessionMiddleware: any;

let sessionSecret = process.env.SESSION_SECRET;

if (sessionSecret) {
  sessionMiddleware = session({
    store: new Neo4jStore({
      client: neoDriver,
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
}

export default sessionMiddleware;
