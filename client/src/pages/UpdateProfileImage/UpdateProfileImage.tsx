import styles from "./UpdateProfileImage.module.css";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../reduxHooks";

function UpdateProfileImage() {
  const user = useAppSelector((state) => state.user.value);
  const { profileImg } = user;

  let iconDisplay = profileImg ? (
    <img src={profileImg} alt="profile image" className={styles.image} />
  ) : (
    <span>{user.name.charAt(0).toUpperCase()}</span>
  );

  return (
    <main className={styles.main}>
      <Link to="/account">Back</Link>
      {iconDisplay}
      <button className={`bg-purple ${styles.imageButton}`}>
        Select Image
      </button>
      <button className={styles.imageButton}>Confirm</button>
      <p style={{ "font-style": "italic" }}>
        Dear users - we aren't currently allowing updates to profile images at
        this time. Coming soon!
      </p>
    </main>
  );
}

export default UpdateProfileImage;
