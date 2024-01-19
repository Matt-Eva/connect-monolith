import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import ConnectionCard from "../../components/ConnectionCard/ConnectionCard"
import styles from "./MyConnections.module.css"

function MyConnections() {
  const { user } = useOutletContext()
  const [connections, setConnections] = useState([])
  const [search, setSearch] = useState("")

  console.log(connections)

  useEffect(() =>{
    const fetchConnections = async () =>{
      try{
        const res = await fetch("/api/my-connections", {
          credentials: "include"
        })
        if (res.ok){
          const data = await res.json()
          setConnections(data)
        } else {
          throw new Error("problem")
        }
      } catch(e){
        console.error(e)
      }
    }
    if (user){
      fetchConnections()
    }
  }, [user])

  const filterUsers = (e) =>{
    setSearch(e.target.value)
  }

  const filteredConnections = connections.filter(connection => connection.name.toLowerCase().startsWith(search.toLowerCase()))

  const displayConnections = filteredConnections.map(connection => <ConnectionCard key={connection.uId} {...connection} />)

  return (
    <div className={styles.container}>
        <label className={styles.searchLabel}>browse your connections</label>
        <input type="text" placeholder="Browse connections..." className={styles.search} onChange={filterUsers}/>
        {displayConnections}
    </div>
  )
}

export default MyConnections