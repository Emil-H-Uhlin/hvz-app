import {useAuth0} from "@auth0/auth0-react";
import {useContext, useEffect} from "react";
import {UserContext} from "../../UserProvider";
import checkIfAdmin from "../../util/checkAdmin";

export default function() {
    const { user, getAccessTokenSilently } = useAuth0()

    // @ts-ignore
    const [hvzUser, setUser] = useContext(UserContext)

    if (user && !hvzUser) {
        (async function() {
            await getAccessTokenSilently().then(token => setUser({
                ...user,
                isAdmin: checkIfAdmin(token),
                token
            })).catch(e => console.log(e))
        })()
    }

    return <></>
}