import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Star, Tag, BookOpen } from 'lucide-react';
import { IBlog, IMedia, IUser } from '@intelligen/types';
import { TiptapRenderer } from '../../../components/TiptapRenderer';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Helper to fetch single blog
async function getBlog(slug: string): Promise<IBlog | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/blogs/${slug}`, {
      cache: 'no-store', // dynamic fetch on server
    });
    const data = await res.json();
    if (res.status === 200 && data.success) {
      return data.data;
    }
  } catch (err) {
    console.error(`[BlogDetail] Fetch error for slug ${slug}:`, err);
  }
  return null;
}

// Helper to fetch related blogs based on overlapping tags or recent as fallback
async function getRelatedBlogs(currentBlog: IBlog): Promise<IBlog[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/blogs?limit=20`, {
      cache: 'no-store',
    });
    const data = await res.json();
    if (res.status === 200 && data.success) {
      const allBlogs: IBlog[] = data.data;
      
      // Exclude current blog post
      const otherBlogs = allBlogs.filter(b => b._id !== currentBlog._id);
      
      // Calculate overlapping tags count
      const scored = otherBlogs.map(b => {
        const intersection = b.tags?.filter(t => currentBlog.tags?.includes(t)) || [];
        return {
          blog: b,
          score: intersection.length
        };
      });

      // Sort: highest tag overlap score first, then newest publishedDate
      scored.sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        const dateA = a.blog.publishedAt ? new Date(a.blog.publishedAt).getTime() : 0;
        const dateB = b.blog.publishedAt ? new Date(b.blog.publishedAt).getTime() : 0;
        return dateB - dateA;
      });

      return scored.slice(0, 3).map(s => s.blog);
    }
  } catch (err) {
    console.error('[BlogDetail] Error fetching related blogs:', err);
  }
  return [];
}

// Tiptap Renderer moved to components/TiptapRenderer

// Generate SEO Metadata dynamically
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return {
      title: 'Article Not Found | GrowMedLink Insights',
    };
  }

  const image = blog.image as IMedia;

  return {
    title: blog.metaTitle || `${blog.title} | GrowMedLink Insights`,
    description: blog.metaDescription || blog.summary,
    keywords: blog.keywords || [],
    alternates: {
      canonical: blog.canonicalUrl || undefined,
    },
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.summary,
      images: [
        {
          url: blog.ogImage || image?.secureUrl || '',
        },
      ],
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return (
      <main className="min-h-screen bg-[#020C1B] text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl md:text-3xl font-heading font-black mb-2">Article not found</h1>
        <p className="text-gray-400 text-sm mb-6 max-w-sm">The publication you are searching for does not exist or has been removed from our listings.</p>
        <Link href="/blog" className="px-5 py-2.5 bg-secondary text-[#020C1B] font-bold rounded-xl text-sm transition-all hover:scale-[1.01]">
          Back to Insights
        </Link>
      </main>
    );
  }

  const image = blog.image as IMedia;
  const author = blog.author as IUser;
  const relatedBlogs = await getRelatedBlogs(blog);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0A192F] to-[#020C1B] text-white py-16 px-6 relative">
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[#0A192F]/40 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Insights</span>
        </Link>

        {/* Hero Header Block */}
        <div className="space-y-6">
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 font-light">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-secondary" />
              {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              }) : 'Draft'}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-secondary" />
              {blog.readingTime || 1} min read
            </span>
            {author && (
              <span className="bg-white/5 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-gray-300">
                By {author.name}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-heading font-black leading-tight text-white">
            {blog.title}
          </h1>

          <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed border-l-2 border-secondary/35 pl-4 py-0.5">
            {blog.summary}
          </p>

          {/* Featured Image cover */}
          <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 relative bg-[#020C1B]">
            {image?.secureUrl ? (
              <img
                src={image.secureUrl}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                No Cover Image
              </div>
            )}
            
            {blog.isFeatured && (
              <div className="absolute top-4 right-4 bg-secondary text-[#020C1B] px-3 py-1 rounded-md text-[10px] uppercase font-bold tracking-widest flex items-center gap-1 shadow-md">
                <Star className="h-3 w-3 fill-[#020C1B]" />
                <span>Featured Post</span>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Content Details */}
        <div className="bg-[#0A192F]/10 border border-white/5 p-6 md:p-8 rounded-3xl space-y-6">
          {blog.content ? (
            <TiptapRenderer content={blog.content} />
          ) : (
            <p className="text-gray-500 italic text-sm">No detailed content provided yet.</p>
          )}

          {/* Tags list */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
              {blog.tags.map(t => (
                <span key={t} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#020C1B]/80 border border-white/10 rounded-xl text-xs text-gray-400">
                  <Tag className="h-3.5 w-3.5" />
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Related Articles Widget */}
        {relatedBlogs.length > 0 && (
          <div className="space-y-6 pt-10 border-t border-white/5">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-secondary" />
              <h2 className="text-xl font-heading font-black text-white">Related Insights</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map(related => {
                const rImage = related.image as IMedia;
                return (
                  <Link
                    key={related._id}
                    href={`/blog/${related.slug}`}
                    className="group bg-[#0A192F]/20 hover:bg-[#0A192F]/40 border border-white/5 hover:border-white/10 p-4 rounded-2xl flex flex-col gap-3 transition-all hover:-translate-y-0.5 duration-300"
                  >
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-[#020C1B]">
                      {rImage?.secureUrl ? (
                        <img
                          src={rImage.secureUrl}
                          alt={related.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 bg-white/5 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400 font-light uppercase tracking-wider block">
                        {related.publishedAt ? new Date(related.publishedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric'
                        }) : 'Draft'}
                      </span>
                      <h4 className="text-sm font-bold text-white group-hover:text-secondary transition-colors line-clamp-2 leading-snug">
                        {related.title}
                      </h4>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Metadata Details Display for Verification */}
        <div className="bg-[#020C1B]/40 border border-white/5 p-6 rounded-2xl text-xs text-gray-500 space-y-3 font-mono">
          <div className="font-bold text-gray-400 uppercase tracking-widest border-b border-white/5 pb-1.5 mb-2">
            SEO Validation Metadata (Rendered in Document Head)
          </div>
          <p><span className="text-gray-400">Meta Title:</span> {blog.metaTitle || 'Default'}</p>
          <p><span className="text-gray-400">Meta Description:</span> {blog.metaDescription || 'Default'}</p>
          <p><span className="text-gray-400">Keywords:</span> {blog.keywords?.join(', ') || 'None'}</p>
          <p><span className="text-gray-400">Canonical:</span> {blog.canonicalUrl || 'Auto'}</p>
          <p><span className="text-gray-400">OG Image:</span> {blog.ogImage || 'Featured secureUrl'}</p>
        </div>

      </div>
    </main>
  );
}
