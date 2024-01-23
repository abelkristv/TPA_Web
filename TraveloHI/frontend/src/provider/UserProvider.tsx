import { createContext, useState } from "react"

const UserContext = createContext(null)

type UserProviderProps = {
    children: React.ReactNode
}

export const UserProvider = ({children}: UserProviderProps) => {
    const [user, setUser] = useState('')

    return (
        <UserContext.Provider value={{user, setUser}}></UserContext>
    );
}