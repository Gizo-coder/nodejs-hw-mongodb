import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
    name: { type: String, required: true, minlength: 3, maxlength: 20 },
    email: { type: String, required: true, minlength: 3, maxlength: 20 },
    phone: { type: String, required: true, minlength: 3, maxlength: 20 },
    isFavourite: { type: Boolean, default: false },
    contactType: { type: String, enum: ["work", "home", "personal"], default: "personal" },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
