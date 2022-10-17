import { useContext } from "react"
import {getAuthHeaders, UserContext} from "../../../UserProvider"
import {useQuery} from "react-query";
import {GameModel} from "../../../models/GameModel"
import GamesListItem from "./GamesListItem";

export default function GamesComponent() {
    // @ts-ignore
    const [hvzUser] = useContext(UserContext)

    // @ts-ignore
    const { data, status } = useQuery("games", async function() {
        const response = await fetch(`${process.env.REACT_APP_HVZ_API_BASE_URL}/games`, {
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(hvzUser)
            }
        })

        return (await response.json()).map((game: GameModel) => <GamesListItem game={game} key={game.id} />)
    })

    return hvzUser && <>
        { data }
    </>
}