import { useOutletContext, Outlet } from "react-router-dom";

function Account() {
  const { user, handleLogout } = useOutletContext();

  return <Outlet context={{ user, handleLogout }} />;
}

export default Account;
