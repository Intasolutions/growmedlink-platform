'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Info } from 'lucide-react';
import TiptapEditor from '../../../../components/TiptapEditor'; // Assuming TiptapEditor exists here

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function EditPage({ params }: { params: Promise<{ key: string }> }) {
  const router = useRouter();
  const [pageKey, setPageKey] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    content: null as any,
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    canonicalUrl: '',
    ogImage: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const resolvedParams = await params;
        setPageKey(resolvedParams.key);

        const res = await fetch(`${API_BASE_URL}/api/pages/${resolvedParams.key}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setFormData({
            title: data.data.title || '',
            content: data.data.content || { type: 'doc', content: [{ type: 'paragraph' }] },
            metaTitle: data.data.metaTitle || '',
            metaDescription: data.data.metaDescription || '',
            keywords: (data.data.keywords || []).join(', '),
            canonicalUrl: data.data.canonicalUrl || '',
            ogImage: data.data.ogImage || '',
          });
        } else {
          setError(data.message || 'Failed to load page');
        }
      } catch (err) {
        setError('An error occurred while fetching the page.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPage();
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        ...formData,
        keywords: formData.keywords ? formData.keywords.split(',').map(k => k.trim()).filter(Boolean) : [],
      };

      const res = await fetch(`${API_BASE_URL}/api/pages/${pageKey}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update page');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/pages"
            className="p-2 bg-[#020C1B] rounded-lg border border-white/5 hover:border-white/20 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white capitalize">
              Edit {pageKey} Page
            </h1>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="flex items-center gap-2 bg-secondary text-[#020C1B] px-4 py-2 rounded-lg font-bold hover:bg-secondary-dark transition-colors disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm">
          Page updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0A192F] border border-[#1E2D3D] rounded-xl p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Page Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-[#020C1B] border border-white/5 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-secondary transition-colors"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Page Content</label>
              <div className="prose-container bg-[#020C1B] border border-white/5 rounded-lg overflow-hidden min-h-[400px]">
                {formData.content && (
                  <TiptapEditor
                    content={formData.content}
                    onChange={(newContent) => setFormData({ ...formData, content: newContent })}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0A192F] border border-[#1E2D3D] rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5 text-white">
              <Info className="h-4 w-4 text-secondary" />
              <h3 className="font-bold">SEO Settings</h3>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Meta Title</label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                className="w-full bg-[#020C1B] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
                placeholder="Defaults to Title"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Meta Description</label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                rows={3}
                className="w-full bg-[#020C1B] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Keywords (Comma separated)</label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                className="w-full bg-[#020C1B] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Canonical URL</label>
              <input
                type="url"
                value={formData.canonicalUrl}
                onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                className="w-full bg-[#020C1B] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
                placeholder="https://..."
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">OG Image URL</label>
              <input
                type="url"
                value={formData.ogImage}
                onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                className="w-full bg-[#020C1B] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
