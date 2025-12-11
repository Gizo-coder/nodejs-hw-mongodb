import mongoose from 'mongoose';

export async function initMongoConnection() {
  const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;

  if (!MONGODB_URL || !MONGODB_DB) {
    throw new Error('Missing MongoDB environment variables. Check .env');
  }

  let auth = '';
  if (MONGODB_USER) {
    const user = encodeURIComponent(MONGODB_USER);
    const pass = MONGODB_PASSWORD ? encodeURIComponent(MONGODB_PASSWORD) : '';
    auth = `${user}:${pass}@`;
  }

  const connectionString = `mongodb+srv://${auth}${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(connectionString);
    console.log('Mongo connection successfully established!');
  } catch (err) {
    console.error('Mongo connection error:', err);
    throw err;
  }
}
