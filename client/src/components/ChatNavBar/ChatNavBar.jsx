import { NavLink } from "react-router-dom"
import styles from "./ChatNavBar.module.css"

function ChatNavBar() {
  return (
    <nav className={styles.nav}>
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