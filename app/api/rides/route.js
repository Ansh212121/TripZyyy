import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Ride from '@/models/Ride';
import User from '@/models/User';
import { getAuth } from '@clerk/nextjs/server';
import { users } from '@clerk/clerk-sdk-node';

// GET: Fetch all rides
export async function GET() {
  try {
    await dbConnect();
    const rides = await Ride.find({}).populate('driver').sort({ createdAt: -1 });
    // const now = new Date();
    // Filter rides where the combined date and time is in the future or today
    // const filteredRides = rides.filter((ride: any) => {
    //   if (!ride.date || !ride.time) return false;
    //   const rideDateTime = new Date(`${ride.date}T${ride.time}:00`);
    //   // If the ride is today, allow times >= now; if in the future, allow all
    //   const rideDate = new Date(ride.date);
    //   const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    //   if (rideDate.getTime() === today.getTime()) {
    //     // Same day: check time
    //     return rideDateTime >= now;
    //   } else {
    //     // Future date
    //     return rideDate > today;
    //   }
    // });
    // return NextResponse.json(filteredRides);
    return NextResponse.json(rides);
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// POST: Create a new ride
export async function POST(req) {
  try {
    await dbConnect();
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { origin, destination, date, time, availableSeats, price, description, phone } = await req.json();
    if (!origin || !destination || !date || !time || !availableSeats || !price) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    let mongoUser = await User.findOne({ clerkId: userId });
    if (!mongoUser) {
      // Fetch Clerk user data
      const clerkUser = await users.getUser(userId);
      console.log('Full Clerk user object:', JSON.stringify(clerkUser, null, 2));
      const email = clerkUser?.emailAddresses?.[0]?.emailAddress || 'unknown@example.com';
      const nameRaw =
        clerkUser?.firstName?.trim() ||
        clerkUser?.lastName?.trim() ||
        clerkUser?.username?.trim() ||
        clerkUser?.emailAddresses?.[0]?.emailAddress?.split('@')[0] ||
        'Unknown';
      const name = nameRaw?.trim() || 'Unknown';
      const userPayload = {
        clerkId: userId,
        name,
        email,
        avatar: clerkUser?.imageUrl || '',
      };
      console.log('📦 Final userPayload being sent to Mongo:', userPayload);
      // Try to find by email
      mongoUser = await User.findOne({ email });
      if (mongoUser) {
        // Link this MongoDB user to the Clerk user
        mongoUser.clerkId = userId;
        await mongoUser.save();
      } else {
        try {
          // Hard assertion: name must be a non-empty string
          if (!userPayload.name || typeof userPayload.name !== 'string' || !userPayload.name.trim()) {
            console.error('❌ About to create user with invalid name:', userPayload);
            userPayload.name = 'Unknown';
          }
          mongoUser = await User.create({
            clerkId: userId,
            name,
            email,
            avatar: clerkUser?.imageUrl || '',
            phone: phone || '',
          });
          console.log('Created MongoDB user:', mongoUser);
        } catch (userCreateError) {
          console.error('User.create failed:', JSON.stringify(userCreateError, null, 2));
          // Try to find an existing user by email as a fallback
          mongoUser = await User.findOne({ email });
          if (!mongoUser) {
            return NextResponse.json({ error: 'Failed to create or find user for ride posting.', details: userCreateError }, { status: 500 });
          }
        }
      }
    } else {
      // When creating or updating the user, set phone if provided
      if (phone && mongoUser.phone !== phone) {
        mongoUser.phone = phone;
        await mongoUser.save();
      }
    }
    const ride = await Ride.create({
      origin,
      destination,
      date,
      time,
      availableSeats,
      price,
      description,
      driver: mongoUser._id,
    });
    return NextResponse.json(ride, { status: 201 });
  } catch (error) {
    console.error('User creation or ride posting error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error', details: error }, { status: 500 });
  }
}

// DELETE: Delete all rides (for demo/testing)
export async function DELETE() {
  try {
    await dbConnect();
    await Ride.deleteMany({});
    return NextResponse.json({ message: 'All rides deleted.' });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 