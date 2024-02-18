import { NextFunction, Request, Response } from "express";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error", err.message, {
    path: req.path,
    params: req.params,
    body: req.body
  });
  res.status(500).json({ error: { message: "Something went wrong" } });
};
