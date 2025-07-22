'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Calendar, Clock, Users, Plus } from 'lucide-react';
import { Loader } from '@/components/Loader';

export default function MyRides() {
  const { isSignedIn, isLoaded, userId } = useAuth();
  const router = useRouter();
  const [rides, setRides] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchData();
    }
    // eslint-disable-next-line
  }, [isLoaded, isSignedIn, userId]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const ridesRes = await fetch('/api/rides');
      if (!ridesRes.ok) throw new Error('Failed to fetch rides');
      const ridesData = await ridesRes.json();
      const myRides = ridesData.filter((r: any) => r.driver?.clerkId === userId);
      setRides(myRides);
      // Fetch bookings for these rides
      const bookingsRes = await fetch('/api/bookings');
      if (!bookingsRes.ok) throw new Error('Failed to fetch bookings');
      const bookingsData = await bookingsRes.json();
      setBookings(bookingsData.filter((b: any) => myRides.some((r: any) => r._id === b.ride?._id)));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = async (bookingId: string, action: 'accept' | 'decline') => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action === 'accept' ? 'accepted' : 'declined' }),
      });
      if (!res.ok) throw new Error('Failed to update booking');
      fetchData();
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  if (!isLoaded || loading) {
    return <Loader />;
  }
  if (!isSignedIn) {
    router.push('/sign-in');
    return <Loader />;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }

  // Map bookings to rides
  const ridesWithRequests = rides.map((ride) => ({
    ...ride,
    bookingRequests: bookings.filter((b) => b.ride?._id === ride._id),
  }));

  // All booking requests for my rides that are pending
  const pendingRequests = bookings.filter((b) => b.status === 'pending');
  // Optionally, accepted/declined requests
  const acceptedDeclinedRequests = bookings.filter((b) => b.status === 'accepted' || b.status === 'declined');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-[#1a233a] to-[#003366] relative overflow-x-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{background: 'radial-gradient(ellipse at 60% 10%, rgba(30,144,255,0.08) 0%, transparent 70%), radial-gradient(ellipse at 20% 80%, rgba(0,191,174,0.07) 0%, transparent 70%)'}} />
      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <h1 className="mt-12 text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#1e90ff] via-[#00bfae] to-[#1e90ff] text-center drop-shadow-lg">My Rides</h1>
        <div className="w-24 h-1 mx-auto mb-8 rounded-full bg-gradient-to-r from-[#1e90ff] via-[#00bfae] to-[#1e90ff]" />
        <Tabs defaultValue="posted" className="space-y-6">
          <TabsList className="mb-6">
            <TabsTrigger value="posted">Posted Rides ({ridesWithRequests.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending Requests ({pendingRequests.length})</TabsTrigger>
            <TabsTrigger value="other">Accepted/Declined ({acceptedDeclinedRequests.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="posted">
            {ridesWithRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <h2 className="text-2xl font-bold text-white mb-2">No rides posted yet</h2>
                <p className="text-blue-200 mb-6 text-center max-w-md">You haven't posted any rides yet. Share your journey and help others reach their destination!</p>
                <a href="/post-ride" className="inline-block bg-gradient-to-r from-[#1e90ff] to-[#00bfae] text-white font-semibold py-2 px-6 rounded-lg shadow hover:from-[#00bfae] hover:to-[#1e90ff] transition-colors text-center">
                  Post a Ride
                </a>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {ridesWithRequests.map((ride) => (
                  <Card key={ride._id} className="bg-[#1a233a] border-0 shadow-xl hover:shadow-2xl hover:scale-[1.025] transition-transform duration-200 border-gradient-to-r from-[#1e90ff] to-[#00bfae] p-6 rounded-2xl relative">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-semibold text-[#1e90ff]">{ride.origin}</span>
                        <span className="text-lg font-semibold text-[#00bfae]">{ride.destination}</span>
                      </div>
                      <div className="text-blue-100 mb-2">
                        <span className="mr-4">{ride.date}</span>
                        <span>{ride.time}</span>
                      </div>
                      <div className="text-blue-200 mb-2">Seats: {ride.availableSeats}</div>
                      <div className="text-blue-200 mb-2">Price: ₹{ride.price}</div>
                      {ride.description && (
                        <div className="text-blue-300 text-sm mb-2">{ride.description}</div>
                      )}
                    </div>
                    {/* Booking requests UI */}
                    <div className="mt-4">
                      <h2 className="text-lg font-semibold text-white mb-2">Booking Requests</h2>
                      {ride.bookingRequests && ride.bookingRequests.length > 0 ? (
                        <ul className="space-y-2">
                          {ride.bookingRequests.map((booking: any) => (
                            <li key={booking._id} className="bg-[#101c2c] rounded-lg p-3 flex items-center justify-between border border-[#1e90ff]/10">
                              <span className="text-blue-100">{booking.passenger?.name || 'Unknown'}</span>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ml-2 ${booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : booking.status === 'accepted' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{booking.status}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-blue-300">No booking requests yet.</div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="pending">
            <div className="grid md:grid-cols-2 gap-8">
              {pendingRequests.length > 0 ? (
                pendingRequests.map((booking: any) => (
                  <Card key={booking._id} className="bg-[#16213a] rounded-2xl shadow-xl p-6 border border-[#1e293b]/20">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">
                        {booking.ride?.origin} → {booking.ride?.destination}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-blue-100 mb-2">
                        <span className="mr-4">{booking.ride?.date}</span>
                        <span>{booking.ride?.time}</span>
                      </div>
                      <div className="text-blue-200 mb-2">Seats Requested: {booking.seatsBooked}</div>
                      <div className="text-blue-200 mb-2">Passenger: {booking.passenger?.name || 'Unknown'}</div>
                      <span className="px-2 py-1 rounded text-xs font-semibold ml-2 bg-yellow-500/20 text-yellow-400">pending</span>
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => handleBookingAction(booking._id, 'accept')}
                          className="bg-gradient-to-r from-[#1e90ff] to-[#00bfae] text-white px-3 py-1 rounded shadow hover:from-[#00bfae] hover:to-[#1e90ff] hover:shadow-lg transition-colors flex items-center gap-2"
                        >
                          <Users className="h-4 w-4" /> Accept
                        </button>
                        <button
                          onClick={() => handleBookingAction(booking._id, 'decline')}
                          className="bg-[#222f43] text-red-400 px-3 py-1 rounded hover:bg-[#1e293b] transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="p-12 text-center bg-[#16213a] border-none">
                  <p className="text-blue-200 text-lg">No pending booking requests at the moment.</p>
                </Card>
              )}
            </div>
          </TabsContent>
          <TabsContent value="other">
            <div className="grid md:grid-cols-2 gap-8">
              {acceptedDeclinedRequests.length > 0 ? (
                acceptedDeclinedRequests.map((booking: any) => (
                  <Card key={booking._id} className="bg-[#16213a] rounded-2xl shadow-xl p-6 border border-[#1e293b]/20">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">
                        {booking.ride?.origin} → {booking.ride?.destination}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-blue-100 mb-2">
                        <span className="mr-4">{booking.ride?.date}</span>
                        <span>{booking.ride?.time}</span>
                      </div>
                      <div className="text-blue-200 mb-2">Seats Requested: {booking.seatsBooked}</div>
                      <div className="text-blue-200 mb-2">
                        Passenger: {booking.passenger?.name || 'Unknown'}
                      </div>
                      {booking.passengerEmail && (
                        <div className="text-blue-200 mb-2 text-xs">Passenger Email: {booking.passengerEmail}</div>
                      )}
                      <span className={`px-2 py-1 rounded text-xs font-semibold ml-2 ${booking.status === 'accepted' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{booking.status}</span>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="p-12 text-center bg-[#16213a] border-none">
                  <p className="text-blue-200 text-lg">No accepted or declined booking requests at the moment.</p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}