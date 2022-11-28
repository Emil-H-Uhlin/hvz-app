import jwtDecode from 'jwt-decode'
import {Exception} from "sass";

export enum GameState {
    Registering, Playing, Completed
}

export function checkIfAdmin(token: string) {
    const decoded: { permissions: [] } = jwtDecode(token)

    return decoded.permissions.filter((it: string) => it.startsWith("ADMIN_")).length === 2
}

export function strToGameState(input: string): GameState {
    switch (input.toLowerCase()) {
        case "register": case "registering":
            return GameState.Registering
        case "playing":
            return GameState.Playing
        case "complete": case "completed":
            return GameState.Completed
    }

    throw new Error(`Unable to map input '${input}' to any game state.`)
}