import React, {useState} from "react";
import {hvzUser} from "./App";
import {useAuth0} from "@auth0/auth0-react";
import checkIfAdmin from "./util/checkAdmin";

// @ts-ignore
export const UserContext = React.createContext()

export default function ({ children }: {children: Array<JSX.Element> | JSX.Element }) {
    const [hvzUser, setUser] = useState<hvzUser | null>(null)
    const { user, getAccessTokenSilently } = useAuth0()

    if (user && !hvzUser) {
        (async function() {
            await (await getAccessTokenSilently().then(token => setUser({
                ...user,
                isAdmin: checkIfAdmin(token),
                token
            })).catch(e => console.log(e)))
        })()
    }

    return <UserContext.Provider value={[hvzUser, setUser]}>
        {children}
    </UserContext.Provider>
}