import { NavLink } from "react-router-dom"
import styles from "./SearchNavBar.module.css"

function SearchNavBar() {
  return (
    <nav className={styles.nav}>
        <NavLink to="/people">
            search
        </NavLink>
        <NavLink to="/people/my-connections">
            my connections
        </NavLink>
        <NavLink to="/people/invitations">
          invitations
        </NavLink>
    </nav>
  )
}

export default SearchNavBar