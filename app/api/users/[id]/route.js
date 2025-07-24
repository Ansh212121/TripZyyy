import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// GET: Fetch a single user by ID
export async function GET(_req, { params }) {
  try {
    await dbConnect();
    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// PUT: Update a user by ID
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const update = await req.json();
    const user = await User.findByIdAndUpdate(params.id, update, { new: true, runValidators: true });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Delete a user by ID
export async function DELETE(_req, { params }) {
  try {
    await dbConnect();
    const user = await User.findByIdAndDelete(params.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'User deleted' });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 