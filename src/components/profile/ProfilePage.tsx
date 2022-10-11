import { useContext } from "react";
import { UserContext } from "../../UserProvider";
import {withAuthenticationRequired} from "@auth0/auth0-react";

function ProfilePage() {
    // @ts-ignore
    const [hvzUser] = useContext(UserContext)

    return !!hvzUser ? <>
        <h1>Profile</h1>
        <section>
            <p>Name: {hvzUser.name}</p>
            <p>Email: {hvzUser.email}</p>
            <p>Admin: {hvzUser.isAdmin ? "yes" : "no"}</p>
        </section>
    </>
    : <h1>LOADING</h1>
}

export default withAuthenticationRequired(ProfilePage)