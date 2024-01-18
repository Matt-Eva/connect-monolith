import { useState } from "react"
import { Link, useOutletContext } from 'react-router-dom'
import styles from "./CreateAccount.module.css"

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
        <main className={styles.main}>
            <h1 className={styles.welcome}>CONNECT</h1>
            <h2 className={styles.title}>Create Account</h2>
            <form onSubmit={handleSubmit} onChange={handleChange} className={styles.form}>
                <label htmlFor="email" className="">email</label>
                <input type="text" name="email" value={formState.email} className={styles.input}/>
                <label htmlFor="firstName" className="">first name</label>
                <input type="text" name="firstName" value={formState.firstName} className={styles.input}/>
                <label htmlFor="lastName" className="">last name</label>
                <input type="text" name="lastName" value={formState.lastName} className={styles.input}/>
                <label htmlFor="password" className="">password</label>
                <input type="password" name="password" value={formState.password} className={styles.input}/>
                <label htmlFor="confirmPassword" className="">confirm password</label>
                <input type="password" name="confirmPassword" value={formState.confirmPassword} className={styles.input}/>
                <input type="submit" value="Create Account" className={styles.createAccount} />
            </form>
            <Link to="/login" className={`underlined-link ${styles.login}`}>Login</Link>
        </main>
    )
}

export default CreateAccount