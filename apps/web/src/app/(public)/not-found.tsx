import React from 'react';
import Link from 'next/link';
import { AlertTriangle, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#020C1B] px-4 text-center">
      <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mb-8">
        <AlertTriangle className="h-12 w-12 text-secondary" />
      </div>
      <h1 className="text-5xl md:text-7xl font-black font-heading text-white mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-300 mb-6">Page Not Found</h2>
      <p className="text-gray-400 max-w-md mx-auto mb-10 leading-relaxed">
        We couldn't find the page you were looking for. It might have been moved, deleted, or never existed.
      </p>
      <Link
        href="/"
        className="flex items-center gap-2 bg-secondary text-[#020C1B] px-8 py-4 rounded-xl font-bold hover:bg-secondary-dark transition-colors"
      >
        <Home className="h-5 w-5" />
        Back to Home
      </Link>
    </div>
  );
}
