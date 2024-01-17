import MainNavBar from "../MainNavBar/MainNavBar"
import { Link } from "react-router-dom"
import styles from "./Header.module.css"

function Header() {

  return (
    <header className={styles.header}>
        <h1 className={styles.title}>CONNECT</h1>
        <Link to="/about" className={styles.about}>about</Link>
        <Link className={styles.donate}>donate</Link>
        <Link className={styles.getApp}>get the app</Link>
        <Link to="/account" className={styles.account}>account</Link>
    </header>
  )
}

export default Header