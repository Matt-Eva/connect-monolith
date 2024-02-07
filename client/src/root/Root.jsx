import { useState, useEffect } from "react";
import { Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header/Header";
import MainNavBar from "../components/MainNavBar/MainNavBar";
import styles from "./Root.module.css";
import { getMe, logout, login, createAccount } from "./UtilsRoot";

function Root() {
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [offlineDisplay, setOfflineDisplay] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [startingPath, setStartingPath] = useState(location.pathname);

  useEffect(() => {
    getMe({ setUser, setLoading, setOfflineDisplay, navigate });
  }, []);

  const handleLogin = ({ email, password }) => {
    login({ email, password, setUser, navigate, startingPath });
  };

  const handleLogout = () => {
    logout({ setStartingPath, setUser, navigate, location });
  };

  const handleCreateAccount = async ({ newUser }) => {
    await createAccount({ newUser, setUser, navigate, startingPath });
  };

  const destroyUser = () => setUser(false);

  const outletContext = {
    user,
    handleLogin,
    handleLogout,
    destroyUser,
    handleCreateAccount,
  };

  if (loading && !offlineDisplay) {
    return <h1>Loading...</h1>;
  } else if (offlineDisplay) {
    return <h1>You are currently offline</h1>;
  }

  return (
    <div className={styles.root}>
      {user ? <Header logout={handleLogout} /> : <Navigate to="/login" />}
      <Outlet context={outletContext} />
      {user ? <MainNavBar /> : null}
    </div>
  );
}

export default Root;
