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
    <main className="h-screen w-screen max-w-screen-lg overflow-auto flex flex-wrap justify-center content-start p-5">
        <h1 className="text-3xl text-cyan-600">Connect</h1>
        <form onSubmit={handleLogin} className="grid grid-rows-5 w-screen justify-center">
            <label htmlFor="email" className="row-span-1 self-end">email</label>
            <input type='text' autoComplete="username" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="row-start-2 row-end-3 h-8 w-full max-w-sm rounded"/>
            <label htmlFor="password" className="row-start-3 row-end-4 self-end">password</label>
            <input type='password' autoComplete="current-password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="row-start-4 row-end-5 h-8 max-w-sm rounded"/>
            <input type='submit' value='Login' className="h-8 w-2/4 m-1 justify-self-center bg-cyan-600 rounded text-white"/>
        </form>
        <nav className="m-5">
            <Link to="/new-account" className="underline">Create Account</Link>
        </nav>
    </main>
    )
}

export default Login