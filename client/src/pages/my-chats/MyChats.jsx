import { useOutletContext } from "react-router-dom"
import { useEffect, useState } from "react"
import ChatCard from "../../components/ChatCard/ChatCard"

function MyChats() {
  const {user} = useOutletContext()
  const [chats, setChats] = useState({})

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
    <div className="grid grid-rows-6">
      <h2 className="row-span-1 text-lg justify-self-center m-1">My Chats</h2>
      <div className="row-start-2 row-end-6">
        {displayChats}
      </div>
    </div>
  )
}

export default MyChats