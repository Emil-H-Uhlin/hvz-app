import {GameModel} from "../../../models/GameModel"
import React from 'react'
import Popup from 'reactjs-popup'

export default function GameJoinPopup(
	{game, onClose} : {game: GameModel, onClose: (result: string) => void}) {

	return <Popup trigger={<button>Join Game</button>}
		modal
		nested
		>
		{ 	
			// @ts-ignore
			close => (
				<div className="joinPopup">
					<div className="header">
						<h1>{game.gameName}</h1>
						<p>{game.description}</p>
					</div>
					<div className="body">

					</div>
					<div className="actions">
						<button onClick={() => {
							onClose("z")
							close()
						}}>Join as Zombie</button>
						<button onClick={() => {
							onClose("h")
							close()
						}}>Join as Human</button>
						<button onClick={() => {
							onClose("n")
							close()
						}}>Cancel</button>
					</div>
				</div>
			)
	}
		
	</Popup>
}