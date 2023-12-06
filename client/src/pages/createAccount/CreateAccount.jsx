import { useState } from "react"
import { Link, useOutletContext } from 'react-router-dom'

function CreateAccount() {
    const baseFormState = {
        password: '',
        confirmPassword: '',
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
        if (formState.password !== formState.confirmPassword){
            return alert("password and password confirmation must match")
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
        <main className="w-screen h-screen flex flex-wrap justify-center p-5 content-start">
            <h1 className="text-3xl text-cyan-600 w-screen text-center m-1">Connect</h1>
            <form onSubmit={handleSubmit} onChange={handleChange} className="w-screen grid grid-rows-12 justify-center h-96">
                <label htmlFor="email" className="self-end">email</label>
                <input type="text" name="email" value={formState.email} className="h-8 rounded"/>
                <label htmlFor="firstName" className="self-end">first name</label>
                <input type="text" name="firstName" value={formState.firstName} className="h-8 rounded"/>
                <label htmlFor="lastName" className="self-end">last name</label>
                <input type="text" name="lastName" value={formState.lastName} className="h-8 rounded"/>
                <label htmlFor="password" className="self-end">password</label>
                <input type="password" name="password" value={formState.password} className="h-8 rounded"/>
                <label htmlFor="confirmPassword" className="self-end">confirm password</label>
                <input type="password" name="confirmPassword" value={formState.password} className="h-8 rounded"/>
                <input type="submit" value="Create Account" className="h-8 w-3/4 m-3 justify-self-center bg-cyan-600 rounded text-white"/>
            </form>
            <Link to="/login" className="underline">Login</Link>
        </main>
    )
}

export default CreateAccount