import React, {useState} from "react";
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
            (await getAccessTokenSilently().then(token => {

                setUser({
                    ...user,
                    isAdmin: checkIfAdmin(token),
                    token
                });

                fetch(`${process.env.REACT_APP_AUTH0_AUDIENCE}register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

            }).catch(e => console.log(e)))
        })()
    }

    function LogoutButton() {
        const { logout } = useAuth0()
        return <button onClick={() => {
            logout({returnTo: window.location.origin})
            setUser(null)
        }}>Log out</button>
    }

    return <>
        { hvzUser != null && <LogoutButton /> }
        <UserContext.Provider value={[hvzUser, setUser]}>
            {children}
        </UserContext.Provider>
    </>
}