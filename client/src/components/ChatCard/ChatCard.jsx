import { Link } from "react-router-dom"

function ChatCard({chatId, users}) {
  
  const userNames = users.map(user => <span key={user.uId}>{user.name} </span>)
 
  return (
    <article>
        {userNames}
        <Link to={`/chat/${chatId}`}>open</Link>
    </article>
  )
}

export default ChatCard