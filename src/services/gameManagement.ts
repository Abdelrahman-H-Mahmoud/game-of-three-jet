import { config } from "../config";
import { Game, GameState, GameStatus } from "../types";
import { assignToGame, changeGameStatus, getGameById, getGameByPlayerId } from "./game";
import { GAME_EVENTS, notifyPlayer } from "./gameNotification";
import { createPlayer } from "./player"
import { calculate, getNextPlayerTurn, isGameFinished } from "./utils";

export const startGame = (email: string): GameState => {
  const player = createPlayer(email);
  const game = assignToGame(player);
  if (game.players.length === config.numberOfPlayersPerGame) {
    changeGameStatus(game, GameStatus.IN_PROGRESS);
    game.players.forEach(p => {
      notifyPlayer(game.id, p.id, GAME_EVENTS.STARTED, { number: game.number, isTurn: game.currentPlayerId === p.id })
    });
  }
  return { playerId: player.id, gameId: game.id, number: game.number, gameStatus: game.gameStatus, isTurn: game.currentPlayerId === player.id }
}

export const makeMove = (number: number, gameId: string, playerId: string): GameState | null => {
  const game = getGameById(gameId);
  if (!game) {
    return null
  }
  if (game?.currentPlayerId === playerId) {
    game.number = calculate(game.number, number);
    isGameFinished(game.number) ? handleGameFinished(game) : handleNextPlayerTurn(game)
  }
  return {
    playerId,
    gameId: game.id,
    number: game.number,
    gameStatus: game.gameStatus,
    isTurn: game.currentPlayerId === playerId
  }
}

export const getGameState = (playerId: string): GameState | null => {
  const game = getGameByPlayerId(playerId);
  if (!game) {
    return null;
  }
  return {
    playerId,
    gameId: game.id,
    number: game.number,
    gameStatus: game.gameStatus,
    isTurn: game.currentPlayerId === playerId,
    winnerId: game.winnerId
  }
}

const handleNextPlayerTurn = (game: Game) => {
  const curretPlayerTurn = getNextPlayerTurn(game.players, game.currentPlayerId as string);
  if (curretPlayerTurn) {
    game.currentPlayerId = curretPlayerTurn.id
    notifyPlayer(game.id, curretPlayerTurn.id, GAME_EVENTS.TURN, {
      number: game.number
    })
  }
}

const handleGameFinished = (game: Game) => {
  const winnerId = game.currentPlayerId as string;
  game.currentPlayerId = null;
  changeGameStatus(game, GameStatus.FINISHED);
  game.winnerId = winnerId;
  game.players.forEach(p => {
    notifyPlayer(game.id, p.id, GAME_EVENTS.FINISHED, { number: game.number, isWinner: p.id === game.winnerId })
  });
}
