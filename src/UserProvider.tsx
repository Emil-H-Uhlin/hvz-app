import React, {useState} from "react";
import {HvzUser} from "./App";
import {useAuth0} from "@auth0/auth0-react";
import {useQuery} from "react-query";
import jwtDecode from "jwt-decode";

// @ts-ignore
export const UserContext = React.createContext<HvzUser | null>()

export function checkIfAdmin(token: string) {
    const decoded: { permissions: [] } = jwtDecode(token)
    return decoded.permissions.filter((it: string) => it.startsWith("ADMIN_")).length === 2
}

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