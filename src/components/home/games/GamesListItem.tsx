
import {GameModel, PlayerModel} from "../../../Models"

import React, {useContext, useState} from 'react'
import Popup from 'reactjs-popup'
import {getAuthHeaders, UserContext} from "../../../UserProvider"

import {useQuery} from "react-query";

import "./games.sass"

export default function GamesListItem(
    {game, handleGameJoin, joined} : { game: GameModel, handleGameJoin?: (team: string) => void, joined: boolean }) {

    const [open, setOpen] = useState(false)

    // @ts-ignore
    const hvzUser = useContext(UserContext)

    const {data:player} = useQuery<PlayerModel | null>(`player-game${game.id}`, async function() {

        if (!joined) return null;

        const response = await fetch(`${process.env.REACT_APP_HVZ_API_BASE_URL}/games/${game.id}/currentUser/player`, {
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(hvzUser!)
            }
        })

        return await response.json()
    })

    return <div className="gamesListItem" onClick={_ => setOpen(true)}>
        <h2>{game.gameName}</h2>
        <div className="gameInfo">
            <span id="g_desc">{game.description} </span>
            <span id="g_player_count">Players: ({game.playerCount}/{game.maxPlayers}) </span>
            <span id="g_state">State: {game.gameState[0] + game.gameState.substring(1).toLowerCase()} </span>
            { joined && <span id="g_team">Team: {player?.human ? "humans": "zombies" } </span> }
        </div>
        { joined
            ? <Popup open={open} modal onClose={_ => setOpen(false)} >
                { player && <div className="bitecode-display">
                    <img src={"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data="
                        + `${process.env.REACT_APP_DOMAIN}/kill?`
                        + `bitecode=${player?.biteCode}`}/>

                    <p>{player.biteCode}</p>
                </div> }
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