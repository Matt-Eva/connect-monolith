import { useState } from 'react'
import { useOutletContext } from "react-router-dom"
import AccountInfo from '../../components/AccountInfo/AccountInfo'
import EditAccountForm from '../../components/EditAccountForm/EditAccountForm'

function Account() {
    const {user, logout} = useOutletContext()
    const [editMode, setEditMode] = useState(false)

    console.log(user)

    const toggleEdit = () =>{
        setEditMode(!editMode)
    }

    return (
        <div>
            {editMode ? <EditAccountForm toggleEdit={toggleEdit} {...user}/> : <AccountInfo toggleEdit={toggleEdit} logout={logout} {...user} />}
        </div>
    )
}

export default Account