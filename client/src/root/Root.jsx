import { useState, useEffect } from 'react'
import { Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom'
import Header from '../components/Header/Header'
import MainNavBar from "../components/MainNavBar/MainNavBar"
import styles from './Root.module.css'

function Root() {
  const [user, setUser] = useState(false)
  const [loading, setLoading] = useState(true)
  const [offlineDisplay, setOfflineDisplay] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [startingPath, setStartingPath] = useState(location.pathname)

  useEffect(() =>{
    const getMe = async () =>{
      try {
        const res = await fetch("/api/me")
        if(res.ok){
          const data = await res.json()
          setUser(data)
          setLoading(false)
        } else if (res.status === 401){
          setUser(false)
          setLoading(false)
          navigate('/login')
        } else {
          throw new Error('Problem with network response')
        }
      } catch (e){
        setOfflineDisplay(true)
        console.log("caught error")
        console.error(e)
      }
    }
    getMe()
  }, [])

  const login = async (email, password) =>{
    const res = await fetch("/api" + "/login", {
        method: "POST",
        credentials: "include",
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
        // throw new Error(error.error)
      }
    } catch(e) {
      // console.log(e)
      throw new Error(e.message)
    }
  }

  const destroyUser = () => setUser(false)

  const outletContext = {user, login: login, logout, destroyUser, createAccount: createAccount}

  if (loading && !offlineDisplay){
    return <h1>Loading...</h1>
  } else if (offlineDisplay) {
    return <h1>You are currently offline</h1>
  }

  return (
    <div className={styles.root}>
      {user ? <Header logout={logout} /> : <Navigate to="/login" />}
      <Outlet context={outletContext}/>
      {user ? <MainNavBar /> : null}
    </div>
  )
}

export default Root
