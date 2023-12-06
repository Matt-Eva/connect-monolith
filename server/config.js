const neo = require("neo4j-driver")
const express = require("express")
const cors = require("cors")
const session = require("express-session")
const path = require("path")
const http = require("http")
const { Server } = require("socket.io")
let Neo4jStore = require('connect-neo4j')(session)

const driver = neo.driver(process.env.NEO_URL, neo.auth.basic(process.env.NEO_USER, process.env.NEO_PASSWORD))

const testDriverConnectivity = async (driver) => {
    try {
        await driver.verifyConnectivity()
        console.log("connected")
    } catch (error){
        console.error(error)
        process.exit(0)
    }
}

testDriverConnectivity(driver)

const app = express()
const server = http.createServer(app)


let sessionMiddleware;

if (process.env.NODE_ENV === 'development'){
    sessionMiddleware = session({
        store: new Neo4jStore({ 
            client: driver,
            ttl: 60 * 60 * 1000
         }),
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
        cookie: {
            httpOnly: true,
            // maxAge: (60 * 60 * 1000000)
        }
    })
} else {
    sessionMiddleware = session({
        store: new Neo4jStore({ 
            client: driver,
            ttl: 60 * 60 * 1000
         }),
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
        cookie: {
            secure: true,
            httpOnly: true,
            // maxAge: 60 * 60 * 1000
        }
    })
}

app.use(sessionMiddleware)

app.use(express.json())

app.use(express.static(path.join(__dirname, "../client/dist") ))

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

// io.use((socket, next) =>{
//     sessionMiddleware(socket.request, {}, next)
// })

module.exports = {
    app,
    server,
    driver,
    io
}