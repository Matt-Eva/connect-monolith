import MainNavBar from "../MainNavBar/MainNavBar"
import { Link } from "react-router-dom"

function Header({logout}) {

  return (
    <header>
        <h1>Connect</h1>
        <button onClick={logout}>logout</button>
        <Link to="/account">My Account</Link>
        <MainNavBar />
    </header>
  )
}

export default Header