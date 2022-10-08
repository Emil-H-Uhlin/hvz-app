import { withAuthenticationRequired } from "@auth0/auth0-react"
import {useContext, useEffect} from "react";
import {UserContext} from "../../UserProvider";
import {Navigate} from "react-router-dom";

export function AdminPage() {
    // @ts-ignore
    const [hvzUser] = useContext(UserContext)

    return <>
         { hvzUser && <>
             { hvzUser.isAdmin
                 ? <p>Some secret admin stuff</p>
                 : <Navigate replace to="/" /> }
         </> }
    </>
}

export default withAuthenticationRequired(AdminPage)