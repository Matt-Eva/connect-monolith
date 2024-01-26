const { Server } = require("socket.io")

const  sessionMiddleware = require("./sessionConfig.js")
const { server } = require("./appConfig.js")
const neoDriver = require("./neo4jConfig.js")
const { v4 } = require("uuid")
const uuid = v4

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

const loadMessages = async ({socket, chatId, userId}) => {

    const session = neoDriver.session()

    try {
        const messageQuery = `
            MATCH (:User {uId: $userId}) - [:PARTICIPATING] -> (c:Chat {uId: $chatId}) <- [:SENT_IN_CHAT] - (m:Message) <- [:SENT] - (u:User)
            RETURN u.name AS name, u.profileImg AS profileImg, m
            ORDER BY m.date
        `
        const messageResults = await session.executeRead(async tx => tx.run(messageQuery, {userId: userId, chatId: chatId}))

        const messages = []

        for (const record of messageResults.records){
            const message = record.get('m').properties
            const user = {
                name: record.get("name"),
                profileImg: record.get("profileImg"),
            }
            messages.push([user, message])
        }

        const participantsQuery = `
            MATCH (:User {uId: $userId}) - [:PARTICIPATING] -> (c:Chat {uId: $chatId}) <- [:PARTICIPATING] - (u:User)
            RETURN u.firstName AS firstName, u.uId AS uId
        `
        const participantResults = await session.executeRead(async tx => tx.run(participantsQuery, {userId: userId, chatId: chatId}))

        const participants = participantResults.records.map(record => { return {firstName: record.get("firstName"), uId: record.get("uId")} })

        socket.join(chatId)

        io.to(chatId).emit("joined", `joined room ${chatId}`)

        socket.emit("load", {
            messages,
            participants
        })
    } 
    catch(e) {
        console.error(e)
    } 
    finally {
        await session.close()
    }
}

const handleMessage = async ({message, chatId, userId}) =>{

    const session = neoDriver.session()

    try {

        const query = `
            MATCH (user:User {uId: $userId}), (c:Chat {uId: $chatId})
            CREATE (user) - [:SENT] -> (message:Message {uId: $uId, text: $text, date: $date, userId: $userId}) - [:SENT_IN_CHAT] ->(c)
            RETURN user.name AS name, user.profileImg AS profileImg, message
            ORDER BY message.date DESC
        `
        const result = await session.executeWrite(async tx => tx.run(query, {userId: message.userId, uId: uuid(), text: message.text, date: Date.now(), chatId: message.chatId}))
        const record = result.records[0]

        const newMessage = [
            {
                name: record.get("name"),
                profileImg: record.get("profileImg")
            }, 
            record.get('message').properties
        ]

        io.to(chatId).emit("new-message", newMessage)

    } catch(e){
        console.error(e)
    } finally {
        await session.close()
    }
}

const handleConnection = async (socket) =>{

    if (!socket.request.session.user) return socket.disconnect()

    const chatId = socket.handshake.query.chatId
    const userId = socket.request.session.user.uId

    loadMessages({socket, chatId, userId})

    socket.on("message", async (message) =>{
        handleMessage({message, chatId, userId})
    })

    socket.on("disconnecting", () =>{

    })

    socket.on("disconnect", (reason) =>{

    })
}

module.exports = {
    io,
    handleConnection
}