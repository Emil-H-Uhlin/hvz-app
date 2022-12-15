export interface GameAddModel {
    gameName: string,
    description: string,

    nwLat: number,
    nwLng: number,
    seLat: number,
    seLng: number,

    maxPlayers: number,
    gameState: string,
}

export interface GameReadModel {
    id: number,
    gameName: string,
    description: string,

    nwLat: number,
    nwLng: number,
    seLat: number,
    seLng: number,

    playerCount: number,
    maxPlayers: number,

    gameState: string,
    players: string[],
    kills: string[],
    missions: string[],
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

export interface BaseMissionModel {
    id: number,
    name: string,
    description: string,
    lat: number,
    lng: number
}

export interface MissionEditModel extends BaseMissionModel {

}