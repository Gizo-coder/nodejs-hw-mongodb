import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
    name: { type: String, required: true, minlength: 3 },
    email: { type: String, required: true, maxlength: 50 },
    phone: { type: String, required: true, maxlength: 20 },
    isFavourite: { type: Boolean, default: false },
  contactType: { type: String, enum: ["work", "home", "personal"], default: "personal" },
  photo: { type: String,default: null,},
  },
  { timestamps: true }
  
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
