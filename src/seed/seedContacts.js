import 'dotenv/config';
import mongoose from 'mongoose';
import { Contact } from '../db/models/Contact.js';


const MONGO_URI = process.env.MONGO_URI;

const contactsSeed = [
  {
    name: "Yulia Shevchenko",
    phoneNumber: "+380000000001",
    email: "oleh1@example.com",
    isFavourite: false,
    contactType: "personal",
  },
  {
    name: "Dmytro Boyko",
    phoneNumber: "+380000000002",
    email: null,
    isFavourite: false,
    contactType: "personal",
  },
  {
    name: "Andriy Pavlenko",
    phoneNumber: "+380000000003",
    contactType: "home",
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

