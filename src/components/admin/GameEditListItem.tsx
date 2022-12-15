import {getAuthHeaders, UserContext} from "../../UserProvider";
import {GameReadModel, MissionEditModel} from "../../Models";
import {GameState} from "../../Utils";
import {HvzMap, MissionMarker} from "../home/games/GamePage";

import React, {useCallback, useContext, useRef, useState} from "react";
import {useQuery} from "react-query";

import {MapContainer, Rectangle} from "react-leaflet";
import {LeafletMouseEvent, Map} from "leaflet";

import "./admin.sass"

export default function GameEditListItem({game} : {game: GameReadModel }) {
    const hvzUser = useContext(UserContext)
    const [updatedGame, updateGame] = useState<GameReadModel>(game)
    const [showMap, setMapVisibility] = useState(false)

    const currentGame = useRef<GameReadModel>(game)
    const counter = useRef<number>(0)

    const {data: missions, isLoading} = useQuery<MissionEditModel[]>(`game-${game.id}-missions`,
        async function() {
        const response = await fetch(`${process.env.REACT_APP_HVZ_API_BASE_URL}/games/${game.id}/missions`, {
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(hvzUser!)
            }
        })

        return await response.json()
    })

    async function save() {
        const response = await fetch(`${process.env.REACT_APP_HVZ_API_BASE_URL}/games/${game.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(hvzUser!)
            },
            body: JSON.stringify({
                ...updatedGame,
                gameState: updatedGame.gameState.toUpperCase()
            })
        })

        console.log(response)
    }

    async function deleteGame() {
        const response = await fetch(`${process.env.REACT_APP_HVZ_API_BASE_URL}/games/${game.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(hvzUser!)
            }
        })

        console.log(response)
    }

    function mapModified(): boolean {
        return JSON.stringify({
            nwLat: game.nwLat, nwLng: game.nwLng,
            seLat: game.seLat, seLng: game.seLng
        }) !== JSON.stringify({
            nwLat: updatedGame.nwLat, nwLng: updatedGame.nwLng,
            seLat: updatedGame.seLat, seLng: updatedGame.seLng
        })
    }

    const reset = () => updateGame(game)

    function selectCorner({latlng: {lat, lng}}: LeafletMouseEvent) {
        updateGame(prev => ({
            ...prev,
            [counter.current % 2 === 0 ? "se" : "nw"]: [lat, lng]
        }))

        counter.current++
    }

    const toggleMapVisibility = useCallback(() => setMapVisibility(b => !b), [])

    return <div className="game-edit-list-item">
        <form className="form-inline"
            onSubmit={async (e) => {
                e.preventDefault()
                await save()
            }}
            onReset={reset}>
            <fieldset>
                <label>ID: </label>
                <input
                    type="number"
                    value={game.id}
                    readOnly
                />
            </fieldset>
            <fieldset>
                <label>Name: </label>
                <input
                    type="text"
                    value={updatedGame.gameName}
                    onChange={e => {
                        updateGame(current => currentGame.current = {
                            ...current,
                            gameName: e.target.value
                        })
                    }
                }/>
            </fieldset>

            <fieldset>
                <label>Description: </label>
                <input
                    type="text"
                    value={updatedGame.description}
                    onChange={e =>
                        updateGame(current => currentGame.current = {
                            ...current,
                            description: e.target.value
                        })
                }/>
            </fieldset>
            <select
                value={updatedGame.gameState.toUpperCase()}
                onChange={e =>
                    updateGame(current => currentGame.current = {
                        ...current,
                        gameState: e.target.value
                    })
                }>
                { Object.values(GameState)
                    .filter(it => typeof(it) !== "number")
                    .map(it => <option key={it}>{it}</option>)
                }
            </select>
            <button type="submit">Save</button>
            <button type="reset">Reset</button>
            <button type="button" onClick={async () => await deleteGame()}>
                <span className="delete-button">Delete game</span>
            </button>
        </form>
        { !isLoading &&
            <>Toggle map display {mapModified() ? "(*)" : ""}:
                <button onClick={_ => toggleMapVisibility()}>{showMap ? "Hide" : "Show"}</button>
                <button onClick={_ => updateGame(prev => ({
                    ...prev,
                    nwLat: game.nwLat,
                    nwLng: game.nwLng,
                    seLat: game.seLat,
                    seLng: game.seLng
                })) } hidden={!mapModified()}>Reset map</button>
                { showMap && <div className="hvz-leaflet-editor">
                    <MapContainer>
                        <HvzMap
                            mapSetup={(map: Map) => {
                                map.fitBounds([[updatedGame.nwLat, updatedGame.nwLng], [updatedGame.seLat, updatedGame.seLng]])
                                map.doubleClickZoom.disable()

                                map.on("dblclick", selectCorner);

                                for (const mission of missions!) {
                                    let m = MissionMarker(mission)
                                    m.addTo(map)
                                }
                            }
                        }/>
                        <Rectangle bounds={[[updatedGame.nwLat, updatedGame.nwLng], [updatedGame.seLat, updatedGame.seLng]]} />
                    </MapContainer>
                </div> }
            </> }
    </div>
}