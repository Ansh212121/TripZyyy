import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import User from '@/models/User';

// GET: Fetch a single booking by ID
export async function GET(_req, { params }) {
  try {
    await dbConnect();
    const booking = await Booking.findById(params.id)
      .populate({ path: 'ride', populate: { path: 'driver' } })
      .populate('passenger');
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    let riderEmail = null;
    let passengerEmail = null;
    if (booking.status === 'accepted') {
      riderEmail = booking.ride.driver.email;
      passengerEmail = booking.passenger.email;
    }
    return NextResponse.json({
      ...booking.toObject(),
      riderEmail,
      passengerEmail,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// PUT: Update a booking by ID
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const update = await req.json();
    const booking = await Booking.findByIdAndUpdate(params.id, update, { new: true, runValidators: true });
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Delete a booking by ID
export async function DELETE(_req, { params }) {
  try {
    await dbConnect();
    const booking = await Booking.findByIdAndDelete(params.id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Booking deleted' });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 