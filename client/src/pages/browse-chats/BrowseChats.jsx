import ChatNavBar from "../../components/ChatNavBar/ChatNavBar"
import { Outlet, useOutletContext } from "react-router-dom"

function BrowseChats() {
  const {user} = useOutletContext()

  const outletContext = {user: user}
  return (
    <main>
        Chats
        <ChatNavBar />
        <Outlet context={outletContext}/>
    </main>
  )
}

export default BrowseChats