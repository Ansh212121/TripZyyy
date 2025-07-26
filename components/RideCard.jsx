import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Calendar, Clock, Users, Star, ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import RouteMap from './RouteMap';
import { useState } from 'react';
import Link from 'next/link';

export function RideCard({ ride, rideBookings = [], filter }) {
  const [showRoute, setShowRoute] = useState(false);
  const [processingBooking, setProcessingBooking] = useState(null);
  const isAcceptedSection = filter === 'other';
  const isPendingSection = filter === 'pending';
  const hasBookingRequests = rideBookings.length > 0;
  
  // Determine if this is a "My Rides" context (driver viewing their own rides)
  // If filter prop is provided, it means we're in My Rides page
  const isMyRidesContext = filter !== undefined;

  const handleBookingAction = async (bookingId, action) => {
    setProcessingBooking(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update booking');
      }
      
      // Refresh the page to show updated status
      window.location.reload();
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking. Please try again.');
    } finally {
      setProcessingBooking(null);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-gray-800 text-gray-100 shadow-md rounded-2xl overflow-hidden transition-transform hover:scale-102">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <MapPin className="h-5 w-5 text-blue-300" />
            <span className="font-medium text-base">{ride.origin}</span>
          </div>
          <span className="text-xl font-bold">→</span>
          <div className="flex items-center space-x-1">
            <MapPin className="h-5 w-5 text-blue-300" />
            <span className="font-medium text-base">{ride.destination}</span>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={() => setShowRoute(!showRoute)}>
          {showRoute
            ? <><ChevronUp className="h-4 w-4 text-blue-200" /><span className="ml-1">Hide Route</span></>
            : <><ChevronDown className="h-4 w-4 text-blue-200" /><span className="ml-1">Show Route</span></>
          }
        </Button>
      </div>

      {/* Map */}
      <div className={`overflow-hidden transition-max-h duration-400 ease-in-out ${showRoute ? 'max-h-56' : 'max-h-0'}`}>        
        <RouteMap origin={ride.origin} destination={ride.destination} className="w-full h-40" />
      </div>

      {/* Details & Actions */}
      <CardContent className="p-4 bg-gray-800 space-y-4">
        {/* Meta */}
        <div className="flex justify-between text-gray-200 text-sm">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4 text-blue-400" />
            <span>{ride.date}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4 text-blue-400" />
            <span>{ride.time}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4 text-blue-400" />
            <span>{ride.availableSeats} seats</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="font-medium text-green-400">${ride.price}</span>
            <span className="text-xs text-gray-400">/seat</span>
          </div>
        </div>

        {/* Driver */}
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 ring-1 ring-blue-500">
            <AvatarImage src={ride.driver.avatar} alt={ride.driver.name} />
            <AvatarFallback>{ride.driver.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-white text-sm">{ride.driver.name}</p>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-xs text-gray-300">{ride.driver.rating}</span>
            </div>
          </div>
        </div>

        {/* My Rides Context - Show Booking Requests */}
        {isMyRidesContext && (
          <>
            {/* Accepted Passengers - Only show in "other" section */}
            {isAcceptedSection && hasBookingRequests && (
              <div className="p-3 bg-green-700 rounded-xl text-green-200 text-sm">
                <h4 className="font-semibold mb-1">Accepted Passengers</h4>
                <ul className="list-disc list-inside space-y-1">
                  {rideBookings.filter(b => b.status === 'accepted').map(b => (
                    <li key={b._id}>{b.passenger.name || 'Unknown'} ({b.passenger.email})</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Booking Requests */}
            <div className="p-3 rounded-xl text-sm">
              {hasBookingRequests ? (
                <div className="bg-blue-700 text-blue-200">
                  <h4 className="font-semibold mb-1">
                    {isPendingSection ? 'Pending Requests' : 
                     isAcceptedSection ? 'Accepted/Declined Requests' : 
                     'All Booking Requests'}
                  </h4>
                  <ul className="space-y-2">
                    {rideBookings.map(b => (
                      <li key={b._id} className="bg-gray-800 p-3 rounded-lg border border-gray-600">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-blue-200 font-medium">{b.passenger.name || 'Unknown'}</span>
                            {b.passenger.email && (
                              <p className="text-xs text-gray-400 mt-1">{b.passenger.email}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              Seats: {b.seatsBooked} • ${ride.price * b.seatsBooked}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            b.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                            b.status === 'accepted' ? 'bg-green-200 text-green-800' :
                            'bg-red-200 text-red-800'}
                          `}>{b.status}</span>
                        </div>
                        
                        {/* Action Buttons - Only show for pending requests in pending section */}
                        {isPendingSection && b.status === 'pending' && (
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              onClick={() => handleBookingAction(b._id, 'accepted')}
                              disabled={processingBooking === b._id}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-1"
                            >
                              {processingBooking === b._id ? (
                                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <>
                                  <Check className="h-3 w-3 mr-1" />
                                  Accept
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleBookingAction(b._id, 'declined')}
                              disabled={processingBooking === b._id}
                              className="flex-1 border-red-500 text-red-400 hover:bg-red-500 hover:text-white text-xs py-1"
                            >
                              {processingBooking === b._id ? (
                                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <>
                                  <X className="h-3 w-3 mr-1" />
                                  Decline
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="bg-blue-700 text-blue-200 p-3 text-center">
                  {isPendingSection ? 'No pending requests.' :
                   isAcceptedSection ? 'No accepted or declined requests.' :
                   'No booking requests yet.'}
                </div>
              )}
            </div>
          </>
        )}

        {/* Find Rides Context - Show Book Button */}
        {!isMyRidesContext && (
          <div className="p-3 rounded-xl text-sm text-center">
            <Link href={`/ride/${ride._id}`}>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105">
                Book This Ride
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
