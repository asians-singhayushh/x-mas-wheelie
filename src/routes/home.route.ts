import { Router } from 'express';
import { renderHomePage } from '../controllers/home.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', isAuthenticated, renderHomePage);

export default router;
