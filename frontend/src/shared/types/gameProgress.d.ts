import { GameStatus } from "../stores/gameStore"

type GamePresentProgressPackage =  {
    startProgress: number
    maximumTimeInMiliSeconds: number
    status: GameStatus
    sendAt: Date
}