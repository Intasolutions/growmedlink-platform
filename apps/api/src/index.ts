import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import authRouter from './routes/auth.js';
import mediaRouter from './routes/media.js';
import servicesRouter from './routes/services.js';
import productsRouter from './routes/products.js';
import blogsRouter from './routes/blogs.js';
import pagesRouter from './routes/pages.js';
import enquiriesRouter from './routes/enquiries.js';
import settingsRouter from './routes/settings.js';
import usersRouter from './routes/users.js';
import dashboardRouter from './routes/dashboard.js';
import reviewsRouter from './routes/reviews.js';
import categoriesRouter from './routes/categories.js';
import { connectDatabase } from './config/database.js';

// Connect to Database
connectDatabase();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001'
      ];
      const isAllowed =
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.includes('growmedlink');
      
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(null, false); // Block other origins safely
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { message: 'Too many requests from this IP, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/media', mediaRouter);
app.use('/api/services', servicesRouter);
app.use('/api/products', productsRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/pages', pagesRouter);
app.use('/api/enquiries', enquiriesRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/users', usersRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/categories', categoriesRouter);

// Health Check Route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Intelligen API is running smoothly' });
});

// Global Error Handler to always return JSON instead of HTML
app.use((err: any, req: any, res: any, next: any) => {
  console.error('[Global Error Handler]', err);
  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: err.message, errors: err.errors });
  }
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`[server] API Server is running on port ${PORT}`);
});
export default app;
