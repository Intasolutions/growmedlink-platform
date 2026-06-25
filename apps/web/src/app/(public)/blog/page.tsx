import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogsPaginated } from '@/lib/api/blogs';
import { ArrowRight, Clock, Calendar, BookOpen, Search, X } from 'lucide-react';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Insights & Blog',
  description: 'Stay updated with the latest news on immigration policies, study abroad tips, and language test strategies.',
};

const CATEGORIES = [
  { name: 'All Insights', tag: '' },
  { name: 'Nursing', tag: 'nursing' },
  { name: 'Study Abroad', tag: 'study-abroad' },
  { name: 'Immigration & Visas', tag: 'visa' },
  { name: 'English Exams', tag: 'english-test' },
  { name: 'Student Life', tag: 'student-life' },
];

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string; tag?: string }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10) || 1;
  const search = params.search || '';
  const tag = params.tag || '';
  const limit = 6; // 6 blogs per page

  const { blogs, pagination } = await getBlogsPaginated({ page, limit, search, tag });

  // URL Helper to keep search/tag query parameters during page switches
  const getPageUrl = (targetPage: number) => {
    const query = new URLSearchParams();
    query.append('page', String(targetPage));
    if (search) query.append('search', search);
    if (tag) query.append('tag', tag);
    return `/blog?${query.toString()}`;
  };

  const getTagUrl = (targetTag: string) => {
    const query = new URLSearchParams();
    if (search) query.append('search', search);
    if (targetTag) query.append('tag', targetTag);
    return `/blog?${query.toString()}`;
  };

  const getSearchResetUrl = () => {
    const query = new URLSearchParams();
    if (tag) query.append('tag', tag);
    return `/blog?${query.toString()}`;
  };

  return (
    <div className="min-h-screen bg-[#020C1B] text-white font-['Power_Grotesk']">
      
      {/* ── Header / Search banner ── */}
      <section className="bg-[#0A192F] py-20 border-b border-[#1E2D3D] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(150,202,69,0.06),transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Insights & Articles</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Stay updated with the latest news on immigration policies, study abroad tips, and language test strategies.
          </p>

          {/* Search form */}
          <form action="/blog" method="GET" className="max-w-md mx-auto mt-8 flex gap-2">
            {tag && <input type="hidden" name="tag" value={tag} />}
            <div className="relative flex-grow">
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#020C1B]/80 border border-[#1E2D3D] text-white focus:outline-none focus:border-[#96CA45] placeholder-gray-500 text-sm transition-all"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#96CA45] text-black font-bold rounded-lg hover:brightness-95 active:scale-95 transition-all text-sm"
            >
              Search
            </button>
          </form>

          {search && (
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
              Showing results for &quot;{search}&quot;
              <Link href={getSearchResetUrl()} className="text-red-400 hover:text-red-300 ml-1">
                <X className="h-3 w-3 inline-block" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Filter Tags & Cards stage ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12 border-b border-white/5 pb-6">
            {CATEGORIES.map((cat) => {
              const isActive = tag === cat.tag;
              return (
                <Link
                  key={cat.name}
                  href={getTagUrl(cat.tag)}
                  className={`px-4 py-2 text-xs font-semibold rounded-full border tracking-wider transition-all uppercase ${
                    isActive
                      ? 'bg-[#96CA45] text-black border-[#96CA45]'
                      : 'bg-[#0A192F] text-gray-300 border-[#1E2D3D] hover:text-white hover:border-[#96CA45]/40'
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>

          {/* Cards Grid */}
          {blogs.length === 0 ? (
            <div className="text-center py-20 bg-[#0A192F]/40 border border-[#1E2D3D] rounded-2xl p-8">
              <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Articles Found</h2>
              <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
                {search 
                  ? `We couldn't find any articles matching "${search}". Try checking your spelling or clearing search filters.` 
                  : 'Check back later for new insights.'}
              </p>
              {(search || tag) && (
                <Link
                  href="/blog"
                  className="mt-6 inline-block px-5 py-2 bg-[#96CA45] text-black font-bold text-xs uppercase tracking-wider rounded-lg hover:brightness-95 transition-all"
                >
                  Clear Filters
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Blog posts list */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog: any) => (
                  <Link key={blog._id} href={`/blog/${blog.slug}`} className="group block h-full">
                    <div className="bg-[#0A192F] rounded-2xl border border-[#1E2D3D] overflow-hidden hover:border-[#96CA45]/50 transition-colors h-full flex flex-col shadow-lg">
                      
                      {/* Image container */}
                      <div className="relative h-52 w-full bg-[#020C1B] overflow-hidden">
                        {blog.image ? (
                          <Image
                            src={typeof blog.image === 'object' ? blog.image.secureUrl : blog.image}
                            alt={blog.title}
                            fill
                            sizes="(max-w-768px) 100vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#0A192F] text-gray-600">
                            <BookOpen className="h-8 w-8" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020C1B]/80 via-transparent to-transparent opacity-80" />
                      </div>

                      {/* Content panel */}
                      <div className="p-6 flex-grow flex flex-col">
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {blog.tags?.slice(0, 3).map((tagItem: string) => (
                            <span key={tagItem} className="text-[9px] uppercase tracking-wider font-bold text-[#96CA45] bg-[#96CA45]/10 px-2 py-0.5 rounded">
                              {tagItem}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#96CA45] transition-colors line-clamp-2 leading-snug">
                          {blog.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                          {blog.summary}
                        </p>
                        
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

              {/* Pagination controls */}
              {pagination.pages > 1 && (
                <div className="mt-16 flex items-center justify-center gap-2 border-t border-white/5 pt-8">
                  {/* Prev button */}
                  <Link
                    href={getPageUrl(page - 1)}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg border uppercase transition-all ${
                      page === 1
                        ? 'border-white/5 text-gray-600 pointer-events-none'
                        : 'border-[#1E2D3D] bg-[#0A192F] text-gray-300 hover:text-white hover:border-[#96CA45]'
                    }`}
                  >
                    Prev
                  </Link>

                  {/* Page numbers */}
                  {Array.from({ length: pagination.pages }, (_, i) => {
                    const pageNum = i + 1;
                    const isActive = pageNum === page;
                    return (
                      <Link
                        key={pageNum}
                        href={getPageUrl(pageNum)}
                        className={`w-9 h-9 flex items-center justify-center text-xs font-bold rounded-lg transition-all border ${
                          isActive
                            ? 'bg-[#96CA45] text-black border-[#96CA45]'
                            : 'bg-[#0A192F] text-gray-400 border-[#1E2D3D] hover:text-white hover:border-[#96CA45]'
                        }`}
                      >
                        {pageNum}
                      </Link>
                    );
                  })}

                  {/* Next button */}
                  <Link
                    href={getPageUrl(page + 1)}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg border uppercase transition-all ${
                      page === pagination.pages
                        ? 'border-white/5 text-gray-600 pointer-events-none'
                        : 'border-[#1E2D3D] bg-[#0A192F] text-gray-300 hover:text-white hover:border-[#96CA45]'
                    }`}
                  >
                    Next
                  </Link>
                </div>
              )}
            </>
          )}

        </div>
      </section>

    </div>
  );
}
