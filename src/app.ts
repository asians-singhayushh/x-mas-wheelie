import express from 'express';
import 'tsconfig-paths/register';
import cookieParser from 'cookie-parser';
import { PORT } from './config/dotenv.config';
import authRoutes from './routes/auth.route';
import homeRoutes from './routes/home.route';
import path from 'path';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use(authRoutes);
app.use(homeRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
