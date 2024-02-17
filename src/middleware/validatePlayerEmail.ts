import { Request, Response, NextFunction } from "express";
import { isValidEmail } from "../utils/isValidEmail";

export const validatePlayerEmail = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body?.email || !isValidEmail(req.body?.email)) {
    return res.status(400).json({ message: "Invalid Email" })
  }
  return next();
}