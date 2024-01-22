import { useState } from "react"
import { Link } from "react-router-dom"
import CardImageIcon from "../CardImageIcon/CardImageIcon"
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

    const iconUser = [{
        name,
        profileImg,
        uId
    }]

  return (
    <article className={`${styles.card}`}>
        <div className={styles.imageContainer}>
            <CardImageIcon users={iconUser} />
        </div>
        <span className={styles.name}>{name}</span>
        <Link to={`/profile/${uId}`} className={`underlined-link ${styles.link}`}>view profile</Link>
        <div className={styles.responseContainer}>
            {responded ?  null :
                <>
                    <button onClick={block} className={`bg-red ${styles.button}`}>Block</button>
                    <button onClick={ignore} className={`bg-purple ${styles.button}`}>Ignore</button>
                    <button onClick={accept} className={`${styles.button}`}>Accept</button>
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