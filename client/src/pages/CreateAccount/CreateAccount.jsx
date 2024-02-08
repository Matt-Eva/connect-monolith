import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import styles from "./CreateAccount.module.css";

import { createAccount } from "./UtilsCreateAccount";

function CreateAccount() {
  const startingPath = useSelector((state) => state.startingPath.value);
  const dispatch = useDispatch();

  const baseFormState = {
    password: "",
    confirmPassword: "",
    email: "",
    firstName: "",
    lastName: "",
    profileImg: "",
  };
  const [formState, setFormState] = useState(baseFormState);

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createAccount({
      startingPath,
      dispatch,
      createUser,
      formState,
      setFormState,
      baseFormState,
      navigate,
    });
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.welcome}>CONNECT</h1>
      <h2 className={styles.title}>Create Account</h2>
      <form
        onSubmit={handleSubmit}
        onChange={handleChange}
        className={styles.form}
      >
        <label htmlFor="email" className="">
          email
        </label>
        <input
          type="text"
          name="email"
          value={formState.email}
          className={styles.input}
        />
        <label htmlFor="firstName" className="">
          first name
        </label>
        <input
          type="text"
          name="firstName"
          value={formState.firstName}
          className={styles.input}
        />
        <label htmlFor="lastName" className="">
          last name
        </label>
        <input
          type="text"
          name="lastName"
          value={formState.lastName}
          className={styles.input}
        />
        <label htmlFor="password" className="">
          password
        </label>
        <input
          type="password"
          name="password"
          value={formState.password}
          className={styles.input}
        />
        <label htmlFor="confirmPassword" className="">
          confirm password
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formState.confirmPassword}
          className={styles.input}
        />
        <input
          type="submit"
          value="Create Account"
          className={styles.createAccount}
        />
      </form>
      <Link to="/login" className={`underlined-link ${styles.login}`}>
        Login
      </Link>
    </main>
  );
}

export default CreateAccount;
