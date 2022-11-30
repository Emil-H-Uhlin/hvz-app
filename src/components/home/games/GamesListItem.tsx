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

    function InitMap() {
        const map = useMap()
        map.setView([(game.nw[0] + game.se[0]) / 2, (game.nw[1] + game.se[1]) / 2], 15)

        // disable movement and zooming
        map.dragging.disable()
        map.boxZoom.disable()
        map.doubleClickZoom.disable()
        map.zoomControl.remove()

        map.attributionControl.addAttribution('&copy; ' +
            '<a href="http://osm.org/copyright">OpenStreetMap</a> ' +
            'contributors')

        return <>
        </>
    }

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
                <InitMap />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            </MapContainer>
        </div>
    </div>
}