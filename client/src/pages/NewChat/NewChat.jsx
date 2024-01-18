import {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import CreateChatUserCard from "../../components/CreateChatUserCard/CreateChatUserCard.jsx"
import styles from "./NewChat.module.css"

function NewChat() {
  const [connections, setConnections] = useState([])
  const [search, setSearch] = useState("")
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() =>{
    const fetchConnections = async () =>{
      const res = await fetch("/api/my-connections", {
        credentials: "include"
      })
      if (res.ok){
        const data = await res.json()
        setConnections(data)
        setLoading(false)
      } else if (res.status === 401){
        console.log("unauthorized")
      }
    }
    fetchConnections()
  }, [])

  const addParticipant = (user) =>{
    if (participants.find(participant => participant.uId === user.uId)) return
    setParticipants([...participants, user])
    setSearch("")
  }

  const removeParticipant = (user) =>{
    const oneLess = participants.filter( participant => participant.uId !== user.uId)
    setParticipants(oneLess)
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

  const filteredConnections = connections.filter(connection => {
    const searchMatch = connection.name.toLowerCase().includes(search.toLowerCase())
    const isParticipant = participants.find(participant => participant.uId === connection.uId)
    if (searchMatch && !isParticipant){
      return true
    } else {
      return false
    }
  })

  const displayConnections = filteredConnections.map(connection => <CreateChatUserCard key={connection.uId} user={connection} addParticipant={addParticipant} />)

  const displayParticipants = participants.map(participant => {
    return (
      <div className={styles.participantCard}>
        <span key={participant.uId} className={styles.participant}>{participant.name}</span>
        <button onClick={() => removeParticipant(participant)} className={styles.removeParticipant}>remove</button>
      </div>
    )
  })

  return (
    <section className={styles.newChat}>
      <div className={styles.searchContainer}>
        <label hmtlfor="search" className={styles.searchLabel}>Browse connections </label>
        <input type="text" value={search} name="search" placeholder="Browse connections..." onChange={(e)=>setSearch(e.target.value)} className={styles.search}/>
        <button onClick={createChat} className={styles.createChat}>Create Chat</button>  
      </div>
      {
        loading ? 
          <h3>Loading...</h3> 
          : 
          <div>
            <div className={styles.participantContainer}>
              {displayParticipants}
            </div>
            <div>
              {displayConnections}
            </div>
          </div>
      }
    </section>
  )
}

export default NewChat;