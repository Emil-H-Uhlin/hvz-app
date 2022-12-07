import {getAuthHeaders, UserContext} from "../../UserProvider";
import {GameModel, MissionEditModel} from "../../Models";
import {GameState} from "../../Utils";
import {HvzMap, MissionMarker} from "../home/games/GamePage";

import React, {useContext, useRef, useState} from "react";
import {useQuery} from "react-query";

import {MapContainer, Rectangle} from "react-leaflet";
import {LeafletMouseEvent, Map} from "leaflet";

import "./admin.sass"

export default function GameEditListItem({game} : {game: GameModel }) {
    const hvzUser = useContext(UserContext)
    const [updatedGame, updateGame] = useState<GameModel>(game)

    const currentGame = useRef<GameModel>(game)
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
                gameState: GameState[updatedGame.gameState].toUpperCase(),
                nwLat: updatedGame.nw[0], nwLng: updatedGame.nw[1],
                seLat: updatedGame.se[0], seLng: updatedGame.se[1]
            })
        })

        console.log(response)
    }

    const reset = () => updateGame(game)

    function selectCorner({originalEvent: {button: mouseButton}, latlng: {lat, lng} }: LeafletMouseEvent) {
        if (mouseButton !== 1)
            return

        currentGame.current = {
            ...currentGame.current,
            [counter.current % 2 === 0 ? "se" : "nw"]: [lat, lng]
        }

        console.log("test")
        // update state every two clicks (allowing the user to select both corners
        if (counter.current % 2 !== 0) {
            // ensure current game has been updated by waiting 100ms
            (async function () {
                await new Promise(resolve => setTimeout(resolve, 50))
            })()

            updateGame(currentGame.current)
        }

        counter.current++
    }

    return <div>
        <form
            onSubmit={async (e) => {
                e.preventDefault()
                await save()
            }}
            onReset={reset}
        >
            <input
                type="number"
                value={game.id}
                readOnly
            />
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
            <textarea
                value={updatedGame.description}
                onChange={e =>
                    updateGame(current => currentGame.current = {
                        ...current,
                        description: e.target.value
                    })
            }/>
            <select
                value={GameState[updatedGame.gameState]}
                onChange={e =>
                    updateGame(current => currentGame.current = {
                        ...current,
                        gameState: e.target.selectedIndex
                    })
            }>
                { Object.values(GameState)
                    .filter(it => typeof(it) !== "number")
                    .map(it => <option key={it}>{it}</option>)
                }
            </select>
            <button type="submit">Save</button>
            <button type="reset">Reset</button>
        </form>
        <div className="hvz-leaflet-editor">
            <MapContainer>
                { !isLoading &&
                    <HvzMap
                        mapSetup={(map: Map) => {
                            map.fitBounds([updatedGame.nw, updatedGame.se])
                            map.doubleClickZoom.disable()

                            map.on("mousedown", selectCorner);

                            for (const mission of missions!) {
                                let m = MissionMarker(mission)
                                m.addTo(map)
                            }
                        }
                    }/>
                }
                <Rectangle bounds={[updatedGame.nw, updatedGame.se]} />
            </MapContainer>
        </div>
    </div>
}