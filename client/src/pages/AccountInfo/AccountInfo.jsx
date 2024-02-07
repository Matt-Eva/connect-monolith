import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import BlockedUserCard from "../../components/BlockedUserCard/BlockedUserCard";
import styles from "./AccountInfo.module.css";
import { fetchBlockedUsers } from "./UtilsAccountInfo";

function AccountInfo() {
  const { user, handleLogout } = useOutletContext();
  const { name, email, profileImg, uId } = user;

  const [blockedUsers, setBlockedUsers] = useState([]);
  const [showBlockedUsers, setShowBlockedUsers] = useState(false);

  const handleFetchBlockedUsers = () => {
    fetchBlockedUsers({ setBlockedUsers, setShowBlockedUsers });
  };

  const displayBlockedUsers = blockedUsers.map((user) => (
    <BlockedUserCard key={user.uId} {...user} />
  ));

  return (
    <main className={styles.main}>
      <div className={styles.imageLogout}>
        <img
          src={profileImg}
          alt={`${name} profile image`}
          className={styles.profileImage}
        />
        <button onClick={handleLogout} className={styles.logoutButton}>
          logout
        </button>
      </div>
      <h2 className={styles.name}>{name}</h2>
      <p className={styles.email}>{email}</p>
      <Link to={`/profile/${uId}`} className={`underlined-link`}>
        view profile
      </Link>
      <Link to="/account/enable-notifications" className={`underlined-link`}>
        manage notifications
      </Link>
      <div className={styles.editContainer}>
        <Link to="/account/edit" className={`underlined-link`}>
          edit account
        </Link>
        <Link to="/account/edit-image" className={`underlined-link`}>
          edit profile image
        </Link>
      </div>
      {showBlockedUsers ? (
        <button
          onClick={() => setShowBlockedUsers(false)}
          className={`bg-purple ${styles.blockedUserButton}`}
        >
          hide blocked users
        </button>
      ) : (
        <button
          onClick={handleFetchBlockedUsers}
          className={` bg-red ${styles.blockedUserButton}`}
        >
          manage blocked users
        </button>
      )}
      <div>{showBlockedUsers ? displayBlockedUsers : null}</div>
    </main>
  );
}

export default AccountInfo;
