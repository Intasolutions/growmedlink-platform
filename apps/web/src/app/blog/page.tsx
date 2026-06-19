'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Search, ArrowRight, RefreshCw, AlertCircle, Calendar, Clock, Star, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { IBlog, IMedia, IUser } from '@intelligen/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function PublicBlogsPage() {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [featuredBlog, setFeaturedBlog] = useState<IBlog | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(6);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // reset to page 1 on new search
    }, 4000); // 400ms debounce
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch featured blog (run once on load or if selectedTag/search changes)
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/blogs?featured=true&limit=1`);
        const data = await res.json();
        if (res.status === 200 && data.success && data.data.length > 0) {
          setFeaturedBlog(data.data[0]);
        } else {
          setFeaturedBlog(null);
        }
      } catch (err) {
        console.error('[PublicBlogs] Featured fetch error:', err);
      }
    };
    fetchFeatured();
  }, []);

  // Fetch paginated blogs list with search/tag filters
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      
      let queryStr = `page=${page}&limit=${limit}`;
      if (debouncedSearch) {
        queryStr += `&search=${encodeURIComponent(debouncedSearch)}`;
      }
      if (selectedTag && selectedTag !== 'All') {
        queryStr += `&tag=${encodeURIComponent(selectedTag)}`;
      }

      const res = await fetch(`${API_BASE_URL}/api/blogs?${queryStr}`);
      const data = await res.json();
      if (res.status === 200 && data.success) {
        setBlogs(data.data);
        if (data.pagination) {
          setTotalPages(data.pagination.pages || 1);
        }
      } else {
        setErrorMsg(data.message || 'Failed to retrieve blog feed.');
      }
    } catch (err) {
      console.error('[PublicBlogs] Fetch error:', err);
      setErrorMsg('Could not establish connection to the server.');
    } finally {
      setLoading(false);
    }
  };

  // Compile list of unique tags from all posts to filter by
  useEffect(() => {
    const fetchAllTags = async () => {
      try {
        // Fetch a list of blogs without pagination to gather all unique tags
        const res = await fetch(`${API_BASE_URL}/api/blogs?limit=50`);
        const data = await res.json();
        if (res.status === 200 && data.success) {
          const tagsSet = new Set<string>();
          data.data.forEach((b: IBlog) => {
            if (b.tags) {
              b.tags.forEach(t => tagsSet.add(t));
            }
          });
          setUniqueTags(Array.from(tagsSet));
        }
      } catch (err) {
        console.error('[PublicBlogs] Error gathering tags:', err);
      }
    };
    fetchAllTags();
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [page, debouncedSearch, selectedTag]);

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0A192F] to-[#020C1B] text-white py-16 px-6 relative">
      {/* Decorative blurred backgrounds */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-secondary/5 rounded-full filter blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full filter blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full text-secondary text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="h-3.5 w-3.5" />
            <span>GrowMedLink Insights</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-black tracking-wide">
            Educational <span className="text-secondary">Resources</span> & News
          </h1>
          <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed">
            Stay updated with the latest express entry draw results, visa procedures, exam training strategies, and academy announcements.
          </p>
        </div>

        {/* Featured Hero Article Slot (Only show on Page 1 if featured blog exists, and no filters active) */}
        {page === 1 && !debouncedSearch && selectedTag === 'All' && featuredBlog && (
          <div className="bg-[#0A192F]/30 border border-white/5 rounded-3xl overflow-hidden p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-center shadow-xl">
            {/* Thumbnail */}
            <div className="w-full lg:w-1/2 aspect-video rounded-2xl overflow-hidden relative bg-[#020C1B] border border-white/5 shrink-0">
              {featuredBlog.image ? (
                <img
                  src={(featuredBlog.image as IMedia).secureUrl}
                  alt={featuredBlog.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
              )}
              <div className="absolute top-4 left-4 bg-secondary text-[#020C1B] px-3 py-1 rounded-md text-[10px] uppercase font-bold tracking-widest flex items-center gap-1">
                <Star className="h-3 w-3 fill-[#020C1B]" />
                <span>Featured</span>
              </div>
            </div>
            
            {/* Info details */}
            <div className="space-y-4 flex-1">
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 font-light">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-secondary" />
                  {featuredBlog.publishedAt ? new Date(featuredBlog.publishedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  }) : 'Draft'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-secondary" />
                  {featuredBlog.readingTime || 1} min read
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-heading font-black text-white hover:text-secondary transition-colors leading-tight line-clamp-2">
                <Link href={`/blog/${featuredBlog.slug}`}>{featuredBlog.title}</Link>
              </h2>

              <p className="text-gray-400 text-sm font-light leading-relaxed line-clamp-3">
                {featuredBlog.summary}
              </p>

              {featuredBlog.tags && featuredBlog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {featuredBlog.tags.map(t => (
                    <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-gray-400">
                      <Tag className="h-3 w-3" />
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-4">
                <Link
                  href={`/blog/${featuredBlog.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary-dark text-[#020C1B] font-bold rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-secondary/10 transition-all hover:scale-[1.01]"
                >
                  <span>Read Article</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Toolbar: Search, Filters, Tags selector */}
        <div className="flex flex-col md:flex-row gap-6 border-b border-white/5 pb-8 justify-between items-center">
          
          {/* Tags Pills list */}
          <div className="flex flex-wrap gap-2 order-2 md:order-1 self-start md:self-auto">
            <button
              onClick={() => handleTagSelect('All')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                selectedTag === 'All'
                  ? 'bg-secondary border-secondary text-[#020C1B] font-bold'
                  : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              All Topics
            </button>
            {uniqueTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagSelect(tag)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  selectedTag === tag
                    ? 'bg-secondary border-secondary text-[#020C1B] font-bold'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Search Input field */}
          <div className="relative w-full md:w-80 order-1 md:order-2">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-11 pr-4 py-2.5 bg-[#020C1B]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition-all text-xs"
            />
          </div>
        </div>

        {/* List View States */}
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin" />
            <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Retrieving posts...</span>
          </div>
        ) : errorMsg ? (
          <div className="flex flex-col items-center justify-center h-80 text-center gap-4">
            <div className="flex items-center gap-2 bg-red-500/15 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={fetchBlogs}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold hover:bg-white/10 transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry</span>
            </button>
          </div>
        ) : blogs.length === 0 ? (
          <div className="h-80 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-[#0A192F]/10">
            <p className="text-gray-400 text-sm">No articles found matching your criteria.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Grid display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map(blog => {
                const image = blog.image as IMedia;
                const author = blog.author as IUser;
                return (
                  <Link
                    key={blog._id}
                    href={`/blog/${blog.slug}`}
                    className={`group bg-[#0A192F]/30 hover:bg-[#0A192F]/50 border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col hover:-translate-y-1 hover:shadow-2xl ${
                      blog.isFeatured
                        ? 'border-secondary/30 hover:border-secondary/50'
                        : 'border-white/5 hover:border-white/20'
                    }`}
                  >
                    {/* Cover image */}
                    <div className="aspect-video w-full relative bg-[#020C1B] overflow-hidden">
                      {image?.secureUrl ? (
                        <img
                          src={image.secureUrl}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 bg-white/5">
                          No Image
                        </div>
                      )}
                      
                      {/* Featured star badge */}
                      {blog.isFeatured && (
                        <div className="absolute top-4 right-4 bg-secondary text-[#020C1B] p-1.5 rounded-lg border border-secondary/20 shadow-md">
                          <Star className="h-3.5 w-3.5 fill-[#020C1B] stroke-[#020C1B]" />
                        </div>
                      )}
                    </div>

                    {/* Content body */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        {/* Meta lines */}
                        <div className="flex items-center gap-3 text-[10px] text-gray-400 font-light uppercase tracking-wider">
                          <span>
                            {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric'
                            }) : 'Draft'}
                          </span>
                          <span>•</span>
                          <span>{blog.readingTime || 1} min read</span>
                        </div>
                        
                        <h3 className="text-lg font-heading font-black text-white group-hover:text-secondary transition-colors line-clamp-2">
                          {blog.title}
                        </h3>
                        
                        <p className="text-gray-400 text-xs font-light leading-relaxed line-clamp-3">
                          {blog.summary}
                        </p>
                      </div>

                      {/* Read details link */}
                      <div className="flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-widest pt-2 group-hover:gap-3 transition-all">
                        <span>Read Article</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination Grid wrapper */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 bg-[#0A192F]/20 border border-white/5 rounded-2xl text-xs text-gray-400">
                <div>
                  Page <span className="font-semibold text-white">{page}</span> of <span className="font-semibold text-white">{totalPages}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/5 disabled:opacity-40 transition-all"
                  >
                    <ChevronLeft className="h-4.5 w-4.5" />
                  </button>
                  <button
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/5 disabled:opacity-40 transition-all"
                  >
                    <ChevronRight className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
