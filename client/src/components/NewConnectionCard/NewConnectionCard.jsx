import { useState } from "react"
import { Link } from "react-router-dom"
import styles from "./NewConnectionCard.module.css"

function NewConnectionCard({name, uId, pending, invited}) {
    const [pendingInvite, setPendingInvite] = useState(pending)
    const [connected, setConnected] = useState(false)

    const addConnection = async () =>{
        try {
            const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/invite-connection", {
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
            }
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <article className={styles.card}>
            <img className={styles.image}/>
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
            <Link to={`/profile/${uId}`} className={styles.link}>View Profile</Link>
        </article>
      )
}

export default NewConnectionCard