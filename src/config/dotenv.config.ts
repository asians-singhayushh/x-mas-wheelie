import dotenv from 'dotenv';

dotenv.config();

export const ION_PASSWORD = process.env.ION_PASSWORD || 'ion_default_password';
export const LUDWIG_PASSWORD = process.env.LUDWIG_PASSWORD || 'ludwig_default_password';
export const WIN_PASSWORD = process.env.WIN_PASSWORD || 'win_default_password';
export const MASTER_PASSWORD = process.env.MASTER_PASSWORD || 'master_default_password';
export const TOKEN_SECRET = process.env.TOKEN_SECRET || 'default_secret';
export const PORT = process.env.PORT || 3000;