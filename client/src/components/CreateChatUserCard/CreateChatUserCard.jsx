import CardImageIcon from "../CardImageIcon/CardImageIcon"
import styles from "./CreateChatUserCard.module.css"

function CreateChatUserCard({user, addParticipant}) {
  
  const iconUser = [{
    firstName: user.name,
    profileImg: user.profileImg
  }]
    
  return (
    <div className={`userCard ${styles.card}`}>
        <CardImageIcon users={iconUser}/>
        <span className={styles.name}>{user.name}</span>
        <button onClick={() => addParticipant(user) }>Add</button>
    </div>
  )
}

export default CreateChatUserCard