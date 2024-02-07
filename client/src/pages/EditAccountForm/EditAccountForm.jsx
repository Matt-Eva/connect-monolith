import { useState } from "react";
import { useNavigate, useOutletContext, Link } from "react-router-dom";
import styles from "./EditAccountForm.module.css";
import {
  updateAccount,
  updatePassword,
  deleteAccount,
} from "./UtilsEditAccountForm";

function EditAccountForm() {
  const { destroyUser, user } = useOutletContext();
  const { firstName, lastName, email } = user;

  const [enableDelete, setEnableDelete] = useState(false);
  const [disableChangeInfo, setDisableChangeInfo] = useState(true);
  const [disableChangePassword, setDisableChangePassword] = useState(true);

  const [initialChangeFormState, setInitialChangeFormState] = useState({
    firstName: firstName,
    lastName: lastName,
    email: email,
  });
  const [formState, setFormState] = useState(initialChangeFormState);

  const initialPasswordState = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
  const [passwordState, setPasswordState] = useState(initialPasswordState);

  const navigate = useNavigate();

  const handleInfoChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordState({
      ...passwordState,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateAccount = (e) => {
    e.preventDefault();
    updateAccount({
      formState,
      setFormState,
      setInitialChangeFormState,
      setDisableChangeInfo,
    });
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    updatePassword({ setPasswordState, passwordState, initialPasswordState });
  };

  const handleDeleteAccount = () => {
    deleteAccount({ destroyUser, navigate });
  };

  return (
    <main className={styles.main}>
      <Link to="/account">Back</Link>
      <div className={styles.formContainer}>
        <h2>Update Profile Info</h2>
        {disableChangeInfo ? (
          <button
            onClick={() => setDisableChangeInfo(false)}
            className={styles.permissionsButton}
          >
            Change Info
          </button>
        ) : (
          <button
            onClick={() => {
              setFormState(initialChangeFormState);
              setDisableChangeInfo(true);
            }}
            className={styles.permissionsButton}
          >
            Cancel
          </button>
        )}
        <form
          onSubmit={handleUpdateAccount}
          onChange={handleInfoChange}
          disabled={true}
          className={styles.form}
        >
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formState.firstName}
            disabled={disableChangeInfo}
          />
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formState.lastName}
            disabled={disableChangeInfo}
          />
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            value={formState.email}
            disabled={disableChangeInfo}
          />
          <input
            type="submit"
            disabled={disableChangeInfo}
            className={styles.submitButton}
          />
        </form>
      </div>
      <div className={styles.formContainer}>
        <h2>Change password</h2>
        {disableChangePassword ? (
          <button
            onClick={() => setDisableChangePassword(false)}
            className={styles.permissionsButton}
          >
            Change Password
          </button>
        ) : (
          <button
            onClick={() => {
              setPasswordState(initialPasswordState);
              setDisableChangePassword(true);
            }}
            className={styles.permissionsButton}
          >
            Cancel
          </button>
        )}
        <form
          onSubmit={handleUpdatePassword}
          onChange={handlePasswordChange}
          className={styles.form}
        >
          <label htmlFor="currentPassword">Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={passwordState.currentPassword}
            disabled={disableChangePassword}
          />
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={passwordState.newPassword}
            disabled={disableChangePassword}
          />
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={passwordState.confirmPassword}
            disabled={disableChangePassword}
          />
          <input
            type="submit"
            disabled={disableChangePassword}
            className={styles.submitButton}
          />
        </form>
      </div>
      <div className={styles.deleteContainer}>
        <h2 className={styles.deleteAccountHeader}>Delete Account</h2>
        <button
          onClick={() => setEnableDelete(true)}
          className={styles.enableDelete}
        >
          Delete Account
        </button>
        {enableDelete ? (
          <>
            <p className={styles.deleteQuestion}>
              Are you sure you want to delete your account?
            </p>
            <button
              onClick={() => setEnableDelete(false)}
              className={styles.deleteAccountButton}
            >
              No, Don't Delete my Account
            </button>
            <button
              onClick={handleDeleteAccount}
              className={styles.deleteAccountButton}
            >
              Yes, Delete my Account
            </button>
          </>
        ) : null}
      </div>
    </main>
  );
}

export default EditAccountForm;
