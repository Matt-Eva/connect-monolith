const fetchBlockedUsers = async ({
  setBlockedUsers,
  setShowBlockedUsers,
}: {
  setBlockedUsers: Function;
  setShowBlockedUsers: Function;
}) => {
  try {
    const res = await fetch("/api/blocked-users", { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      if (data.length !== 0) {
        setBlockedUsers(data);
        setShowBlockedUsers(true);
      } else {
        alert("You haven't blocked any other users");
      }
    }
  } catch (e) {
    console.error(e);
  }
};

const logout = async ({
  setStartingPath,
  dispatch,
  destroyUser,
  navigate,
  clearChats,
  clearConnections,
  clearPosts,
  clearMyPosts,
}: {
  setStartingPath: Function;
  dispatch: Function;
  destroyUser: Function;
  navigate: Function;
  clearChats: Function;
  clearConnections: Function;
  clearPosts: Function;
  clearMyPosts: Function;
}) => {
  await fetch("/api" + "/logout", {
    method: "DELETE",
    credentials: "include",
  });
  dispatch(setStartingPath("/"));
  dispatch(destroyUser());
  dispatch(clearChats());
  dispatch(clearConnections());
  dispatch(clearPosts());
  dispatch(clearMyPosts());
  navigate("/login");
};

export { fetchBlockedUsers, logout };
