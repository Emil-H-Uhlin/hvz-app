
import {GameModel, PlayerModel} from "../../../Models"

import React, {useContext} from 'react'
import GameJoinPopup from './GameJoinPopup'
import Popup from 'reactjs-popup'
import {getAuthHeaders, UserContext} from "../../../UserProvider"

import {useQuery} from "react-query";

import "./games.sass"

export default function GamesListItem(
    {game, handleGameJoin, joined} : { game: GameModel, handleGameJoin?: (team: string) => void, joined: boolean }) {
    
    // @ts-ignore
    const [hvzUser] = useContext(UserContext)

    const {data:player} = useQuery<PlayerModel | null>(`player-game${game.id}`, async function() {

        if (!joined) return null;

        const response = await fetch(`${process.env.REACT_APP_HVZ_API_BASE_URL}/games/${game.id}/currentUser/player`, {
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(hvzUser)
            }
        })

        return await response.json()
    })

    return <div className={"gamesListItem"}>
        <div>
            <h2>{game.gameName} - ({game.playerCount}/{game.maxPlayers})</h2>
            <span>{game.description}</span>
        </div>
        <aside>
            { joined 
                ? <>
                    <Popup trigger={<button>Show bitecode</button>} modal >
                        <div style={{
                            backgroundColor: "black",
                            color: "white"
                        }}>
                            <span>{player?.biteCode}</span>
                        </div>
                    </Popup>
                </> 
                : <>
                    <GameJoinPopup game={game} onPopupClosed={(result: string) => handleGameJoin?.(result)}/>
                </>
            }            
        </aside>
    </div>
}