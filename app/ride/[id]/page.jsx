'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader } from '@/components/Loader';

export default function RideDetails({ params }) {
  const { isSignedIn, isLoaded, userId } = useAuth();
  const router = useRouter();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [bookingError, setBookingError] = useState(null);

  useEffect(() => {
    fetchRide();
  }, [params.id]);

  const fetchRide = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/rides/${params.id}`);
      if (!res.ok) throw new Error('Ride not found');
      const data = await res.json();
      setRide(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }
    setIsBooking(true);
    setBookingError(null);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ride: ride._id,
          passenger: userId,
          seatsBooked: seatsToBook,
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Booking failed');
      }
      router.push('/my-bookings');
    } catch (error) {
      setBookingError(error.message);
    } finally {
      setIsBooking(false);
    }
  };

  if (!isLoaded || loading) return <Loader />;

  if (error || !ride) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-600 py-24">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 018 0v2m-4-4v4m-4 4h8a2 2 0 002-2v-5a2 2 0 00-2-2h-1.5a2 2 0 01-2-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v5a2 2 0 002 2H8a2 2 0 012 2v5a2 2 0 01-2 2z" />
        </svg>
        <h2 className="text-2xl font-bold text-white mb-2">This ride is no longer available or has expired.</h2>
        <p className="text-blue-200 mb-6 text-center max-w-md">The ride you are looking for may have already taken place or has been removed. Please browse available rides to find your next journey.</p>
        <a href="/rides" className="inline-block bg-gradient-to-r from-[#1e90ff] to-[#00bfae] text-white font-semibold py-2 px-6 rounded-lg shadow hover:from-[#00bfae] hover:to-[#1e90ff] transition-colors text-center">
          Find a Ride
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-[#003366] to-[#101c2c] text-white py-10">
      <div className="max-w-3xl mx-auto px-4">
        <Card className="bg-[#16213a] rounded-2xl shadow-xl p-8 border border-[#1e293b]/20">
          <h1 className="text-3xl font-bold mb-4 text-[#1e90ff]">{ride.origin} → {ride.destination}</h1>
          <div className="text-blue-100 mb-2">Date: {ride.date}</div>
          <div className="text-blue-100 mb-2">Time: {ride.time}</div>
          <div className="text-blue-200 mb-2">Seats Available: {ride.availableSeats}</div>
          <div className="text-blue-200 mb-2">Price: ₹{ride.price}</div>
          {ride.description && <div className="text-blue-300 text-sm mb-4">{ride.description}</div>}
          <form onSubmit={handleBooking} className="mt-6 space-y-4">
            <div>
              <label className="block text-blue-100 mb-1">Seats to Book</label>
              <input
                type="number"
                min={1}
                max={ride.availableSeats}
                value={seatsToBook}
                onChange={(e) => setSeatsToBook(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-lg bg-[#101c2c] text-white border border-[#1e90ff]/30 focus:border-[#1e90ff] focus:ring-2 focus:ring-[#1e90ff]/40 outline-none transition"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#1e90ff] to-[#00bfae] text-white font-semibold py-2 px-6 rounded-lg shadow hover:from-[#00bfae] hover:to-[#1e90ff] transition-colors"
              disabled={isBooking}
            >
              {isBooking ? 'Booking...' : 'Book Ride'}
            </button>
            {bookingError && <div className="text-red-400 text-center mt-2">{bookingError}</div>}
          </form>
        </Card>
      </div>
    </div>
  );
}
