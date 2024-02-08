const createAccount = async ({
  createUser,
  dispatch,
  navigate,
  startingPath,
  formState,
  setFormState,
  baseFormState,
}) => {
  if (formState.email === "") {
    return alert("email is required");
  }
  if (formState.firstName === "" && formState.lastName === "") {
    return alert("you must enter either a first name or a last name");
  }
  if (formState.password.length < 4) {
    return alert("password must be at least 4 characters in length");
  }
  if (formState.password !== formState.confirmPassword) {
    return alert("password and password confirmation must match");
  }
  const newUser = {
    ...formState,
    name: `${formState.firstName} ${formState.lastName}`,
  };
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
      dispatch(createUser(data));
      setFormState(baseFormState);
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

export { createAccount };
