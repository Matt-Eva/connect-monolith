import {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import CreateChatUserCard from "../../components/CreateChatUserCard/CreateChatUserCard.jsx"

function NewChat() {
  const [connections, setConnections] = useState([])
  const [search, setSearch] = useState("")
  const [participants, setParticipants] = useState([])

  const navigate = useNavigate()

  useEffect(() =>{
    const fetchConnections = async () =>{
      const res = await fetch("/api/my-connections", {
        credentials: "include"
      })
      if (res.ok){
        const data = await res.json()
        setConnections(data)
      } else if (res.status === 401){
        console.log("unauthorized")
      }
    }
    fetchConnections()
  }, [])

  const addParticipant = (user) =>{
    if (participants.find(participant => participant.uId === user.uId)) return
    setParticipants([...participants, user])
  }

  const createChat = async () =>{
    const body = {
      participants: participants
    }

    const res = await fetch("/api/new-chat", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
    
    if (res.ok){
      const newChat = await res.json()
      console.log(newChat)
      navigate(`/chat/${newChat.uId}`)
    }
  }

  const filteredConnections = connections.filter(connection => connection.name.toLowerCase().includes(search.toLowerCase()))

  const displayConnections = filteredConnections.map(connection => <CreateChatUserCard key={connection.uId} user={connection} addParticipant={addParticipant} />)

  const displayParticipants = participants.map(participant => <span key={participant.uId}>{participant.name}</span>)

  return (
    <div>
      <label>Search connections</label>
      <input type="text" value={search} onChange={(e)=>setSearch(e.target.value)}/>
      {displayParticipants}
      <button onClick={createChat}>Create Chat</button>
      <br/>
      {displayConnections}
    </div>
  )
}

export default NewChat;