import { createPlayer, flushPlayers, isPlayerExists } from "../../src/services/player";

describe("Player Service", () => {

  describe('createPlayer', () => {
    afterEach(() => {
      flushPlayers(); // Reset players object for each test
    });
    it('should create a new player with unique ID', () => {
      const email = 'test@example.com';
      const player = createPlayer(email);
      expect(player).toBeDefined();
      expect(player.email).toBe(email);
      expect(player.id).toBeDefined();
      expect(player.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/); // Check for UUID format
      expect(isPlayerExists(email)).toBe(true);
    });

    it('should return existing player for same email', () => {
      const email = 'test@example.com';
      const player1 = createPlayer(email);
      const player2 = createPlayer(email);
      expect(player1).toEqual(player2);
    });
  });

  describe('isPlayerExists', () => {
    it('should return true for existing player', () => {
      const email = 'test@example.com';
      createPlayer(email);
      expect(isPlayerExists(email)).toBe(true);
    });

    it('should return false for non-existent player', () => {
      const email = 'unknown@example.com';
      expect(isPlayerExists(email)).toBe(false);
    });
  });
})