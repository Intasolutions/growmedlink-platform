import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogs } from '@/lib/api/blogs';
import { ArrowRight, Clock, Calendar, BookOpen } from 'lucide-react';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Insights & Blog',
  description: 'Stay updated with the latest news on immigration policies, study abroad tips, and language test strategies.',
};

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <div className="min-h-screen bg-[#020C1B]">
      {/* Header */}
      <section className="bg-[#0A192F] py-20 border-b border-[#1E2D3D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black font-heading text-white mb-6">Insights & Articles</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
            Stay updated with the latest news on immigration policies, study abroad tips, and language test strategies.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {blogs.length === 0 ? (
            <div className="text-center py-24">
              <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">No Articles Found</h2>
              <p className="text-gray-400">Check back later for new insights.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog: any) => (
                <Link key={blog._id} href={`/blog/${blog.slug}`} className="group block h-full">
                  <div className="bg-[#0A192F] rounded-2xl border border-[#1E2D3D] overflow-hidden hover:border-secondary/50 transition-colors h-full flex flex-col">
                    <div className="relative h-56 w-full bg-[#020C1B]">
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
                        {blog.tags?.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="text-[10px] uppercase tracking-widest font-bold text-secondary bg-secondary/10 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-secondary transition-colors line-clamp-2 leading-snug">{blog.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">{blog.summary}</p>
                      
                      <div className="flex justify-between items-center mt-auto border-t border-white/5 pt-4 text-xs text-gray-500 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {blog.readingTime || 5} min read
                        </div>
                      </div>
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
