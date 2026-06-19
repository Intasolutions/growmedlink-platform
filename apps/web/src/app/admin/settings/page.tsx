'use client';

import React from 'react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl md:text-3xl font-heading font-black tracking-wide text-white">
        Global Settings
      </h1>
      <p className="text-gray-400 text-sm font-light">
        Scaffolding view for updating company contact details, address records, and defaults SEO properties.
      </p>
      <div className="border border-dashed border-white/10 rounded-2xl h-96 flex items-center justify-center bg-[#0A192F]/10">
        <span className="text-sm font-medium text-gray-500">Global configurations CRUD form elements pending Phase 10 implementation</span>
      </div>
    </div>
  );
}
