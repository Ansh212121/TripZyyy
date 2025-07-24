'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RideCard } from '@/components/RideCard';
import { Search, MapPin, Calendar, Clock, Users } from 'lucide-react';
import Link from 'next/link';

export default function RidesPage() {
  const [searchOrigin, setSearchOrigin] = useState('');
  const [searchDestination, setSearchDestination] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [rides, setRides] = useState([]);
  const [allRides, setAllRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    } catch (err) {
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
        <div className="text-center mt-6 mb-4">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Find Your Perfect Ride</h1>
          <p className="text-xl text-blue-200 mb-2 font-semibold">Find your next adventure, save money, and travel together!</p>
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
                  className={`relative flex flex-col border-l-8 ${ride.availableSeats <= 2 ? 'border-red-500' : 'border-blue-500'} bg-gradient-to-br from-[#16213a] via-[#1a233a] to-[#101c2c] rounded-2xl shadow-xl hover:shadow-2xl transition-shadow p-0 border border-[#1e293b]/20 overflow-hidden group`}
                >
                  {/* Header: Route and Date */}
                  <div className="flex items-center justify-between px-6 pt-6 pb-2">
                    <div className="flex items-center gap-2 font-bold text-lg text-white">
                      <MapPin className="h-5 w-5 text-blue-400" />
                      <span>{ride.origin}</span>
                      <span className="mx-1 text-blue-200">➜</span>
                      <span>{ride.destination}</span>
                    </div>
                    <span className="text-xs text-blue-200 font-semibold bg-blue-900/40 px-3 py-1 rounded-full">{ride.date}</span>
                  </div>
                  {/* Driver Avatar and Price */}
                  <div className="flex items-center justify-between px-6 pb-2">
                    <div className="flex items-center gap-2">
                      {ride.driver?.avatar ? (
                        <img src={ride.driver.avatar} alt={ride.driver.name} className="h-10 w-10 rounded-full border-2 border-blue-500 shadow" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-800 flex items-center justify-center text-white font-bold text-lg border-2 border-blue-500 shadow">
                          {ride.driver?.name ? ride.driver.name[0] : 'D'}
                        </div>
                      )}
                      <span className="text-blue-100 font-medium">{ride.driver?.name || 'Driver'}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-2xl font-extrabold text-green-300 drop-shadow">₹{ride.price}</span>
                      <span className="text-xs text-blue-200">per seat</span>
                    </div>
                  </div>
                  {/* Details Row */}
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-blue-100 text-base px-6 pb-2">
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-blue-300" />{ride.time}</span>
                    <span className="flex items-center gap-1"><Users className="h-4 w-4 text-blue-300" />{ride.availableSeats} seats</span>
                    {/* Info icon for extra details */}
                    {ride.description && (
                      <span className="flex items-center gap-1 group-hover:underline cursor-pointer" title={ride.description}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
                        <span className="text-xs text-blue-300">Details</span>
                      </span>
                    )}
                  </div>
                  {/* Divider */}
                  <div className="border-t border-blue-900 mx-6 my-2" />
                  {/* Few seats left badge at bottom left */}
                  {ride.availableSeats <= 2 && (
                    <div className="px-6 pb-1 flex">
                      <span className="inline-block bg-red-500/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow animate-pulse">Few seats left!</span>
                    </div>
                  )}
                  {/* CTA Button */}
                  <div className="px-6 pb-6 pt-2 flex justify-end">
                    <Link
                      href={`/ride/${ride._id}`}
                      className="inline-block bg-gradient-to-r from-[#1e90ff] to-[#00bfae] text-white font-semibold py-2 px-6 rounded-lg shadow hover:from-[#00bfae] hover:to-[#1e90ff] transition-colors text-center"
                    >
                      View Details
                    </Link>
                  </div>
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
