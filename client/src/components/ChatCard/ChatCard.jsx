import { useState } from "react"
import { Link } from "react-router-dom"
import styles from "./ChatCard.module.css"

function ChatCard({chatId, users}) {
  const [isTruncated, setIsTruncated] = useState(true)
  
  const userNameArray = users.map((user) => user.firstName)

  const userNames = userNameArray.join(', ')

  const nameClass = isTruncated ? styles.namesTruncated : styles.allNames
 
  console.log(nameClass)

  return (
    <article className={`userCard ${styles.card}`}>
      <span 
      className={nameClass} 
      title={userNames} 
      onClick={() => setIsTruncated(!isTruncated)}
      >
        {userNames}
      </span>
      <Link to={`/chat/${chatId}`} className={styles.link}>open chat</Link>
      
    </article>
  )
}

export default ChatCard