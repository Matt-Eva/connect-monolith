import {useEffect, useState} from "react"
import InvitationCard from "../../components/InvitationCard/InvitationCard"
import styles from "./MyInvitations.module.css"

function MyInvitations() {
    const [invitations, setInvitations] = useState([])
    console.log(invitations)

    useEffect(() =>{
        const fetchInvitations = async () =>{
            try {
                const res = await fetch("/api/my-invitations", {
                    credentials: "include"
                })
                if (res.ok){
                    const data = await res.json()
    
                    setInvitations(data)
                } 
            } catch(e){
                console.error(e)
            }
        }
        fetchInvitations()
    }, [])

    const displayInvitations = invitations.map(invitation => <InvitationCard key={invitation.uId} {...invitation}/>)

  return (
    <div className={styles.container}>
        <h2 className={styles.header}>My Invitations</h2>
        <div className={styles.invitationContainer}>   
        {displayInvitations}
        </div>
    </div>
  )
}

export default MyInvitations