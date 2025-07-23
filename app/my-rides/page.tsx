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
        {/* Eco-impact card */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="bg-[#16213a] rounded-2xl shadow-xl p-6 flex flex-col items-center border border-[#1e90ff]/10">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400/30 to-[#1e90ff]/20 flex items-center justify-center mb-3 shadow">
              <svg width="48" height="48" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="30" cy="30" r="30" fill="#00bfae" fillOpacity="0.12"/>
                <path d="M30 45c-7 0-13-5.5-13-12.5C17 25 23 20 30 20s13 5 13 12.5C43 39.5 37 45 30 45z" fill="#1e90ff"/>
                <rect x="27" y="38" width="6" height="10" rx="2" fill="#00bfae"/>
              </svg>
            </div>
            <h2 className="text-xl font-extrabold text-green-400 mb-1 text-center drop-shadow">You're Making a Difference!</h2>
            <p className="text-blue-200 text-center font-medium max-w-lg mb-1">By sharing your rides, you're helping reduce carbon emissions and making travel greener for everyone.</p>
            <div className="flex items-center gap-2 text-green-400 font-bold text-base mt-2">
              <svg width="18" height="18" fill="none" viewBox="0 0 20 20"><path d="M10 2C6 2 2 6 2 10c0 4 4 8 8 8s8-4 8-8c0-4-4-8-8-8zm0 14.5c-3.6 0-6.5-2.9-6.5-6.5S6.4 3.5 10 3.5 16.5 6.4 16.5 10 13.6 16.5 10 16.5z" fill="#22c55e"/><path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-4a1 1 0 01-1-1V6a1 1 0 011-1z" fill="#22c55e"/></svg>
              <span>You've helped save <span className="text-emerald-300">{Math.max(1, ridesWithRequests.length * 2)}</span> trees!</span>
            </div>
          </div>
        </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                {ridesWithRequests.map((ride) => (
                  <Card key={ride._id} className="min-w-0 bg-gradient-to-br from-[#1a233a] via-[#16213a] to-[#101c2c] border-0 shadow-2xl hover:shadow-3xl hover:scale-[1.03] transition-transform duration-200 p-0 rounded-3xl overflow-hidden relative">
                    <div className="p-6 pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="flex items-center gap-2 text-xl font-bold text-[#1e90ff]"><MapPin className="h-5 w-5" />{ride.origin}</span>
                        <span className="flex items-center gap-2 text-xl font-bold text-[#00bfae]"><MapPin className="h-5 w-5 rotate-180" />{ride.destination}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-blue-100 mb-3">
                        <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{ride.date}</span>
                        <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{ride.time}</span>
                        <span className="flex items-center gap-1"><Users className="h-4 w-4" />{ride.availableSeats} seats</span>
                        <span className="flex items-center gap-1"><Plus className="h-4 w-4" />₹{ride.price}</span>
                      </div>
                      {ride.description && (
                        <div className="text-blue-300 text-sm mb-3 italic border-l-4 border-[#1e90ff] pl-3">{ride.description}</div>
                      )}
                    </div>
                    <div className="bg-[#101c2c]/80 px-6 py-4 border-t border-[#1e90ff]/10 rounded-b-3xl">
                      <h2 className="text-lg font-semibold text-white mb-3">Booking Requests</h2>
                      {ride.bookingRequests && ride.bookingRequests.length > 0 ? (
                        <ul className="space-y-2">
                          {ride.bookingRequests.map((booking: any) => (
                            <li key={booking._id} className="flex items-center justify-between bg-[#16213a] rounded-xl px-4 py-2 border border-[#1e90ff]/10 shadow-sm">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1e90ff]/30 to-[#00bfae]/30 flex items-center justify-center text-white font-bold text-lg">
                                  {booking.passenger?.name ? booking.passenger.name[0] : 'U'}
                                </div>
                                <span className="text-blue-100 font-medium">{booking.passenger?.name || 'Unknown'}</span>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ml-2 shadow-sm ${booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : booking.status === 'accepted' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{booking.status}</span>
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
                  <Card key={booking._id} className="bg-gradient-to-br from-[#16213a] via-[#1a233a] to-[#101c2c] rounded-3xl shadow-2xl p-0 border-0 overflow-hidden hover:shadow-3xl hover:scale-[1.03] transition-transform duration-200">
                    <div className="p-6 pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="flex items-center gap-2 text-xl font-bold text-[#1e90ff]"><MapPin className="h-5 w-5" />{booking.ride?.origin}</span>
                        <span className="flex items-center gap-2 text-xl font-bold text-[#00bfae]"><MapPin className="h-5 w-5 rotate-180" />{booking.ride?.destination}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-blue-100 mb-3">
                        <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{booking.ride?.date}</span>
                        <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{booking.ride?.time}</span>
                        <span className="flex items-center gap-1"><Users className="h-4 w-4" />{booking.seatsBooked} seats</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1e90ff]/30 to-[#00bfae]/30 flex items-center justify-center text-white font-bold text-lg">
                          {booking.passenger?.name ? booking.passenger.name[0] : 'U'}
                        </div>
                        <span className="text-blue-100 font-medium">{booking.passenger?.name || 'Unknown'}</span>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold shadow-sm bg-yellow-500/20 text-yellow-400">pending</span>
                      <div className="flex space-x-2 mt-4">
                        <button
                          onClick={() => handleBookingAction(booking._id, 'accept')}
                          className="bg-gradient-to-r from-[#1e90ff] to-[#00bfae] text-white px-4 py-2 rounded-xl shadow hover:from-[#00bfae] hover:to-[#1e90ff] hover:shadow-lg transition-colors flex items-center gap-2 font-semibold"
                        >
                          <Users className="h-4 w-4" /> Accept
                        </button>
                        <button
                          onClick={() => handleBookingAction(booking._id, 'decline')}
                          className="bg-[#222f43] text-red-400 px-4 py-2 rounded-xl hover:bg-[#1e293b] transition-colors font-semibold"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-12 text-center bg-[#16213a] border-none rounded-3xl">
                  <p className="text-blue-200 text-lg">No pending booking requests at the moment.</p>
                </Card>
              )}
            </div>
          </TabsContent>
          <TabsContent value="other">
            <div className="grid md:grid-cols-2 gap-8">
              {acceptedDeclinedRequests.length > 0 ? (
                acceptedDeclinedRequests.map((booking: any) => (
                  <Card key={booking._id} className="bg-gradient-to-br from-[#16213a] via-[#1a233a] to-[#101c2c] rounded-3xl shadow-2xl p-0 border-0 overflow-hidden hover:shadow-3xl hover:scale-[1.03] transition-transform duration-200">
                    <div className="p-6 pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="flex items-center gap-2 text-xl font-bold text-[#1e90ff]"><MapPin className="h-5 w-5" />{booking.ride?.origin}</span>
                        <span className="flex items-center gap-2 text-xl font-bold text-[#00bfae]"><MapPin className="h-5 w-5 rotate-180" />{booking.ride?.destination}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-blue-100 mb-3">
                        <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{booking.ride?.date}</span>
                        <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{booking.ride?.time}</span>
                        <span className="flex items-center gap-1"><Users className="h-4 w-4" />{booking.seatsBooked} seats</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1e90ff]/30 to-[#00bfae]/30 flex items-center justify-center text-white font-bold text-lg">
                          {booking.passenger?.name ? booking.passenger.name[0] : 'U'}
                        </div>
                        <span className="text-blue-100 font-medium">{booking.passenger?.name || 'Unknown'}
                          {booking.passenger?.phone && (
                            <span className="ml-2 text-xs text-blue-300">({booking.passenger.phone})</span>
                          )}
                        </span>
                      </div>
                      {booking.passengerEmail && (
                        <div className="text-blue-200 mb-2 text-xs">Passenger Email: {booking.passengerEmail}</div>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ml-2 ${booking.status === 'accepted' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{booking.status}</span>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-12 text-center bg-[#16213a] border-none rounded-3xl">
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