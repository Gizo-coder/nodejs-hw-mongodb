import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import contactsRouter from './routes/contacts.js';

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
