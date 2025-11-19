import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Contact } from '../db/models/Contact.js';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const contactsSeed = [
  {
    name: "Gizem Demirci",
    phoneNumber: "555-123-4567",
    email: "gizdemirci91@gmail.com",
    isFavourite: true,
    contactType: "personal"
  },
  {
    name: "Onur Pınargözü",
    phoneNumber: "555-987-6543",
    email: "o.pinargozu@gmail.com",
    isFavourite: false,
    contactType: "work"
  },
  {
    name: "Mercan Deniz",
    phoneNumber: "555-111-2222",
    contactType: "personal"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    await Contact.deleteMany({});
    console.log("Existing contacts deleted");

    await Contact.insertMany(contactsSeed);
    console.log("Seed contacts inserted");

    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

seedDB();

