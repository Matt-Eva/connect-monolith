import { Link } from "react-router-dom"
import ProfileIcon from "../ProfileIcon/ProfileIcon"

function ConnectionCard({name, uId, profileImg}) {
  return (
    <div>
      <img src={profileImg} alt={`${name} profile image`}/>
      {name}
      <Link to={`/profile/${uId}`}>View Profile</Link>
    </div>
  )
}

export default ConnectionCard

// 54a3a1e1-50b7-4c7d-a8a4-4b9e6e914664