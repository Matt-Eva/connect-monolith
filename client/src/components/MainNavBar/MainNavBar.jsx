import { NavLink } from "react-router-dom"

function MainNavBar() {
  return (
    <nav className="col-span-3 flex justify-around items-end">
      <NavLink to="/" className="underline">
        chats
      </NavLink>
      <NavLink to="/people" className="underline">
        people
      </NavLink>
    </nav>
  )
}

export default MainNavBar