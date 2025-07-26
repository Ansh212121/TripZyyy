'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader } from '@/components/Loader';
import RouteMap from '@/components/RouteMap';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Star, 
  Car, 
  DollarSign, 
  User, 
  ArrowRight,
  Shield,
  CheckCircle,
  AlertCircle,
  Navigation
} from 'lucide-react';

export default function RideDetails({ params }) {
  const { isSignedIn, isLoaded, userId } = useAuth();
  const router = useRouter();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [bookingError, setBookingError] = useState(null);

  const fetchRide = useCallback(async () => {
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
  }, [params.id]);

  useEffect(() => {
    fetchRide();
  }, [fetchRide]);

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

  const totalPrice = ride ? (seatsToBook * ride.price) : 0;

  if (!isLoaded || loading) return <Loader />;

  if (error || !ride) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-600 py-24 bg-gradient-to-br from-[#0a192f] via-[#003366] to-[#101c2c]">
        <div className="text-center max-w-md mx-auto">
          <AlertCircle className="h-16 w-16 text-red-400 mb-6 mx-auto" />
          <h2 className="text-2xl font-bold text-white mb-2">Ride Not Available</h2>
          <p className="text-blue-200 mb-6">This ride may have been removed or is no longer available. Please browse other available rides.</p>
          <Button 
            onClick={() => router.push('/rides')}
            className="bg-gradient-to-r from-[#1e90ff] to-[#00bfae] hover:from-[#00bfae] hover:to-[#1e90ff] text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200"
          >
            Browse Available Rides
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-[#003366] to-[#101c2c] text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="text-blue-300 hover:text-white mb-4"
          >
            ← Back to Rides
          </Button>
          <h1 className="text-4xl font-bold text-white mb-2">Book Your Ride</h1>
          <p className="text-blue-200">Complete your journey details and secure your seat</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Route Map */}
            <Card className="bg-[#16213a] border-[#1e293b]/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Navigation className="h-5 w-5 text-blue-400" />
                  Route Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RouteMap origin={ride.origin} destination={ride.destination} />
              </CardContent>
            </Card>

            {/* Journey Details */}
            <Card className="bg-[#16213a] border-[#1e293b]/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Car className="h-5 w-5 text-blue-400" />
                  Journey Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Route */}
                <div className="flex items-center justify-between p-4 bg-[#1e293b]/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-white">{ride.origin}</p>
                      <p className="text-sm text-blue-200">Departure</p>
                    </div>
                  </div>
                  <ArrowRight className="h-6 w-6 text-blue-400" />
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="text-right">
                      <p className="font-semibold text-white">{ride.destination}</p>
                      <p className="text-sm text-blue-200">Destination</p>
                    </div>
                  </div>
                </div>

                {/* Trip Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-[#1e293b]/30 rounded-xl text-center">
                    <Calendar className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                    <p className="font-semibold text-white">{ride.date}</p>
                    <p className="text-sm text-blue-200">Date</p>
                  </div>
                  <div className="p-4 bg-[#1e293b]/30 rounded-xl text-center">
                    <Clock className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                    <p className="font-semibold text-white">{ride.time}</p>
                    <p className="text-sm text-blue-200">Time</p>
                  </div>
                  <div className="p-4 bg-[#1e293b]/30 rounded-xl text-center">
                    <Users className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                    <p className="font-semibold text-white">{ride.availableSeats}</p>
                    <p className="text-sm text-blue-200">Available Seats</p>
                  </div>
                  <div className="p-4 bg-[#1e293b]/30 rounded-xl text-center">
                    <DollarSign className="h-6 w-6 text-green-400 mx-auto mb-2" />
                    <p className="font-semibold text-white">${ride.price}</p>
                    <p className="text-sm text-blue-200">Per Seat</p>
                  </div>
                </div>

                {/* Description */}
                {ride.description && (
                  <div className="p-4 bg-[#1e293b]/30 rounded-xl">
                    <h4 className="font-semibold text-white mb-2">Additional Notes</h4>
                    <p className="text-blue-200 text-sm">{ride.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Driver Information */}
            <Card className="bg-[#16213a] border-[#1e293b]/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <User className="h-5 w-5 text-blue-400" />
                  Your Driver
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 bg-[#1e293b]/30 rounded-xl">
                  <Avatar className="h-16 w-16 ring-2 ring-blue-500">
                    <AvatarImage src={ride.driver?.avatar} alt={ride.driver?.name} />
                    <AvatarFallback className="bg-blue-600 text-white text-lg font-semibold">
                      {ride.driver?.name?.charAt(0) || 'D'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-lg">{ride.driver?.name || 'Driver Name'}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-blue-200">{ride.driver?.rating || '4.8'}</span>
                      <Badge variant="secondary" className="ml-2 bg-green-600 text-white">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                    <p className="text-blue-200 text-sm mt-1">Professional driver with excellent reviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar - Right Side */}
          <div className="lg:col-span-1">
            <Card className="bg-[#16213a] border-[#1e293b]/20 shadow-xl sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  Book Your Seat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price Summary */}
                <div className="p-4 bg-[#1e293b]/30 rounded-xl">
                  <h4 className="font-semibold text-white mb-3">Price Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-blue-200">
                      <span>Price per seat:</span>
                      <span>${ride.price}</span>
                    </div>
                    <div className="flex justify-between text-blue-200">
                      <span>Seats selected:</span>
                      <span>{seatsToBook}</span>
                    </div>
                    <Separator className="bg-blue-600/30" />
                    <div className="flex justify-between text-white font-semibold text-lg">
                      <span>Total:</span>
                      <span className="text-green-400">${totalPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Booking Form */}
                <form onSubmit={handleBooking} className="space-y-4">
                  <div>
                    <label className="block text-blue-100 mb-2 font-medium">Number of Seats</label>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSeatsToBook(Math.max(1, seatsToBook - 1))}
                        disabled={seatsToBook <= 1}
                        className="text-blue-300 border-blue-600 hover:bg-blue-600/20"
                      >
                        -
                      </Button>
                      <input
                        type="number"
                        min={1}
                        max={ride.availableSeats}
                        value={seatsToBook}
                        onChange={(e) => setSeatsToBook(Number(e.target.value))}
                        className="flex-1 px-4 py-2 rounded-lg bg-[#101c2c] text-white border border-[#1e90ff]/30 focus:border-[#1e90ff] focus:ring-2 focus:ring-[#1e90ff]/40 outline-none transition text-center"
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSeatsToBook(Math.min(ride.availableSeats, seatsToBook + 1))}
                        disabled={seatsToBook >= ride.availableSeats}
                        className="text-blue-300 border-blue-600 hover:bg-blue-600/20"
                      >
                        +
                      </Button>
                    </div>
                    <p className="text-xs text-blue-300 mt-1">
                      {ride.availableSeats - seatsToBook} seats remaining
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#1e90ff] to-[#00bfae] hover:from-[#00bfae] hover:to-[#1e90ff] text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                    disabled={isBooking}
                  >
                    {isBooking ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </div>
                    ) : (
                      `Book ${seatsToBook} Seat${seatsToBook > 1 ? 's' : ''} - $${totalPrice}`
                    )}
                  </Button>

                  {bookingError && (
                    <div className="p-3 bg-red-600/20 border border-red-600/30 rounded-lg text-red-300 text-sm">
                      {bookingError}
                    </div>
                  )}

                  {/* Safety Notice */}
                  <div className="p-3 bg-blue-600/20 border border-blue-600/30 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-blue-200">
                        <p className="font-medium mb-1">Safe Travel Guarantee</p>
                        <p>All drivers are verified and rides are insured for your safety.</p>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
