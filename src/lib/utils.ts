import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config/dotenv.config';

export const createToken = (payload: object, expiresIn: string = '3h') => {
  return jwt.sign(payload, TOKEN_SECRET, { expiresIn });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, TOKEN_SECRET);
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
