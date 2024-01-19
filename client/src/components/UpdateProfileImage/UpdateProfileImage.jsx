import { useState } from "react"
import styles from "./UpdateProfileImage.module.css"

function UpdateProfileImage({toggleEdit, profileImg, name}) {
    const [image, setImage] = useState(profileImg)
    
    let iconDisplay = profileImg ? <img src={profileImg} alt="profile image" className={styles.image}/> : <span>{name.charAt(0).toUpperCase()}</span>


    return (
    <main className={styles.main}>
        <button onClick={() => toggleEdit("")} className={styles.backButton}>Back</button>
        {iconDisplay}
        <button className={`bg-purple ${styles.imageButton}`}>Select Image</button>
        <button className={styles.imageButton}>Confirm</button>
        <p style={{"font-style": "italic"}}>Dear users - we aren't currently allowing updates to profile images at this time. Coming soon!</p>
    </main>
    )
}

export default UpdateProfileImage