import {GameModel} from "../../../models/GameModel"
import React from 'react'
import Popup from 'reactjs-popup'

export default function GameJoinPopup(
	{game, onPopupClosed} : {game: GameModel, onPopupClosed: (result: string) => void}) {

	return <Popup trigger={<button>Join Game</button>}
		modal
		onClose={ (event: any) => {
			if (!event || event.type !== "click") return

			onPopupClosed(event.target.title)
		}
	}>
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
						<button onClick={close} title="zombie">Join as Zombie</button>
						<button onClick={close} title="human">Join as Human</button>
						<button onClick={close}>Cancel</button>
					</div>
				</div>
			)
	}
		
	</Popup>
}