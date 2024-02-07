import { useOutletContext, Outlet } from "react-router-dom";

function Account() {
  const { user, handleLogout, destroyUser } = useOutletContext();

  return <Outlet context={{ user, handleLogout, destroyUser }} />;
}

export default Account;
