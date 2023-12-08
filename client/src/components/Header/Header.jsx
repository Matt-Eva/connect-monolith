import MainNavBar from "../MainNavBar/MainNavBar"
import { Link } from "react-router-dom"
import styles from "./Header.module.css"

function Header() {

  return (
    <header className={styles.header}>
      <div className={styles.siteNav}>
        <h1 className={styles.title}>Connect</h1>
        <Link to="/about" className={`${styles.click} ${styles.learnMore}`}>about</Link>
        {/* <Link className={`${styles.click} ${styles.learnMore}`}>donate</Link> */}
        <Link to="/account" className={`${styles.click} ${styles.myAccount}`}>my account</Link>
      </div>
        <MainNavBar />
    </header>
  )
}

export default Header