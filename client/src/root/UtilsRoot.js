const getMe = async ({ navigate, setUser, setLoading, setOfflineDisplay }) => {
  try {
    const res = await fetch("/api/me");
    if (res.ok) {
      const data = await res.json();
      setUser(data);
      setLoading(false);
    } else if (res.status === 401) {
      setUser(false);
      setLoading(false);
      navigate("/login");
    } else {
      throw new Error("Problem with network response");
    }
  } catch (e) {
    setOfflineDisplay(true);
    console.log("caught error");
    console.error(e);
  }
};

const logout = async ({ setStartingPath, setUser, navigate, location }) => {
  await fetch("/api" + "/logout", {
    method: "DELETE",
    credentials: "include",
  });
  setStartingPath(location.pathname);
  setUser(false);
  navigate("/login");
};

export { getMe, logout };
