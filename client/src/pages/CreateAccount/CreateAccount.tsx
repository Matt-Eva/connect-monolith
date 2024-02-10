import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../reduxHooks";

import styles from "./CreateAccount.module.css";

import { createUser } from "../../state/user";

import { createAccount } from "./UtilsCreateAccount";

function CreateAccount() {
  const user = useAppSelector((state) => state.user.value);
  const startingPath = useAppSelector((state) => state.startingPath.value);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const baseFormState = {
    password: "",
    confirmPassword: "",
    email: "",
    firstName: "",
    lastName: "",
    profileImg: "",
  };
  const [formState, setFormState] = useState(baseFormState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

  if (user) {
    return (
      <main>
        <p>You are already logged in.</p>
        <Link to="/" className={`underlined-link`}>
          Home
        </Link>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.welcome}>CONNECT</h1>
      <h2 className={styles.title}>Create Account</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="email" className="">
          email
        </label>
        <input
          type="text"
          name="email"
          value={formState.email}
          onChange={handleChange}
          className={styles.input}
        />
        <label htmlFor="firstName" className="">
          first name
        </label>
        <input
          type="text"
          name="firstName"
          value={formState.firstName}
          onChange={handleChange}
          className={styles.input}
        />
        <label htmlFor="lastName" className="">
          last name
        </label>
        <input
          type="text"
          name="lastName"
          value={formState.lastName}
          onChange={handleChange}
          className={styles.input}
        />
        <label htmlFor="password" className="">
          password
        </label>
        <input
          type="password"
          name="password"
          value={formState.password}
          onChange={handleChange}
          className={styles.input}
        />
        <label htmlFor="confirmPassword" className="">
          confirm password
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formState.confirmPassword}
          onChange={handleChange}
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
