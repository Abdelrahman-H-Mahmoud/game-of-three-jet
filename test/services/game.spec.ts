import { assignToGame, createGame, flushGames, getAvailableGame, getGameById, getGameByPlayerId } from "../../src/services/game";
import { flushPlayers } from "../../src/services/player";
import { Game, GameStatus, Player } from "../../src/types";
import { generateUUID } from "../../src/utils/uuid";

jest.mock("../../src/utils/uuid", () => ({
  generateUUID: jest.fn(() => "fake-uuid"), // Mock UUID generation
}));

describe("Game Service", () => {
  beforeEach(() => {
    flushGames();
    flushPlayers();
  });

  describe("createGame", () => {
    it("should create a new game with correct properties", () => {
      const player: Player = { id: "player4", email: "Alice" };
      const game = createGame(player);

      expect(game.id).toBe("fake-uuid");
      expect(game.players[0]).toBe(player);
      expect(game.currentPlayerId).toBe(player.id);
      expect(game.gameStatus).toBe(GameStatus.PENDING);
      expect(typeof game.number).toBe("number");
    });
  });

  describe("getAvailableGame", () => {
    it("should return available game", () => {
      const player1: Player = { id: "player1", email: "John" };
      const game1 = assignToGame(player1);
      expect(getAvailableGame()).toMatchObject(game1);
    });

    it("should return undefined if no game created", () => {
      expect(getAvailableGame()).toBeUndefined();
    });

    it("should return undefined if no available game", () => {
      const player: Player = { id: "player3", email: "Mark" };
      const playe2: Player = { id: "player3", email: "Mark2" };
      assignToGame(player);
      assignToGame(playe2);
      expect(getAvailableGame()).toBeUndefined();
    });
  });

  describe("assignToGame", () => {
    it("should assign player to available game and return pending if one player", () => {
      const player: Player = { id: "player1", email: "John Doe" };
      const assignedGame = assignToGame(player);
      expect(assignedGame.gameStatus).toBe(GameStatus.PENDING);
    });

    it("should assign players to available game and return inProgress", () => {
      const player: Player = { id: "player1", email: "Jane Doe" };
      const player2: Player = { id: "player2", email: "Jane" };
      const assignedGame = assignToGame(player);
      const assignedGame2 = assignToGame(player2);
      expect(assignedGame).not.toBeUndefined();
      expect(assignedGame.id).toEqual(assignedGame2.id);
      expect(assignedGame.gameStatus).toBe(GameStatus.IN_PROGRESS);
    });
  });

  describe("getGameById", () => {
    it("should return game by ID", () => {
      const player: Player = { id: "player4", email: "Alice" };
      const game = createGame(player);

      expect(getGameById(game.id)?.id).toBe(game.id);
    });

    it("should return undefined for non-existent ID", () => {
      expect(getGameById("invalid-id")).toBeUndefined();
    });
  });

  describe("getGameByPlayerId", () => {
    it("should return game where player is player id", () => {
      const player: Player = { id: "player5", email: "Bob" };
      const game = createGame(player);

      expect(getGameByPlayerId(player.id)?.id).toBe(game.id);
    });

    it("should return game if there is multiple player", () => {
      let game: Game;
      const player1: Player = { id: "player6", email: "Charlie" };
      const player2: Player = { id: "player7", email: "David" };
      game = assignToGame(player1);

      expect(game.players.length).toBe(1);

      game = assignToGame(player2);
      const foundedGame = getGameByPlayerId(player1.id);
      expect(game?.id).toBe(foundedGame?.id);
    });
    
    it("should return undefined for non-existent ID", () => {
      expect(getGameByPlayerId("invalid-id")).toBeUndefined();
    });
  })

})

