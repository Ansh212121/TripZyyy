'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { BookingCard } from '@/components/BookingCard';
import { Card } from '@/components/ui/card';
import { Loader } from '@/components/Loader';

const FILTERS = [
  { label: 'All Bookings', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted/Declined', value: 'other' },
];

export default function MyBookingsPage() {
  const { isSignedIn, isLoaded, userId } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/bookings');
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const data = await res.json();
      setBookings(data.filter((b) => b.passenger?.clerkId === userId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchBookings();
    }
  }, [isLoaded, isSignedIn, fetchBookings]);

  if (!isLoaded || loading) return <Loader />;
  if (!isSignedIn) {
    router.push('/sign-in');
    return <Loader />;
  }

  let filteredBookings = bookings;
  if (filter === 'pending') {
    filteredBookings = bookings.filter((b) => b.status === 'pending');
  } else if (filter === 'other') {
    filteredBookings = bookings.filter((b) => b.status === 'accepted' || b.status === 'declined');
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold mt-8 mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#1e90ff] via-[#00bfae] to-[#1e90ff] text-center drop-shadow-lg">
          Your Booked Journeys
        </h1>
        <p className="text-lg text-blue-200 text-center mb-10 font-medium">
          Every adventure starts with a booking! Track your rides, check their status, and get ready to hit the road. 🚗✨
        </p>
        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-5 py-2 rounded-lg font-semibold transition-colors focus:outline-none border-2 border-transparent
                ${filter === f.value
                  ? 'bg-gradient-to-r from-[#1e90ff] to-[#00bfae] text-white border-[#00bfae] shadow-lg'
                  : 'bg-[#16213a] text-blue-200 hover:bg-[#1e90ff]/10 border-[#1e90ff]'}
              `}
            >
              {f.label}
            </button>
          ))}
        </div>
        {filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <h2 className="text-2xl font-bold text-white mb-2">No bookings yet</h2>
            <p className="text-blue-200 mb-6 text-center max-w-md">
              {filter === 'all'
                ? "You haven't booked any rides yet. Start exploring available rides and book your next journey!"
                : filter === 'pending'
                ? "No pending bookings at the moment."
                : "No accepted or declined bookings at the moment."}
            </p>
            <a
              href="/rides"
              className="inline-block bg-gradient-to-r from-[#1e90ff] to-[#00bfae] text-white font-semibold py-2 px-6 rounded-lg shadow hover:from-[#00bfae] hover:to-[#1e90ff] transition-colors text-center"
            >
              Find a Ride
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {filteredBookings.map((booking) => (
              <Card
                key={booking._id}
                className="w-full bg-[#1a233a] border-0 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 p-6 rounded-2xl flex flex-col gap-3 h-fit"
              >
                <BookingCard booking={booking} showRiderEmail={filter === 'other'} />
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold self-start ${
                    booking.status === 'pending'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : booking.status === 'accepted'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {booking.status}
                </span>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
