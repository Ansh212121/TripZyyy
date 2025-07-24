import React from 'react';
import { Card } from '@/components/ui/card';
import { Users, Heart, Globe, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen py-16 px-4 md:px-8 bg-gradient-to-br from-[#0a192f] via-[#003366] to-[#101c2c] text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 mt-8">
            About TripZyyy
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to make travel more affordable, sustainable, and social by connecting drivers with empty seats to passengers looking for a ride.
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-20">
          <div className="bg-[#16213a] rounded-2xl p-8 md:p-12 shadow-xl mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Our Mission
            </h2>
            <p className="text-lg text-blue-100 text-center max-w-4xl mx-auto leading-relaxed">
              Every day, millions of cars travel with empty seats while others struggle with expensive transport options. 
              We believe in the power of sharing - not just resources, but experiences, stories, and connections. 
              TripZyyy transforms every journey into an opportunity to save money, protect the environment, and build community.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="flex flex-col items-center mb-12">
          <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
            <Card className="flex flex-col items-center justify-between h-full p-8 text-center bg-[#16213a] border-none shadow-xl rounded-2xl hover:shadow-2xl hover:scale-[1.03] transition-transform duration-200">
              <div className="bg-[#1e90ff]/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-[#1e90ff]" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Community</h3>
              <p className="text-blue-100 flex-1">
                We foster a welcoming, inclusive community where everyone can share rides and stories.
              </p>
            </Card>
            <Card className="flex flex-col items-center justify-between h-full p-8 text-center bg-[#16213a] border-none shadow-xl rounded-2xl hover:shadow-2xl hover:scale-[1.03] transition-transform duration-200">
              <div className="bg-[#00bfae]/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Heart className="h-8 w-8 text-[#00bfae]" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Sustainability</h3>
              <p className="text-blue-100 flex-1">
                By sharing rides, we reduce emissions and make travel more eco-friendly for everyone.
              </p>
            </Card>
            <Card className="flex flex-col items-center justify-between h-full p-8 text-center bg-[#16213a] border-none shadow-xl rounded-2xl hover:shadow-2xl hover:scale-[1.03] transition-transform duration-200">
              <div className="bg-[#1e90ff]/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Award className="h-8 w-8 text-[#1e90ff]" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Excellence</h3>
              <p className="text-blue-100 flex-1">
                We strive for the best experience, safety, and reliability in every ride.
              </p>
            </Card>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-gray-900 text-white rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Our Impact
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">50K+</div>
              <p className="text-gray-300">Happy Travelers</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">1M+</div>
              <p className="text-gray-300">Miles Shared</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-400 mb-2">200T</div>
              <p className="text-gray-300">CO₂ Saved</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
