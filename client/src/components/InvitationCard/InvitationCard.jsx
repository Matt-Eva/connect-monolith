import { useState } from "react"
import styles from "./InvitationCard.module.css"

function InvitationCard({name, uId}) {
    const [connected, setConnected] = useState(false)
    const [responded, setResponded] = useState(false)
    const [blocked, setBlocked] = useState(false)
    const [ignored, setIgnored] = useState(false)

    const accept = async () => {
        try {
            const res = await fetch("/api/accept-invitation", {
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
            const res = await fetch("/api/ignore-invitation", {
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
        try {
            const res = await fetch("/api/block-user", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({userId: uId})
            })
            if (res.ok){
                setResponded(true)
                setBlocked(true)
            }
        } catch (e){
            console.error(e)
        }
    }

  return (
    <article className={styles.card}>
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
    </article>
  )
}

export default InvitationCard