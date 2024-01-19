import { Link } from "react-router-dom"
import CardImageIcon from "../CardImageIcon/CardImageIcon"
import styles from "./BlockedUserCard.module.css"

function BlockedUserCard({name, profileImg, uId}) {

  const iconUser = [{
    firstName: name,
    profileImg
  }]

  const unblock = async () => {
    try {
        const res = await fetch(`/api/unblock-user/${uId}`, {
            method: "DELETE",
            credentials: "include"
        })
        if (res.ok){
            setProfile({
                ...profile,
                blocked: false
            })
        }
    } catch (e) {
        console.error(e)
    }
}

  return (
    <article className={`${styles.card}`}>
        <CardImageIcon users={iconUser} />
        <p className={styles.name}>{name}</p>
        <button onClick={unblock}>unblock</button>
        <Link to={`/profile/${uId}`} className={`buttonLink`}>view profile</Link>
    </article>
  )
}

export default BlockedUserCard