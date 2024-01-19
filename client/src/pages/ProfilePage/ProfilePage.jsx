import { useEffect, useState } from "react"
import { useParams, useOutletContext, useNavigate } from "react-router"
import styles from "./ProfilePage.module.css"

function ProfilePage() {
    const {user} = useOutletContext()
    const [profile, setProfile] = useState(false)
    const [allowDisconnect, setAllowDisconnect] = useState(false)
    const navigate = useNavigate()
    const {id} = useParams()

    console.log(profile)

    useEffect(() =>{
        const loadProfile = async () =>{
            try {
                const res = await fetch(`/api/user/${id}`, {
                    credentials: "include"
                })
                if (res.ok){
                    const data = await res.json()
                    setProfile(data)
                } else if(res.status === 404){
                    alert("Profile not found - redirecting to home page")
                    navigate("/")
                }
            } catch (e){
                console.error(e)
            }
        }
        loadProfile()
    }, [user])

    const startChat = async () =>{
        console.log(profile)
        try {
            const res = await fetch("/api/new-chat", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({participants: [profile]})
            })

            if (res.ok){
                const chat = await res.json()
                navigate(`/chat/${chat.uId}`)
                console.log(chat)
            }
        } catch(e) {
            console.error(e)
        }
    }

    const connect = async () => {
        try {
            const res = await fetch("/api/invite-connection", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({connectionId: profile.uId})
            })
            if(res.ok){
                setProfile({
                    ...profile, pending: true
                })
            }
            
        } catch (e){
            console.error(e)
        }
    }

    const accept = async () =>{
        try {
            const res = await fetch("/api/accept-invitation", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({connectionId: profile.uId})
            })
            if (res.ok){
                setProfile({...profile, connected: true})
                setResponded(true)
            }
        } catch (e){
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
                body: JSON.stringify({userId: profile.uId})
            })
            if (res.ok){
                setProfile({
                    ...profile,
                    blocked: true,
                    connected: false,
                    pending: false,
                    invited: false
                })
            }
        } catch (e) {
            console.error(e)
        }
    }

    const unblock = async () => {
        try {
            const res = await fetch(`/api/unblock-user/${profile.uId}`, {
                method: "DELETE",
                credentials: "include"
            })
            if (res.ok){
                setProfile({
                    ...profile,
                    blocked: false
                })
            }
        } catch (e) {
            console.error(e)
        }
    }
 
    const disconnect = async () =>{
        try {
            const res = await fetch(`/api/delete-connection/${profile.uId}`, {
                method: "DELETE",
                credentials: "include"
            })
            if (res.ok){
                alert(`disconnected from ${profile.name}`)
                setProfile({...profile, connected: false})
                setAllowDisconnect(false)
            }
        } catch (e) {
            console.error(e)
        }
    }

    if(!profile){
        return <h2>Loading...</h2>
    }
    
    return (
        <main>
            <h2>{profile.name}</h2>
            {profile.connected ? 
            <>
                <button onClick={startChat}>Message</button>
                <button onClick={() => setAllowDisconnect(true)}>Disconnect</button>
            </>
             : null}
            {profile.blocked? <button onClick={unblock}>Unblock</button> : <button onClick={block}>Block</button>}
            {allowDisconnect ? 
            <>
                <p>Are you sure you want to disconnect from {profile.name}?</p>
                <button onClick={disconnect}>Yes</button>
                <button onClick={() => setAllowDisconnect(false)}>No</button>
            </>
                : null}
            {profile.pending ? <p>Invitation Pending</p> : null}
            {profile.invited ? <button onClick={accept}>Accept Invitation</button> : null}
            {(!profile.connected && !profile.pending) && (!profile.invited && !profile.blocked) ? <button onClick={connect}>Connect</button> : null}
        </main>
    )
}

export default ProfilePage