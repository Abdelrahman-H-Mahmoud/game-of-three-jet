import { Router, Request, Response, NextFunction } from "express";
import { getGameState, makeMove, startGame } from "../services/gameManagement";
import { getNotificationUrl } from "../services/gameNotification";
import { validatePlayerMove, validatePlayerEmail } from "../middleware";

const gameRouter = Router();


export const handleStartGame = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const gameState = startGame(email);
    return res.json({ state: gameState, joinLink: getNotificationUrl(gameState.gameId, gameState.playerId) });
  }
  catch (err) {
    return next(err);
  }

}

export const handleMakeMove = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { number } = req.body;
    const { gameId, playerId } = req.params;
    const move = makeMove(number, gameId, playerId);
    if (!move) {
      return res.status(400).json({ message: "Invalid Game Or Player" });
    }
    return res.json(move);
  }
  catch (err) {
    return next(err);
  }

}

export const handleGameState = (req: Request, res: Response, next: NextFunction) => {
  try {
    const gameState = getGameState(req.params.playerId);
    return res.json({ state: gameState, joinLink: gameState ? getNotificationUrl(gameState.gameId, gameState.playerId) : null });
  }
  catch (err) {
    return next(err)
  }
}

gameRouter.post("/start", validatePlayerEmail, handleStartGame);

gameRouter.post("/move/:gameId/player/:playerId", validatePlayerMove, handleMakeMove)


gameRouter.get('/:playerId', handleGameState)


export default gameRouter;