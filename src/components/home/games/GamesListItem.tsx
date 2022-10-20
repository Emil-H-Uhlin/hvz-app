
import {GameModel} from "../../../models/GameModel"
import React, {useState} from 'react'
import GameJoinPopup from './GameJoinPopup'

import "./games.sass"

export default function GamesListItem(
    {game, handleGameJoin, joined} : { game: GameModel, handleGameJoin?: (team: string) => void, joined: boolean }) {

    return <div className={"gamesListItem"}>
        <div>
            <h2>{game.gameName} - ({game.playerCount}/{game.maxPlayers})</h2>
            <span>{game.description}</span>
        </div>
        <aside>
            { joined 
                ? <>

                </> 
                : <>
                    <GameJoinPopup game={game} onPopupClosed={(result: string) => handleGameJoin?.(result)}/>
                </>
            }            
        </aside>
    </div>
}