import { Link } from "react-router-dom"

function ChatCard({chatId, users}) {
  
  const userNames = users.map((user, index) => {
    if (index === users.length - 1){
      return< >{user.firstName}</>
    } else{
      return< >{user.firstName}, </>
    }
    
  })
 
  return (
    <article className="bg-cyan-50 border-y h-8 flex items-center">
      <p className="w-34 truncate mr-2">{userNames}:</p>
      <Link to={`/chat/${chatId}`} className="text-ellipsis underline">open ></Link>
    </article>
  )
}

export default ChatCard