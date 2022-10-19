
import {GameModel} from "../../../models/GameModel"
import React, {useState} from 'react'
import GameJoinPopup from './GameJoinPopup'

import "./games.sass"

export default function GamesListItem(
    {game, handleGameJoin} : { game: GameModel, handleGameJoin: (team: string) => void }) {

    return <div className={"gamesListItem"}>
        <div>
            <h2>{game.gameName}</h2>
            <p>
                Id={game.id}, Description='{game.description}'
            </p>
        </div>
        <aside>
            <GameJoinPopup game={game} onPopupClosed={(result: string) => handleGameJoin(result)}/>
        </aside>
    </div>
}