import mongoose, { Schema, models } from 'mongoose';

const RideSchema = new Schema({
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  availableSeats: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  driver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true, collection: 'trips' });

const Ride = models.Ride || mongoose.model('Ride', RideSchema);

export default Ride; 