import { useState } from "react"
import { useOutletContext, Link, Navigate } from "react-router-dom"
import styles from "./Login.module.css"

function Login() {
    const {login, user} = useOutletContext()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = (e) =>{
        e.preventDefault()
        login(email, password)
    }

    if (user){
        return <Navigate to="/" />
    }

    return (
        <main className={styles.main}>
            <h1 className={styles.welcome}>Connect</h1>
            <h2 className={styles.title}>Login</h2>
            <form onSubmit={handleLogin} className={styles.form}>
                <label htmlFor="email">email</label>
                <input type='text' autoComplete="username" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input}/>
                <label htmlFor="password" className="">password</label>
                <input type='password' autoComplete="current-password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.input}/>
                <input type='submit' value='Login' className={styles.login}/>
            </form>
            <Link to="/new-account" className={`underlined-link ${styles.createAccount}`}>Create Account</Link>
            {/* <Link to="/about" className="underline">About Connect</Link> */}
        </main>
    )
}

export default Login