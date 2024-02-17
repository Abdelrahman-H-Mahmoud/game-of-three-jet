import { GameState, GameStatus, Player } from "../types";
import { assignToGame, getGameById, getGameByPlayerId } from "./game";
import { createPlayer } from "./player"

export const startGame = (email: string): GameState => {
  const player = createPlayer(email);
  const game = assignToGame(player);
  if (game.gameStatus === GameStatus.IN_PROGRESS) {
    //dispatch a notification for the first player that game started.
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
      game.gameStatus = GameStatus.FINISHED;
      game.winnerId = playerId;
    }
    else {
      game.currentPlayerId = (game.player1?.id === playerId ? game.player2?.id : game.player1?.id) || null
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