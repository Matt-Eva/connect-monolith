const getMe = async ({
  navigate,
  dispatch,
  createUser,
  setLoading,
  setOfflineDisplay,
  destroyUser,
}) => {
  try {
    const res = await fetch("/api/me");
    if (res.ok) {
      const data = await res.json();
      dispatch(createUser(data));
      setLoading(false);
    } else if (res.status === 401) {
      dispatch(destroyUser());
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

export { getMe };
