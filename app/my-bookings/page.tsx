'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { BookingCard } from '@/components/BookingCard';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader } from '@/components/Loader';

export default function MyBookingsPage() {
  const { isSignedIn, isLoaded, userId } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchBookings();
    }
    // eslint-disable-next-line
  }, [isLoaded, isSignedIn, userId]);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/bookings');
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const data = await res.json();
      // Filter bookings for current user
      setBookings(data.filter((b: any) => b.passenger?.clerkId === userId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return <Loader />;
  }

  if (!isSignedIn) {
    router.push('/sign-in');
    return <Loader />;
  }

  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const acceptedDeclinedBookings = bookings.filter((b) => b.status === 'accepted' || b.status === 'declined');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-[#1a233a] to-[#003366] relative overflow-x-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{background: 'radial-gradient(ellipse at 60% 10%, rgba(30,144,255,0.08) 0%, transparent 70%), radial-gradient(ellipse at 20% 80%, rgba(0,191,174,0.07) 0%, transparent 70%)'}} />
      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <h1 className="mt-12 text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#1e90ff] via-[#00bfae] to-[#1e90ff] text-center drop-shadow-lg">My Bookings</h1>
        <p className="text-lg text-blue-200 text-center mb-4 font-medium">All your journeys in one place. Track your bookings, check their status, and get ready for your next trip!</p>
        <div className="w-24 h-1 mx-auto mb-8 rounded-full bg-gradient-to-r from-[#1e90ff] via-[#00bfae] to-[#1e90ff]" />
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Bookings ({bookings.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingBookings.length})</TabsTrigger>
            <TabsTrigger value="other">Accepted/Declined ({acceptedDeclinedBookings.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 018 0v2m-4-4v4m-4 4h8a2 2 0 002-2v-5a2 2 0 00-2-2h-1.5a2 2 0 01-2-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v5a2 2 0 002 2H8a2 2 0 012 2v5a2 2 0 01-2 2z" />
                </svg>
                <h2 className="text-2xl font-bold text-white mb-2">No bookings yet</h2>
                <p className="text-blue-200 mb-6 text-center max-w-md">You haven't booked any rides yet. Start exploring available rides and book your next journey!</p>
                <a href="/rides" className="inline-block bg-gradient-to-r from-[#1e90ff] to-[#00bfae] text-white font-semibold py-2 px-6 rounded-lg shadow hover:from-[#00bfae] hover:to-[#1e90ff] transition-colors text-center">
                  Find a Ride
                </a>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {bookings.map((booking) => (
                  <Card key={booking._id} className="bg-[#1a233a] border-0 shadow-xl hover:shadow-2xl hover:scale-[1.025] transition-transform duration-200 border-gradient-to-r from-[#1e90ff] to-[#00bfae] p-6 rounded-2xl relative flex flex-col gap-2">
                    <BookingCard booking={booking} />
                    <span className={`px-2 py-1 rounded text-xs font-semibold self-start ${booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : booking.status === 'accepted' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{booking.status}</span>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="pending">
            <div className="grid md:grid-cols-2 gap-8">
              {pendingBookings.length > 0 ? (
                pendingBookings.map((booking: any) => (
                  <Card key={booking._id} className="bg-[#1a233a] border-0 shadow-xl hover:shadow-2xl hover:scale-[1.025] transition-transform duration-200 border-gradient-to-r from-[#1e90ff] to-[#00bfae] p-6 rounded-2xl relative flex flex-col gap-2">
                    <BookingCard booking={booking} />
                    <span className="px-2 py-1 rounded text-xs font-semibold self-start bg-yellow-500/20 text-yellow-400">pending</span>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <svg className="h-16 w-16 text-blue-400 mb-4" />
                  <p className="text-blue-200 text-lg">No pending bookings at the moment.</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="other">
            <div className="grid md:grid-cols-2 gap-8">
              {acceptedDeclinedBookings.length > 0 ? (
                acceptedDeclinedBookings.map((booking: any) => (
                  <Card key={booking._id} className="bg-[#1a233a] border-0 shadow-xl hover:shadow-2xl hover:scale-[1.025] transition-transform duration-200 border-gradient-to-r from-[#1e90ff] to-[#00bfae] p-6 rounded-2xl relative flex flex-col gap-2">
                    <BookingCard booking={booking} showRiderEmail={true} />
                    <span className={`px-2 py-1 rounded text-xs font-semibold self-start ${booking.status === 'accepted' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{booking.status}</span>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <svg className="h-16 w-16 text-blue-400 mb-4" />
                  <p className="text-blue-200 text-lg">No accepted or declined bookings at the moment.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}