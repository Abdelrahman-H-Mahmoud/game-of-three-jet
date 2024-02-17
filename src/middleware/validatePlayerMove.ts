import { Request, Response, NextFunction } from "express";
import { config } from "../config";

export const validatePlayerMove = (req: Request, res: Response, next: NextFunction) => {
  if (!config.allowedNumber.includes(req.body?.number)) {
    return res.status(400).json({ message: "Invalid Number" })
  }
  return next();
}