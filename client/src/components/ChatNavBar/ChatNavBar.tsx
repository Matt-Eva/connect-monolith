import { NavLink } from "react-router-dom"
import styles from "./ChatNavBar.module.css"

function ChatNavBar() {
  return (
    <nav className={styles.nav}>
        <NavLink to="/">
            my chats
        </NavLink>
        <NavLink to="/new-chat">
            new chat
        </NavLink>
    </nav>
  )
}

export default ChatNavBar