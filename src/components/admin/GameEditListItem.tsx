import {getAuthHeaders, UserContext} from "../../UserProvider";
import {GameModel} from "../../Models";
import {GameState} from "../../Utils";
import {HvzMap} from "../home/games/GamePage";

import React, {useContext, useRef, useState} from "react";

import {MapContainer, Rectangle} from "react-leaflet";
import {Map} from "leaflet";

import "./admin.sass"

export default function GameEditListItem({game} : {game: GameModel }) {
    const hvzUser = useContext(UserContext)
    const [updatedGame, updateGame] = useState<GameModel>(game)

    const currentGame = useRef<GameModel>(game)
    const counter = useRef<number>(0)

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
                <HvzMap
                    game={updatedGame}
                    mapSetup={(map: Map) => {
                        map.removeEventListener("mousedown")
                        map.on("mousedown", ({originalEvent, latlng}) => {
                            if (originalEvent.button !== 1)
                                return

                            currentGame.current = {
                                ...currentGame.current,
                                [counter.current % 2 === 0 ? "nw" : "se"]: [latlng.lat, latlng.lng]
                            }

                            // update state every two clicks (allowing the user to select both corners
                            if (counter.current % 2 !== 0) {
                                // ensure current game has been updated by waiting 100ms
                                (async function () {
                                    await new Promise(resolve => setTimeout(resolve, 100))
                                })()

                                updateGame(currentGame.current)
                            }

                            counter.current++
                        })
                    }
                }/>
                <Rectangle bounds={[updatedGame.nw, updatedGame.se]} />
            </MapContainer>
        </div>
    </div>
}