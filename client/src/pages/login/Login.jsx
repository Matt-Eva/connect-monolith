import { useState } from "react"
import { useOutletContext, Link } from "react-router-dom"

function Login() {
    const {login} = useOutletContext()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = (e) =>{
        e.preventDefault()
        login(email, password)
    }

    return (
    <main>
        Login
        <form onSubmit={handleLogin}>
            <label>email</label>
            <input type='text' autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <label>password</label>
            <input type='password' autoComplete="current-password" value = {password} onChange={(e) => setPassword(e.target.value)} />
            <input type='submit' value='login' />
        </form>
        <Link to="/new-account">Create Account</Link>
    </main>
    )
}

export default Login