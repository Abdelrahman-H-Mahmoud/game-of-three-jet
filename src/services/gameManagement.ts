import { GameState, GameStatus } from "../types";
import { assignToGame, getGameById, getGameByPlayerId } from "./game";
import { notifyGameFinished, notifyGameStarted, notifyPlayerTurn } from "./notification";
import { createPlayer } from "./player"

export const startGame = (email: string): GameState => {
  const player = createPlayer(email);
  const game = assignToGame(player);
  if (game.gameStatus === GameStatus.IN_PROGRESS) {
    notifyGameStarted(game.id, game.player1?.id ?? "");
    notifyGameStarted(game.id, game.player2?.id ?? "");
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
      notifyGameFinished(game.id);
    }
    else {
      game.currentPlayerId = (game.player1?.id === playerId ? game.player2?.id : game.player1?.id) || null
      notifyPlayerTurn(gameId, game.currentPlayerId ?? "", game);
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