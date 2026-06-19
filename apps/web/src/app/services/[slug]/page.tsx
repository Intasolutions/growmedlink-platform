import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Star } from 'lucide-react';
import { IService, IMedia } from '@intelligen/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getService(slug: string): Promise<IService | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/services/${slug}`, {
      cache: 'no-store', // force dynamic fetching on server
    });
    const data = await res.json();
    if (res.status === 200 && data.success) {
      return data.data;
    }
  } catch (err) {
    console.error(`[ServiceDetail] Fetch error for slug ${slug}:`, err);
  }
  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    return {
      title: 'Service Not Found | GrowMedLink Academy',
    };
  }

  const image = service.image as IMedia;

  return {
    title: service.metaTitle || `${service.title} | GrowMedLink Academy`,
    description: service.metaDescription || service.description,
    keywords: service.keywords || [],
    alternates: {
      canonical: service.canonicalUrl || undefined,
    },
    openGraph: {
      title: service.metaTitle || service.title,
      description: service.metaDescription || service.description,
      images: [
        {
          url: service.ogImage || image?.secureUrl || '',
        },
      ],
    },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    return (
      <main className="min-h-screen bg-[#020C1B] text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl md:text-3xl font-heading font-black mb-2">Service not found</h1>
        <p className="text-gray-400 text-sm mb-6 max-w-sm">The visa pathway or coaching course you are looking for does not exist or has been removed.</p>
        <Link href="/services" className="px-5 py-2.5 bg-secondary text-[#020C1B] font-bold rounded-xl text-sm transition-all hover:scale-[1.01]">
          Back to Directory
        </Link>
      </main>
    );
  }

  const image = service.image as IMedia;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0A192F] to-[#020C1B] text-white py-16 px-6 relative">
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[#0A192F]/40 to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* Back Link */}
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Offerings</span>
        </Link>

        {/* Hero Banner Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#0A192F]/20 border border-white/5 p-6 rounded-2xl">
          {/* Cover image */}
          <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/10 relative bg-[#020C1B]">
            {image?.secureUrl ? (
              <img
                src={image.secureUrl}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
            
            <div className="absolute top-4 left-4">
              <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-widest ${
                service.category === 'Immigration'
                  ? 'bg-blue-500 text-white'
                  : 'bg-green-500 text-white'
              }`}>
                {service.category}
              </span>
            </div>
          </div>

          {/* Details header */}
          <div className="space-y-4">
            {service.isFeatured && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-[10px] font-bold uppercase tracking-wider">
                <Star className="h-3 w-3 fill-amber-500" />
                <span>Featured Program</span>
              </div>
            )}
            <h1 className="text-2xl md:text-4xl font-heading font-black leading-tight">
              {service.title}
            </h1>
            <p className="text-gray-300 text-sm font-light leading-relaxed">
              {service.description}
            </p>
          </div>
        </div>

        {/* Detailed Content Details */}
        <div className="bg-[#0A192F]/10 border border-white/5 p-6 md:p-8 rounded-2xl space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-white/5">
            <BookOpen className="h-5 w-5 text-secondary" />
            <h2 className="text-lg font-bold tracking-wide uppercase">Curriculum & Details</h2>
          </div>
          <div className="text-gray-300 font-light leading-relaxed text-sm md:text-base whitespace-pre-wrap font-sans">
            {service.content?.text || 'No detailed content provided yet.'}
          </div>
        </div>

        {/* Metadata Details Display for Verification */}
        <div className="bg-[#020C1B]/40 border border-white/5 p-6 rounded-2xl text-xs text-gray-500 space-y-3 font-mono">
          <div className="font-bold text-gray-400 uppercase tracking-widest border-b border-white/5 pb-1.5 mb-2">
            SEO Validation Metadata (Rendered in Document Head)
          </div>
          <p><span className="text-gray-400">Meta Title:</span> {service.metaTitle || 'Default'}</p>
          <p><span className="text-gray-400">Meta Description:</span> {service.metaDescription || 'Default'}</p>
          <p><span className="text-gray-400">Keywords:</span> {service.keywords?.join(', ') || 'None'}</p>
          <p><span className="text-gray-400">Canonical:</span> {service.canonicalUrl || 'Auto'}</p>
          <p><span className="text-gray-400">OG Image:</span> {service.ogImage || 'Featured secureUrl'}</p>
        </div>

      </div>
    </main>
  );
}
