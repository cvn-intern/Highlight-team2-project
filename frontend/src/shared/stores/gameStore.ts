import { create } from "zustand";
import {
  WAIT_FOR_OTHER_PLAYERS,
  INTERVAL_INACTIVE,
  INTERVAL_NEW_TURN,
  INTERVAL_NOT_SHOW_WORD,
  INTERVAL_SHOW_WORD,
  START_GAME,
  PLAY_GAME,
} from "../components/IntervalCanvas";

export type GameStatus =
  | typeof WAIT_FOR_OTHER_PLAYERS
  | typeof INTERVAL_SHOW_WORD
  | typeof INTERVAL_NOT_SHOW_WORD
  | typeof INTERVAL_NEW_TURN
  | typeof INTERVAL_INACTIVE
  | typeof START_GAME
  | typeof PLAY_GAME;

interface GameState {
  participants: Participant[];
  maxPlayer: number;
  gameStatus: GameStatus | null;
  roomRound: RoomRound | null;
  isDrawer: boolean;
  isHost: boolean;
  correctAnswers: number[]
  setParticipants: (participants: Participant[]) => void;
  setMaxPlayer: (maxPlayer: number) => void;
  setGameStatus: (gameStatus: GameStatus) => void;
  setRoomRound: (roomRound: RoomRound | null) => void;
  setIsDrawer: (isDrawer: boolean) => void;
  setIsHost: (isDrawer: boolean) => void;
  setCorrectAnswers: (correctAnswers: number[]) => void
}

export const useGameStore = create<GameState>((set) => ({
  participants: [],
  maxPlayer: 0,
  gameStatus: null,
  roomRound: null,
  isDrawer: false,
  isHost: false,
  correctAnswers: [],
  setParticipants: (data) => set((state) => ({ ...state, participants: data })),
  setMaxPlayer: (data) => set((state) => ({ ...state, maxPlayer: data })),
  setGameStatus: (data) => set((state) => ({ ...state, gameStatus: data })),
  setRoomRound: (data) => set((state) => ({ ...state, roomRound: data })),
  setIsDrawer: (data) => set((state) => ({ ...state, isDrawer: data })),
  setIsHost:  (data) => set((state) => ({ ...state, isHost: data })),
  setCorrectAnswers:  (data) => set((state) => ({ ...state, correctAnswers: data })),
}));
