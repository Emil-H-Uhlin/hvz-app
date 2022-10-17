
import {GameModel} from "../../../models/GameModel"
import React from 'react'
import Popup from 'reactjs-popup'
import GameJoinPopup from './GameJoinPopup'

import "./games.sass"

export default function GamesListItem({game} : { game: GameModel }) {
    return <div className={"gamesListItem"}>
        <div>
            <h2>{game.gameName}</h2>
            <p>
                Id={game.id}, Description='{game.description}'
            </p>
        </div>
        <aside>
            <GameJoinPopup />
        </aside>
    </div>
}