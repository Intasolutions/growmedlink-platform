import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getServices } from '@/lib/api/services';
import { ArrowRight, Globe, BookOpen } from 'lucide-react';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Our Services',
  description: 'Explore our world-class immigration pathways and professional language coaching services.',
};

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const resolvedParams = await searchParams;
  const category = resolvedParams.category || '';
  const services = await getServices(category);

  return (
    <div className="min-h-screen bg-[#020C1B]">
      {/* Header */}
      <section className="bg-[#0A192F] py-20 border-b border-[#1E2D3D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black font-heading text-white mb-6">Our Services</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light mb-8">
            Specialized immigration pathways and elite language coaching tailored to your global ambitions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/services"
              className={`px-6 py-2 rounded-full text-sm font-bold transition-colors ${!category ? 'bg-secondary text-[#020C1B]' : 'bg-[#020C1B] text-gray-400 hover:text-white border border-white/10'}`}
            >
              All Services
            </Link>
            <Link
              href="/services?category=Immigration"
              className={`px-6 py-2 rounded-full text-sm font-bold transition-colors ${category === 'Immigration' ? 'bg-secondary text-[#020C1B]' : 'bg-[#020C1B] text-gray-400 hover:text-white border border-white/10'}`}
            >
              Immigration
            </Link>
            <Link
              href="/services?category=Language"
              className={`px-6 py-2 rounded-full text-sm font-bold transition-colors ${category === 'Language' ? 'bg-secondary text-[#020C1B]' : 'bg-[#020C1B] text-gray-400 hover:text-white border border-white/10'}`}
            >
              Language Coaching
            </Link>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {services.length === 0 ? (
            <div className="text-center py-24">
              <Globe className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">No Services Found</h2>
              <p className="text-gray-400">We couldn't find any services matching this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service: any) => (
                <Link key={service._id} href={`/services/${service.slug}`} className="group block h-full">
                  <div className="bg-[#0A192F] rounded-2xl border border-[#1E2D3D] overflow-hidden hover:border-secondary/50 transition-colors h-full flex flex-col">
                    <div className="relative h-48 w-full bg-[#020C1B]">
                      {service.image && (
                        <Image
                          src={typeof service.image === 'object' ? service.image.secureUrl : service.image}
                          alt={service.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute top-4 left-4 bg-[#020C1B]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                        {service.category === 'Immigration' ? <Globe className="h-3 w-3 text-secondary" /> : <BookOpen className="h-3 w-3 text-secondary" />}
                        <span className="text-xs font-bold text-white tracking-wider uppercase">{service.category}</span>
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-secondary transition-colors line-clamp-2">{service.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">{service.description}</p>
                      <span className="text-secondary text-sm font-bold flex items-center gap-2 mt-auto">
                        View Details <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
