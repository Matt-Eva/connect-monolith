import { io } from "socket.io-client"
import { useEffect, useState, useRef } from "react"
import { useParams, useOutletContext, useNavigate } from "react-router-dom"
import styles from "./Chat.module.css"
import CardImageIcon from "../../components/CardImageIcon/CardImageIcon"


function Chat() {
  const {user} = useOutletContext()
  const [loading, setLoading] = useState(true)
  const [justLoaded, setJustLoaded] = useState(true)
  const [messages, setMessages] = useState([])
  const [participants, setParticipants] = useState([])
  const [input, setInput] = useState("")
  const [socket, setSocket] = useState({})

  const scrollRef = useRef(null)

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
      setMessages(arg.messages)
      setParticipants(arg.participants)
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

  useEffect(() =>{
    if (scrollRef.current !== null){
      const messageContainer = scrollRef.current
      if (justLoaded === true) {
        messageContainer.lastChild.scrollIntoView({block: 'end'})
        setJustLoaded(false)
      } else {
        messageContainer.lastChild.scrollIntoView({behavior: 'smooth',block: 'end'})
      }
    }
  }, [messages])

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

  console.log(messages)

  const displayMessages = messages.map(message =>{
    const user = message[0]
    const content = message[1]
    const userSpan = <span>{user.name}</span>
    const text = <p className={styles.messageContent}>{content.text}</p>
    const userImageIcon = <div className={styles.imageContainer}>
      <CardImageIcon  users={[{firstName: user.name, profileImg: user.profileImg}]}/>
      </div>
    return <article key={message[1].uId} className={styles.messageCard}> {userImageIcon} {userSpan} {text}</article>
  })
  
  const usernames = participants.map((p, index) => {
    if (index === participants.length -1) return <span>{p.firstName}</span>
    return <span>{p.firstName}, </span>
})

  return (
    <main className={styles.main}>
      <h2 className={styles.participants} title={usernames}>{usernames}</h2>
      <button onClick={leaveChat}>Leave Chat</button>
      <section className={styles.messageContainer} ref={scrollRef}>
        {displayMessages}
      </section>
      <form onSubmit={sendMessage} className={styles.textInputForm}>
        <input type="text" placeholder="Type message here..." value={input} onChange={(e) => setInput(e.target.value)}  />
        <input type="submit" value='send'/>
      </form>
    </main>
  )
}

export default Chat