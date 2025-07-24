import './globals.css';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { Navbar } from '@/components/Navbar';
import { ToastProvider } from '@/components/ToastProvider';
import GoogleMapsProvider from '@/components/GoogleMapsProvider';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 overflow-x-hidden`}>
        <GoogleMapsProvider>
          <ClerkProvider>
            <Navbar />
            {/* Main content with padding to avoid overlap with sticky Navbar */}
            <main className="pt-0 min-h-[calc(100vh-64px)] text-white">
              {children}
            </main>
            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 pt-10 pb-6 px-6">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Logo and About */}
                <div>
                  <h2 className="text-xl font-bold text-white">TripZyyy</h2>
                  <p className="mt-4 text-sm">
                    Smart, secure, and sustainable carpooling. Save money, meet people, and reduce your carbon footprint — all in one ride.
                  </p>
                </div>
                {/* Quick Links */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="/" className="hover:underline">Home</a></li>
                    <li><a href="/rides" className="hover:underline">Find a Ride</a></li>
                    <li><a href="/post-ride" className="hover:underline">Post a Ride</a></li>
                    <li><a href="/about" className="hover:underline">About</a></li>
                  </ul>
                </div>
                {/* Support */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="/faq" className="hover:underline">FAQ</a></li>
                    <li><a href="/terms" className="hover:underline">Terms & Conditions</a></li>
                    <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
                    <li><a href="/help" className="hover:underline">Help Center</a></li>
                  </ul>
                </div>
                {/* Newsletter */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Stay Connected</h3>
                  <p className="text-sm mb-3">Join our mailing list for updates and promotions.</p>
                  <form className="flex items-center">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="w-full p-2 rounded-l bg-gray-800 text-sm text-white focus:outline-none"
                    />
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r text-sm"
                      type="button"
                    >
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>
              <div className="border-t border-gray-700 mt-10 pt-4 text-sm text-center text-gray-500">
                &copy; {new Date().getFullYear()} TripZyyy. All rights reserved. Made by Ansh Agarwal. Contact: <a href="mailto:ansh212109@gmail.com" className="underline hover:text-blue-400">ansh212109@gmail.com</a>
              </div>
            </footer>
            <ToastProvider />
          </ClerkProvider>
        </GoogleMapsProvider>
      </body>
    </html>
  );
}
