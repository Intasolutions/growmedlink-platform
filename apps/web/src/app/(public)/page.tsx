import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getServices } from '@/lib/api/services';
import { getBlogs } from '@/lib/api/blogs';
import { ArrowRight, Globe, BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch featured services and blogs
  const [allServices, allBlogs] = await Promise.all([
    getServices().catch(() => []),
    getBlogs().catch(() => [])
  ]);

  // Optionally filter for featured, or just take first 3
  const featuredServices = allServices.slice(0, 3);
  const recentBlogs = allBlogs.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold tracking-widest uppercase mb-6">
            World-Class Education & Migration
          </span>
          <h1 className="text-5xl md:text-7xl font-black font-heading tracking-tight mb-8">
            Intelligen Immigration <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#F59E0B]">
              & Language Academy
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Embark on your journey to study, work, or live abroad. Achieve your target IELTS, PTE, or OET scores with our elite training.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/services"
              className="px-8 py-4 bg-secondary text-[#020C1B] rounded-xl font-bold hover:bg-secondary-dark transition-colors"
            >
              Explore Services
            </Link>
            <Link
              href="/talk-to-expert"
              className="px-8 py-4 bg-[#0A192F] border border-[#1E2D3D] text-white rounded-xl font-bold hover:border-secondary/50 hover:bg-[#0A192F]/80 transition-colors"
            >
              Consult an Expert
            </Link>
          </div>
        </div>
        
        {/* Abstract Backgrounds */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      </section>

      {/* Featured Services Section */}
      <section className="py-24 bg-[#0A192F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-black font-heading text-white mb-4">Our Core Services</h2>
              <p className="text-gray-400 max-w-2xl">We offer specialized immigration pathways and world-class language coaching tailored to your global ambitions.</p>
            </div>
            <Link href="/services" className="hidden md:flex items-center gap-2 text-secondary font-bold hover:underline">
              View All Services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service: any) => (
              <Link key={service._id} href={`/services/${service.slug}`} className="group block h-full">
                <div className="bg-[#020C1B] rounded-2xl border border-[#1E2D3D] overflow-hidden hover:border-secondary/50 transition-colors h-full flex flex-col">
                  <div className="relative h-48 w-full bg-[#0A192F]">
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
                      Learn More <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-10 text-center md:hidden">
            <Link href="/services" className="inline-flex items-center gap-2 text-secondary font-bold hover:underline">
              View All Services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Insights Section */}
      <section className="py-24 bg-[#020C1B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-black font-heading text-white mb-4">Latest Insights</h2>
              <p className="text-gray-400 max-w-2xl">Stay updated with the latest news on immigration policies, study abroad tips, and language test strategies.</p>
            </div>
            <Link href="/blog" className="hidden md:flex items-center gap-2 text-secondary font-bold hover:underline">
              View All Articles <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentBlogs.map((blog: any) => (
              <Link key={blog._id} href={`/blog/${blog.slug}`} className="group block">
                <div className="bg-[#0A192F] rounded-2xl border border-[#1E2D3D] overflow-hidden hover:border-secondary/50 transition-colors h-full flex flex-col">
                  <div className="relative h-48 w-full bg-[#020C1B]">
                    {blog.image && (
                      <Image
                        src={typeof blog.image === 'object' ? blog.image.secureUrl : blog.image}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags?.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="text-[10px] uppercase tracking-widest font-bold text-secondary bg-secondary/10 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-secondary transition-colors line-clamp-2">{blog.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">{blog.summary}</p>
                    <div className="flex justify-between items-center mt-auto text-xs text-gray-500 font-medium">
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      <span>{blog.readingTime || 5} min read</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center md:hidden">
            <Link href="/blog" className="inline-flex items-center gap-2 text-secondary font-bold hover:underline">
              View All Articles <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
