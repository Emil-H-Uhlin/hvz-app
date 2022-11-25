import React, {useState} from "react";
import {HvzUser} from "./App";
import {useAuth0} from "@auth0/auth0-react";
import {checkIfAdmin} from "./Utils"
import {useQuery} from "react-query";

// @ts-ignore
export const UserContext = React.createContext<HvzUser | null>()

export function getAuthHeaders(hvzUser: HvzUser): HeadersInit {
    return { "Authorization":`Bearer ${hvzUser.token}` }
}

export default function UserProvider ({ children }: {children: Array<JSX.Element> | JSX.Element }) {
    const [hvzUser, setUser] = useState<HvzUser | null>(null)
    const { getAccessTokenSilently } = useAuth0()

    useQuery("users", async function() {
        const token = await getAccessTokenSilently()

        const response = await fetch(`${process.env.REACT_APP_HVZ_API_DOMAIN}/register`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${token}`
            }
        });

        const user = await response.json()

        setUser({
            ...user,
            isAdmin: checkIfAdmin(token),
            token
        })
    })

    return <UserContext.Provider value={hvzUser}>
        {children}
    </UserContext.Provider>
}