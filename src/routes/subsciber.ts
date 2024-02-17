import { Router, Request, Response } from "express";
import { subscribeToGameChanges } from "../services/notification";

const subscribeRouter = Router();


subscribeRouter.get("/:gameId/player/:playerId", (req: Request, res: Response) => {
  const { gameId, playerId } = req.params
  subscribeToGameChanges(gameId, playerId, req, res);
})


export default subscribeRouter;