import {useEffect, useState} from "react"
import InvitationCard from "../../components/InvitationCard/InvitationCard"

function MyInvitations() {
    const [invitations, setInvitations] = useState([])
    console.log(invitations)

    useEffect(() =>{
        const fetchInvitations = async () =>{
            try {
                const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/my-invitations", {
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
    <div>myInvitations
        {displayInvitations}
    </div>
  )
}

export default MyInvitations