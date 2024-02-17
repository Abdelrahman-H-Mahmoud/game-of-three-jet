import { flushGames } from "../../src/services/game";
import { getGameState, makeMove, startGame } from "../../src/services/gameManagement";
import { flushPlayers } from "../../src/services/player";
import { GameStatus } from "../../src/types";

jest.mock("../../src/utils/generateNumber", () => {
  return {
    generateNumer: () => 5
  }
})
describe("Game Management Service", () => {
  beforeEach(() => {
    flushGames();
    flushPlayers();
  })
  describe("startGame", () => {
    it("should start a game with state pending if only one player", () => {
      const gameState = startGame('test@mail.com');
      expect(gameState.gameStatus).toBe(GameStatus.PENDING);
      expect(gameState.isTurn).toBe(true);
    });

    it("should start a game with state in progress if two players joined", () => {
      startGame("test@gmail.com")
      const gameState = startGame('test2@mail.com');
      expect(gameState.gameStatus).toBe(GameStatus.IN_PROGRESS);
      expect(gameState.isTurn).toBe(false);
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

    })
  })
})