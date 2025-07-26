'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Loader } from '@/components/Loader';
import { MapPin, Calendar, Clock, Users, Plus } from 'lucide-react';
import { RideCard as SharedRideCard } from '@/components/RideCard';

const FILTERS = [
  { label: 'All Rides', value: 'all' },
  { label: 'Pending Requests', value: 'pending' },
  { label: 'Accepted/Declined', value: 'other' },
];

function RideCard({ ride, rideBookings, filter }) {
  // Determine status for the card (show the most relevant status among bookings)
  let status = 'no-requests';
  if (rideBookings.some(b => b.status === 'pending')) status = 'pending';
  else if (rideBookings.some(b => b.status === 'accepted')) status = 'accepted';
  else if (rideBookings.some(b => b.status === 'declined')) status = 'declined';

  const statusText = {
    'pending': 'Pending',
    'accepted': 'Confirmed',
    'declined': 'Declined',
    'no-requests': 'No Requests',
  };
  const statusColor =
    status === 'pending'
      ? 'text-yellow-600'
      : status === 'accepted'
      ? 'text-green-600'
      : status === 'declined'
      ? 'text-red-600'
      : 'text-blue-600';
  const statusBg =
    status === 'pending'
      ? 'bg-yellow-100'
      : status === 'accepted'
      ? 'bg-green-100'
      : status === 'declined'
      ? 'bg-red-100'
      : 'bg-blue-100';

  return (
    <Card className="w-full bg-[#1a233a] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm px-6 py-5 flex flex-col gap-3">
      {/* Header: Route */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 font-semibold text-lg text-white">
          <MapPin className="h-5 w-5 text-blue-400" />
          <span>{ride.origin}</span>
          <span className="mx-1 text-blue-200">➜</span>
          <span>{ride.destination}</span>
        </div>
      </div>
      {/* Status Row */}
      <div className="mt-1 mb-1">
        <span className={`px-3 py-1 rounded text-xs font-bold ${statusBg} ${statusColor}`}>{statusText[status]}</span>
      </div>
      {/* Details Row */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-blue-100 text-base">
        <span className="flex items-center gap-1"><Calendar className="h-4 w-4 text-blue-300" />{ride.date}</span>
        <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-blue-300" />{ride.time}</span>
        <span className="flex items-center gap-1"><Users className="h-4 w-4 text-blue-300" />{ride.availableSeats} seats</span>
        <span className="flex items-center gap-1"><span className="text-green-300 font-bold">₹{ride.price}</span> per seat</span>
      </div>
      {/* Divider */}
      <div className="border-t border-blue-900 my-2" />
      {/* Driver & Contact */}
      <div className="flex flex-col gap-1 text-blue-100 text-base">
        <span className="flex items-center gap-2"><span className="font-medium text-white">👤 Driver:</span> <span className="text-blue-100">You</span></span>
      </div>
      {/* Booking Requests */}
      <div className="mt-2">
        <span className="font-semibold text-blue-200">Booking Requests:</span>
        {rideBookings.length > 0 ? (
          <ul className="mt-1 space-y-1">
            {rideBookings.map((booking) => (
              <li key={booking._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-[#16213a] rounded-xl px-3 py-2 border border-[#1e90ff]/10 shadow-sm">
                <div className="flex flex-col gap-0.5">
                  <span className="text-blue-100 font-medium">{booking.passenger?.name || 'Unknown'}</span>
                  {filter === 'other' && booking.status === 'accepted' && booking.passenger?.email && (
                    <span className="text-xs text-green-300 font-semibold">{booking.passenger.email}</span>
                  )}
                  {filter === 'other' && booking.passenger?.phone && (
                    <span className="text-xs text-blue-300">{booking.passenger.phone}</span>
                  )}
                </div>
                <span className={`mt-1 sm:mt-0 px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : booking.status === 'accepted' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{booking.status}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-blue-300 mt-1">No booking requests yet.</div>
        )}
      </div>
      {/* Status at the bottom */}
      <div className="flex items-center mt-2">
        <span className={`flex items-center gap-2 font-bold text-base ${statusColor}`}>
          {status === 'accepted' && <span className="text-green-400 text-lg">🟢</span>}
          {status === 'pending' && <span className="text-yellow-400 text-lg">🟡</span>}
          {status === 'declined' && <span className="text-red-400 text-lg">🔴</span>}
          {statusText[status]}
        </span>
      </div>
    </Card>
  );
}

export default function MyRides() {
  const { isSignedIn, isLoaded, userId } = useAuth();
  const router = useRouter();
  const [rides, setRides] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const ridesRes = await fetch('/api/rides');
      if (!ridesRes.ok) throw new Error('Failed to fetch rides');
      const ridesData = await ridesRes.json();
      const myRides = ridesData.filter((r) => r.driver?.clerkId === userId);
      setRides(myRides);

      const bookingsRes = await fetch('/api/bookings');
      if (!bookingsRes.ok) throw new Error('Failed to fetch bookings');
      const bookingsData = await bookingsRes.json();
      setBookings(bookingsData.filter((b) => myRides.some((r) => r._id === b.ride?._id)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchData();
    }
  }, [isLoaded, isSignedIn, fetchData]);

  if (!isLoaded || loading) return <Loader />;
  if (!isSignedIn) {
    router.push('/sign-in');
    return <Loader />;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }

  // Filtering logic
  let filteredRides = rides;
  if (filter === 'pending') {
    filteredRides = rides.filter((ride) =>
      bookings.some((b) => b.ride?._id === ride._id && b.status === 'pending')
    );
  } else if (filter === 'other') {
    filteredRides = rides.filter((ride) =>
      bookings.some((b) => b.ride?._id === ride._id && (b.status === 'accepted' || b.status === 'declined'))
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold mt-8 mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#1e90ff] via-[#00bfae] to-[#1e90ff] text-center drop-shadow-lg">
          Your Posted Rides
        </h1>
        <p className="text-lg text-blue-200 text-center mb-10 font-medium">
          Share your journey, fill your seats, and make new friends along the way. Manage your rides and booking requests below! 🛣️🤝
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
        {filteredRides.length === 0 ? (
          <div className="text-blue-300 text-center mt-8">No rides found for this filter.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredRides.map((ride) => {
              const rideBookings = bookings.filter((b) => b.ride?._id === ride._id);
              return (
                <SharedRideCard key={ride._id} ride={ride} rideBookings={rideBookings} filter={filter} />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}