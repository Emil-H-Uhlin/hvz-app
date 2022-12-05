import {UserContext} from "../../UserProvider";
import {GameModel} from "../../Models";
import GameEditListItem from "./GameEditListItem";

import {useContext, useEffect} from "react";
import {useQuery} from "react-query";
import {useNavigate} from "react-router";

import { withAuthenticationRequired } from "@auth0/auth0-react"

function AdminPage() {
    // @ts-ignore
    const hvzUser = useContext(UserContext)
    const navigate = useNavigate()

    const {data: games} = useQuery<GameModel[]>("allGames")

    useEffect(() => {
        if (!hvzUser || !hvzUser.isAdmin)
            navigate("/home")

    }, [hvzUser, navigate])

    return hvzUser && <>
        <div>
            { games?.map((it: GameModel) => <GameEditListItem game={it} key={it.id}/>) }
        </div>
        <textarea value={hvzUser.token} readOnly></textarea>
    </>
}

export default withAuthenticationRequired(AdminPage)