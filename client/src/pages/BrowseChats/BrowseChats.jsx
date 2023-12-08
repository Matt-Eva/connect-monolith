import ChatNavBar from "../../components/ChatNavBar/ChatNavBar"
import { Outlet, useOutletContext } from "react-router-dom"
import styles from "./BrowseChats.module.css"

function BrowseChats() {
  const {user} = useOutletContext()

  const outletContext = {user: user}

  return (
    <main className={styles.main}>
        <ChatNavBar />
        <Outlet context={outletContext}/>
    </main>
  )
}

export default BrowseChats