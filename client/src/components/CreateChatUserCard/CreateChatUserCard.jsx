import styles from "./CreateChatUserCard.module.css"

function CreateChatUserCard({user, addParticipant}) {
    
  return (
    <div className={styles.card}>
        <span className={styles.name}>{user.name}</span>
        <button onClick={() => addParticipant(user) } className={styles.button}>Add</button>
    </div>
  )
}

export default CreateChatUserCard