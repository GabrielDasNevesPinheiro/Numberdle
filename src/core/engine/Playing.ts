import GameEngine from "./GameEngine"

type GameManager = {
    attempts: number,
    generatedNumber: number,
    playerEngine: GameEngine
}

export abstract class Playing {

    static inGame: { [userId: string]: GameManager } = {}

}
