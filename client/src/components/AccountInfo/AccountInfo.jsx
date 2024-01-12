import { useState } from "react"
import BlockedUserCard from "../BlockedUserCard/BlockedUserCard"
import styles from "./AccountInfo.module.css"

function AccountInfo({toggleEdit, name, email, profileImg, logout}) {
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
    <main className={styles.main}>
      <div className={styles.imageLogout}>
        <img src={profileImg} alt={`${name} profile image`} className={styles.profileImage}/>
        <button onClick={logout} className={styles.logoutButton}>logout</button>
      </div>
      <div className={styles.userInfo}>
        <h2>{name}</h2>
        <p className={styles.email}>{email}</p>
        <button onClick={toggleEdit} className={styles.editButton}>Edit Account</button>
      </div>
      <div>
        {showBlockedUsers ? <button onClick={() => setShowBlockedUsers(false)}>Hide Blocked Users</button> : <button onClick={fetchBlockedUsers}>Manage Blocked Users</button>}
        {showBlockedUsers ? displayBlockedUsers : null }
      </div>
    </main>
  )
}

export default AccountInfo