import SearchNavBar from "../../components/SearchNavBar/SearchNavBar"
import { Outlet, useOutletContext } from "react-router-dom"
import styles from "./Search.module.css"

function Search() {
  const { user } = useOutletContext()

  const outletContext = {user: user}

  return (
    <main className={styles.main}>
        <SearchNavBar />
        <Outlet context={outletContext}/>
    </main>
  )
}

export default Search