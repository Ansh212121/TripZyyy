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
        populate: { path: 'driver' }
      })
      .populate('passenger')
      .sort({ createdAt: -1 });
    return NextResponse.json(bookings);
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