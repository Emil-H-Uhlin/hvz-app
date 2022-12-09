import {GameState, strToGameState} from "./Utils"

export interface GameBaseModel {
    id: number,
    gameName: string,
    description: string,
    gameState: GameState,
    maxPlayers: number,
    playerCount: number,
    nw: [number, number],
    se: [number, number]
}

export interface GameModel extends GameBaseModel {
    missions: [string]
}

export function jsonToGameModel(it: any): GameModel {
    try {
        return {
            id: it.id,
            gameName: it.gameName,
            description: it.description,
            gameState: strToGameState(it.gameState),
            maxPlayers: it.maxPlayers,
            playerCount: it.playerCount,
            missions: it.missions,
            nw: [it.nwLat, it.nwLng],
            se: [it.seLat, it.seLng]
        }
    }
    catch {
        throw new Error("Invalid game model passed")
    }
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