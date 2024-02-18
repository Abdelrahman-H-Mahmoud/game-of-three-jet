import { handleGameSubcribation } from "../../src/routes/subsciber";
import { subscribeToGameChanges } from "../../src/services/gameNotification";


const mockedGameId = "g1";
const mockedPlayerId = "p1";


jest.mock("../../src/services/gameNotification");

describe("Game Subscription Route Handles", () => {
  const req: any = {
    body: {},
    params: {}
  }
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  }
  const next = jest.fn();

  beforeEach(() => {
    req.body = {};
    req.params = {};
    jest.clearAllMocks();
  })
  describe("handleGameSubcribation", () => {
    
    it("should subscribe to game", () => {
      req.params = {
        playerId: mockedPlayerId,
        gameId: mockedGameId
      }
      handleGameSubcribation(req, res, next);
      expect(subscribeToGameChanges).toBeCalledWith(mockedGameId, mockedPlayerId, req, res);
    });
    it("should call next function when error", () => {
      const error = new Error("Error");
      (subscribeToGameChanges as jest.Mock).mockImplementation(() => { throw error });

      handleGameSubcribation(req, res, next);

      expect(next).toBeCalledWith(error)
    });
  })

})