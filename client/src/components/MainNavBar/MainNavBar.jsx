import { NavLink } from "react-router-dom"
import styles from "./MainNavBar.module.css"

function MainNavBar() {
  return (
    <footer className={styles.footer}>
      <nav className={styles.nav}>
        <NavLink to="/" className="underline">
          chats
        </NavLink>
        <NavLink to="/people" className="underline">
          people
        </NavLink>
      </nav>
    </footer>
  )
}

export default MainNavBar