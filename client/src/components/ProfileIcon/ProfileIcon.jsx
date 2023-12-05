

function ProfileIcon({profileImg, firstName}) {
  return (
    <div>
        {profileImg ? <img src={profileImg} alt="profile img"/> : <span>{firstName.charAt(0)}</span>}
    </div>
  )
}

export default ProfileIcon