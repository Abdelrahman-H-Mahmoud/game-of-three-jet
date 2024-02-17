import { Router, Request, Response } from "express";
import { getGameState, makeMove, startGame } from "../services/gameManagement";
import { getNotificationUrl } from "../services/notification";

const gameRouter = Router();

gameRouter.post("/start", (req: Request, res: Response) => {
  const { email } = req.body;
  const gameState = startGame(email);
  return res.json({ state: gameState, joinLink: getNotificationUrl(gameState.gameId,gameState.playerId) });
});

gameRouter.post("/move/:gameId/player/:playerId", (req: Request, res: Response) => {
  const { number } = req.body;
  const { gameId, playerId } = req.params;
  const move = makeMove(number, gameId, playerId);
  res.json(move);
})


gameRouter.get('/:playerId', (req: Request, res: Response) => {
  const gameState = getGameState(req.params.playerId);
  return res.json({ state: gameState, joinLink: gameState ? getNotificationUrl(gameState.gameId,gameState.playerId) : null });
})

export default gameRouter;