import { useState } from 'react'
import { useOutletContext } from "react-router-dom"
import AccountInfo from '../../components/AccountInfo/AccountInfo'
import EditAccountForm from '../../components/EditAccountForm/EditAccountForm'
import UpdateProfileImage from '../../components/UpdateProfileImage/UpdateProfileImage'
import styles from "./Account.module.css"

function Account() {
    const {user, logout} = useOutletContext()
    const [editMode, setEditMode] = useState("")

    console.log(user)

    const toggleEdit = (option) =>{
        setEditMode(option)
    }

    let display;

    if (editMode === "info"){
        <EditAccountForm toggleEdit={toggleEdit} {...user}/>
    } else if (editMode === "image") {
        
    } else {
        display = <AccountInfo toggleEdit={toggleEdit} logout={logout} {...user} />
    }

    return (
        <>
            {editMode ? <EditAccountForm toggleEdit={toggleEdit} {...user}/> : <AccountInfo toggleEdit={toggleEdit} logout={logout} {...user} />}
        </>
    )
}

export default Account