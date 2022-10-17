import React from 'react'
import Popup from 'reactjs-popup'

export default function GameJoinPopup() {

	return <Popup trigger={<button>Join Game</button>}
		modal
		nested
		>
		{ 	
			// @ts-ignore
			close => (
				<div>
					<button onClick={close}>test</button>
				</div>
			)
	}
		
	</Popup>
}