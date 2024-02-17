import { config } from "../../src/config"
import { GAME_EVENTS, flushSubscribers, getNotificationUrl, getPlayerConnection, sendMessage, subscribeToGameChanges } from "../../src/services/gameNotification"

describe("Game Notification Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    flushSubscribers();
  });
  const [gameId, playerId] = ["abcd", "abcd"];
  const req: any = {
    id: 1,
    on: jest.fn()
  }
  const res: any = {
    writeHead: jest.fn(),
    write: jest.fn(),
    end: jest.fn()
  }
  describe("getNotificationUrl", () => {
    it("should return notifcation url", () => {
      const url = getNotificationUrl('abcd', 'abcd')
      expect(url).toMatch(`${config.notificationURL}/abcd/player/abcd`);
    })
  })
  describe("getPlayerConnection", () => {
    it("should return null if no connection", () => {
      expect(getPlayerConnection(gameId, playerId)).toBeNull();
    })
  });

  describe("subscribeToGameChanges", () => {

    it("should subscribe to game changes", () => {
      subscribeToGameChanges(gameId, playerId, req, res);
      expect(res.writeHead).toBeCalledTimes(1);
      expect(res.writeHead).toBeCalledWith(200, {
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
      });
      expect(req.on).toBeCalledTimes(1);
      expect(getPlayerConnection(gameId, playerId)).toMatchObject({
        request: req,
        response: res
      })
    })

    it("should refresh player connection and end old one", () => {
      subscribeToGameChanges(gameId, playerId, req, res);
      const newReq: any = {
        id: 2,
        on: jest.fn()
      };

      subscribeToGameChanges(gameId, playerId, newReq, res);
      expect(getPlayerConnection(gameId, playerId)).toMatchObject({
        request: newReq,
        response: res
      })

    })
  });
  describe("sendMessage", () => {
    it("should send message with specfic format", () => {
      const data = { name: 'test' };
      sendMessage(res, GAME_EVENTS.JOINED, data);
      expect(res.write).toBeCalledTimes(1);
      expect(res.write).toBeCalledWith(`event: JOINED\ndata: ${JSON.stringify(data)}\n\n`)
    })
  })
})