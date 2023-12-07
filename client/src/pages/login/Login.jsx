import { useState } from "react"
import { useOutletContext, Link, Navigate } from "react-router-dom"

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
    <>
        <main className="">
            <h1 className="">Connect</h1>
            <form onSubmit={handleLogin} className="">
                <label htmlFor="email" className="">email</label>
                <input type='text' autoComplete="username" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className=""/>
                <label htmlFor="password" className="">password</label>
                <input type='password' autoComplete="current-password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className=""/>
                <input type='submit' value='Login' className=""/>
            </form>
            <Link to="/new-account" className="">Create Account</Link>
            {/* <Link to="/about" className="underline">About Connect</Link> */}
        </main>
    </>
    )
}

export default Login