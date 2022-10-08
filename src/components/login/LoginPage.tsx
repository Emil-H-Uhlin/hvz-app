import React, { useContext } from "react";
import { UserContext } from "../../UserProvider";
import {useAuth0} from "@auth0/auth0-react";
import checkIfAdmin from "../../util/checkAdmin";

export default function() {
    // @ts-ignore
    const [hvzUser, setUser] = useContext(UserContext)
    const { user, getAccessTokenSilently } = useAuth0()

    function LoginButton() {
        const { loginWithRedirect } = useAuth0()
        return <button onClick={loginWithRedirect}>Log in with Auth0</button>
    }

    function LogoutButton() {
        const { logout } = useAuth0()
        return <button onClick={() => {
            logout({returnTo: window.location.origin})
            setUser(null)
        }}>Log out</button>
    }

    if (user && !hvzUser) {
        (async function() {
            await getAccessTokenSilently().then(token => setUser({
                ...user,
                isAdmin: checkIfAdmin(token),
                token
            })).catch(e => console.log(e))
        })()
    }

    return <>
        { hvzUser ?
            <>
                <h2>Logged in as user:</h2>
                <p>Name: {hvzUser.name}</p>
                <p>Email: {hvzUser.email}</p>
                <p>Admin: {hvzUser.isAdmin ? "yes" : "no"}</p>
                <LogoutButton />
            </>
            : <LoginButton />
        }
    </>
}