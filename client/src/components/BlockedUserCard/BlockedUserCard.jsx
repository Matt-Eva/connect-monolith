import { Link } from "react-router-dom"

function BlockedUserCard({name, profileImg, uId}) {
  return (
    <div>
        <p>{name}</p>
        <Link to={`/profile/${uId}`}>View Profile</Link>
    </div>
  )
}

export default BlockedUserCard