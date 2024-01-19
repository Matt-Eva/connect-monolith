import { useState } from "react"
import styles from "./UpdateProfileImage.module.css"

function UpdateProfileImage({toggleEdit, profileImg}) {
    const [image, setImage] = useState(profileImg)  


    return (
    <div>UpdateProfileImage</div>
    )
}

export default UpdateProfileImage