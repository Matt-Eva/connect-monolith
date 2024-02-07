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

export { fetchBlockedUsers };
