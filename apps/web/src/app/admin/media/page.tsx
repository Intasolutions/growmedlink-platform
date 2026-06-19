'use client';

import React from 'react';

export default function AdminMediaPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl md:text-3xl font-heading font-black tracking-wide text-white">
        Media Library
      </h1>
      <p className="text-gray-400 text-sm font-light">
        Scaffolding view for managing Cloudinary image assets and folders.
      </p>
      <div className="border border-dashed border-white/10 rounded-2xl h-96 flex items-center justify-center bg-[#0A192F]/10">
        <span className="text-sm font-medium text-gray-500">Media upload form components pending Phase 5 UI integration</span>
      </div>
    </div>
  );
}
