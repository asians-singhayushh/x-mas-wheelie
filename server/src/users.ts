import dotenv from 'dotenv';

dotenv.config();

const users = [
  { username: 'ion', password: process.env.PASSWORD_ION },
  { username: 'ludwig', password: process.env.PASSWORD_LUDWIG },
  { username: 'win', password: process.env.PASSWORD_WIN },
  { username: 'sophie', password: process.env.PASSWORD_SOPHIE },
];

export const authenticate = (username: string, password: string) => {
  return users.some(user => user.username === username && user.password === password);
};
