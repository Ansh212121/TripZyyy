'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RideCard } from '@/components/RideCard';
import { Search, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function RidesPage() {
  const [searchOrigin, setSearchOrigin] = useState('');
  const [searchDestination, setSearchDestination] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [rides, setRides] = useState<any[]>([]);
  const [allRides, setAllRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/rides');
      if (!res.ok) throw new Error('Failed to fetch rides');
      const data = await res.json();
      setRides(data);
      setAllRides(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    let filtered = allRides;
    if (searchOrigin) filtered = filtered.filter((r) => r.origin.toLowerCase().includes(searchOrigin.toLowerCase()));
    if (searchDestination) filtered = filtered.filter((r) => r.destination.toLowerCase().includes(searchDestination.toLowerCase()));
    if (searchDate) filtered = filtered.filter((r) => r.date === searchDate);
    setRides(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-[#003366] to-[#101c2c] text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Find Your Perfect Ride</h1>
          <p className="text-blue-100">Discover rides that match your route and schedule</p>
        </div>
        {/* Search Form */}
        <Card className="p-6 mb-8 bg-[#16213a] border-none shadow-xl rounded-2xl">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-100 flex items-center">
                <MapPin className="mr-1 h-4 w-4" />
                From
              </label>
              <Input
                placeholder="Starting location"
                value={searchOrigin}
                onChange={(e) => setSearchOrigin(e.target.value)}
                className="bg-[#101c2c] text-white border border-[#1e90ff]/30 focus:border-[#1e90ff] focus:ring-2 focus:ring-[#1e90ff]/40"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-100 flex items-center">
                <MapPin className="mr-1 h-4 w-4" />
                To
              </label>
              <Input
                placeholder="Destination"
                value={searchDestination}
                onChange={(e) => setSearchDestination(e.target.value)}
                className="bg-[#101c2c] text-white border border-[#00bfae]/30 focus:border-[#00bfae] focus:ring-2 focus:ring-[#00bfae]/40"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-100 flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                Date
              </label>
              <Input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="bg-[#101c2c] text-white border border-[#1e90ff]/30 focus:border-[#1e90ff] focus:ring-2 focus:ring-[#1e90ff]/40"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} className="w-full bg-gradient-to-r from-[#1e90ff] to-[#00bfae] text-white font-semibold shadow hover:from-[#00bfae] hover:to-[#1e90ff] transition-colors">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </Card>
        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Available Rides ({rides.length})</h2>
          </div>
          {loading ? (
            <Card className="p-12 text-center bg-[#16213a] border-none">
              <p className="text-blue-200 text-lg animate-pulse">Loading rides...</p>
            </Card>
          ) : error ? (
            <Card className="p-12 text-center bg-[#16213a] border-none">
              <p className="text-red-400 text-lg">{error}</p>
            </Card>
          ) : rides.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {rides.map((ride) => (
                <div
                  key={ride._id}
                  className="bg-[#16213a] rounded-2xl shadow-xl hover:shadow-2xl transition-shadow p-6 flex flex-col justify-between border border-[#1e293b]/20"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-semibold text-[#1e90ff]">{ride.origin}</span>
                      <span className="text-lg font-semibold text-[#00bfae]">{ride.destination}</span>
                    </div>
                    <div className="text-blue-100 mb-2">
                      <span className="mr-4">{ride.date}</span>
                      <span>{ride.time}</span>
                    </div>
                    <div className="text-blue-200 mb-2">Seats: {ride.availableSeats}</div>
                    <div className="text-blue-200 mb-2">Price: ₹{ride.price}</div>
                    {ride.description && (
                      <div className="text-blue-300 text-sm mb-2">{ride.description}</div>
                    )}
                  </div>
                  <Link
                    href={`/ride/${ride._id}`}
                    className="mt-4 inline-block bg-gradient-to-r from-[#1e90ff] to-[#00bfae] text-white font-semibold py-2 px-6 rounded-lg shadow hover:from-[#00bfae] hover:to-[#1e90ff] transition-colors text-center"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center bg-[#16213a] border-none">
              <p className="text-blue-200 text-lg">No rides found matching your criteria. Try adjusting your search.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}