import {UserContext} from "../../UserProvider";
import {GameReadModel} from "../../Models";
import GameEditListItem from "./GameEditListItem";
import GameAddItem from "./GameAddItem"

import {useContext, useEffect} from "react";
import {useQuery} from "react-query";
import {useNavigate} from "react-router";

import { withAuthenticationRequired } from "@auth0/auth0-react"

function AdminPage() {
    const hvzUser = useContext(UserContext)
    const navigate = useNavigate()

    const {data: games, isLoading} = useQuery<GameReadModel[]>("allGames")

    useEffect(() => {
        if (!hvzUser || !hvzUser.isAdmin)
            navigate("/home")

    }, [hvzUser, navigate])

    return <> { (!!hvzUser && !isLoading) && <>
        <div>
            { games?.map((it: GameReadModel) => <GameEditListItem game={it} key={it.id}/>) }
            <h2>Host a new game!</h2>
            <GameAddItem />
        </div>
        <textarea value={hvzUser.token} readOnly></textarea>
    </>}</>
}

export default withAuthenticationRequired(AdminPage)