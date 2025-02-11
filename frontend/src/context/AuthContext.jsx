import { createContext, useEffect, useState } from "react"

export const AuthContext = createContext();

export const AuthProvider = ({children})=>{
  const [authenticated,setAuthenticated] = useState(flase);
}

export const AuthContext=({children})=>{
  return(
    useEffect(()=>{
      const token = localStorage.getItem('token')
      const userStr = localStorage.getItem('user')
      if(token){
        setAuthenticated(true)
      }
      if(userStr){setUser(JSON.parse(userStr))}
    })


    const login = (credentials)=>{
      setAuthenticated(true);
      setUser(credentials);
    }

    const logout = ()=>{
      setAuthenticated(false);
      setUser(null);
    }

    <AuthContext.Provider value={{authenticated, user, login, logout}}>{children}</AuthContext.Provider>
  )

}