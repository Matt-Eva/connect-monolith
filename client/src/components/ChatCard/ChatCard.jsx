import { Link } from "react-router-dom"
import styles from "./ChatCard.module.css"

function ChatCard({chatId, users}) {
  
  const userNames = users.map((user, index) => {
    if (index === users.length - 1){
      return< >{user.firstName}</>
    } else{
      return< >{user.firstName}, </>
    }
    
  })
 
  return (
    <article className={styles.card}>
      <p className="">{userNames}</p>
      <Link to={`/chat/${chatId}`} className="">open chat</Link>
      
    </article>
  )
}

export default ChatCard