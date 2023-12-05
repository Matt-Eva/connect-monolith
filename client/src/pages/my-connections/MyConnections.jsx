import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import ConnectionCard from "../../components/ConnectionCard/ConnectionCard"

function MyConnections() {
  const { user } = useOutletContext()
  const [connections, setConnections] = useState([])

  console.log(connections)

  useEffect(() =>{
    const fetchConnections = async () =>{
      try{
        const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/my-connections", {
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

  const displayConnections = connections.map(connection => <ConnectionCard key={connection.uId} {...connection} />)

  return (
    <div>
      {displayConnections}
    </div>
  )
}

export default MyConnections