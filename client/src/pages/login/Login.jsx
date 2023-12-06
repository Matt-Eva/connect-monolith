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
    <main className="bg-cyan-50 h-screen w-screen max-w-screen-lg grid grid-cols-1 grid-rows-6 justify-items-center">
        <h1 className="text-3xl text-cyan-500 row-span-1 self-end">Login</h1>
        <form onSubmit={handleLogin} className="row-start-2 row-end-4 grid grid-rows-5 self-start">
            <label className="row-span-1 self-end">email</label>
            <input type='text' autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="row-start-2 row-end-3 h-8"/>
            <label className="row-start-3 row-end-4 self-end">password</label>
            <input type='password' autoComplete="current-password" value = {password} onChange={(e) => setPassword(e.target.value)} className="row-start-4 row-end-5 h-8"/>
            <input type='submit' value='Login' className="h-8 w-2/4 m-1 justify-self-center bg-cyan-500"/>
        </form>
        <nav className="row-span-6 self-start">
            <Link to="/new-account" className="underline">Create Account</Link>
        </nav>
    </main>
    )
}

export default Login