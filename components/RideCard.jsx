import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Calendar, Clock, Users, Star } from 'lucide-react';
import RouteMap from './RouteMap';
import { useState } from 'react';

export function RideCard({ ride }) {
  const [showRoute, setShowRoute] = useState(false);
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {/* Trip Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="font-medium">{ride.origin}</span>
              </div>
              <div className="text-gray-400">→</div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-green-600" />
                <span className="font-medium">{ride.destination}</span>
              </div>
            </div>
            <button
              className="text-xs text-blue-500 underline mb-2"
              onClick={() => setShowRoute((v) => !v)}
            >
              {showRoute ? 'Hide Route' : 'Show Route'}
            </button>
            {showRoute && (
              <div className="my-2">
                <RouteMap origin={ride.origin} destination={ride.destination} />
              </div>
            )}

            <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{ride.date}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{ride.time}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{ride.availableSeats} seats</span>
              </div>
            </div>

            {/* Driver Info */}
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={ride.driver.avatar} alt={ride.driver.name} />
                <AvatarFallback>{ride.driver.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{ride.driver.name}</span>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-600">{ride.driver.rating}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Price and Action */}
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600 mb-2">
              ${ride.price}
            </div>
            <p className="text-sm text-gray-500 mb-4">per seat</p>
            <Link href={`/ride/${ride.id}`}>
              <Button>View Details</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}