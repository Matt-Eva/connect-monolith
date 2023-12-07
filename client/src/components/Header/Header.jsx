import MainNavBar from "../MainNavBar/MainNavBar"
import { Link } from "react-router-dom"

function Header({logout}) {

  return (
    <header className="h-14 w-full grid grid-rows-2">
      <div className="box-border w-screen grid grid-cols-header sm:grid-cols-2 items-end pb-1 ">
        <h1 className="text-2xl/7 text-cyan-600 m-0 row-start-1 col-start-1 pl-1">Connect</h1>
        <Link to="/account" className="underline justify-self-end row-start-1 sm:col-start-2 sm:mr-16">my account</Link>
        <button onClick={logout} className="underline justify-self-end row-start-1 sm:col-start-2 mr-1">logout</button>
      </div>
        <MainNavBar />
    </header>
  )
}

export default Header