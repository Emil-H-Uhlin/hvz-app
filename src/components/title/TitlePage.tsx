import React, {useContext} from "react";
import {Navigate, redirect} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";

export default function TitlePage() {
    const { isAuthenticated } = useAuth0()

    function LoginButton() {
        const { loginWithRedirect } = useAuth0()
        return <button onClick={loginWithRedirect}>Log in with Auth0</button>
    }

    return <>
        <h1>HvZ</h1>
        <h3>Humans vz Zombies</h3>
        <hr/>
        { isAuthenticated && <Navigate to={"/home"} replace /> }
        <LoginButton />
    </>
}