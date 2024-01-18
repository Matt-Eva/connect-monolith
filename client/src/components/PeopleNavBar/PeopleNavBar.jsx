import { NavLink } from "react-router-dom"
import styles from "./PeopleNavBar.module.css"

function SearchNavBar() {
  return (
    <nav className={styles.nav}>
        <NavLink to="/people" className={styles.search}>
            search
        </NavLink>
        <NavLink to="/people/my-connections" className={styles.connections}>
            connections
        </NavLink>
        <NavLink to="/people/invitations" className={styles.invitations}>
          invitations
        </NavLink>
    </nav>
  )
}

export default SearchNavBar