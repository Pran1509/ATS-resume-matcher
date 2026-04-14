import React, { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../utils/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined)
  const [guestUses, setGuestUses] = useState(() => parseInt(localStorage.getItem('guestUses') || '0'))

  useEffect(() => {
    return onAuthStateChanged(auth, u => setUser(u || null))
  }, [])

  function incrementGuestUse() {
    const n = guestUses + 1
    setGuestUses(n)
    localStorage.setItem('guestUses', n)
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      isLoading: user === undefined,
      guestUses,
      canUseAsGuest: guestUses < 2,
      incrementGuestUse
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
