import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import AccountInfo from "../../components/AccountInfo/AccountInfo";
import EditAccountForm from "../../components/EditAccountForm/EditAccountForm";
import UpdateProfileImage from "../../components/UpdateProfileImage/UpdateProfileImage";
import styles from "./Account.module.css";

function Account() {
  const { user, handleLogout } = useOutletContext();
  const [editMode, setEditMode] = useState("");

  console.log(editMode);

  const toggleEdit = (option) => {
    setEditMode(option);
  };

  let display;

  if (editMode === "info") {
    display = <EditAccountForm toggleEdit={toggleEdit} {...user} />;
  } else if (editMode === "image") {
    display = <UpdateProfileImage toggleEdit={toggleEdit} {...user} />;
  } else {
    display = (
      <AccountInfo toggleEdit={toggleEdit} logout={handleLogout} {...user} />
    );
  }

  return <>{display}</>;
}

export default Account;
