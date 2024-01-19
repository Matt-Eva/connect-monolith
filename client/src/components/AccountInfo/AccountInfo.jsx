import { useState } from "react"
import { Link } from "react-router-dom"
import BlockedUserCard from "../BlockedUserCard/BlockedUserCard"
import styles from "./AccountInfo.module.css"

function AccountInfo({toggleEdit, name, email, profileImg, uId, logout}) {
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
      <h2 className={styles.name}>{name}</h2>
      <p className={styles.email}>{email}</p>
      <Link to={`/profile/${uId}`} className={`underlined-link`}>view profile</Link>
      <div className={styles.buttonContainer}>
        <button onClick={() =>toggleEdit("info")} className={styles.editButton}>edit account</button>
        <button onClick={() =>toggleEdit("image")}>edit profile image</button>
      </div>
      {showBlockedUsers ? <button onClick={() => setShowBlockedUsers(false)} className={styles.blockedUserButton}>hide blocked users</button> : <button onClick={fetchBlockedUsers} className={styles.blockedUserButton}>manage blocked users</button>}
      <div>
        {showBlockedUsers ? displayBlockedUsers : null }
      </div>
    </main>
  )
}

export default AccountInfo