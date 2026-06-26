import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getServiceBySlug, getServices } from '@/lib/api/services';
import { TiptapRenderer } from '@/components/TiptapRenderer';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { IMedia } from '@intelligen/types';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const service = await getServiceBySlug(resolvedParams.slug);
  if (!service) return {};
  
  return {
    title: service.metaTitle || service.title,
    description: service.metaDescription || service.description,
    openGraph: {
      images: service.ogImage ? [service.ogImage] : (service.image ? [typeof service.image === 'object' ? service.image.secureUrl : service.image] : []),
    }
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const service = await getServiceBySlug(resolvedParams.slug);

  if (!service) {
    notFound();
  }

  const relatedServicesAll = await getServices(service.category);
  const relatedServices = relatedServicesAll
    .filter((s: any) => s._id !== service._id)
    .slice(0, 2);

  const imageUrl = typeof service.image === 'object' ? service.image.secureUrl : service.image;

  return (
    <div className="min-h-screen bg-[#020C1B]">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={service.title}
              fill
              className="object-cover opacity-30"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020C1B] via-[#020C1B]/80 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center mt-20">
          <span className="inline-block py-1 px-4 rounded-full bg-secondary/20 border border-secondary/30 text-secondary text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-md">
            {service.category}
          </span>
          <h1 className="text-4xl md:text-6xl font-black font-heading text-white mb-6 leading-tight">
            {service.title}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            {service.description}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 -mt-20 relative z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2">
              <Link href="/services" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors text-sm font-bold uppercase tracking-wider">
                <ArrowLeft className="h-4 w-4" /> Back to Services
              </Link>
              <div className="bg-[#0A192F] border border-[#1E2D3D] rounded-3xl p-8 md:p-12 shadow-2xl">
                <TiptapRenderer content={service.content} />
              </div>

              {/* Secondary Section & Features */}
              {(service.secondaryHeading || service.secondaryImage || (service.features && service.features.length > 0)) && (
                <div className="mt-12 bg-[#020C1B]/80 border border-[#1E2D3D] rounded-3xl p-8 md:p-12">
                  {service.secondaryHeading && (
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                      {service.secondaryHeading}
                    </h2>
                  )}
                  {service.secondaryImage && (
                    <div className="mb-10 rounded-2xl overflow-hidden border border-white/5 shadow-lg">
                      <Image
                        src={(service.secondaryImage as IMedia).secureUrl}
                        alt={(service.secondaryImage as IMedia).filename || service.secondaryHeading || 'Service image'}
                        width={800}
                        height={400}
                        className="w-full h-auto object-cover max-h-[400px]"
                      />
                    </div>
                  )}
                  {service.features && service.features.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                      {service.features.map((feature: any, idx: number) => (
                        <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-secondary/30 transition-colors">
                          <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
                          <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar CTA */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-[#0A192F] border border-[#1E2D3D] rounded-3xl p-8 text-center shadow-xl">
                <h3 className="text-xl font-bold text-white mb-4">Ready to start?</h3>
                <p className="text-sm text-gray-400 mb-8">Book a dedicated consultation session with our experts to discuss your requirements.</p>
                <Link
                  href="/talk-to-expert"
                  className="block w-full py-4 bg-secondary text-[#020C1B] rounded-xl font-bold hover:bg-secondary-dark transition-colors mb-4"
                >
                  Consult an Expert
                </Link>
                <div className="space-y-3 text-left border-t border-white/5 pt-6">
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" /> Fast Processing
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" /> Certified Professionals
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" /> High Success Rate
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="py-16 bg-[#020C1B] border-t border-white/5">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-10 text-center">Related Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedServices.map((rs: any) => (
                <Link key={rs._id} href={`/services/${rs.slug}`} className="group block">
                  <div className="bg-[#0A192F] border border-[#1E2D3D] rounded-3xl overflow-hidden hover:border-secondary/50 transition-all duration-300">
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={typeof rs.image === 'object' ? rs.image.secureUrl : rs.image}
                        alt={rs.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-secondary transition-colors">{rs.title}</h3>
                      <p className="text-sm text-gray-400 line-clamp-2">{rs.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
