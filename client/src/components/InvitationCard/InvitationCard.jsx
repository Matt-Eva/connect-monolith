import { useState } from "react"
import styles from "./InvitationCard.module.css"

function InvitationCard({name, uId, profileImg}) {
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
    <article className={`userCard ${styles.card}`}>
        <div className={styles.infoContainer}>
            <img src={profileImg} alt={`${name} profile image`} className={`userCardImage ${styles.image}`}/>
            <span className={styles.name}>{name}</span>
        </div>
        <div className={styles.responseContainer}>
            {responded ?  null :
                <>
                    <button onClick={accept} className={styles.button}>Accept</button>
                    <button onClick={ignore} className={styles.button}>Ignore</button>
                    <button onClick={block} className={styles.button}>Block</button>
                </>
            }
            {connected ? <span className={styles.response}>Connected</span>: null}
            {blocked ? <span className={styles.response}>Blocked</span> : null}
            {ignored ? <span className={styles.response}>Ignored</span> : null}
        </div>
    </article>
  )
}

export default InvitationCard