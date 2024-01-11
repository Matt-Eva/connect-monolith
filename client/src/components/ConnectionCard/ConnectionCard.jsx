import { Link } from "react-router-dom"
import styles from "./ConnectionCard.module.css"

function ConnectionCard({name, uId, profileImg}) {
  return (
    <div className={`userCard ${styles.card}`}>
      <img src={profileImg} alt={`${name} profile image`}/>
      <span title={name}>{name}</span>
      <Link to={`/profile/${uId}`} className={`buttonLink ${styles.link}`}>view profile</Link>
    </div>
  )
}

export default ConnectionCard

// 54a3a1e1-50b7-4c7d-a8a4-4b9e6e914664