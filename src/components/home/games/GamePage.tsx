import {useQuery} from "react-query";
import {useParams} from 'react-router'
import {getAuthHeaders, UserContext} from "../../../UserProvider";
import React, {FormEvent, useContext} from "react";
import {GameModel, PlayerModel} from "../../../Models";

export default function GamePage() {
    // @ts-ignore
    const hvzUser = useContext(UserContext)
    const {id} = useParams()

    function handleBitecodeInput(event: FormEvent<HTMLFormElement>) {
        console.log(event)

        event.preventDefault()
    }

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
        })

        return [game, player]
    }

    const [game, player] = useGameFetch()

    return hvzUser && <>
        { !!game
            ? <>
                <div className="gameDisplay">
                    { !!player
                        ? (player.human
                            ? <div className="bitecode-display">
                                <img src={"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data="
                                    + `${process.env.REACT_APP_DOMAIN}/kill?`
                                    + `bitecode=${player.biteCode}`}/>
                                <p>{player.biteCode}</p>
                                <p>Show this to zombies trying to kill you!</p>
                        </div>
                            : <div className="zombie-display">
                                <p>Use your camera app to scan another human-team players bitecode!</p>
                                <p>Alternatively - manually enter their bitecode: </p>
                                <form onSubmit={e => handleBitecodeInput(e)}>
                                    <input type="text"></input>
                                    <button type="submit">Submit kill</button>
                                </form>
                            </div>)
                        : <>
                        {/* join game? */}
                        </> }
                    <h1>{game.gameName}</h1>
                    <p>{game.description}</p>
                    <ul>
                        <li>Players: {game.playerCount}/{game.maxPlayers}</li>
                        <li>Game state: {game.gameState}</li>
                    </ul>
                </div>
                {/* map display */}
            </>
            : <div>error loading game. return to home page?</div>
        }
        </>
}