import { handleStartGame, handleMakeMove } from "../../src/routes/game"
import { makeMove, startGame } from "../../src/services/gameManagement";
import { getNotificationUrl } from "../../src/services/gameNotification";


const mockedGameId = "g1";
const mockedPlayerId = "p1";



jest.mock("../../src/services/gameManagement");

jest.mock("../../src/services/gameNotification");

describe("Game Route Handlers", () => {
  const req: any = {
    body: {},
    params:{}
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
  describe("handleStartGame", () => {
    (startGame as jest.Mock).mockReturnValue({
      "playerId": mockedPlayerId,
      "gameId": mockedGameId,
      "number": 2,
      "gameStatus": "PENDING",
      "isTurn": true
    })
    it("should handle game start", () => {
      const email = "a@m.com"
      req.body.email = email
      handleStartGame(req, res,next);
      expect(startGame).toBeCalled()
      expect(startGame).toBeCalledWith(email);

      expect(getNotificationUrl).toBeCalled();
      expect(getNotificationUrl).toBeCalledWith(mockedGameId, mockedPlayerId)
    });
    it("should call next function when error", () => {
      const error = new Error("Error");
      (startGame as jest.Mock).mockImplementation(() => { throw error });

      handleStartGame(req, res, next);

      expect(next).toBeCalledWith(error)
    });
  })

  describe("handleMakeMove", () => {
    const mockedMove: any = {
      "playerId": mockedPlayerId,
      "gameId": mockedGameId,
      "number": 40,
      "gameStatus": "PENDING",
      "isTurn": true
    };
    it("should handle player move", () => {
      (makeMove as jest.Mock).mockReturnValue(mockedMove);
      const number = 1;
      req.body.number = number
      req.params ={
        gameId: mockedGameId,
        playerId: mockedPlayerId
      }
      handleMakeMove(req, res,next);
      expect(makeMove).toBeCalled()
      expect(makeMove).toBeCalledWith(number,mockedGameId,mockedPlayerId);
      expect(res.json).toBeCalledWith(mockedMove);

    });
    it("should return 400 in case of non-valid player/game id", () => {
      (makeMove as jest.Mock).mockReturnValue(null);
      const number = 1;
      req.body.number = number
      req.params ={
        gameId: mockedGameId,
        playerId: mockedPlayerId
      }
      handleMakeMove(req, res,next);
      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalled();
    });
    it("should call next function when error", () => {
      const error = new Error("Error");
      (makeMove as jest.Mock).mockImplementation(() => { throw error });
      handleMakeMove(req, res, next);
      expect(next).toBeCalledWith(error)
    });
  })
})