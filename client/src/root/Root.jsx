import { useState, useEffect } from "react";
import { Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Header from "../components/Header/Header";
import MainNavBar from "../components/MainNavBar/MainNavBar";

import styles from "./Root.module.css";

import { createUser, destroyUser } from "../state/user";

import { getMe, logout, login, createAccount } from "./UtilsRoot";

function Root() {
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [offlineDisplay, setOfflineDisplay] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [startingPath, setStartingPath] = useState(location.pathname);

  useEffect(() => {
    getMe({
      setLoading,
      setOfflineDisplay,
      navigate,
      dispatch,
      createUser,
      destroyUser,
    });
  }, []);

  const handleLogin = ({ email, password }) => {
    login({ email, password, dispatch, createUser, navigate, startingPath });
  };

  const handleLogout = () => {
    logout({ setStartingPath, dispatch, destroyUser, navigate, location });
  };

  const handleCreateAccount = async ({ newUser }) => {
    await createAccount({
      newUser,
      dispatch,
      createUser,
      navigate,
      startingPath,
    });
  };

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
      {user ? <Header /> : <Navigate to="/login" />}
      <Outlet context={outletContext} />
      {user ? <MainNavBar /> : null}
    </div>
  );
}

export default Root;
