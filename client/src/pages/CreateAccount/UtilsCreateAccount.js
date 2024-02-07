const validateAndCreate = async ({
  handleCreateAccount,
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
    await handleCreateAccount({ newUser });
    setFormState(baseFormState);
  } catch (e) {
    console.error(e);
    alert(e.message + ". Please use a different email address.");
  }
};

export { validateAndCreate };
