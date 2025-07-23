import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import User from '@/models/User';

// GET: Fetch all bookings
export async function GET() {
  try {
    await dbConnect();
    const bookings = await Booking.find({})
      .populate({
        path: 'ride',
        populate: { path: 'driver', select: 'name email avatar phone' }
      })
      .populate({ path: 'passenger', select: 'clerkId name email avatar phone' })
      .sort({ createdAt: -1 });
    const bookingsWithEmails = bookings.map((booking: any) => {
      let riderEmail = null;
      let passengerEmail = null;
      let riderPhone = null;
      if (booking.status === 'accepted') {
        riderEmail = booking.ride?.driver?.email || null;
        passengerEmail = booking.passenger?.email || null;
        riderPhone = booking.ride?.driver?.phone || null;
      }
      // Calculate totalCost
      const ridePrice = booking.ride?.price || 0;
      const totalCost = booking.seatsBooked * ridePrice;
      // Ensure ride.price is included in the response
      const ride = booking.ride?.toObject ? { ...booking.ride.toObject(), price: ridePrice } : booking.ride;
      return {
        ...booking.toObject(),
        ride,
        totalCost,
        riderEmail,
        passengerEmail,
        riderPhone,
      };
    });
    return NextResponse.json(bookingsWithEmails);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// POST: Create a new booking
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { ride, passenger, seatsBooked, status } = await req.json();
    if (!ride || !passenger || !seatsBooked) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    // Find the MongoDB user by Clerk ID
    const mongoUser = await User.findOne({ clerkId: passenger });
    if (!mongoUser) {
      return NextResponse.json({ error: 'User not found for booking.' }, { status: 400 });
    }
    const booking = await Booking.create({ ride, passenger: mongoUser._id, seatsBooked, status });
    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Delete all bookings (for demo/testing)
export async function DELETE() {
  try {
    await dbConnect();
    await Booking.deleteMany({});
    return NextResponse.json({ message: 'All bookings deleted.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 