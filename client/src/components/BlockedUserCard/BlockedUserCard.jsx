import { Link } from "react-router-dom"
import styles from "./BlockedUserCard.module.css"

function BlockedUserCard({name, profileImg, uId}) {
  return (
    <article className={`userCard ${styles.card}`}>
        <img src={profileImg} alt={`${name} profile image`} className={`userCardImage`}/>
        <p className={`userCardName`}>{name}</p>
        <Link to={`/profile/${uId}`} className={`buttonLink`}>view profile</Link>
    </article>
  )
}

export default BlockedUserCard