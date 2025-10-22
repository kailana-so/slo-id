import { Request, Response, NextFunction } from 'express';

export const systemKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const systemKey = req.headers['x-system-key'] as string;
  const validSystemKey = process.env.NEXT_PUBLIC_X_SYSTEM_KEY;

  if (systemKey !== validSystemKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
};
