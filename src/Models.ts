export interface GameModel {
    id: number,
    gameName: string,
    description: string,
    gameState: string,
    maxPlayers: number,
    playerCount: number
}

export interface PlayerModel {
	id: number,
	human: boolean,
	patientZero: boolean,
	biteCode: string
}