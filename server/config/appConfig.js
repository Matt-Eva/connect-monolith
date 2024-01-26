const express = require("express")
const path = require("path")
const http = require("http")


const router = require("../router.js")
const sessionMiddleware = require("./sessionConfig.js")

const app = express()

app.use(sessionMiddleware)

app.use(express.json())

app.use(express.static(path.join(__dirname, "../client/dist") ))

app.use("/", router)

const server = http.createServer(app)

module.exports =  {
    server,
    app
}
