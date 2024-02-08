import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import styles from "./Login.module.css";

import { createUser } from "../../state/user";

import { login } from "./UtilsLogin";

function Login() {
  const user = useSelector((state) => state.user.value);
  const startingPath = useSelector((state) => state.startingPath.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    login({ email, password, startingPath, dispatch, createUser, navigate });
  };

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.welcome}>CONNECT</h1>
      <h2 className={styles.title}>Login</h2>
      <form onSubmit={handleLogin} className={styles.form}>
        <label htmlFor="email">email</label>
        <input
          type="text"
          autoComplete="username"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        <label htmlFor="password" className="">
          password
        </label>
        <input
          type="password"
          autoComplete="current-password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        <input type="submit" value="Login" className={styles.login} />
      </form>
      <Link
        to="/new-account"
        className={`underlined-link ${styles.createAccount}`}
      >
        Create Account
      </Link>
      {/* <Link to="/about" className="underline">About Connect</Link> */}
    </main>
  );
}

export default Login;
