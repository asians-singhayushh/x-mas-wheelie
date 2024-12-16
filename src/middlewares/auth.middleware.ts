import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/utils';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if (!token) {
      return res.redirect('/login');
    }
  
    try {
      const decoded = verifyToken(token);
      res.locals.user = decoded;
      next();
    } catch (err) {
      return res.redirect('/login');
    }
  };