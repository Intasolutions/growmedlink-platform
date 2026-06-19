import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogBySlug } from '@/lib/api/blogs';
import { TiptapRenderer } from '@/components/TiptapRenderer';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const blog = await getBlogBySlug(resolvedParams.slug);
  if (!blog) return {};
  
  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.summary,
    openGraph: {
      images: blog.ogImage ? [blog.ogImage] : (blog.image ? [typeof blog.image === 'object' ? blog.image.secureUrl : blog.image] : []),
      type: 'article',
    }
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const blog = await getBlogBySlug(resolvedParams.slug);

  if (!blog) {
    notFound();
  }

  const imageUrl = typeof blog.image === 'object' ? blog.image.secureUrl : blog.image;

  return (
    <div className="min-h-screen bg-[#020C1B]">
      {/* Article Header */}
      <section className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors text-sm font-bold uppercase tracking-wider">
            <ArrowLeft className="h-4 w-4" /> All Articles
          </Link>
          
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {blog.tags?.map((tag: string) => (
              <span key={tag} className="text-xs uppercase tracking-widest font-bold text-secondary bg-secondary/10 border border-secondary/20 px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-heading text-white mb-8 leading-tight">
            {blog.title}
          </h1>

          <div className="flex justify-center items-center gap-6 text-sm text-gray-400 font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-secondary" />
              {new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-secondary" />
              {blog.readingTime || 5} min read
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {imageUrl && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-white/5">
            <Image
              src={imageUrl}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </section>
      )}

      {/* Article Content */}
      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-invert prose-lg max-w-none">
            <TiptapRenderer content={blog.content} />
          </div>
        </div>
      </section>
    </div>
  );
}
