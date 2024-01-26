const { Server } = require("socket.io")

const { sessionMiddleware} = require("./sessionConfig.js")
const { server } = require("./appConfig.js")

let io;

if (process.env.NODE_ENV === 'development'){
    io = new Server(server,{
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true
        }
    })
} else {
    io = new Server(server)
}

io.engine.use(sessionMiddleware)

module.exports = io