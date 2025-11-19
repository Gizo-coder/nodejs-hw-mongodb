import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { 
      type: String,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
    },
    isFavourite: { type: Boolean, default: false },
    contactType: { 
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

export const Contact = mongoose.model('Contact', contactSchema);
