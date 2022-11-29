
import {GameModel, PlayerModel} from "../../../Models"
import {GameState} from "../../../Utils";

import React, {FormEvent, useContext, useState} from 'react'
import Popup from 'reactjs-popup'
import {getAuthHeaders, UserContext} from "../../../UserProvider"

import {useQuery} from "react-query";

import "./games.sass"

export default function GamesListItem(
    {game, handleGameJoin, joined} : { game: GameModel, handleGameJoin?: (team: string) => void, joined: boolean }) {

    const [open, setOpen] = useState(false)

    // @ts-ignore
    const hvzUser = useContext(UserContext)

    const {data:player} = useQuery<PlayerModel>(`player-game${game.id}`, async function() {

        if (!joined) return null;

        const response = await fetch(`${process.env.REACT_APP_HVZ_API_BASE_URL}/games/${game.id}/currentUser/player`, {
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(hvzUser!)
            }
        })

        return await response.json()
    })

    function handleBitecodeInput(event: FormEvent<HTMLFormElement>) {
        console.log(event)

        event.preventDefault()
    }

    return <div className="gamesListItem">
        <a href={`/games/${game.id}`}><h2>{game.gameName}</h2></a>
        <div className="gameInfo" onClick={_ => setOpen(true)}>
            <span id="g_desc">{game.description} </span>
            <span id="g_player_count">Players: ({game.playerCount}/{game.maxPlayers}) </span>
            <span id="g_state">State: {game.gameState} </span>
            { joined && <span id="g_team">Team: {player?.human ? "humans": "zombies" } </span> }
        </div>
        { joined
            ? <Popup open={open} modal onClose={_ => setOpen(false)} >
                { player && player.human
                    ? <div className="bitecode-display">
                        <img src={"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data="
                            + `${process.env.REACT_APP_DOMAIN}/kill?`
                            + `bitecode=${player?.biteCode}`}/>

                        <p>{player.biteCode}</p>
                    </div>
                    : <div className="zombie-display">
                        <p>Use your camera app to scan human bitecode!</p>
                        <p>Alternatively - manually enter their bitecode: </p>
                        <form onSubmit={e => handleBitecodeInput(e)}>
                            <input type="text"></input>
                            <button type="submit">Submit kill</button>
                        </form>
                    </div>
                }
            </Popup>
            : <Popup open={open} modal onClose={_ => setOpen(false)} >
                {   // @ts-ignore
                    close => (
                        <div className="joinPopup">
                            <button onClick={e => {
                                handleGameJoin!("zombie")
                                close(e)
                            }}>Join as Zombie</button>
                            <button onClick={e => {
                                handleGameJoin!("human")
                                close(e)
                            }}>Join as Human</button>
                            <button onClick={close}>Cancel</button>
                        </div>
                    )
                }
            </Popup>
        }
    </div>
}