 'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Car, Users, MapPin, Shield, Clock, Leaf, Quote } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-[#003366] to-[#101c2c] text-white">
      {/* Hero Section */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
              Share Your Journey
            </h1>
            <p className="text-2xl md:text-3xl mb-8 text-blue-100 max-w-2xl mx-auto font-light">
              The easiest way to find, share, and book rides with trusted travelers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link href="/rides">
                <Button size="lg" className="bg-gradient-to-r from-[#1e90ff] to-[#00bfae] text-white font-semibold px-10 py-5 text-xl shadow-lg animate-bounce-slow hover:from-[#00bfae] hover:to-[#1e90ff]">
                  <MapPin className="mr-2 h-6 w-6" />
                  Find a Ride
                </Button>
              </Link>
              <Link href="/post-ride">
                <Button size="lg" variant="outline" className="border-[#1e90ff] text-white hover:bg-[#1e90ff]/10 font-semibold px-10 py-5 text-xl">
                  <Car className="mr-2 h-6 w-6" />
                  Post a Ride
                </Button>
              </Link>
            </div>
            <p className="text-blue-200 text-lg max-w-xl mx-auto">
              Save money, make friends, and reduce your carbon footprint. Join the ridesharing revolution today!
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose TripZyyy?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Join thousands of travelers who trust our platform for safe, affordable, and convenient ridesharing.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center bg-[#16213a] border-none shadow-xl rounded-2xl hover:shadow-2xl transition-shadow">
              <div className="bg-[#1e90ff]/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-[#1e90ff]" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Trusted & Safe</h3>
              <p className="text-blue-100">
                All users are verified with secure authentication. Travel with confidence knowing your safety is our priority.
              </p>
            </Card>

            <Card className="p-8 text-center bg-[#16213a] border-none shadow-xl rounded-2xl hover:shadow-2xl transition-shadow">
              <div className="bg-[#00bfae]/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-[#00bfae]" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Instant Booking</h3>
              <p className="text-blue-100">
                Find and book rides instantly. Real-time notifications keep you updated on your booking status.
              </p>
            </Card>

            <Card className="p-8 text-center bg-[#16213a] border-none shadow-xl rounded-2xl hover:shadow-2xl transition-shadow">
              <div className="bg-[#1e90ff]/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf className="h-8 w-8 text-[#1e90ff]" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Eco-Friendly</h3>
              <p className="text-blue-100">
                Reduce your carbon footprint by sharing rides. Help create a more sustainable future for everyone.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-24" style={{ background: '#0a192f' }}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-4">What Our Users Say</h2>
          <p className="text-lg text-blue-100 text-center mb-12">Real stories from real travelers.</p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 flex flex-col items-center text-center bg-[#16213a] text-white">
              <Quote className="mx-auto h-10 w-10 text-blue-400 mb-4" />
              <p className="mb-6 text-lg">“I saved so much on travel and met amazing people. The booking process is seamless!”</p>
              <span className="font-bold text-blue-400">Priya S.</span>
              <span className="text-white">Student, Delhi</span>
            </Card>
            <Card className="p-8 flex flex-col items-center text-center bg-[#16213a] text-white">
              <Quote className="mx-auto h-10 w-10 text-green-400 mb-4" />
              <p className="mb-6 text-lg">“As a driver, I love filling my empty seats and covering fuel costs. Highly recommend!”</p>
              <span className="font-bold text-green-400">Rahul M.</span>
              <span className="text-white">Engineer, Mumbai</span>
            </Card>
            <Card className="p-8 flex flex-col items-center text-center bg-[#16213a] text-white">
              <Quote className="mx-auto h-10 w-10 text-orange-400 mb-4" />
              <p className="mb-6 text-lg">“It feels good to help the environment while traveling. The app is super easy to use.”</p>
              <span className="font-bold text-orange-400">Ayesha K.</span>
              <span className="text-white">Designer, Bangalore</span>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="bg-[#101c2c] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Get Started Today
            </h2>
            <p className="text-lg text-blue-100">
              Whether you're driving or looking for a ride, we've got you covered.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-8 bg-[#16213a] hover:shadow-2xl transition-all border-none rounded-2xl">
              <div className="flex items-center mb-6">
                <Users className="h-8 w-8 text-[#1e90ff] mr-3" />
                <h3 className="text-2xl font-semibold text-white">For Passengers</h3>
              </div>
              <p className="text-blue-100 mb-6">
                Search for rides, book instantly, and travel comfortably with verified drivers.
              </p>
              <Link href="/rides">
                <Button className="w-full bg-gradient-to-r from-[#1e90ff] to-[#00bfae] text-white font-bold hover:from-[#00bfae] hover:to-[#1e90ff] shadow-md">Browse Available Rides</Button>
              </Link>
            </Card>
            <Card className="p-8 bg-[#16213a] hover:shadow-2xl transition-all border-none rounded-2xl">
              <div className="flex items-center mb-6">
                <Car className="h-8 w-8 text-[#00bfae] mr-3" />
                <h3 className="text-2xl font-semibold text-white">For Drivers</h3>
              </div>
              <p className="text-blue-100 mb-6">
                Share your empty seats, cover fuel costs, and meet new people on your regular routes.
              </p>
              <Link href="/post-ride">
                <Button className="w-full bg-gradient-to-r from-[#1e90ff] to-[#00bfae] text-white font-bold hover:from-[#00bfae] hover:to-[#1e90ff] shadow-md">Post Your First Ride</Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
