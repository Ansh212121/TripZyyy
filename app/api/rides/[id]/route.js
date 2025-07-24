import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Ride from '@/models/Ride';

// GET: Fetch a single ride by ID
export async function GET(_req, { params }) {
  try {
    await dbConnect();
    const ride = await Ride.findById(params.id).populate('driver');
    if (!ride) {
      return NextResponse.json({ error: 'Ride not found' }, { status: 404 });
    }
    return NextResponse.json(ride);
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// PUT: Update a ride by ID
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const update = await req.json();
    const ride = await Ride.findByIdAndUpdate(params.id, update, { new: true, runValidators: true });
    if (!ride) {
      return NextResponse.json({ error: 'Ride not found' }, { status: 404 });
    }
    return NextResponse.json(ride);
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Delete a ride by ID
export async function DELETE(_req, { params }) {
  try {
    await dbConnect();
    const ride = await Ride.findByIdAndDelete(params.id);
    if (!ride) {
      return NextResponse.json({ error: 'Ride not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Ride deleted' });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 