import { useState, useEffect } from "react";
import { Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Header from "../components/Header/Header";
import MainNavBar from "../components/MainNavBar/MainNavBar";

import styles from "./Root.module.css";

import { createUser, destroyUser } from "../state/user";

import { getMe } from "./UtilsRoot";
import { setStartingPath } from "../state/startingPath";

function Root() {
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();
  console.log(location.pathname);

  const [loading, setLoading] = useState(true);
  const [offlineDisplay, setOfflineDisplay] = useState(false);

  console.log(user);

  useEffect(() => {
    getMe({
      setLoading,
      setOfflineDisplay,
      navigate,
      dispatch,
      createUser,
      destroyUser,
    });
    console.log(location.pathname);
    dispatch(setStartingPath(location.pathname));
  }, []);

  if (loading && !offlineDisplay) {
    return <h1>Loading...</h1>;
  } else if (offlineDisplay) {
    return <h1>You are currently offline</h1>;
  }

  return (
    <div className={styles.root}>
      {user ? <Header /> : <Navigate to="/login" />}
      <Outlet />
      {user ? <MainNavBar /> : null}
    </div>
  );
}

export default Root;
