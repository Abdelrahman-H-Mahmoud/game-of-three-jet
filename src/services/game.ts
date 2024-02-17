import { Game, GameStatus, Player } from "../types";
import { generateNumer } from "../utils/generateNumber";
import { generateUUID } from "../utils/uuid";

let games: Game[] = []

export const assignToGame = (player: Player) => {
  const game = getAvailableGame();
  if (!game) {
    const game = createGame(player);
    return game;
  }
  game.players.push(player);

  return game;
}

//A game to be created need at least one player
export const createGame = (player: Player): Game => {
  const game = {
    id: generateUUID(),
    players: [player],
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
  return games.find(x => x.players.find((p) => p.id === playerId));
}

export const changeGameStatus = (game: Game, newStatus: GameStatus) => {
  game.gameStatus = newStatus;
}

export const flushGames = () => {
  games = [];
}
