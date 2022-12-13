import { withAuthenticationRequired } from "@auth0/auth0-react";
import React, {useContext} from "react";
import {UserContext} from "../../UserProvider";
import GamesComponent from "./games/GamesComponent";

function HomePage() {
    const hvzUser = useContext(UserContext)

    return <> {!!hvzUser &&
        <GamesComponent /> }
    </>
}

export default withAuthenticationRequired(HomePage)