import { Request, Response } from 'express';

export const renderHomePage = (req: Request, res: Response) => {
  res.render('index', { title: 'Authenticated Home Page' });
};
