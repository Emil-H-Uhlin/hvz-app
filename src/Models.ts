import {GameState} from "./Utils"

export interface GameModel {
    id: number,
    gameName: string,
    description: string,
    gameState: GameState,
    maxPlayers: number,
    playerCount: number
}

export interface PlayerModel {
	id: number,
	human: boolean,
	patientZero: boolean,
	biteCode: string
}

export interface KillModel {
    victimBiteCode: string,
    story: string, 
    lat: number,
    lng: number
}
