import mongoose, { Schema, models } from 'mongoose';

const BookingSchema = new Schema({
  ride: { type: Schema.Types.ObjectId, ref: 'Ride', required: true },

  passenger: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  seatsBooked: { type: Number, required: true },

  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
}, 
{ timestamps: true, collection: 'riderequests' });

const Booking = models.Booking || mongoose.model('Booking', BookingSchema);

export default Booking; 