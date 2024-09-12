import React, { useState, useEffect, useContext } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from '@/firebase';

// Create a context object, which provides a way to pass down props through the component tree without having to manually do so
const AuthContext = React.createContext()

// Custom hook that allows components to directly access the context values 
const useAuth = () => {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  // A state to keep track of the user
  const [user, setUser] = useState(null)

  // A state to keep track of the loading status while the authentication of the user is being verified 
  const [loading, setLoading] = useState(true)

  // Function to handle login with email and password
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  // Function to handle signup with email and password
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  // Function to handle signout by the user 
  function signout() {
    return signOut(auth)
  }

  // Monitor the authentication status of the user after the initial render
  useEffect(() => {
    // Set up a listener that will notify you of the authentication status of the user (e.g. logged in or signed out)
    const unsubscribe = auth.onAuthStateChanged(user => {
      // Set the user to null (signed out) or user object (logged in)
      setUser(user);
      // Once the authentication status of the user is determined, loading becaomes false indicating the process is over
      setLoading(false)
    })
    // The listener no longer needs to pay attention to the authentication state changes
    return unsubscribe
  }, []) 

  // Values that the other components can access
  const values = {
    user,
    login,
    signup,
    signout
  }

  return (
    // AuthContext.Provider is used to provide the context values to its children
    <AuthContext.Provider value = {values}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

// Export the custom hook for access the auth context
export { useAuth }
