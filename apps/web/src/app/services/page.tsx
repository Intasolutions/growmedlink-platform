'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Briefcase, ArrowRight, RefreshCw, AlertCircle, Star } from 'lucide-react';
import { IService, IMedia } from '@intelligen/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function PublicServicesPage() {
  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Immigration' | 'Language'>('All');

  const fetchServices = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await fetch(`${API_BASE_URL}/api/services`);
      const data = await res.json();
      if (res.status === 200 && data.success) {
        setServices(data.data);
      } else {
        setErrorMsg(data.message || 'Failed to fetch offerings.');
      }
    } catch (err) {
      console.error('[PublicServices] Fetch error:', err);
      setErrorMsg('Could not establish connection to the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const filteredServices = services.filter(service => {
    if (selectedCategory === 'All') return true;
    return service.category === selectedCategory;
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0A192F] to-[#020C1B] text-white py-16 px-6 relative">
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-secondary/5 rounded-full filter blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full filter blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full text-secondary text-xs font-semibold uppercase tracking-wider">
            <Briefcase className="h-3.5 w-3.5" />
            <span>Our Offerings</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-black tracking-wide">
            Immigration & Language <span className="text-secondary">Programs</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed">
            Professional consultation pathways and intensive language instruction packages designed to facilitate your global growth journey.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex justify-center gap-3 border-b border-white/5 pb-6">
          {(['All', 'Immigration', 'Language'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-secondary border-secondary text-[#020C1B] font-bold shadow-lg shadow-secondary/15'
                  : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat} Offerings
            </button>
          ))}
        </div>

        {/* List View States */}
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin" />
            <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Loading offerings...</span>
          </div>
        ) : errorMsg ? (
          <div className="flex flex-col items-center justify-center h-80 text-center gap-4">
            <div className="flex items-center gap-2 bg-red-500/15 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={fetchServices}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold hover:bg-white/10 transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry</span>
            </button>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="h-80 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-[#0A192F]/10">
            <p className="text-gray-400 text-sm">No programs found matching this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map(service => {
              const image = service.image as IMedia;
              return (
                <Link
                  key={service._id}
                  href={`/services/${service.slug}`}
                  className={`group bg-[#0A192F]/30 hover:bg-[#0A192F]/50 border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col hover:-translate-y-1 hover:shadow-2xl ${
                    service.isFeatured
                      ? 'border-secondary/30 hover:border-secondary/50'
                      : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="aspect-video w-full relative bg-[#020C1B] overflow-hidden">
                    {image?.secureUrl ? (
                      <img
                        src={image.secureUrl}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 bg-white/5">
                        No Image
                      </div>
                    )}
                    
                    {/* Category Label */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-widest ${
                        service.category === 'Immigration'
                          ? 'bg-blue-500 text-white'
                          : 'bg-green-500 text-white'
                      }`}>
                        {service.category}
                      </span>
                    </div>

                    {/* Featured star */}
                    {service.isFeatured && (
                      <div className="absolute top-4 right-4 bg-secondary text-[#020C1B] p-1.5 rounded-lg border border-secondary/20 shadow-md">
                        <Star className="h-3.5 w-3.5 fill-[#020C1B] stroke-[#020C1B]" />
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-heading font-black text-white group-hover:text-secondary transition-colors line-clamp-1">
                        {service.title}
                      </h3>
                      <p className="text-gray-400 text-xs font-light leading-relaxed line-clamp-3">
                        {service.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-widest pt-2 group-hover:gap-3 transition-all">
                      <span>View Details</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
