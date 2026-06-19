'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Public Layout Error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#020C1B] px-4 text-center">
      <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="h-10 w-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-4">Something went wrong!</h2>
      <p className="text-gray-400 max-w-md mx-auto mb-8">
        We encountered an unexpected error while trying to load this page. Please try again.
      </p>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 bg-[#0A192F] border border-[#1E2D3D] text-white px-8 py-3 rounded-xl font-bold hover:border-secondary hover:text-secondary transition-colors"
      >
        <RefreshCw className="h-5 w-5" />
        Try Again
      </button>
    </div>
  );
}
