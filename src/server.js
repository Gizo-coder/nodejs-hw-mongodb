import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import contactsRouter from './routes/contacts.js';
import authRouter from './routes/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

export function setupServer() {
  const app = express();

  app.use(cors());

  app.use(express.json());

  app.use(cookieParser());  

  const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
  });

  app.use(pinoHttp({ logger }));

  app.use('/auth', authRouter);
  
  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler);
  
  app.use(errorHandler);

  return app;
}
