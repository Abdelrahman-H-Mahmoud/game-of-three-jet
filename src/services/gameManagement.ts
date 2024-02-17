import { config } from "../config";
import { GameState, GameStatus, Player } from "../types";
import { assignToGame, changeGameStatus, getGameById, getGameByPlayerId } from "./game";
import { GAME_EVENTS, notifyPlayer } from "./gameNotification";
import { createPlayer } from "./player"

export const startGame = (email: string): GameState => {
  const player = createPlayer(email);
  const game = assignToGame(player);
  if (game.players.length === config.numberOfPlayersPerGame) {
    changeGameStatus(game, GameStatus.IN_PROGRESS);
    game.players.forEach(p => {
      notifyPlayer(game.id, p.id, GAME_EVENTS.STARTED, { number: game.number })
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
    if (isGameFinished(game.number)) {
      game.currentPlayerId = null;
      changeGameStatus(game,GameStatus.FINISHED);
      game.winnerId = playerId;
      game.players.forEach(p => {
        notifyPlayer(game.id, p.id, GAME_EVENTS.FINISHED, { number: game.number, isWinner: p.id === game.winnerId })
      });
    }
    else {
      game.currentPlayerId = getNextPlayerTurn(game.players, game.currentPlayerId).id
      notifyPlayer(gameId, game.currentPlayerId ?? "", GAME_EVENTS.TURN, { number: game.number })
    }
  }
  return {
    playerId,
    gameId: game.id,
    number: game.number,
    gameStatus: game.gameStatus,
    isTurn: game.currentPlayerId === playerId
  }
}

export const getNextPlayerTurn = (players: Player[], currentPlayerId: string): Player => {
  const index = players.findIndex(p => p.id === currentPlayerId);
  return index === players.length - 1 ? players[0] : players[index + 1];
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

const isGameFinished = (number: number) => {
  return number <= 1;
}

const calculate = (currentGameNumber: number, playerMove) => {
  currentGameNumber += playerMove;
  return Math.floor(currentGameNumber / 3);
}