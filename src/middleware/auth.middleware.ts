import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from './error.middleware';

const jwtSecret = process.env.JWT_SECRET as string;

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    next(new ApiError(401, 'Access denied: No token provided'));
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    next(new ApiError(401, 'Access denied: No token provided'));
    return;
  }

  try {
    next();
  } catch (error) {
    next(new ApiError(401, 'Access denied: Token expired or invalid'))
    return;
  }
};