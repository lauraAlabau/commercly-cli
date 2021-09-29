import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:5005'

const AuthContext = React.createContext()

function AuthProviderWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [count, setCount] = useState(0)

  const verifyStoredToken = () => {
    // Get the stored token from the localStorage
    const storedToken = localStorage.getItem('authToken')

    // If the token exists in the localStorage
    if (storedToken) {
      // We must send the JWT token in the request's "Authorization" Headers
      axios
        .get(`${API_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((response) => {
          // If the server verifies that JWT token is valid
          const user = response.data
          setUser(user)
          setIsLoggedIn(true)
          setIsLoading(false)
        })
        .catch((error) => {
          // If the server sends an error response (invalid token)
          setIsLoggedIn(false)
          setUser(null)
          setIsLoading(false)
        })
    } else {
      // If the token is not available
      setIsLoading(false)
    }
  }

  const logInUser = (token) => {
    localStorage.setItem('authToken', token)
    verifyStoredToken()
  }

  const logOutUser = () => {
    // Upon logout, remove the token from the localStorage
    localStorage.removeItem('authToken')

    // Update the state variables
    setIsLoggedIn(false)
    setUser(null)
  }

  useEffect(() => {
    // to be updated in next step
    verifyStoredToken()
  }, [])

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, user, logInUser, logOutUser, count, setCount }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export { AuthProviderWrapper, AuthContext }
