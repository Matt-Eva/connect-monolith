import SearchNavBar from "../../components/SearchNavBar/SearchNavBar"
import { Outlet, useOutletContext } from "react-router-dom"
import styles from "./People.module.css"

function People() {
  const { user } = useOutletContext()

  const outletContext = {user: user}

  return (
    <main className={styles.main}>
        <SearchNavBar />
        <Outlet context={outletContext}/>
    </main>
  )
}

export default People;