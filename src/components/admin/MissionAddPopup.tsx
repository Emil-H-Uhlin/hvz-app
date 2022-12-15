import {HvzMap} from "../home/games/GamePage";
import {GameReadModel} from "../../Models";

import React from "react";

import {MapContainer, Rectangle} from "react-leaflet";
import {LeafletMouseEvent, Map} from "leaflet";

import Popup from "reactjs-popup";

export const MissionAddPopup = ({game, onClick}: {game: GameReadModel, onClick: (latlng: [number, number]) => void}) => <Popup trigger={<button type="button">Select location</button>}>
    {   //@ts-ignore
        close => <div className="hvz-leaflet-mission-add">
            <MapContainer>
                <HvzMap
                    mapSetup={(map: Map) => {
                        map.fitBounds([[game.nwLat, game.nwLng], [game.seLat, game.seLng]])
                        map.doubleClickZoom.disable()

                        map.on("click", ({latlng: {lat, lng}}: LeafletMouseEvent) => {
                            onClick([lat, lng])
                            close()
                        });
                    }
                    }/>
                <Rectangle bounds={[[game.nwLat, game.nwLng], [game.seLat, game.seLng]]} />
            </MapContainer>
        </div> }
    </Popup>

export default MissionAddPopup