import { Request, Response } from 'express';
import { ION_PASSWORD, LUDWIG_PASSWORD, WIN_PASSWORD, MASTER_PASSWORD } from '../config/dotenv.config';
import { createToken } from '../lib/utils';

export const renderLogin = (req: Request, res: Response) => {
    res.render('login', { error: null });
};

export const handleLogin = (req: Request, res: Response) => {
    const { password } = req.body;

    let userIdentifier: string | null = null;

    // Check the password against the valid passwords
    if (password === ION_PASSWORD) {
        userIdentifier = 'ION';
    } else if (password === LUDWIG_PASSWORD) {
        userIdentifier = 'LUDWIG';
    } else if (password === WIN_PASSWORD) {
        userIdentifier = 'WINR';
    } else if (password === MASTER_PASSWORD) {
        userIdentifier = 'MASTER';
    }

    // If no match, render login with an error
    if (!userIdentifier) {
        return res.render('login', { error: 'Invalid password' });
    }

    // Generate a token with the user identifier
    const token = createToken({ identifier: userIdentifier });

    // Set token in a cookie
    res.cookie('token', token, { httpOnly: true, maxAge: 3 * 60 * 60 * 1000 }); // 3 hours
    res.redirect('/');
};

export const handleLogout = (req: Request, res: Response) => {
    res.clearCookie('token');
    res.redirect('/login');
};
