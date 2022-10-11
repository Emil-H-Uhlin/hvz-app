import React, {useContext} from "react";
import {UserContext} from "../../UserProvider";
import GamesComponent from "./GamesComponent";

export default function HomePage() {
    // @ts-ignore
    const [hvzUser] = useContext(UserContext)

    return !!hvzUser ? <>
            <GamesComponent />
        </>
        : <h1>LOADING</h1>
}