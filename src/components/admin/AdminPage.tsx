import {UserContext} from "../../UserProvider";
import {GameModel} from "../../Models";

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

    }, [hvzUser, games, navigate])

    return hvzUser && <>
        <textarea>{hvzUser.token}</textarea>
        { games?.map((it: GameModel) => <>game {it.id}</>) }
    </>
}

export default withAuthenticationRequired(AdminPage)