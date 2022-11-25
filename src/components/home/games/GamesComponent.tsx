import { useContext } from "react"
import {getAuthHeaders, UserContext} from "../../../UserProvider"
import {useQuery} from "react-query";
import {GameModel} from "../../../Models"
import GamesListItem from "./GamesListItem";

export default function GamesComponent() {
    // @ts-ignore
    const hvzUser = useContext(UserContext)

    async function joinGame(game: GameModel, team: string) {
        if (team !== "zombie" && team !== "human") return;
        
        const response = await fetch(`${process.env.REACT_APP_HVZ_API_BASE_URL}/games/${game.id}/players`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(hvzUser!)
            },
            body: JSON.stringify({
                "human": (team === "human")
            })
        })

        if (response.ok) refetchGames();
        else console.log(response)
    }
    
    function useGameFetch() {
        const { data : allGames, refetch : refetchAll } = useQuery<GameModel[]>("allGames", async function () {
            const response = await fetch(`${process.env.REACT_APP_HVZ_API_BASE_URL}/games`, {
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders(hvzUser!)
                }
            })

            return await response.json()
        })

        const { data : userGames, refetch : refetchUser } = useQuery<GameModel[]>("userGames", async function() {
            const response = await fetch(`${process.env.REACT_APP_HVZ_API_BASE_URL}/currentUser/games`, {
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders(hvzUser!)
                }
            })

            return await response.json()
        })

        return {
            games: [!!allGames && !!userGames
                ? allGames.filter(({id:aId}: GameModel) => !userGames.some(({id:iId}: GameModel)=> aId === iId))
                : (allGames ?? [])
                , userGames ?? []],
            refetchGames: async function() {
                await refetchAll()
                await refetchUser()
            }
        }
    }

    const {games:[filteredGames, userGames], refetchGames} = useGameFetch()

    return hvzUser && <>
        { userGames.map((game: GameModel) => <GamesListItem
            game={game}
            key={game.id}
            joined={true}
        />)}
        { filteredGames.length > 0 && <hr/>}
        { filteredGames.map((game: GameModel) => <GamesListItem
            game={game} 
            key={game.id} 
            handleGameJoin={(team: string) => joinGame(game, team)}
            joined={false}
        />)}
    </>
}