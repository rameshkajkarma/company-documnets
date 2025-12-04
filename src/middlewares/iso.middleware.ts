import { Request, Response, NextFunction } from "express";

export const isoMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log("ISO Middleware Running");
  next();
};
