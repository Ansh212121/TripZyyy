import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Calendar, Clock, Users } from 'lucide-react';

interface BookingCardProps {
  booking: {
    id: string;
    status: 'pending' | 'accepted' | 'declined';
    seatsBooked: number;
    totalCost: number;
    ride: {
      id: string;
      origin: string;
      destination: string;
      date: string;
      time: string;
      driver: {
        name: string;
        avatar: string;
      };
    };
  };
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800',
};

const statusText = {
  pending: 'Pending Review',
  accepted: 'Confirmed',
  declined: 'Declined',
};

export function BookingCard({ booking }: BookingCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span className="font-medium">{booking.ride.origin}</span>
            <div className="text-gray-400">→</div>
            <MapPin className="h-4 w-4 text-green-600" />
            <span className="font-medium">{booking.ride.destination}</span>
          </div>
          <Badge className={statusColors[booking.status]}>
            {statusText[booking.status]}
          </Badge>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{booking.ride.date}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{booking.ride.time}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{booking.seatsBooked} seat{booking.seatsBooked > 1 ? 's' : ''}</span>
          </div>
          <div className="text-sm font-medium">
            ${booking.totalCost} total
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={booking.ride.driver.avatar} alt={booking.ride.driver.name} />
              <AvatarFallback>{booking.ride?.driver?.name ? booking.ride.driver.name.charAt(0) : "?"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Driver: {booking.ride?.driver?.name || "Unknown"}</p>
            </div>
          </div>

          {booking.status === 'pending' && (
            <p className="text-sm text-gray-500">
              Waiting for driver's response
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}