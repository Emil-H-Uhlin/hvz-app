
import {GameModel, PlayerModel} from "../../../Models"
import {getAuthHeaders, UserContext} from "../../../UserProvider"
import "./games.sass"

import React, {useContext} from 'react'
import {useQuery} from "react-query";

import {MapContainer, TileLayer, useMap} from "react-leaflet";
import {useNavigate} from "react-router-dom";

export default function GamesListItem(
    {game, joined} : { game: GameModel, handleGameJoin?: (team: string) => void, joined: boolean }) {
    const navigate = useNavigate()
    // @ts-ignore
    const hvzUser = useContext(UserContext)

    const {data:player} = useQuery<PlayerModel>(`player-game${game.id}`, async function() {
        const response = await fetch(`${process.env.REACT_APP_HVZ_API_BASE_URL}/games/${game.id}/currentUser/player`, {
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(hvzUser!)
            }
        })

        return await response.json()
    }, {
        enabled: joined
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