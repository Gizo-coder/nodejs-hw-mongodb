import dotenv from 'dotenv';
dotenv.config();

import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await initMongoConnection();
    const app = setupServer();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start app:', err);
    process.exit(1);
  }
}

start();
