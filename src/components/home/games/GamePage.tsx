import {useQuery} from "react-query";
import {useParams, useNavigate} from 'react-router'
import {getAuthHeaders, UserContext} from "../../../UserProvider";
import {useContext} from "react";
import {GameModel, PlayerModel} from "../../../Models";

export default function GamePage() {
    // @ts-ignore
    const hvzUser = useContext(UserContext)
    const {id} = useParams()    // fetch game id

    function useGameFetch(): [GameModel | undefined, PlayerModel | undefined] {
        const {data: game} = useQuery<GameModel>(`game-${id}`, async function() {
            const response = await fetch(`${process.env.REACT_APP_HVZ_API_BASE_URL}/games/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders(hvzUser!)
                }
            })

            return await response.json()
        }, {
            enabled: hvzUser !== null,
            retry: 1
        })

        const {data:player} = useQuery<PlayerModel>(`player-game${id}`, async function() {

            const response = await fetch(`${process.env.REACT_APP_HVZ_API_BASE_URL}/games/${id}/currentUser/player`, {
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders(hvzUser!)
                }
            })

            return await response.json()
        }, {
            enabled: hvzUser !== null,
            retry: 1
        })

        return [game, player]
    }

    const [game, player] = useGameFetch()

    return hvzUser && <>
        { !!game
            ? <div className="gameDisplay">
                { player && <>member of game</>}
                <h1>{game.gameName}</h1>
                <p>{game.description}</p>
            </div>
            : <div>error loading game. return to home page?</div>
        }
        </>
}