import React, {useEffect, useState} from "react";
import {HvzUser} from "./App";
import {useAuth0} from "@auth0/auth0-react";
import checkIfAdmin from "./util/checkAdmin";

// @ts-ignore
export const UserContext = React.createContext()

export default function UserProvider ({ children }: {children: Array<JSX.Element> | JSX.Element }) {
    const [hvzUser, setUser] = useState<HvzUser | null>(null)
    const { user, getAccessTokenSilently } = useAuth0()

    if (user && !hvzUser) {
        (async function() {
            const token = await getAccessTokenSilently()
            
            await fetch(`${process.env.REACT_APP_AUTH0_AUDIENCE}register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            setUser({
                ...user,
                isAdmin: checkIfAdmin(token),
                token
            })
        })()
    }

    return <UserContext.Provider value={[hvzUser, setUser]}>
        {children}
    </UserContext.Provider>
}