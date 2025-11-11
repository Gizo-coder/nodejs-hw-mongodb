import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { Contact } from '../db/models/Contact.js';

const contactsPath = path.resolve('src', 'seed', 'contacts.json');

async function runSeed() {
  const {
    MONGODB_USER,
    MONGODB_PASSWORD,
    MONGODB_URL,
    MONGODB_DB
  } = process.env;

  if (!MONGODB_USER || !MONGODB_PASSWORD || !MONGODB_URL || !MONGODB_DB) {
    console.error('Missing MongoDB env vars in .env');
    process.exit(1);
  }

  const connectionString = `mongodb+srv://${encodeURIComponent(
    MONGODB_USER
  )}:${encodeURIComponent(MONGODB_PASSWORD)}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const raw = fs.readFileSync(contactsPath);
    const contacts = JSON.parse(raw);


    const result = await Contact.insertMany(contacts);
    console.log(`Inserted ${result.length} contacts`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Seed error', err);
    process.exit(1);
  }
}

runSeed();
