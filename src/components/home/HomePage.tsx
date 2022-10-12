import { withAuthenticationRequired } from "@auth0/auth0-react";
import React, {useContext} from "react";
import {UserContext} from "../../UserProvider";
import GamesComponent from "./GamesComponent";

function HomePage() {
    // @ts-ignore
    const [hvzUser] = useContext(UserContext)

    return !!hvzUser ? <>
            <GamesComponent />
        </>
        : <h1>LOADING</h1>
}

export default withAuthenticationRequired(HomePage)