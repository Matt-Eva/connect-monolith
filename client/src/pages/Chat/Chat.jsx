import { io } from "socket.io-client"
import { useParams, useOutletContext, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import styles from "./Chat.module.css"


function Chat() {
  const {user} = useOutletContext()
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [socket, setSocket] = useState({})

  const chatId = useParams().id

  const navigate = useNavigate()

  useEffect(() =>{
    const socket = io(import.meta.env.VITE_BACKEND_URL, {
      withCredentials: true,
      query: {
        chatId: chatId
      }
    })

    setSocket(socket)
  
    socket.on("disconnect", () =>{
      console.log("disconnected")
    })
  
    socket.on("load", (arg) =>{
      setMessages(arg)
      setLoading(false)
    })

    socket.on("joined", (arg) =>{
      console.log(arg)
    })
  
    socket.on("connect", () =>{
      // console.log("socket", socket.id)
    })
    
    socket.on("new-message", message =>{
      setMessages((messages) =>[...messages, message])
    })

    return () =>{
      socket.disconnect()
    }

  }, [user])

  if (loading){
    return <h1>Loading</h1>
  }

  const sendMessage = (e) =>{
    e.preventDefault()
    if (input === '') return

    const message = {
      userId: user.uId,
      chatId: chatId,
      text: input
    }

    socket.emit('message', message)

    setInput('')
  }

  const leaveChat = async () => {
    try {
      const res = await fetch(`/api/leave-chat/${chatId}`, {
        method: "DELETE",
        credentials: "include"
      })
      if (res.ok){
        alert("You have left the chat")
        navigate('/')
      }
    } catch(e) {
      console.error(e)
    }
  }

  const displayMessages = messages.map(message =>{
    const user = message[0]
    const content = message[1]
    const userSpan = <span>{user.name}</span>
    const text = <p>{content.text}</p>
    return <article key={message[1].uId}>{userSpan} {text}</article>
  })

  const participants = []

  for(const message of messages) {
    if (participants.find(user => user.uId === message[0].uId)) continue
    else participants.push(message[0])
  }
  
  const usernames = participants.map((p, index) => {
    if (index === participants.length -1) return <span>{p.firstName}</span>
    return <span>{p.firstName}, </span>
})

  return (
    <main>
      <h2>{usernames}</h2>
      <button onClick={leaveChat}>Leave Chat</button>
      <section style={{height: "70vh", overflow: "scroll"}}>
        {displayMessages}
      </section>
      <form onSubmit={sendMessage}>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)}  />
        <input type="submit" value='send'/>
      </form>
    </main>
  )
}

export default Chat