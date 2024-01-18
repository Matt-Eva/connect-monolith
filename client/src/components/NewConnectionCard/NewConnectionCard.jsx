import { useState } from "react"
import { Link } from "react-router-dom"
import CardImageIcon from "../CardImageIcon/CardImageIcon"
import styles from "./NewConnectionCard.module.css"

function NewConnectionCard({name, uId, pending, invited, profileImg}) {
    const [pendingInvite, setPendingInvite] = useState(pending)
    const [connected, setConnected] = useState(false)

    const addConnection = async () =>{
        try {
            const res = await fetch("/api/invite-connection", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({connectionId: uId})
            })
            if(res.ok){
                setPendingInvite(true)
            } else{
                const error = await res.json()
                console.log(error)
            }
        } catch(e){
            console.error(e)
        }
    }

    const acceptInvitation = async () => {
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
            }
        } catch (e) {
            console.error(e)
        }
    }

    const iconUser = [{
        firstName: name,
        profileImg: profileImg
    }]

    return (
        <article className={styles.card}>
            <div className={styles.imageContainer}>
                <CardImageIcon users={iconUser} />
            </div>
            <span className={styles.name} title={name}>{name}</span>
            { pendingInvite ? <span> Invitation Pending</span> : 
                (invited ? 
                    (connected ? 
                        <span className={styles.connected}> Connected</span>
                        : 
                        <button onClick={acceptInvitation} className={styles.button}> Accept Invitation</button>
                    )
                    :
                    <button onClick={addConnection} className={styles.button}>connect</button>
                )
            }
            <Link to={`/profile/${uId}`} className={styles.link}>view profile</Link>
        </article>
      )
}

export default NewConnectionCard