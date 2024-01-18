import styles from "./CardImageIcon.module.css"

function CardImageIcon({users}) {

    const length = users.length

    console.log(length)

    let imageClass;

    if(length === 1) {
        imageClass = styles.single
    } else if (length === 2){
        imageClass = styles.double
    } else if (length === 3) {
        imageClass = styles.triple
    } else {
        imageClass = styles.quadruple
    }

    const images = users.map(user => {
        if (!user.profileImg){
            return <span className={`${styles.roundImage} ${imageClass} ${styles.firstLetter}`}>{user.firstName.charAt(0).toUpperCase()}</span>
        } else {
            return <img src={user.profileImg} className={`${imageClass} ${styles.roundImage}`}/>
        }
    }) 

  return (
    <div className={styles.icon}>
        {images}
    </div>
  )
}

export default CardImageIcon