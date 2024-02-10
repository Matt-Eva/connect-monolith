function ProfileIcon({
  profileImg,
  firstName,
}: {
  profileImg: string;
  firstName: string;
}) {
  return (
    <div>
      {profileImg ? (
        <img src={profileImg} alt="profile img" />
      ) : (
        <span>{firstName.charAt(0)}</span>
      )}
    </div>
  );
}

export default ProfileIcon;
