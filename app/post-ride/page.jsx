'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, Users, DollarSign } from 'lucide-react';
import { Loader } from '@/components/Loader';
import MapPicker from '@/components/MapPicker';

const rideSchema = z.object({
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  availableSeats: z.number().min(1, 'At least 1 seat required').max(8, 'Maximum 8 seats'),
  price: z.number().min(0, 'Price cannot be negative').optional(),
  description: z.string().optional(),
});

export default function PostRide() {
  const { isSignedIn, isLoaded, userId } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [phone, setPhone] = useState('');
  const [showOriginPicker, setShowOriginPicker] = useState(false);
  const [showDestinationPicker, setShowDestinationPicker] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(rideSchema),
  });

  if (!isLoaded) return <Loader />;
  if (!isSignedIn) {
    router.push('/sign-in');
    return <Loader />;
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/rides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, driver: userId, phone }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to post ride');
      }
      router.push('/my-rides');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-[#003366] to-[#101c2c] text-white py-10">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header Illustration and Text */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#1e90ff]/30 to-[#00bfae]/30 flex items-center justify-center mb-4 shadow-lg">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="80" height="80" rx="40" fill="#1e90ff" fillOpacity="0.15"/>
              <path d="M20 60c0-8 8-12 20-12s20 4 20 12" stroke="#00bfae" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="32" cy="36" r="6" fill="#1e90ff"/>
              <circle cx="48" cy="36" r="6" fill="#00bfae"/>
              <ellipse cx="40" cy="50" rx="8" ry="4" fill="#1e90ff" fillOpacity="0.3"/>
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-[#1e90ff] mb-2 text-center drop-shadow">Ready to Share Your Journey?</h2>
          <p className="text-lg text-blue-200 text-center font-medium max-w-md">
            Fill your empty seats, meet awesome people, and make every trip memorable. Posting a ride is quick, easy, and helps the planet too!
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#16213a] rounded-2xl shadow-2xl p-8 border border-[#1e293b]/20">
          <h1 className="text-3xl font-bold mb-2 text-[#1e90ff] text-center">Post a New Ride</h1>
          <p className="text-lg text-blue-200 text-center mb-6 font-medium">
            Share your journey, fill your empty seats, and make new friends. Help others reach their destination while saving on travel costs!
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Origin */}
              <div>
                <label className="block text-blue-100 mb-1">Origin</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Starting location"
                    {...register('origin')}
                    className="w-full px-4 py-2 rounded-lg bg-[#101c2c] text-white border border-[#1e90ff]/30 focus:border-[#1e90ff] focus:ring-2 focus:ring-[#1e90ff]/40 outline-none transition"
                    required
                  />
                  <Button type="button" variant="outline" className="border-[#1e90ff] text-xs px-2 py-1" onClick={() => setShowOriginPicker(true)}>
                    Pick on Map
                  </Button>
                </div>
                {errors.origin && <p className="text-sm text-red-600">{errors.origin.message}</p>}
              </div>

              {/* Destination */}
              <div>
                <label className="block text-blue-100 mb-1">Destination</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Destination"
                    {...register('destination')}
                    className="w-full px-4 py-2 rounded-lg bg-[#101c2c] text-white border border-[#00bfae]/30 focus:border-[#00bfae] focus:ring-2 focus:ring-[#00bfae]/40 outline-none transition"
                    required
                  />
                  <Button type="button" variant="outline" className="border-[#00bfae] text-xs px-2 py-1" onClick={() => setShowDestinationPicker(true)}>
                    Pick on Map
                  </Button>
                </div>
                {errors.destination && <p className="text-sm text-red-600">{errors.destination.message}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-blue-100 mb-1">Contact Number</label>
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[#101c2c] text-white border border-[#1e90ff]/30 focus:border-[#1e90ff] focus:ring-2 focus:ring-[#1e90ff]/40 outline-none transition"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <Label htmlFor="date" className="flex items-center text-blue-100 mb-1">
                  <Calendar className="mr-1 h-4 w-4" /> Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  {...register('date')}
                  className="w-full px-4 py-2 rounded-lg bg-[#101c2c] text-white border border-[#1e90ff]/30 focus:border-[#1e90ff] focus:ring-2 focus:ring-[#1e90ff]/40 outline-none transition"
                  required
                />
                {errors.date && <p className="text-sm text-red-600">{errors.date.message}</p>}
              </div>

              {/* Time */}
              <div>
                <Label htmlFor="time" className="flex items-center text-blue-100 mb-1">
                  <Calendar className="mr-1 h-4 w-4" /> Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  {...register('time')}
                  className="w-full px-4 py-2 rounded-lg bg-[#101c2c] text-white border border-[#00bfae]/30 focus:border-[#00bfae] focus:ring-2 focus:ring-[#00bfae]/40 outline-none transition"
                  required
                />
                {errors.time && <p className="text-sm text-red-600">{errors.time.message}</p>}
              </div>

              {/* Seats */}
              <div>
                <Label htmlFor="availableSeats" className="flex items-center text-blue-100 mb-1">
                  <Users className="mr-1 h-4 w-4" /> Available Seats
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
                {errors.availableSeats && <p className="text-sm text-red-600">{errors.availableSeats.message}</p>}
              </div>

              {/* Price */}
              <div>
                <Label htmlFor="price" className="flex items-center text-blue-100 mb-1">
                  <DollarSign className="mr-1 h-4 w-4" /> Price per Seat (Optional)
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
                {errors.price && <p className="text-sm text-red-600">{errors.price.message}</p>}
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

            {/* Error Message */}
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}

            {/* Submit Button */}
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
      <MapPicker
        open={showOriginPicker}
        onClose={() => setShowOriginPicker(false)}
        onSelect={({ address }) => {
          // Set the value of the origin field
          const input = document.querySelector('input[name="origin"]');
          if (input) input.value = address;
          // For react-hook-form, trigger change event
          input?.dispatchEvent(new Event('input', { bubbles: true }));
        }}
      />
      <MapPicker
        open={showDestinationPicker}
        onClose={() => setShowDestinationPicker(false)}
        onSelect={({ address }) => {
          const input = document.querySelector('input[name="destination"]');
          if (input) input.value = address;
          input?.dispatchEvent(new Event('input', { bubbles: true }));
        }}
      />
    </div>
  );
}
