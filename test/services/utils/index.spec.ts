import { getNextPlayerTurn, isGameFinished } from "../../../src/services/utils"

describe("Utilities", () => {
  describe("isGameFinished", () => {
    it.each([0,1,-1])("should return true if number less than or equal 1",(number)=>{
      expect(isGameFinished(number)).toBe(true)
    });

    it("should return false if number is bigger than 1",()=>{
      expect(isGameFinished(2)).toBe(false);
    })
  })

  describe('getNextPlayerTurn', () => {
    const players:any = [
      { id: 'player1' },
      { id: 'player2' },
      { id: 'player3' },
    ];
  
    it('should return the first player when the current player is the last', () => {
      const nextPlayer = getNextPlayerTurn(players, 'player3');
      expect(nextPlayer?.id).toBe('player1');
    });
  
    it('should return the next player in the list', () => {
      const nextPlayer = getNextPlayerTurn(players, 'player1');
      expect(nextPlayer?.id).toBe('player2');
    });
  
    it('should handle a non-existent player ID', () => {
      expect(getNextPlayerTurn(players, 'invalid-player')).toBeNull()
    });
  
    it('should handle an empty players list', () => {
      expect(getNextPlayerTurn([], 'any-player')).toBeNull();
    });
  });
})