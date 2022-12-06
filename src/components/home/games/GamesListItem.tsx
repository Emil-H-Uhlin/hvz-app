import {GameModel, PlayerModel} from "../../../Models"
import {getAuthHeaders, UserContext} from "../../../UserProvider"
import {HvzMap} from "./GamePage";

import React, {useContext} from 'react'
import {useQuery} from "react-query";
import {useNavigate} from "react-router";

import {MapContainer} from "react-leaflet";
import {Map} from 'leaflet'

import "./games.sass"

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

    const goToGame = () => navigate(`/games/${game.id}`)

    return <div className="gamesListItem" onClick={_ => goToGame()} >
        <div className="gameInfo" >
            <h2>{game.gameName}</h2>
            <p id="g_desc">{game.description} </p>
            <ul>
                <li id="g_player_count">Players: ({game.playerCount}/{game.maxPlayers}) </li>
                <li id="g_state">State: {game.gameState} </li>
                { joined && <li id="g_team">Team: {player?.human ? "humans": "zombies" } </li> }
            </ul>
        </div>
        <div className="hvz-leaflet-preview">
            <MapContainer>
                <HvzMap
                    mapSetup={(map: Map) => {
                        map.fitBounds([game.nw, game.se])

                        map.doubleClickZoom.disable()
                        map.zoomControl.remove()
                        map.boxZoom.disable()
                        map.scrollWheelZoom.disable()

                        map.dragging.disable()
                    }}/>
            </MapContainer>
        </div>
    </div>
}
