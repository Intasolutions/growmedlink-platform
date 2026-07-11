'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Star, StarOff, AlertCircle, RefreshCw, ChevronLeft, ChevronRight, FileText, Search, X } from 'lucide-react';
import { IBlog } from '@intelligen/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const LIMIT = 10;

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>('');

  const fetchBlogs = async (p: number, q: string) => {
    try {
      setLoading(true);
      setErrorMsg('');
      const params = new URLSearchParams({ page: p.toString(), limit: LIMIT.toString() });
      if (q) params.append('search', q);
      const res = await fetch(`${API_BASE_URL}/api/blogs?${params}`, { method: 'GET', credentials: 'include' });
      const data = await res.json();
      if (res.status === 200 && data.success) {
        setBlogs(data.data);
        if (data.pagination) {
          setTotalPages(data.pagination.pages || 1);
          setTotal(data.pagination.total || data.data.length);
        } else {
          setTotalPages(1);
          setTotal(data.data.length);
        }
      } else {
        setErrorMsg(data.message || 'Failed to fetch blog posts.');
      }
    } catch (err) {
      console.error('[AdminBlogs] Fetch error:', err);
      setErrorMsg('Could not establish connection to the API server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(page, search); }, [page]);

  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchBlogs(1, search); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the article "${title}"? This is a soft-delete and can be restored.`)) return;
    try {
      setDeletingId(id);
      const res = await fetch(`${API_BASE_URL}/api/blogs/${id}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (res.status === 200 && data.success) {
        setBlogs(prev => prev.filter(b => b._id !== id));
        setTotal(prev => prev - 1);
      } else {
        alert(data.message || 'Failed to delete blog post.');
      }
    } catch (err) {
      console.error('[AdminBlogs] Delete error:', err);
      alert('Connection failed. Blog post could not be deleted.');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500/10 text-green-400 border border-green-500/15';
      case 'archived': return 'bg-red-500/10 text-red-400 border border-red-500/15';
      default: return 'bg-amber-500/10 text-amber-400 border border-amber-500/15';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-[#0A192F]/40 border border-white/5 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-black tracking-wide text-white">Blogs Management</h1>
          <p className="text-gray-400 text-sm mt-1 font-light">
            Compose, edit, and publish rich articles and news updates for GrowMedLink.
            {total > 0 && <span className="ml-2 text-gray-500">({total} total)</span>}
          </p>
        </div>
        <Link href="/admin/blogs/new" className="flex items-center justify-center gap-2 px-5 py-3 bg-secondary hover:bg-secondary-dark text-[#020C1B] font-bold rounded-xl shadow-lg shadow-secondary/15 transition-all hover:scale-[1.01] active:scale-[0.99] shrink-0">
          <Plus className="h-5 w-5" /><span>Write Article</span>
        </Link>
      </div>

      {/* Search bar */}
      <div className="bg-[#0A192F] border border-[#1E2D3D] p-4 rounded-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles by title, slug or author..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#020C1B] border border-white/5 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {errorMsg && (
        <div className="flex items-center gap-3 bg-red-500/15 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="leading-relaxed font-medium">{errorMsg}</span>
          <button onClick={() => fetchBlogs(page, search)} className="ml-auto flex items-center gap-1.5 px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold border border-red-500/20 transition-all">
            <RefreshCw className="h-3.5 w-3.5" /><span>Retry</span>
          </button>
        </div>
      )}

      {loading ? (
        <div className="border border-dashed border-white/10 rounded-2xl h-80 flex items-center justify-center bg-[#0A192F]/10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin" />
            <span className="text-xs font-medium text-gray-400 tracking-wide uppercase">Retrieving articles...</span>
          </div>
        </div>
      ) : blogs.length === 0 && !errorMsg ? (
        <div className="border border-dashed border-white/10 rounded-2xl h-80 flex flex-col items-center justify-center bg-[#0A192F]/10 text-center p-6">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 mb-4 text-gray-500">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="text-white font-bold text-base mb-1">{search ? 'No articles match your search' : 'No articles composed'}</h3>
          <p className="text-gray-400 text-xs font-light max-w-sm mb-6">
            {search ? `No results found for "${search}". Try a different search term.` : 'Get started by composing your first rich educational article or announcement post.'}
          </p>
          {!search && (
            <Link href="/admin/blogs/new" className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg border border-white/10 text-xs transition-all">
              Compose Article
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-[#0A192F]/20 border border-white/5 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-[#020C1B]/40 text-xs font-bold text-gray-300 uppercase tracking-widest">
                    <th className="py-4 px-6">Article Title & Slug</th>
                    <th className="py-4 px-6">Author</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-center">Featured</th>
                    <th className="py-4 px-6">Published Date</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                  {blogs.map((blog) => (
                    <tr key={blog._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-6 max-w-sm">
                        <div className="font-semibold text-white truncate">{blog.title}</div>
                        <div className="text-xs text-gray-400 font-mono truncate mt-0.5">/{blog.slug}</div>
                      </td>
                      <td className="py-4 px-6 text-gray-400">
                        {typeof blog.author === 'object' ? blog.author.name : 'Unknown Author'}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getStatusBadge(blog.status)}`}>
                          {blog.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex justify-center">
                          {blog.isFeatured ? <Star className="h-5 w-5 text-amber-500 fill-amber-500" /> : <StarOff className="h-5 w-5 text-gray-500" />}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-400 font-light">
                        {blog.publishedAt
                          ? new Date(blog.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
                          : <span className="italic text-gray-500 text-xs">Not Published</span>}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2 shrink-0">
                        <Link href={`/admin/blogs/${blog._id}`} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 text-gray-300 rounded-lg text-xs font-semibold transition-all">
                          <Edit className="h-3.5 w-3.5" /><span>Edit</span>
                        </Link>
                        <button onClick={() => handleDelete(blog._id, blog.title)} disabled={deletingId === blog._id}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold border border-red-500/10 transition-all disabled:opacity-50">
                          <Trash2 className="h-3.5 w-3.5" /><span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 bg-[#0A192F]/20 border border-white/5 rounded-2xl text-sm text-gray-400">
              <div>Page <span className="font-semibold text-white">{page}</span> of <span className="font-semibold text-white">{totalPages}</span></div>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}
                  className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/5 disabled:opacity-40 transition-all">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}
                  className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/5 disabled:opacity-40 transition-all">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
