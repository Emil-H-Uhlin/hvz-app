import React, {useContext} from "react";
import {UserContext} from "../../UserProvider";

export default function HomePage() {
    // @ts-ignore
    const [hvzUser] = useContext(UserContext)

    return hvzUser && <>
        <h2>Logged in as user:</h2>
        <p>Name: {hvzUser.name}</p>
        <p>Email: {hvzUser.email}</p>
        <p>Admin: {hvzUser.isAdmin ? "yes" : "no"}</p>
    </>
}