import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";

import styles from "./ProfilePage.module.css";

import {
  loadProfile,
  startChat,
  connect,
  accept,
  disconnect,
  block,
  unblock,
  renderIconDisplay,
} from "./UtilsProfilePage";

function ProfilePage() {
  const user = useSelector((state) => state.user.value);

  const [profile, setProfile] = useState(false);
  const [allowDisconnect, setAllowDisconnect] = useState(false);
  const [manageConnection, setManageConnection] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    loadProfile({ navigate, id, setProfile });
  }, [user]);

  const handleStartChat = () => {
    startChat({ profile, navigate });
  };

  const handleConnect = () => {
    connect({ profile, setProfile });
  };

  const handleAccept = () => {
    accept({ profile, setProfile });
  };

  const handleDisconnect = () => {
    disconnect({ profile, setProfile, setAllowDisconnect });
  };

  const handleBlock = () => {
    block({ setProfile, profile });
  };

  const handleUnblock = () => {
    unblock({ profile, setProfile });
  };

  if (!profile) {
    return <h2>Loading...</h2>;
  }

  const iconDisplay = renderIconDisplay({ profile });

  if (user.uId === profile.uId) {
    return (
      <main className={styles.main}>
        {iconDisplay}
        <h2 className={styles.name}>{profile.name}</h2>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      {iconDisplay}
      <h2 className={styles.name}>{profile.name}</h2>
      {manageConnection ? (
        <div className={styles.buttonContainer}>
          {profile.blocked ? (
            <button onClick={handleUnblock} className={`bg-purple`}>
              Unblock
            </button>
          ) : (
            <button onClick={handleBlock} className={`bg-red`}>
              Block
            </button>
          )}
          {profile.connected ? (
            <button
              onClick={() => setAllowDisconnect(true)}
              className={`bg-purple`}
            >
              Disconnect
            </button>
          ) : null}
          {allowDisconnect ? (
            <>
              <p>Are you sure you want to disconnect from {profile.name}?</p>
              <button onClick={handleDisconnect}>Yes</button>
              <button onClick={() => setAllowDisconnect(false)}>No</button>
            </>
          ) : null}
          <button onClick={() => setManageConnection(false)}>Back</button>
        </div>
      ) : (
        <div className={styles.buttonContainer}>
          {profile.connected ? (
            <button onClick={handleStartChat} className={styles.chatButton}>
              Chat
            </button>
          ) : null}
          {profile.pending ? <p>Invitation Pending</p> : null}
          {profile.invited ? (
            <button onClick={handleAccept}>Accept Invitation</button>
          ) : null}
          {!profile.connected &&
          !profile.pending &&
          !profile.invited &&
          !profile.blocked ? (
            <button onClick={handleConnect}>Connect</button>
          ) : null}
          <button
            onClick={() => setManageConnection(true)}
            className={styles.manageConnectionButton}
          >
            manage connection
          </button>
        </div>
      )}
    </main>
  );
}

export default ProfilePage;
