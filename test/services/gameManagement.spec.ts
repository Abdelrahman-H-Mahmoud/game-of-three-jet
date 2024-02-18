import { flushGames } from "../../src/services/game";
import { getGameState, makeMove, startGame } from "../../src/services/gameManagement";
import { flushPlayers } from "../../src/services/player";
import { GameStatus } from "../../src/types";
import * as notificationService from "../../src/services/gameNotification"
import { config } from "../../src/config";
jest.mock("../../src/utils/generateNumber", () => {
  return {
    generateNumer: () => 5
  }
});

jest.mock("../../src/services/gameNotification");

describe("Game Management Service", () => {
  const mockedConfig = {
    ...config
  };
  mockedConfig.numberOfPlayersPerGame = 2;
  const { numberOfPlayersPerGame } = mockedConfig
  beforeEach(() => {
    flushGames();
    flushPlayers();
    jest.clearAllMocks();
  })
  describe("startGame", () => {
    beforeEach(() => {

    })
    const notifyGameStartedSpy = jest.spyOn(notificationService, "notifyPlayer");
    it("should start a game with state pending if number of player less than the configuration", () => {
      const gameState = startGame('test@mail.com');
      expect(gameState.gameStatus).toBe(GameStatus.PENDING);
      expect(gameState.isTurn).toBe(true);
    });

    it("should start a game with state in progress number of player same as configuration", () => {
      startGame("test@gmail.com");
      const gameState = startGame('test2@mail.com');
      expect(gameState.gameStatus).toBe(GameStatus.IN_PROGRESS);
      expect(gameState.isTurn).toBe(false);
      expect(notifyGameStartedSpy).toBeCalledTimes(numberOfPlayersPerGame)
    });
  });

  describe("getGameState", () => {
    it("should return null if no game found", () => {
      expect(getGameState("abcd")).toBeNull();
    })

    it("should return game state if found", () => {
      const gameState = startGame('test@mail.com');
      expect(getGameState(gameState.playerId)).toMatchObject(gameState);
    })
  });

  describe("makeMove", () => {

    it("should return null if no game found", () => {
      expect(makeMove(5, "abc", "abc")).toBeNull();
    })

    it("should return updated state after the move", () => {
      const [u1, u2] = [startGame("test@mail.com"), startGame("test2@mail.com")];

      const firstMove = makeMove(1, u1.gameId, u1.playerId);
      expect(firstMove?.gameStatus).toEqual(GameStatus.IN_PROGRESS);
      expect(firstMove?.isTurn).toBe(false);

      const gameStatePlayer2 = getGameState(u2.playerId);
      expect(gameStatePlayer2?.gameStatus).toEqual(GameStatus.IN_PROGRESS);
      expect(gameStatePlayer2?.isTurn).toBe(true);
    });

    it("should change game state to finished if there is a winner", () => {
      const [u1, u2] = [startGame("test@mail.com"), startGame("test2@mail.com")];

      makeMove(1, u1.gameId, u1.playerId);
      makeMove(1, u2.gameId, u2.playerId);
      const gameStatePlayer2 = getGameState(u2.playerId);

      expect(gameStatePlayer2?.gameStatus).toEqual(GameStatus.FINISHED);
      expect(gameStatePlayer2?.isTurn).toBe(false);
      expect(gameStatePlayer2?.winnerId).toBe(u2.playerId);
      expect(gameStatePlayer2?.winnerId).not.toBe(u1.playerId);

      // 2 times when making move & 2 times when to notify game finished
      expect(notificationService.notifyPlayer).toBeCalledTimes(4);

    })
  })
})