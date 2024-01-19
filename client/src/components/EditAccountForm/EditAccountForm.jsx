import { useState } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import styles from "./EditAccountForm.module.css"

function EditAccountForm({toggleEdit, firstName, lastName, email, profileImg}) {
    const {destroyUser} = useOutletContext()
    const [enableDelete, setEnableDelete] = useState(false)
    const [disableChangeInfo, setDisableChangeInfo] = useState(true)
    const [disableChangePassword, setDisableChangePassword] = useState(true)
    const [initialChangeFormState, setInitialChangeFormState] = useState({
        firstName: firstName,
        lastName: lastName,
        email: email
    })
    const [formState, setFormState] = useState(initialChangeFormState)
    const initialPasswordState = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    }
    const [passwordState, setPasswordState] = useState (initialPasswordState)

    const navigate = useNavigate()

    const handleInfoChange = (e) =>{
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        })
    }

    const updateAccount = async (e) =>{
        e.preventDefault()
        try {
            const res = await fetch("/api/my-account", {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({newInfo: formState})
            })

            if (res.ok){
                const updatedInfo = await res.json()
                alert("Info successfully updated!")
                setFormState(updatedInfo)
                setInitialChangeFormState(updatedInfo)
                setDisableChangeInfo(true)
            }
        } catch (e) {
            console.error(e)
        }
    }
    
    const handlePasswordChange = (e) =>{
        setPasswordState({
            ...passwordState,
            [e.target.name]: e.target.value
        })
    }
    
    const updatePassword = async (e) =>{
        e.preventDefault()

        if (passwordState.newPassword !== passwordState.confirmPassword) {
            alert("Password confirmation must match new password.")
            setPasswordState({
                ...passwordState,
                newPassword: '',
                confirmPassword: ''
            })
            return
        }

        try{
            const res = await fetch("/api/update-password", {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({passwordInfo: passwordState})
            })
            if (res.ok){
                alert("Password updated successfully!")
                setPasswordState(initialPasswordState)
            }
        } catch(e){
            console.error(e)
        }
    }
 
    const deleteAccount = async () => {
        try {
            const res = await fetch("/api/my-account", {
                method: "DELETE",
                credentials: "include"
            })
            if (res.ok){
                alert("account successfully deleted")
                destroyUser()
                navigate("/login")
            }
        } catch(e) {
            console.error(e)
        }
    }

  return (
    <main className={styles.main}>
        <button onClick={() =>toggleEdit("")} className={styles.backButton}>Back</button>
        <div className={styles.formContainer}>
            <h2>Update Profile Info</h2>
            {disableChangeInfo ? <button onClick={() => setDisableChangeInfo(false)} className={styles.permissionsButton}>Change Info</button> : <button onClick={() =>{
                setFormState(initialChangeFormState)
                setDisableChangeInfo(true)
            }} className={styles.permissionsButton}>Cancel</button>}
            <form onSubmit={updateAccount} onChange={handleInfoChange} disabled={true} className={styles.form}>
                <label htmlFor="firstName">First Name</label>
                <input type="text" name="firstName" value={formState.firstName} disabled={disableChangeInfo}/>
                <label htmlFor="lastName">Last Name</label>
                <input type="text" name="lastName" value={formState.lastName} disabled={disableChangeInfo} />
                <label htmlFor="email">Email</label>
                <input type="text" name="email" value={formState.email} disabled={disableChangeInfo}/>
                <input type="submit" disabled={disableChangeInfo} className={styles.submitButton}/>
            </form>
        </div>
        <div className={styles.formContainer}>
            <h2>Change password</h2>
            {disableChangePassword ? <button onClick={() => setDisableChangePassword(false)} className={styles.permissionsButton}>Change Password</button> : <button onClick={() =>{
                setPasswordState(initialPasswordState)
                setDisableChangePassword(true)
            }} className={styles.permissionsButton}>Cancel</button>}
            <form onSubmit={updatePassword} onChange={handlePasswordChange} className={styles.form}>
                <label htmlFor="currentPassword">Current Password</label>
                <input type="password" name="currentPassword" value={passwordState.currentPassword} disabled={disableChangePassword}/>
                <label htmlFor="newPassword">New Password</label>
                <input type="password" name="newPassword" value={passwordState.newPassword} disabled={disableChangePassword}/>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input type="password" name="confirmPassword" value={passwordState.confirmPassword} disabled={disableChangePassword}/>
                <input type="submit" disabled={disableChangePassword} className={styles.submitButton}/>
            </form>
        </div>
        <div className={styles.deleteContainer}>
            <h2 className={styles.deleteAccountHeader}>Delete Account</h2>
            <button onClick={() => setEnableDelete(true)} className={styles.enableDelete}>Delete Account</button>
            {enableDelete ?
            <>
                <p className={styles.deleteQuestion}>Are you sure you want to delete your account?</p>
                <button onClick={() => setEnableDelete(false)} className={styles.deleteAccountButton}>No, Don't Delete my Account</button>
                <button onClick={deleteAccount} className={styles.deleteAccountButton}>Yes, Delete my Account</button>
            </> : null}
        </div>
    </main>
  )
}

export default EditAccountForm