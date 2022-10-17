import {GameModel} from "../../../models/GameModel"
import React from 'react'
import Popup from 'reactjs-popup'

export default function GameJoinPopup({game} : {game: GameModel}) {

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
						<Popup trigger={<button>Join as Human</button>}>

						</Popup>
						<Popup trigger={<button>Join as Zombie</button>}>
							
						</Popup>
						<button onClick={close}>Cancel</button>
					</div>
				</div>
			)
	}
		
	</Popup>
}