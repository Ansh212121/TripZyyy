import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// GET: Fetch all users
export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({}).sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// POST: Create a new user
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { name, email, avatar, phone } = await req.json();
    if (!name || !email) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    const user = await User.create({ name, email, avatar, phone });
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Delete all users (for demo/testing)
export async function DELETE() {
  try {
    await dbConnect();
    await User.deleteMany({});
    return NextResponse.json({ message: 'All users deleted.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 