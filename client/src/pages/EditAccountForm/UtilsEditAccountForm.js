const updateAccount = async ({
  setFormState,
  setInitialChangeFormState,
  setDisableChangeInfo,
  formState,
}) => {
  try {
    const res = await fetch("/api/my-account", {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newInfo: formState }),
    });

    if (res.ok) {
      const updatedInfo = await res.json();
      alert("Info successfully updated!");
      setFormState(updatedInfo);
      setInitialChangeFormState(updatedInfo);
      setDisableChangeInfo(true);
    }
  } catch (e) {
    console.error(e);
  }
};

const updatePassword = async ({
  setPasswordState,
  passwordState,
  initialPasswordState,
}) => {
  if (passwordState.newPassword !== passwordState.confirmPassword) {
    alert("Password confirmation must match new password.");
    setPasswordState({
      ...passwordState,
      newPassword: "",
      confirmPassword: "",
    });
    return;
  }

  try {
    const res = await fetch("/api/update-password", {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ passwordInfo: passwordState }),
    });
    if (res.ok) {
      alert("Password updated successfully!");
      setPasswordState(initialPasswordState);
    }
  } catch (e) {
    console.error(e);
  }
};

const deleteAccount = async ({ destroyUser, dispatch, navigate }) => {
  try {
    const res = await fetch("/api/my-account", {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      alert("account successfully deleted");
      dispatch(destroyUser());
      navigate("/login");
    }
  } catch (e) {
    console.error(e);
  }
};

export { updateAccount, updatePassword, deleteAccount };
