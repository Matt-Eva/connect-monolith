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

const login = async ({ email, password, setUser, navigate, startingPath }) => {
  const res = await fetch("/api" + "/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email, password: password }),
  });

  if (res.ok) {
    const data = await res.json();
    setUser(data);
    if (startingPath === "/login" || startingPath === "/new-account") {
      navigate("/");
    } else {
      navigate(startingPath);
    }
  } else {
    const error = await res.json();
    console.error(error);
  }
};

const createAccount = async ({ newUser, setUser, navigate, startingPath }) => {
  try {
    const res = await fetch("/api" + "/new-account", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data);
      if (startingPath === "/login" || startingPath === "/new-account") {
        navigate("/");
      } else {
        navigate(startingPath);
      }
    } else {
      const error = await res.json();
      throw new Error(error.error);
    }
  } catch (e) {
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

export { getMe, login, logout, createAccount };
