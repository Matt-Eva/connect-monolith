import styles from "./ProfilePage.module.css";

const loadProfile = async ({ setProfile, navigate, id }) => {
  try {
    const res = await fetch(`/api/user/${id}`, {
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      setProfile(data);
    } else if (res.status === 404) {
      alert("Profile not found - redirecting to home page");
      navigate("/");
    }
  } catch (e) {
    console.error(e);
  }
};

const startChat = async ({ profile, navigate }) => {
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

const connect = async ({ profile, setProfile }) => {
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

const accept = async ({ setProfile, profile }) => {
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

const disconnect = async ({ profile, setProfile, setAllowDisconnect }) => {
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

const block = async ({ setProfile, profile }) => {
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

const unblock = async ({ profile, setProfile }) => {
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

const renderIconDisplay = ({ profile }) => {
  return profile.profileImg ? (
    <img
      src={profile.profileImg}
      alt="profile img"
      className={styles.profileImage}
    />
  ) : (
    <span className={styles.profileIcon}>
      {user.name.charAt(0).toUpperCase()}
    </span>
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
};
