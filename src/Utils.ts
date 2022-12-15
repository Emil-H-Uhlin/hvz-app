import jwtDecode from 'jwt-decode'

export enum GameState {
    Completed, Registering, Playing
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