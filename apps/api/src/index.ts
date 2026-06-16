import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import authRouter from './routes/auth.js';
import mediaRouter from './routes/media.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || 'http://localhost:3000',
      'http://localhost:3001', // Admin local dev
    ],
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

// Health Check Route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Intelligen API is running smoothly' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`[server] API Server is running on port ${PORT}`);
});
export default app;
