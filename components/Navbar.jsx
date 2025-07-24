'use client';

import Link from 'next/link';
import { useAuth, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Car, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { isSignedIn } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-[#0a192f] via-[#003366] to-[#00bfae] shadow-lg border-b border-[#1e293b]/40 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <Car className="h-9 w-9 text-[#00bfae] drop-shadow-lg group-hover:scale-110 transition-transform" />
            <span className="text-2xl font-extrabold text-white tracking-tight drop-shadow-lg group-hover:text-[#1e90ff] transition-colors">
              CarpoolConnect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/rides" className="text-white/90 hover:text-[#1e90ff] font-medium transition-colors px-2 py-1 hover:bg-white/10 rounded-md">
              Find Rides
            </Link>
            <Link href="/post-ride" className="text-white/90 hover:text-[#1e90ff] font-medium transition-colors px-2 py-1 hover:bg-white/10 rounded-md">
              Post Ride
            </Link>
            <Link href="/about" className="text-white/90 hover:text-[#1e90ff] font-medium transition-colors px-2 py-1 hover:bg-white/10 rounded-md">
              About
            </Link>
            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                <Link href="/my-bookings" className="text-white/90 hover:text-[#1e90ff] font-medium transition-colors px-2 py-1 hover:bg-white/10 rounded-md">
                  My Bookings
                </Link>
                <Link href="/my-rides" className="text-white/90 hover:text-[#1e90ff] font-medium transition-colors px-2 py-1 hover:bg-white/10 rounded-md">
                  My Rides
                </Link>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/sign-in">
                  <Button variant="ghost" className="text-white hover:bg-white/10">Sign In</Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="bg-gradient-to-r from-[#1e90ff] to-[#00bfae] text-white font-bold hover:from-[#00bfae] hover:to-[#1e90ff] shadow-md">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-7 w-7" />
            ) : (
              <Menu className="h-7 w-7" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 bg-[#101c2c] shadow-lg mt-2 rounded-xl">
            <Link 
              href="/rides" 
              className="block text-white/90 hover:text-[#1e90ff] font-medium transition-colors px-4 py-2 rounded-md hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Find Rides
            </Link>
            <Link 
              href="/post-ride" 
              className="block text-white/90 hover:text-[#1e90ff] font-medium transition-colors px-4 py-2 rounded-md hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Post Ride
            </Link>
            <Link 
              href="/about" 
              className="block text-white/90 hover:text-[#1e90ff] font-medium transition-colors px-4 py-2 rounded-md hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            {isSignedIn ? (
              <div className="space-y-4">
                <Link 
                  href="/my-bookings" 
                  className="block text-white/90 hover:text-[#1e90ff] font-medium transition-colors px-4 py-2 rounded-md hover:bg-white/10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Bookings
                </Link>
                <Link 
                  href="/my-rides" 
                  className="block text-white/90 hover:text-[#1e90ff] font-medium transition-colors px-4 py-2 rounded-md hover:bg-white/10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Rides
                </Link>
                <div className="pt-2">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">Sign In</Button>
                </Link>
                <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-[#1e90ff] to-[#00bfae] text-white font-bold hover:from-[#00bfae] hover:to-[#1e90ff] shadow-md">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}