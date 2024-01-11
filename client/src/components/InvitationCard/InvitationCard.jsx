import { useState } from "react"
import styles from "./InvitationCard.module.css"

function InvitationCard({name, uId}) {
    const [connected, setConnected] = useState(false)
    const [responded, setResponded] = useState(false)
    const [blocked, setBlocked] = useState(false)
    const [ignored, setIgnored] = useState(false)

    const accept = async () => {
        try {
            const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/accept-invitation", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({connectionId: uId})
            })
            if (res.ok){
                setConnected(true)
                setResponded(true)
            }
        } catch(e){
            console.error(e)
        }
    }

    const ignore = async () =>{
        try {
            const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/ignore-invitation", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({connectionId: uId})
            })
            if (res.ok){
                setResponded(true)
                setIgnored(true)
            }
        } catch (e) {
            console.error(e)
        }
    }

    const block = async () =>{

    }

  return (
    <div>
        {name}
        {responded ?  null :
            <>
                <button onClick={accept}>Accept</button>
                <button onClick={ignore}>Ignore</button>
                <button onClick={block}>Block</button>
            </>
        }
        {connected ? <span>Connected</span>: null}
        {blocked ? <span>Blocked</span> : null}
        {ignored ? <span>Ignored</span> : null}
    </div>
  )
}

export default InvitationCard