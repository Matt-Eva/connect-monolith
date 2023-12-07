import { NavLink } from "react-router-dom"

function ChatNavBar() {
  return (
    <nav className="flex justify-around border-b h-8 items-end">
        <NavLink to="/" className="underline">
            my chats
        </NavLink>
        <NavLink to="/new-chat" className="underline">
            new chat
        </NavLink>
    </nav>
  )
}

export default ChatNavBar