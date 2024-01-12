import styles from "./CreateChatUserCard.module.css"

function CreateChatUserCard({user, addParticipant}) {
    
  return (
    <div className={`userCard ${styles.card}`}>
        <img src={user.profileImg} alt={`${user.name} profile image`} className={`userCardImage`}/>
        <span className={styles.name}>{user.name}</span>
        <button onClick={() => addParticipant(user) }>Add</button>
    </div>
  )
}

export default CreateChatUserCard