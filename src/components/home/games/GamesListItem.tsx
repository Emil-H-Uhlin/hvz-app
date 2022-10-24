
import {GameModel, PlayerModel} from "../../../Models"

import React, {useContext} from 'react'
import GameJoinPopup from './GameJoinPopup'

import {UserContext} from '../../../UserProvider'
import "./games.sass"

import {useQuery} from "react-query";

export default function GamesListItem(
    {game, handleGameJoin, joined} : { game: GameModel, handleGameJoin?: (team: string) => void, joined: boolean }) {
    
    // @ts-ignore
    const [hvzUser] = useContext(UserContext)


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