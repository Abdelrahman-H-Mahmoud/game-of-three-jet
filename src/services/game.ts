import { Game, GameStatus, Player } from "../types";
import { generateUUID } from "../utils/uuid";

let games: Game[] = []

export const assignToGame = (player: Player) => {
  const game = getAvailableGame();
  if (!game) {
    const game = createGame(player);
    return game;
  }
  game.player2 = player;
  game.gameStatus = GameStatus.IN_PROGRESS;
  return game;
}

export const createGame = (player: Player): Game => {
  const game = {
    id: generateUUID(),
    player1: player,
    player2: null,
    currentPlayerId: player.id,
    gameStatus: GameStatus.PENDING,
    number: generateNumer()
  }
  games.push(game);
  return game;
}

export const getAvailableGame = (): Game | undefined => {
  return games.find((x) => x.gameStatus === GameStatus.PENDING);
}

export const getGameById = (id: string): Game | undefined => {
  return games.find(x => x.id === id)
}

export const getGameByPlayerId = (playerId: string): Game | undefined => {
  return games.find(x => x.player1?.id === playerId || x.player2?.id === playerId);
}

export const flushGames = () => {
  games = [];
}

const generateNumer = (min: number = 1, max: number = 60): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}