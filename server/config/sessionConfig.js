const session = require("express-session")
let Neo4jStore = require('connect-neo4j')(session)
const neoDriver = require("./neo4jConfig.js")

const sessionMiddleware = session({
    store: new Neo4jStore({ 
        client: neoDriver,
        ttl: 60 * 60 * 1000
    }),
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        httpOnly: true,
        // cannot do secure because Render uses HTTP for their load balancer,
        // which blocks the cookie from being sent, as secure cookies are only
        // deliverable over HTTPS
    }
});

module.exports = sessionMiddleware