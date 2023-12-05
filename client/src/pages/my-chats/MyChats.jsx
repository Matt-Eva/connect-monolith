import { useOutletContext } from "react-router-dom"
import { useEffect, useState } from "react"
import ChatCard from "../../components/ChatCard/ChatCard"

function MyChats() {
  const {user} = useOutletContext()
  const [chats, setChats] = useState({})

  useEffect(() =>{
    console.log("effected")
    const fetchChats = async () =>{
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/my-chats", {
        credentials: "include"
      })
      console.log(res.status)
      if(res.ok){
        const chats = await res.json()
        setChats(chats)
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
    <div>
      MyChats
    {displayChats}
    </div>
  )
}

export default MyChats