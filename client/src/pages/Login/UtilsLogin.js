const login = async ({
  email,
  password,
  dispatch,
  createUser,
  navigate,
  startingPath,
}) => {
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
    dispatch(createUser(data));
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

export { login };
