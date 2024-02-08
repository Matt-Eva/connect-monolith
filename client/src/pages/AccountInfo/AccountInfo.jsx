import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import BlockedUserCard from "../../components/BlockedUserCard/BlockedUserCard";

import styles from "./AccountInfo.module.css";

import { destroyUser } from "../../state/user";
import { setStartingPath } from "../../state/startingPath";

import { fetchBlockedUsers, logout } from "./UtilsAccountInfo";

function AccountInfo() {
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { name, email, uId, profileImg } = user;

  const [blockedUsers, setBlockedUsers] = useState([]);
  const [showBlockedUsers, setShowBlockedUsers] = useState(false);

  const handleFetchBlockedUsers = () => {
    fetchBlockedUsers({ setBlockedUsers, setShowBlockedUsers });
  };

  const handleLogout = () => {
    logout({ dispatch, destroyUser, setStartingPath, location, navigate });
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
