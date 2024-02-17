export interface Player {
  id: string;
  email: string;
}

export enum GameStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  FINISHED = "FINISHED"
}

export type GameStatusType = `${GameStatus}`
export interface Game {
  id: string;
  players: Player[];
  currentPlayerId: string | null;
  number: number;
  gameStatus: GameStatusType;
  winnerId?: string;
}

export interface GameState {
  playerId: string;
  gameId: string;
  number: number;
  isTurn: Boolean;
  winnerId?: string;
  gameStatus: GameStatusType;
}