import { Router, Request, Response, NextFunction } from "express";
import { subscribeToGameChanges } from "../services/gameNotification";

const subscribeRouter = Router();


export const handleGameSubcribation = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { gameId, playerId } = req.params
    subscribeToGameChanges(gameId, playerId, req, res);
  }
  catch (err) {
    next(err);
  }
}

subscribeRouter.get("/:gameId/player/:playerId",handleGameSubcribation)


export default subscribeRouter;