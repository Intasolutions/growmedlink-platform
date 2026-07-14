'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Edit, Trash2, AlertCircle, RefreshCw, Folder, Search, X } from 'lucide-react';
import { ICategory } from '@intelligen/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  // Modal / Editor State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);

  // Form State
  const [formName, setFormName] = useState<string>('');
  const [formSlug, setFormSlug] = useState<string>('');
  const [formOrder, setFormOrder] = useState<number>(0);
  const [formError, setFormError] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await fetch(`${API_BASE_URL}/api/categories`, { method: 'GET', credentials: 'include' });
      const data = await res.json();
      if (res.status === 200 && data.success) {
        setCategories(data.data);
      } else {
        setErrorMsg(data.message || 'Failed to fetch categories.');
      }
    } catch (err) {
      console.error('[AdminCategories] Fetch error:', err);
      setErrorMsg('Could not establish connection to the API server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  // Client-side filter (categories list is small, no need for server search)
  const filtered = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories.filter(c => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q));
  }, [categories, search]);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormName('');
    setFormSlug('');
    setFormOrder(0);
    setFormError({});
    setIsModalOpen(true);
  };

  const openEditModal = (cat: ICategory) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormOrder(cat.order ?? 0);
    setFormError({});
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError({});
    setSubmitting(true);
    try {
      const url = editingCategory ? `${API_BASE_URL}/api/categories/${editingCategory._id}` : `${API_BASE_URL}/api/categories`;
      const method = editingCategory ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formName, slug: formSlug, order: formOrder }),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchCategories();
      } else {
        if (data.errors) setFormError(data.errors);
        else alert(data.message || 'An error occurred.');
      }
    } catch (err) {
      console.error('[AdminCategories] Save error:', err);
      alert('Network error. Failed to save category.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the category "${name}"?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (res.status === 200 && data.success) {
        setCategories(prev => prev.filter(c => c._id !== id));
      } else {
        alert(data.message || 'Failed to delete category.');
      }
    } catch (err) {
      console.error('[AdminCategories] Delete error:', err);
      alert('Connection failed. Category could not be deleted.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-[#0A192F]/40 border border-white/5 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-black tracking-wide text-white">Category Management</h1>
          <p className="text-gray-400 text-sm mt-1 font-light">
            Manage the categories linked to products and services.
            {categories.length > 0 && <span className="ml-2 text-gray-500">({categories.length} total)</span>}
          </p>
        </div>
        <button onClick={openCreateModal} className="flex items-center justify-center gap-2 px-5 py-3 bg-secondary hover:bg-secondary-dark text-[#020C1B] font-bold rounded-xl shadow-lg shadow-secondary/15 transition-all hover:scale-[1.01] active:scale-[0.99] shrink-0">
          <Plus className="h-5 w-5" /><span>Create Category</span>
        </button>
      </div>

      {/* Search bar */}
      <div className="bg-[#0A192F] border border-[#1E2D3D] p-4 rounded-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories by name or slug..."
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
          <button onClick={fetchCategories} className="ml-auto flex items-center gap-1.5 px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold border border-red-500/20 transition-all">
            <RefreshCw className="h-3.5 w-3.5" /><span>Retry</span>
          </button>
        </div>
      )}

      {loading ? (
        <div className="border border-dashed border-white/10 rounded-2xl h-80 flex items-center justify-center bg-[#0A192F]/10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin" />
            <span className="text-xs font-medium text-gray-400 tracking-wide uppercase">Retrieving categories...</span>
          </div>
        </div>
      ) : filtered.length === 0 && !errorMsg ? (
        <div className="border border-dashed border-white/10 rounded-2xl h-80 flex flex-col items-center justify-center bg-[#0A192F]/10 text-center p-6">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 mb-4 text-gray-500">
            <Folder className="h-6 w-6" />
          </div>
          <h3 className="text-white font-bold text-base mb-1">{search ? 'No categories match your search' : 'No categories registered'}</h3>
          <p className="text-gray-400 text-xs font-light max-w-sm mb-6">
            {search ? `No results found for "${search}". Try a different search term.` : 'Get started by creating your first dynamic category.'}
          </p>
          {!search && (
            <button onClick={openCreateModal} className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg border border-white/10 text-xs transition-all">
              Add First Category
            </button>
          )}
        </div>
      ) : (
        <div className="bg-[#0A192F]/20 border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-[#020C1B]/40 text-xs font-bold text-gray-300 uppercase tracking-widest">
                  <th className="py-4 px-6">Category Name</th>
                  <th className="py-4 px-6">Slug Prefix</th>
                  <th className="py-4 px-6">Order</th>
                  <th className="py-4 px-6">Created Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                {filtered.map((cat) => (
                  <tr key={cat._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 font-semibold text-white">{cat.name}</td>
                    <td className="py-4 px-6 font-mono text-xs text-gray-400">/{cat.slug}</td>
                    <td className="py-4 px-6 text-gray-400 font-mono text-sm">{cat.order ?? 0}</td>
                    <td className="py-4 px-6 text-gray-400 font-light">
                      {new Date(cat.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2 shrink-0">
                      <button onClick={() => openEditModal(cat)} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 text-gray-300 rounded-lg text-xs font-semibold transition-all">
                        <Edit className="h-3.5 w-3.5" /><span>Edit</span>
                      </button>
                      <button onClick={() => handleDelete(cat._id, cat.name)} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold border border-red-500/10 transition-all">
                        <Trash2 className="h-3.5 w-3.5" /><span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0A192F] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="border-b border-white/5 px-6 py-4 flex justify-between items-center bg-[#020C1B]/40">
              <h2 className="text-white font-bold text-lg font-heading">{editingCategory ? 'Edit Category' : 'Create Category'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white text-sm">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wide mb-2">Category Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Visas, Language Prep"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-secondary focus:outline-none transition-colors"
                  required
                />
                {formError.name && <p className="text-red-400 text-xs mt-1">{formError.name[0]}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wide mb-2">URL Slug (Optional)</label>
                <input
                  type="text"
                  value={formSlug}
                  onChange={e => setFormSlug(e.target.value)}
                  placeholder="e.g. language-prep (auto-generated if empty)"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-secondary focus:outline-none transition-colors"
                />
                {formError.slug && <p className="text-red-400 text-xs mt-1">{formError.slug[0]}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wide mb-2">Display Order <span className="normal-case font-normal text-gray-500">(1+ to show; 0 = hidden)</span></label>
                <input
                  type="number"
                  min={0}
                  value={formOrder}
                  onChange={e => setFormOrder(Number(e.target.value))}
                  placeholder="e.g. 1, 2, 3..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-secondary focus:outline-none transition-colors"
                />
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t border-white/5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-lg border border-white/10 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-4 py-2.5 bg-secondary hover:bg-secondary-dark text-[#020C1B] text-xs font-bold rounded-lg transition-colors disabled:opacity-50">
                  {submitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
