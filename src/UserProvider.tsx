import React, {useState} from "react";
import {hvzUser} from "./App";

// @ts-ignore
export const UserContext = React.createContext()

export default function ({ children }: {children: Array<JSX.Element> | JSX.Element }) {
    const [currentUser, setUser] = useState<hvzUser | null>(null)

    return <UserContext.Provider value={[currentUser, setUser]}>
        {children}
    </UserContext.Provider>
}