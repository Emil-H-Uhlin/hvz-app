import {getAuthHeaders, UserContext} from "../../UserProvider";
import {GameAddModel} from "../../Models";
import {HvzMap} from "../home/games/GamePage";

import React, {useContext, useRef, useState} from "react";

import {MapContainer, Rectangle} from "react-leaflet";
import {LeafletMouseEvent, Map} from "leaflet";

import "./admin.sass"

const baseAddModel: GameAddModel = {
    gameName: "New game",
    description: "",
    nwLat: .0, nwLng: .0,
    seLat: .0, seLng: .0,
    gameState: "Registering",
    maxPlayers: 16
}

export default function GameAddItem() {
    const hvzUser = useContext(UserContext)

    const [game, updateGame] = useState<GameAddModel>(baseAddModel)
    const counter = useRef<number>(0)

    async function save() {
        const response = await fetch(`${process.env.REACT_APP_HVZ_API_BASE_URL}/games`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(hvzUser!)
            },
            body: JSON.stringify(game)
        })

        console.log(response)
    }

    const reset = () => updateGame(baseAddModel)

    function selectCorner({latlng: {lat, lng}}: LeafletMouseEvent) {
        updateGame(prev => ({
            ...prev,
            ...(counter.current++ % 2 === 0 ? { "seLat": lat, "seLng": lng } : { "nwLat": lat, "nwLng": lng })
        }))

        counter.current++
    }

    return <div className="game-edit-list-item">
        <form className="form-inline"
              onSubmit={async (e) => {
                  e.preventDefault()
                  await save()
              }}
              onReset={reset}>
            <fieldset>
                <label>Name: </label>
                <input
                    type="text"
                    value={game.gameName}
                    onChange={e => updateGame(prev => ({...prev, gameName: e.target.value})) }
                />
            </fieldset>
            <fieldset>
                <label>Description: </label>
                <input
                    type="text"
                    value={game.description}
                    onChange={e => updateGame(prev => ({ ...prev, description: e.target.value})) }
                />
            </fieldset>
            <fieldset>
                <label>Player count: </label>
                <input
                    type="number"
                    value={game.maxPlayers}
                    onChange={e => updateGame(prev => ({ ...prev, maxPlayers: Number(e.target.value) })) }
                />
            </fieldset>
            <button type="submit">Save</button>
            <button type="reset">Reset</button>
        </form>
        <button onClick={_ => updateGame(prev => ({
            ...prev,
            nwLat: .0, nwLng: .0,
            seLat: .0, seLng: .0
        })) }>Reset map</button>
        <div className="hvz-leaflet-editor">
            <MapContainer>
                <HvzMap
                    mapSetup={(map: Map) => {
                        map.fitBounds([[game.nwLng, game.nwLat], [game.seLng, game.seLat]])
                        map.doubleClickZoom.disable()

                        map.on("dblclick", selectCorner);
                    }
                }/>
                <Rectangle bounds={[[game.nwLat, game.nwLng], [game.seLat, game.seLng]]} />
            </MapContainer>
        </div>
    </div>
}