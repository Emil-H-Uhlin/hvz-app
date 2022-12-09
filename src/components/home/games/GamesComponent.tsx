import { useContext } from "react"
import {getAuthHeaders, UserContext} from "../../../UserProvider"
import {useQuery} from "react-query";
import {GameModel, jsonToGameModel} from "../../../Models"
import GamesListItem from "./GamesListItem";

export default function GamesComponent() {
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

    function gamesSorter(game1: GameModel, game2: GameModel): number {
        let sort = 0

        if (game1.gameState !== game2.gameState)
            sort += game1.gameState > game2.gameState ? -2: 2

        if (game1.playerCount === game2.playerCount)
            sort += game1.id > game2.id ? -1: 1;
        else
            sort += game1.playerCount > game2.playerCount ? -1: 1

        return sort
    }
    
    function useGameFetch() {
        const { data : allGames, refetch : refetchAll } = useQuery<GameModel[]>("allGames", async function () {
            const response = await fetch(`${process.env.REACT_APP_HVZ_API_BASE_URL}/games`, {
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders(hvzUser!)
                }
            })

            return (await response.json()).map((it: any) => jsonToGameModel(it))
        })

        const { data : userGames, refetch : refetchUser } = useQuery<GameModel[]>("userGames", async function() {
            const response = await fetch(`${process.env.REACT_APP_HVZ_API_BASE_URL}/currentUser/games`, {
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders(hvzUser!)
                }
            })

            return (await response.json()).map((it: any) => jsonToGameModel(it))
        })

        return {
            games: [!!allGames && !!userGames
                ? allGames.filter(({id:aId}: GameModel) => !userGames.some(({id:iId}: GameModel) => aId === iId))
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
        { userGames.length > 0 && <>
            <h1>Joined games</h1>
            <div>
                { userGames.sort(gamesSorter).map((game: GameModel) => <GamesListItem
                    game={game}
                    key={game.id}
                    joined={true}
                />)}
            </div>
        </> }
        { filteredGames.length > 0 && <>
            <h1>All games</h1>
            <div>
                { filteredGames.sort(gamesSorter).map((game: GameModel) => <GamesListItem
                    game={game}
                    key={game.id}
                    handleGameJoin={(team: string) => joinGame(game, team)}
                    joined={false}
                />)}
            </div>
        </> }
    </>
}