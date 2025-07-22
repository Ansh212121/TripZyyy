'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Calendar, Users, DollarSign } from 'lucide-react';
import { Loader } from '@/components/Loader';

const rideSchema = z.object({
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  availableSeats: z.number().min(1, 'At least 1 seat required').max(8, 'Maximum 8 seats'),
  price: z.number().min(0, 'Price cannot be negative').optional(),
  description: z.string().optional(),
});

type RideFormData = z.infer<typeof rideSchema>;

export default function PostRide() {
  const { isSignedIn, isLoaded, userId } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RideFormData>({
    resolver: zodResolver(rideSchema),
  });

  if (!isLoaded) {
    return <Loader />;
  }

  if (!isSignedIn) {
    router.push('/sign-in');
    return <Loader />;
  }

  const onSubmit = async (data: RideFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/rides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, driver: userId }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to post ride');
      }
      router.push('/my-rides');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-[#003366] to-[#101c2c] text-white py-10">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-[#16213a] rounded-2xl shadow-xl p-8 border border-[#1e293b]/20">
          <h1 className="text-3xl font-bold mb-6 text-[#1e90ff] text-center">Post a New Ride</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Origin */}
              <div>
                <label className="block text-blue-100 mb-1">Origin</label>
                <Input
                  type="text"
                  placeholder="Starting location"
                  {...register('origin')}
                  className="w-full px-4 py-2 rounded-lg bg-[#101c2c] text-white border border-[#1e90ff]/30 focus:border-[#1e90ff] focus:ring-2 focus:ring-[#1e90ff]/40 outline-none transition"
                  required
                />
                {errors.origin && (
                  <p className="text-sm text-red-600">{errors.origin.message}</p>
                )}
              </div>
              {/* Destination */}
              <div>
                <label className="block text-blue-100 mb-1">Destination</label>
                <Input
                  type="text"
                  placeholder="Destination"
                  {...register('destination')}
                  className="w-full px-4 py-2 rounded-lg bg-[#101c2c] text-white border border-[#00bfae]/30 focus:border-[#00bfae] focus:ring-2 focus:ring-[#00bfae]/40 outline-none transition"
                  required
                />
                {errors.destination && (
                  <p className="text-sm text-red-600">{errors.destination.message}</p>
                )}
              </div>
              {/* Date */}
              <div>
                <Label htmlFor="date" className="flex items-center text-blue-100 mb-1">
                  <Calendar className="mr-1 h-4 w-4" />
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  {...register('date')}
                  className="w-full px-4 py-2 rounded-lg bg-[#101c2c] text-white border border-[#1e90ff]/30 focus:border-[#1e90ff] focus:ring-2 focus:ring-[#1e90ff]/40 outline-none transition"
                  required
                />
                {errors.date && (
                  <p className="text-sm text-red-600">{errors.date.message}</p>
                )}
              </div>
              {/* Time */}
              <div>
                <Label htmlFor="time" className="flex items-center text-blue-100 mb-1">
                  <Calendar className="mr-1 h-4 w-4" />
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  {...register('time')}
                  className="w-full px-4 py-2 rounded-lg bg-[#101c2c] text-white border border-[#00bfae]/30 focus:border-[#00bfae] focus:ring-2 focus:ring-[#00bfae]/40 outline-none transition"
                  required
                />
                {errors.time && (
                  <p className="text-sm text-red-600">{errors.time.message}</p>
                )}
              </div>
              {/* Available Seats */}
              <div>
                <Label htmlFor="availableSeats" className="flex items-center text-blue-100 mb-1">
                  <Users className="mr-1 h-4 w-4" />
                  Available Seats
                </Label>
                <Input
                  id="availableSeats"
                  type="number"
                  min="1"
                  max="8"
                  {...register('availableSeats', { valueAsNumber: true })}
                  className="w-full px-4 py-2 rounded-lg bg-[#101c2c] text-white border border-[#1e90ff]/30 focus:border-[#1e90ff] focus:ring-2 focus:ring-[#1e90ff]/40 outline-none transition"
                  required
                />
                {errors.availableSeats && (
                  <p className="text-sm text-red-600">{errors.availableSeats.message}</p>
                )}
              </div>
              {/* Price */}
              <div>
                <Label htmlFor="price" className="flex items-center text-blue-100 mb-1">
                  <DollarSign className="mr-1 h-4 w-4" />
                  Price per Seat (Optional)
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  {...register('price', { valueAsNumber: true })}
                  className="w-full px-4 py-2 rounded-lg bg-[#101c2c] text-white border border-[#00bfae]/30 focus:border-[#00bfae] focus:ring-2 focus:ring-[#00bfae]/40 outline-none transition"
                />
                {errors.price && (
                  <p className="text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>
            </div>
            {/* Description */}
            <div>
              <Label htmlFor="description" className="block text-blue-100 mb-1">Additional Details (Optional)</Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Any additional information about your ride..."
                {...register('description')}
                className="w-full px-4 py-2 rounded-lg bg-[#101c2c] text-white border border-[#1e90ff]/30 focus:border-[#1e90ff] focus:ring-2 focus:ring-[#1e90ff]/40 outline-none transition"
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#1e90ff] to-[#00bfae] text-white font-semibold py-2 px-6 rounded-lg shadow hover:from-[#00bfae] hover:to-[#1e90ff] transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader />
                  Posting Ride...
                </>
              ) : (
                'Post Ride'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}