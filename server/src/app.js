import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman) or any local dev port
      if (!origin || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.use((req, _res, next) => {
  if (req.url.startsWith('/api') || req.url.startsWith('/v1') || req.url.includes('health')) {
    console.log(`[API Request] ${req.method} ${req.url} (matched: ${req.headers['x-matched-path'] || 'direct'})`);
  }
  next();
});

app.get(['/health', '/api/health', '/v1/health', '/api/v1/health'], (_req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/v1', routes);
app.use('/v1', routes);
app.use(notFound);
app.use(errorHandler);

export default app;
