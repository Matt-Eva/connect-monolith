import SearchNavBar from "../../components/SearchNavBar/SearchNavBar"
import { Outlet, useOutletContext } from "react-router-dom"

function Search() {
  const { user } = useOutletContext()

  const outletContext = {user: user}

  return (
    <main>
        <SearchNavBar />
        <Outlet context={outletContext}/>
    </main>
  )
}

export default Search