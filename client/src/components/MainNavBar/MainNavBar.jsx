import { NavLink } from "react-router-dom"

function MainNavBar() {
  return (
    <nav>
      <NavLink to="/">
        chats
      </NavLink>
      <NavLink to="/people">
        people
      </NavLink>
    </nav>
  )
}

export default MainNavBar