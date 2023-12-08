import { useOutletContext } from "react-router-dom"
import { useEffect, useState } from "react"
import ChatCard from "../../components/ChatCard/ChatCard"
import styles from "./MyChats.module.css"

function MyChats() {
  const {user} = useOutletContext()
  const [chats, setChats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() =>{
    console.log("effected")
    const fetchChats = async () =>{
      const res = await fetch("/api/my-chats", {
        credentials: "include"
      })
      console.log(res.status)
      if(res.ok){
        const chats = await res.json()
        setChats(chats)
        setLoading(false)
      } else {
        alert("Something went wrong when loading your chats.")
      }
    }
    if (user) {
      fetchChats()
    }
  }, [])

  const displayChats = []

  for (const key in chats){
    const chat = {
      chatId: key,
      users: chats[key]
    }
    displayChats.push(<ChatCard key={key} {...chat}/>)
  }

  return (
    <section className={styles.myChats}>
      <h2 className={styles.title}>My Chats</h2>
      { 
        loading ? 
          <h3>Loading...</h3> :
          <div className={styles.chatContainer}>
            {displayChats}
          </div>
      }       
    </section>
  )
}

export default MyChats