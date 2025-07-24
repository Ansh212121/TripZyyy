'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RideCard } from '@/components/RideCard';
import { Search, MapPin, Calendar, Clock, Users } from 'lucide-react';
import Link from 'next/link';
import MapPicker from '@/components/MapPicker';
import RouteMap from '@/components/RouteMap';

export default function RidesPage() {
  const [searchOrigin, setSearchOrigin] = useState('');
  const [searchDestination, setSearchDestination] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [rides, setRides] = useState([]);
  const [allRides, setAllRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOriginPicker, setShowOriginPicker] = useState(false);
  const [showDestinationPicker, setShowDestinationPicker] = useState(false);

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
              <div className="flex gap-2">
                <Input
                  placeholder="Starting location"
                  value={searchOrigin}
                  onChange={(e) => setSearchOrigin(e.target.value)}
                  className="bg-[#101c2c] text-white border border-[#1e90ff]/30 focus:border-[#1e90ff] focus:ring-2 focus:ring-[#1e90ff]/40"
                />
                <Button type="button" variant="outline" className="border-[#1e90ff] text-xs px-2 py-1" onClick={() => setShowOriginPicker(true)}>
                  Pick on Map
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-100 flex items-center">
                <MapPin className="mr-1 h-4 w-4" />
                To
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Destination"
                  value={searchDestination}
                  onChange={(e) => setSearchDestination(e.target.value)}
                  className="bg-[#101c2c] text-white border border-[#00bfae]/30 focus:border-[#00bfae] focus:ring-2 focus:ring-[#00bfae]/40"
                />
                <Button type="button" variant="outline" className="border-[#00bfae] text-xs px-2 py-1" onClick={() => setShowDestinationPicker(true)}>
                  Pick on Map
                </Button>
              </div>
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
                <RideCard key={ride._id} ride={ride} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center bg-[#16213a] border-none">
              <p className="text-blue-200 text-lg">No rides found matching your criteria. Try adjusting your search.</p>
            </Card>
          )}
        </div>
      </div>
      <MapPicker
        open={showOriginPicker}
        onClose={() => setShowOriginPicker(false)}
        onSelect={({ address }) => setSearchOrigin(address)}
      />
      <MapPicker
        open={showDestinationPicker}
        onClose={() => setShowDestinationPicker(false)}
        onSelect={({ address }) => setSearchDestination(address)}
      />
      {/* Show route if both locations are set */}
      {searchOrigin && searchDestination && (
        <div className="my-8">
          <RouteMap origin={searchOrigin} destination={searchDestination} />
        </div>
      )}
    </div>
  );
}
