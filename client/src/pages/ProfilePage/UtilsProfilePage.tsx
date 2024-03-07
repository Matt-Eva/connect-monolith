import { Profile } from "./TypesProfilePage";

import styles from "./ProfilePage.module.css";

const loadProfile = async ({
  setProfile,
  setPosts,
  navigate,
  id,
}: {
  setProfile: Function;
  setPosts: Function;
  navigate: Function;
  id: string;
}) => {
  try {
    const res = await fetch(`/api/user/${id}`, {
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      console.log(data);
      setProfile({ ...data.user, loading: false });
      setPosts([...data.posts]);
    } else if (res.status === 404) {
      alert("Profile not found - redirecting to home page");
      navigate("/");
    }
  } catch (e) {
    console.error(e);
  }
};

const loadMyPosts = async ({
  setPosts,
  dispatch,
  setMyPosts,
}: {
  setPosts: Function;
  dispatch: Function;
  setMyPosts: Function;
}) => {
  try {
    const res = await fetch("/api/my-posts");
    const posts = await res.json();
    setPosts(posts);
    dispatch(setMyPosts(posts));
  } catch (error) {
    console.error(error);
  }
};

const startChat = async ({
  profile,
  navigate,
}: {
  profile: Profile;
  navigate: Function;
}) => {
  try {
    const res = await fetch("/api/new-chat", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ participants: [profile] }),
    });

    if (res.ok) {
      const chat = await res.json();
      navigate(`/chat/${chat.uId}`);
      console.log(chat);
    }
  } catch (e) {
    console.error(e);
  }
};

const connect = async ({
  profile,
  setProfile,
}: {
  profile: Profile;
  setProfile: Function;
}) => {
  try {
    const res = await fetch("/api/invite-connection", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ connectionId: profile.uId }),
    });
    if (res.ok) {
      setProfile({
        ...profile,
        pending: true,
      });
    }
  } catch (e) {
    console.error(e);
  }
};

const accept = async ({
  setProfile,
  profile,
}: {
  profile: Profile;
  setProfile: Function;
}) => {
  try {
    const res = await fetch("/api/accept-invitation", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ connectionId: profile.uId }),
    });
    if (res.ok) {
      setProfile({ ...profile, connected: true });
    }
  } catch (e) {
    console.error(e);
  }
};

const disconnect = async ({
  profile,
  setProfile,
  setAllowDisconnect,
}: {
  profile: Profile;
  setProfile: Function;
  setAllowDisconnect: Function;
}) => {
  try {
    const res = await fetch(`/api/delete-connection/${profile.uId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      alert(`disconnected from ${profile.name}`);
      setProfile({ ...profile, connected: false });
      setAllowDisconnect(false);
    }
  } catch (e) {
    console.error(e);
  }
};

const block = async ({
  setProfile,
  profile,
}: {
  profile: Profile;
  setProfile: Function;
}) => {
  try {
    const res = await fetch("/api/block-user", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: profile.uId }),
    });
    if (res.ok) {
      setProfile({
        ...profile,
        blocked: true,
        connected: false,
        pending: false,
        invited: false,
      });
    }
  } catch (e) {
    console.error(e);
  }
};

const unblock = async ({
  profile,
  setProfile,
}: {
  profile: Profile;
  setProfile: Function;
}) => {
  try {
    const res = await fetch(`/api/unblock-user/${profile.uId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      setProfile({
        ...profile,
        blocked: false,
      });
    }
  } catch (e) {
    console.error(e);
  }
};

const renderIconDisplay = ({
  profileImg,
  name,
}: {
  profileImg: string;
  name: string;
}) => {
  return profileImg ? (
    <img src={profileImg} alt="profile img" className={styles.profileImage} />
  ) : (
    <span className={styles.profileIcon}>{name.charAt(0).toUpperCase()}</span>
  );
};

export {
  loadProfile,
  startChat,
  connect,
  accept,
  disconnect,
  block,
  unblock,
  renderIconDisplay,
  loadMyPosts,
};
