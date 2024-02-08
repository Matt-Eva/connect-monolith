const fetchBlockedUsers = async ({ setBlockedUsers, setShowBlockedUsers }) => {
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
  location,
}) => {
  await fetch("/api" + "/logout", {
    method: "DELETE",
    credentials: "include",
  });
  dispatch(setStartingPath(location.pathname));
  dispatch(destroyUser());
  navigate("/login");
};

export { fetchBlockedUsers, logout };
