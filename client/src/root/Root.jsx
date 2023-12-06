import { useState, useEffect } from 'react'
import { Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom'
import Header from '../components/Header/Header'
// import './Root.css'

function Root() {
  const [user, setUser] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const [startingPath, setStartingPath] = useState(location.pathname)

  console.log(import.meta.env.VITE_BACKEND_URL)

  useEffect(() =>{
    const getMe = async () =>{
      const res = await fetch("/api/me")

      if(res.ok){
        const data = await res.json()
        setUser(data)
        setLoading(false)
      } else if (res.status === 401){
        setUser(false)
        setLoading(false)
        navigate('/login')
      }
    }
    getMe()
  }, [])

  const login = async (email, password) =>{
    const res = await fetch("/api" + "/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email: email, password: password})
    })

    if (res.ok){
      const data = await res.json()
      setUser(data)
      if (startingPath === "/login" || startingPath === "/new-account"){
        navigate("/")
      } else {
        navigate(startingPath)
      }
    } else {
      const error = await res.json()
      console.error(error)
    }
  }

  const logout = async () => {
    await fetch("/api" + "/logout", {
      method: "DELETE",
      credentials: "include"
    })
    setStartingPath(location.pathname)
    setUser(false)
    navigate("/login")
  } 

  const createAccount = async (newUser) => {
    try {
      const res = await fetch("/api" + "/new-account", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newUser)
      })
      if(res.ok){
        const data = await res.json()
        setUser(data)
        if (startingPath === "/login" || startingPath === "/new-account"){
          navigate("/")
        } else {
          navigate(startingPath)
        }
      } else {
        const error = await res.json()
        throw new Error(error.error)
      }
    } catch(e) {
      console.log(e)
      throw new Error(e.message)
    }
  }

  const destroyUser = () => setUser(false)

  const outletContext = {user, login: login, destroyUser, createAccount: createAccount}

  if (loading){
    return <h1>Loading...</h1>
  }

  return (
    <>
      {user ? <Header logout={logout} /> : <Navigate to="/login" />}
      <Outlet context={outletContext}/>
    </>
  )
}

export default Root
