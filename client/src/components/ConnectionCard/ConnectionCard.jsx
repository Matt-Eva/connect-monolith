import { Link } from "react-router-dom"

function ConnectionCard({name, uId}) {
  return (
    <div>
      {name} {uId}
      <Link to={`/profile/${uId}`}>View Profile</Link>
    </div>
  )
}

export default ConnectionCard

// 54a3a1e1-50b7-4c7d-a8a4-4b9e6e914664