'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center text-center p-6 bg-[#020C1B]">
      <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 mb-6 text-red-500">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-heading font-black text-white mb-2 tracking-wide">
        Access Denied
      </h1>
      <p className="text-gray-400 text-sm max-w-sm mb-8 leading-relaxed font-light">
        Your current user role does not have authorization permissions to access this administrative view.
      </p>
      <Link
        href="/admin"
        className="flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary-dark text-[#020C1B] font-bold rounded-xl shadow-lg shadow-secondary/15 transition-all duration-200"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
}
