import { withAuthenticationRequired } from "@auth0/auth0-react"
import {useContext} from "react";
import {UserContext} from "../../UserProvider";
import {Navigate} from "react-router-dom";

function AdminPage() {
    // @ts-ignore
    const [hvzUser] = useContext(UserContext)

    return !!hvzUser ? <>
            { hvzUser.isAdmin
                ? <p>Some secret admin stuff</p>
                : <Navigate replace to="/" />
            }
        </>
        : <h1>LOADING</h1>
}

export default withAuthenticationRequired(AdminPage)