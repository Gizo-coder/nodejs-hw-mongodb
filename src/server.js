import express from 'express';
import mongoose from 'mongoose';
import contactsRouter from './routes/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

export function setupServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  const logger = pino({
    level: process.env.LOG_LEVEL || 'info'
  });
  app.use(pinoHttp({ logger }));

  app.use('/contacts', contactsRouter);

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  return app;
}
