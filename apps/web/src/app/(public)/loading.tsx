'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#020C1B]">
      <Loader2 className="h-12 w-12 animate-spin text-secondary mb-4" />
      <p className="text-gray-400 font-medium tracking-widest uppercase text-sm animate-pulse">Loading content...</p>
    </div>
  );
}
