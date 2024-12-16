import { Router } from 'express';
import { renderLogin, handleLogin, handleLogout } from '../controllers/auth.controller';

const router = Router();

router.get('/login', renderLogin);
router.post('/login', handleLogin);
router.get('/logout', handleLogout);

export default router;
