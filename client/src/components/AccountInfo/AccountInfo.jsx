import { useState } from "react"
import ProfileIcon from "../ProfileIcon/ProfileIcon"
import BlockedUserCard from "../BlockedUserCard/BlockedUserCard"

function AccountInfo({toggleEdit, name, firstName, lastName, email, profileImg}) {
  const [blockedUsers, setBlockedUsers] = useState([])
  const [showBlockedUsers, setShowBlockedUsers] = useState(false)

  const fetchBlockedUsers = async () => {
    try{
      const res = await fetch ("/api/blocked-users",{credentials: "include"})
      if (res.ok){
        const data = await res.json()
        if (data.length !== 0){
          setBlockedUsers(data)
          setShowBlockedUsers(true)
        } else {
          alert("You haven't blocked any other users")
        }
      }
    }catch (e){
      console.error(e)
    }
  }

  const displayBlockedUsers = blockedUsers.map(user => <BlockedUserCard key={user.uId} {...user} />)
  
  return (
    <div>
        <button onClick={toggleEdit}>Edit Account</button>
        <ProfileIcon profileImg={profileImg} firstName={firstName}/>
        <h2>{name}</h2>
        <p>{email}</p>
        {showBlockedUsers ? <button onClick={() => setShowBlockedUsers(false)}>Hide Blocked Users</button> : <button onClick={fetchBlockedUsers}>Manage Blocked Users</button>}
        {showBlockedUsers ? displayBlockedUsers : null }
    </div>
  )
}

export default AccountInfo