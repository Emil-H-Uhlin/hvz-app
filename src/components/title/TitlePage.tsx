import {Navigate} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";
import "../../styles/app.css"

export default function TitlePage() {
    const { isAuthenticated } = useAuth0()

    function LoginButton() {
        const { loginWithRedirect } = useAuth0()
        return <button onClick={loginWithRedirect}>Log in with Auth0</button>
    }

    return <div className="home">
        { isAuthenticated && <Navigate to={"/home"} replace /> }

        <section>
            <h1>HvZ</h1>
            <h3>Humans vz Zombies</h3>
        </section>

        <hr/>

        <LoginButton />
        <section>
            <p>
                <cite><strong>Humans vs. Zombies</strong> is a game of tag played at
                schools, camps, neighborhoods, libraries and conventions anywhere
                around the world.</cite>
            </p>
        </section>

    </div>
}