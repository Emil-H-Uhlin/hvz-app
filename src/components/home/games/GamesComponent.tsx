import { useContext } from "react"
import {getAuthHeaders, UserContext} from "../../../UserProvider"
import {useQuery} from "react-query";
import {GameReadModel} from "../../../Models"
import GamesListItem from "./GamesListItem";

export default function GamesComponent() {
    const hvzUser = useContext(UserContext)

    async function joinGame(game: GameReadModel, team: string) {
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

        if (response.ok) await refetchGames();
        else console.log(response)
    }

    function gamesSorter(game1: GameReadModel, game2: GameReadModel): number {
        let sort = 0

        if (game1.gameState !== game2.gameState)
            sort += game1.gameState > game2.gameState ? -2: 2

        if (game1.playerCount === game2.playerCount)
            sort += game1.id > game2.id ? -1: 1;
        else
            sort += game1.playerCount > game2.playerCount ? -1: 1

        return sort
    }
    
    function useGameFetch(): [GameReadModel[], GameReadModel[], () => void, boolean] {
        const { data : allGames, refetch : refetchAll, isLoading: allGamesLoading }
            = useQuery<GameReadModel[]>("allGames", async function () {
                const response = await fetch(`${process.env.REACT_APP_HVZ_API_BASE_URL}/games`, {
                    headers: {
                        "Content-Type": "application/json",
                        ...getAuthHeaders(hvzUser!)
                    }
                })

            return await response.json()
        })

        const { data : userGames, refetch : refetchUser, isLoading: userGamesLoading }
            = useQuery<GameReadModel[]>("userGames", async function() {
                const response = await fetch(`${process.env.REACT_APP_HVZ_API_BASE_URL}/currentUser/games`, {
                    headers: {
                        "Content-Type": "application/json",
                        ...getAuthHeaders(hvzUser!)
                    }
                })

            return await response.json()
        })

        return [!!allGames && !!userGames
            ? allGames.filter(({id:aId}: GameReadModel) => !userGames.some(({id:iId}: GameReadModel) => aId === iId))
            : (allGames ?? []),
            userGames ?? [],
            async function() {
                await refetchAll()
                await refetchUser()
            },
            allGamesLoading || userGamesLoading
        ]
    }

    const [filteredGames, userGames, refetchGames, isLoading] = useGameFetch()

    return <> {!isLoading && <>
        { userGames.length > 0 && <>
            <h1>Joined games</h1>
            <div>
                { userGames.sort(gamesSorter).map((game: GameReadModel) => <GamesListItem
                    game={game}
                    key={game.id}
                    joined={true}
                />)}
            </div>
        </> }
        { filteredGames.length > 0 && <>
            <h1>All games</h1>
            <div>
                { filteredGames.sort(gamesSorter).map((game: GameReadModel) => <GamesListItem
                    game={game}
                    key={game.id}
                    handleGameJoin={(team: string) => joinGame(game, team)}
                    joined={false}
                />)}
            </div>
        </> }
    </>}</>
}
