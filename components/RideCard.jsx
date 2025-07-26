import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Calendar, Clock, Users, Star, ChevronDown, ChevronUp } from 'lucide-react';
import RouteMap from './RouteMap';
import { useState } from 'react';

export function RideCard({ ride, rideBookings = [], filter }) {
  const [showRoute, setShowRoute] = useState(false);
  const isAcceptedSection = filter === 'other';
  const hasBookingRequests = rideBookings.length > 0;

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

        {/* Accepted Passengers */}
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

        {/* Booking Requests or Placeholder */}
        <div className="p-3 rounded-xl text-sm text-center">
          {hasBookingRequests ? (
            <div className="bg-blue-700 text-blue-200">
              <h4 className="font-semibold mb-1">Booking Requests</h4>
              <ul className="space-y-1">
                {rideBookings.map(b => (
                  <li key={b._id} className="flex justify-between bg-gray-800 p-2 rounded-lg border border-gray-600">
                    <span className="text-blue-200">{b.passenger.name || 'Unknown'}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      b.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                      b.status === 'accepted' ? 'bg-green-200 text-green-800' :
                      'bg-red-200 text-red-800'}
                    `}>{b.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-blue-700 text-blue-200 p-3">
              No booking requests yet.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
