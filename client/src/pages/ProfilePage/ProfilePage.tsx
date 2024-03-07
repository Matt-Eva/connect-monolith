import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAppSelector, useAppDispatch } from "../../reduxHooks";

import PostCard from "../../components/PostCard/PostCard";

import { Post } from "../../types/post";
import { Profile } from "./TypesProfilePage";

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
  loadMyPosts,
} from "./UtilsProfilePage";

import { setMyPosts } from "../../state/myPosts";

function ProfilePage() {
  const user = useAppSelector((state) => state.user.value);
  const myPostsState = useAppSelector((state) => state.myPosts.value);
  const myPosts = myPostsState.myPosts;

  const dispatch = useAppDispatch();

  const [profile, setProfile] = useState<Profile>({
    uId: "",
    profileImg: "",
    name: "",
    blocked: false,
    connected: false,
    invited: false,
    pending: false,
    loading: true,
  });
  const [allowDisconnect, setAllowDisconnect] = useState(false);
  const [manageConnection, setManageConnection] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    if (id && id === user.uId) {
      if (myPostsState.isFetched) {
        setPosts(myPosts);
      } else {
        loadMyPosts({
          setPosts,
          dispatch,
          setMyPosts,
          username: user.name,
          userId: user.uId,
        });
      }
    } else if (id) {
      loadProfile({ navigate, id, setProfile, setPosts });
    }
  }, [myPosts]);

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

  const iconDisplay = renderIconDisplay({
    profileImg: profile.profileImg,
    name: profile.name,
  });

  const displayPosts = posts.map((post) => {
    if (user.uId === id) {
      return (
        <PostCard
          editable={true}
          userId={user.uId}
          username={user.name}
          post={post.post}
          key={post.post.mongoId}
        />
      );
    } else {
      return (
        <PostCard
          editable={false}
          userId={profile.uId}
          username={profile.name}
          post={post.post}
          key={post.post.uId}
        />
      );
    }
  });

  if (user.uId === id) {
    return (
      <main className={styles.main}>
        {renderIconDisplay({ profileImg: user.profileImg, name: user.name })}
        <h2 className={styles.name}>{user.name}</h2>
        {displayPosts}
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
      {displayPosts}
    </main>
  );
}

export default ProfilePage;
