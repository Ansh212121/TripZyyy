import mongoose, { Schema, models } from 'mongoose';

const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String },
  phone: { type: String }, // New field for contact number
}, { timestamps: true });

const User = models.User || mongoose.model('User', UserSchema);

export default User; 