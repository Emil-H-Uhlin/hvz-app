import React, {useEffect, useState} from "react";
import {HvzUser} from "./App";
import {useAuth0} from "@auth0/auth0-react";
import {checkIfAdmin} from "./Utils"
import {useQuery} from "react-query";

// @ts-ignore
export const UserContext = React.createContext()

export function getAuthHeaders(hvzUser: HvzUser): HeadersInit {
    return { "Authorization":`Bearer ${hvzUser.token}` }
}

export default function UserProvider ({ children }: {children: Array<JSX.Element> | JSX.Element }) {
    const [hvzUser, setUser] = useState<HvzUser | null>(null)
    const { user, getAccessTokenSilently } = useAuth0()

    useQuery("users", async function() {
        const token = await getAccessTokenSilently()

        setUser(prevUser => {
            if (prevUser === null) {
                console.log("just logged in")
            }
            else if (prevUser.token === token) {
                return prevUser
            }

            return {
                ...user,
                isAdmin: checkIfAdmin(token),
                token
            }
        })

        return await fetch(`${process.env.REACT_APP_HVZ_API_DOMAIN}/register`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${token}`
            }
        });
    })

    return <UserContext.Provider value={[hvzUser, setUser]}>
        {children}
    </UserContext.Provider>
}