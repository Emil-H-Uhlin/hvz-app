import "./navbar.sass"
import {NavLink} from "react-router-dom";
import React, {useContext} from "react";
import {UserContext} from "../../UserProvider";
import {useAuth0} from "@auth0/auth0-react";

export default function Navbar() {
    // @ts-ignore
    const [hvzUser, setUser] = useContext(UserContext)

    function LogoutButton() {
        const { logout } = useAuth0()

        return <button onClick={() => {
            logout({returnTo: window.location.ancestorOrigins[0]})
            setUser(null)
        }} className="logoutButton navItem">Log out</button>
    }

    return <> { !!hvzUser && <div className="navbar">
        <div className={"navContainer"}>
            <NavLink to={"/home"} className="navItem">Games</NavLink>
            <NavLink to={"/profile"} className="navItem">Profile</NavLink>
            { hvzUser.isAdmin && <NavLink to={"/admin"} className="navItem">Admin</NavLink> }
            <LogoutButton />
        </div>
    </div> } </>
}