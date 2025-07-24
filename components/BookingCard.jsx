import { CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Calendar, Clock, Users } from 'lucide-react';

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

export function BookingCard({ booking, showRiderEmail }) {
  // Status color and label
  const statusLabel = statusText[booking.status];
  const statusColor =
    booking.status === 'pending'
      ? 'text-yellow-600'
      : booking.status === 'accepted'
      ? 'text-green-600'
      : 'text-red-600';
  const statusBg =
    booking.status === 'pending'
      ? 'bg-yellow-100'
      : booking.status === 'accepted'
      ? 'bg-green-100'
      : 'bg-red-100';

  return (
    <CardContent className="p-0">
      <div className="w-full max-w-full bg-[#1a233a] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm px-6 py-5 flex flex-col gap-3">
        {/* Header: Route */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 font-semibold text-lg text-white">
            <MapPin className="h-5 w-5 text-blue-400" />
            <span>{booking.ride.origin}</span>
            <span className="mx-1 text-blue-200">➜</span>
            <span>{booking.ride.destination}</span>
          </div>
        </div>

        {/* Status Row */}
        <div className="mt-1 mb-1">
          <span className={`px-3 py-1 rounded text-xs font-bold ${statusBg} ${statusColor}`}>{statusLabel}</span>
        </div>

        {/* Details Row */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-blue-100 text-base">
          <span className="flex items-center gap-1"><Calendar className="h-4 w-4 text-blue-300" />{booking.ride.date}</span>
          <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-blue-300" />{booking.ride.time}</span>
          <span className="flex items-center gap-1"><Users className="h-4 w-4 text-blue-300" />{booking.seatsBooked} seats</span>
          <span className="flex items-center gap-1"><span className="text-green-300 font-bold">₹{typeof booking.totalCost === 'number' && !isNaN(booking.totalCost) ? booking.totalCost : booking.seatsBooked && booking.ride?.price ? booking.seatsBooked * booking.ride.price : 0}</span> total</span>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-900 my-2" />

        {/* Driver & Contact */}
        <div className="flex flex-col gap-1 text-blue-100 text-base">
          <span className="flex items-center gap-2"><span className="font-medium text-white">👤 Driver:</span> <span className="text-blue-100">{booking.ride?.driver?.name || 'Unknown'}</span></span>
          {showRiderEmail && booking.riderEmail && (
            <span className="flex items-center gap-2"><span className="font-medium text-white">📧</span> <span className="text-blue-100">{booking.riderEmail}</span></span>
          )}
          {showRiderEmail && booking.riderPhone && (
            <span className="flex items-center gap-2"><span className="font-medium text-white">📞</span> <span className="text-blue-100">{booking.riderPhone}</span></span>
          )}
        </div>

        {/* Status at the bottom */}
        <div className="flex items-center mt-2">
          <span className={`flex items-center gap-2 font-bold text-base ${statusColor}`}>
            {booking.status === 'accepted' && <span className="text-green-400 text-lg">🟢</span>}
            {booking.status === 'pending' && <span className="text-yellow-400 text-lg">🟡</span>}
            {booking.status === 'declined' && <span className="text-red-400 text-lg">🔴</span>}
            {statusLabel}
          </span>
        </div>
      </div>
    </CardContent>
  );
}
