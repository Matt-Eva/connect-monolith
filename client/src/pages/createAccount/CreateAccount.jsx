import { useState } from "react"
import { Link, useOutletContext } from 'react-router-dom'

function CreateAccount() {
    const baseFormState = {
        password: '',
        email: '',
        firstName: '',
        lastName: '',
        profileImg: ''
    }
    const {createAccount} = useOutletContext()
    const [formState, setFormState] = useState(baseFormState)

    const handleSubmit = async (e) =>{
        e.preventDefault()
        if (formState.email === ''){
            return alert("email is required")
        }
        if (formState.firstName === "" && formState.lastName === ""){
            return alert("you must enter either a first name or a last name")
        }
        if (formState.password.length < 4) {
            return alert("password must be at least 4 characters in length")
        }
        const newUser = {...formState, name: `${formState.firstName} ${formState.lastName}`}
        try {
            await createAccount(newUser)
            setFormState(baseFormState)
        } catch (e){
            console.error(e)
            alert(e.message + ". Please use a different email address.")
        }
    }

    const handleChange = (e) =>{
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div>
            CreateAccount
            <form onSubmit={handleSubmit} onChange={handleChange}>
                <label>email</label>
                <input type="text" name="email" value={formState.email} />
                <label>first name</label>
                <input type="text" name="firstName" value={formState.firstName} />
                <label>last name</label>
                <input type="text" name="lastName" value={formState.lastName} />
                <label>password</label>
                <input type="password" name="password" value={formState.password} />
                <label>profile image</label>
                <input type="text" name="profileImg" value={formState.profileImg} />
                <input type="submit" value="Create Account" />
            </form>
            <Link to="/login">Login</Link>
        </div>
    )
}

export default CreateAccount