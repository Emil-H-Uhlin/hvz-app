import {GameModel, jsonToGameModel, PlayerModel} from "../../../Models";
import {getAuthHeaders, UserContext} from "../../../UserProvider";

import React, {useContext, useEffect, useState} from "react";
import {useQuery} from "react-query";
import {useNavigate, useParams} from 'react-router'

import {MapContainer, TileLayer, Rectangle, useMap} from "react-leaflet";
import {Map} from 'leaflet'

import 'leaflet/dist/leaflet.css'

export default function GamePage() {
    // @ts-ignore
    const hvzUser = useContext(UserContext)
    const {id} = useParams()
    const navigate = useNavigate()

    const [biteCodeInput, updateInput] = useState("")

    function useGameFetch(): [GameModel | undefined, PlayerModel | undefined, () => void] {
        const {data: game, refetch: refetchGame} = useQuery<GameModel>(`game-${id}`, async function() {
            const response = await fetch(`${process.env.REACT_APP_HVZ_API_BASE_URL}/games/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders(hvzUser!)
                }
            })

            return jsonToGameModel(await response.json())
        }, {
            enabled: hvzUser !== null,
        })

        const {data:player, refetch: refetchPlayer} = useQuery<PlayerModel>(`player-game${id}`, async function() {

            const response = await fetch(`${process.env.REACT_APP_HVZ_API_BASE_URL}/games/${id}/currentUser/player`, {
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders(hvzUser!)
                }
            })

            return response.ok ? await response.json() : null
        }, {
            enabled: hvzUser !== null,
            retry: 0
        })

        return [game, player, async function() {
            await refetchGame()
            await refetchPlayer()
        }]
    }

    const [game, player, refetch] = useGameFetch()

    function joinGame(human: boolean) {
        return fetch(`${process.env.REACT_APP_HVZ_API_BASE_URL}/games/${id}/players`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(hvzUser!)
            },
            body: JSON.stringify({
                human
            })
        })
    }

    async function joinAsHuman() {
        const response = await joinGame(true)
        if (response.ok) await refetch()
    }

    async function joinAsZombie() {
        const response = await joinGame(false)
        if (response.ok) await refetch()
    }

    function handleBitecodeInput(event: any) {
        event.preventDefault()
        navigate(`/kill/${biteCodeInput} ${game!.id}`)
    }

    return hvzUser && <>
        { !!game
            ? <>
                <div className="gameDisplay">
                    { !!player
                        ? (player.human
                            ? <div className="bitecode-display">
                                <img src={"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data="
                                    + `${process.env.REACT_APP_DOMAIN}/kill/`
                                    + `${player.biteCode}`
                                    + ` ${game.id}` }/>
                                <p>{player.biteCode}</p>
                                <p>Show this to zombies trying to kill you!</p>
                        </div>
                            : <div className="zombie-display">
                                <p>Use your camera app to scan another human-team players bitecode!</p>
                                <p>Alternatively - manually enter their bitecode: </p>
                                <form onSubmit={e => handleBitecodeInput(e)}>
                                    <input type="text" onChange={e => updateInput(e.target.value)}></input>
                                    <button type="submit">Submit kill</button>
                                </form>
                            </div>)
                        : <div>
                            <p>You're not playing this game. Would you like to join it?</p>
                            <button onClick={joinAsHuman}>Join game (H)</button>
                            <button onClick={joinAsZombie}>Join game (Z)</button>
                        </div> }
                    <h1>{game.gameName}</h1>
                    <p>{game.description}</p>
                    <ul>
                        <li>Players: {game.playerCount}/{game.maxPlayers}</li>
                        <li>Game state: {game.gameState}</li>
                    </ul>
                </div>
                <div className="hvz-leaflet-container">
                    <MapContainer>
                        <HvzMap mapSetup={(map: Map) => {
                            map.fitBounds([game.nw, game.se])
                            map.doubleClickZoom.disable()
                        }}/>
                        <Rectangle bounds={[game.nw, game.se]} />
                    </MapContainer>
                </div>
            </>
            : <div>error loading game. return to home page?</div>
        }
        </>
}

export function HvzMap({mapSetup} : {mapSetup: (map: Map) => void}) {
    const map = useMap()

    useEffect(() => {
        map.attributionControl.addAttribution('&copy; ' +
            '<a href="http://osm.org/copyright">OpenStreetMap</a> ' +
            'contributors'
        )

        mapSetup(map)
    }, [map])

    return <>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    </>
}