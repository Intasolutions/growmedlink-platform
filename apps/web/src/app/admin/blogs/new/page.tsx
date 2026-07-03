'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, AlertCircle, Image as ImageIcon } from 'lucide-react';
import MediaSelectorModal from '../../../../components/MediaSelectorModal';
import TiptapEditor from '../../../../components/TiptapEditor';
import { IMedia } from '@intelligen/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function NewBlogPage() {
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState<Record<string, any>>({ type: 'doc', content: [] });
  const [selectedImage, setSelectedImage] = useState<IMedia | null>(null);
  const [tagsInput, setTagsInput] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [isFeatured, setIsFeatured] = useState(false);
  const [subHeading, setSubHeading] = useState('');

  // SEO states
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywordsInput, setKeywordsInput] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [ogImage, setOgImage] = useState('');

  // UI status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isMediaOpen, setIsMediaOpen] = useState(false);

  // Auto-generate slug from title
  useEffect(() => {
    if (autoSlug) {
      const generated = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // remove special chars
        .replace(/\s+/g, '-') // spaces to hyphens
        .replace(/-+/g, '-'); // collapse duplicate hyphens
      setSlug(generated);
    }
  }, [title, autoSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setFieldErrors({});

    if (!selectedImage) {
      setErrorMsg('Please select a featured image from the media library.');
      return;
    }

    // Process keywords and tags
    const keywords = keywordsInput
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const payload = {
      title,
      slug,
      summary,
      content,
      image: selectedImage._id,
      tags,
      status,
      isFeatured,
      subHeading,
      metaTitle: metaTitle || title.substring(0, 60),
      metaDescription: metaDescription || summary.substring(0, 160),
      keywords,
      canonicalUrl: canonicalUrl || undefined,
      ogImage: ogImage || selectedImage.secureUrl,
    };

    try {
      setIsSubmitting(true);
      const res = await fetch(`${API_BASE_URL}/api/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      const data = await res.json();
      if (res.status === 201 && data.success) {
        router.push('/admin/blogs');
      } else {
        setErrorMsg(data.message || 'Validation failed. Please review your inputs.');
        if (data.errors) {
          setFieldErrors(data.errors);
        }
      }
    } catch (err) {
      console.error('[NewBlog] Submit error:', err);
      setErrorMsg('Connection failed. Could not contact the API server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header and Actions */}
      <div className="flex items-center gap-4 bg-[#0A192F]/40 border border-white/5 p-6 rounded-2xl">
        <Link
          href="/admin/blogs"
          className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl border border-white/5 transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-black tracking-wide text-white">
            Write Article
          </h1>
          <p className="text-gray-400 text-sm mt-0.5 font-light">
            Compose educational guides, immigration news, or academy announcements.
          </p>
        </div>
      </div>

      {/* Global Error Banner */}
      {errorMsg && (
        <div className="flex items-start gap-3 bg-red-500/15 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span className="leading-relaxed font-medium">{errorMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#0A192F]/20 border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
          <h2 className="text-lg font-bold text-white tracking-wide border-b border-white/5 pb-3">Core Content</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest">
                Article Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Express Entry Draw Updates for 2026"
                className="w-full px-4 py-3 bg-[#020C1B]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition-all text-sm"
              />
              {fieldErrors.title && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.title[0]}</p>
              )}
            </div>

            {/* Status Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest">
                Workflow Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-4 py-3.5 bg-[#020C1B]/80 border border-white/10 rounded-xl text-white focus:outline-none focus:border-secondary transition-all text-sm"
              >
                <option value="draft">Draft (Unpublished)</option>
                <option value="published">Published (Visible to public)</option>
                <option value="archived">Archived</option>
              </select>
              {fieldErrors.status && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.status[0]}</p>
              )}
            </div>
          </div>

          {/* Subheading */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest">
              Sub-heading
            </label>
            <input
              type="text"
              value={subHeading}
              onChange={e => setSubHeading(e.target.value)}
              placeholder="e.g. Key take-aways and immigration program draw schedules"
              className="w-full px-4 py-3 bg-[#020C1B]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition-all text-sm"
            />
            {fieldErrors.subHeading && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.subHeading[0]}</p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest">
                URL Slug
              </label>
              <label className="flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSlug}
                  onChange={e => setAutoSlug(e.target.checked)}
                  className="rounded bg-[#020C1B] border-white/10 text-secondary focus:ring-0 focus:ring-offset-0"
                />
                <span>Auto-generate from Title</span>
              </label>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">/blog/</span>
              <input
                type="text"
                required
                disabled={autoSlug}
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="express-entry-draw-updates-2026"
                className="w-full pl-16 pr-4 py-3 bg-[#020C1B]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition-all text-sm disabled:opacity-60"
              />
            </div>
            {fieldErrors.slug && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.slug[0]}</p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest">
              Tags (Comma-separated, max 10)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="e.g. Canada, Immigration, Express Entry, IELTS"
              className="w-full px-4 py-3 bg-[#020C1B]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition-all text-sm"
            />
            {fieldErrors.tags && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.tags[0]}</p>
            )}
          </div>

          {/* Summary / Excerpt */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest">
              Brief Excerpt Summary
            </label>
            <textarea
              required
              rows={3}
              value={summary}
              onChange={e => setSummary(e.target.value)}
              placeholder="Provide a clear, engaging summary card text of 20 to 500 characters..."
              className="w-full px-4 py-3 bg-[#020C1B]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition-all text-sm resize-none"
            />
            {fieldErrors.summary && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.summary[0]}</p>
            )}
          </div>

          {/* Rich Text Editor */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest">
              Detailed Article Content (Tiptap Rich Text)
            </label>
            <div className="border border-white/10 rounded-xl overflow-hidden bg-[#020C1B]/40">
              <TiptapEditor
                content={content}
                onChange={setContent}
              />
            </div>
            {fieldErrors.content && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.content[0]}</p>
            )}
          </div>

          {/* Featured Image */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest mb-1">
              Featured Image
            </label>
            {selectedImage ? (
              <div className="relative group max-w-sm rounded-xl overflow-hidden border border-white/10 aspect-video bg-[#020C1B]">
                <img
                  src={selectedImage.secureUrl}
                  alt={selectedImage.filename}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setIsMediaOpen(true)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-sm font-bold text-white transition-opacity"
                >
                  Change Image
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsMediaOpen(true)}
                className="w-full max-w-sm aspect-video bg-[#020C1B]/80 hover:bg-[#020C1B] border border-dashed border-white/15 hover:border-secondary/35 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-white transition-all"
              >
                <ImageIcon className="h-8 w-8 text-gray-500 animate-pulse" />
                <span className="text-xs font-semibold tracking-wider uppercase">Select from Media Library</span>
              </button>
            )}
            {fieldErrors.image && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.image[0]}</p>
            )}
          </div>

          {/* isFeatured checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-3 text-sm font-medium text-gray-200 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={e => setIsFeatured(e.target.checked)}
                className="w-5 h-5 rounded bg-[#020C1B]/80 border-white/10 text-secondary focus:ring-0 focus:ring-offset-0"
              />
              <div>
                <p className="font-bold text-white text-sm">Feature this article</p>
                <p className="text-xs text-gray-400 font-light mt-0.5">Feature this article at the top of the public blog page feed and highlight slides.</p>
              </div>
            </label>
          </div>
        </div>

        {/* SEO Information */}
        <div className="bg-[#0A192F]/20 border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
          <h2 className="text-lg font-bold text-white tracking-wide border-b border-white/5 pb-3">SEO / Search Configurations</h2>

          {/* Meta Title */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold uppercase tracking-widest text-gray-300">
              <label>Meta Title</label>
              <span className={metaTitle.length > 60 ? 'text-red-400' : 'text-gray-500'}>
                {metaTitle.length || Math.min(title.length, 60)}/60 chars
              </span>
            </div>
            <input
              type="text"
              value={metaTitle}
              onChange={e => setMetaTitle(e.target.value)}
              placeholder={title ? title.substring(0, 60) : 'e.g. Express Entry Draws Canada 2026'}
              maxLength={60}
              className="w-full px-4 py-3 bg-[#020C1B]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition-all text-sm"
            />
            {fieldErrors.metaTitle && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.metaTitle[0]}</p>
            )}
          </div>

          {/* Meta Description */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold uppercase tracking-widest text-gray-300">
              <label>Meta Description</label>
              <span className={metaDescription.length > 160 ? 'text-red-400' : 'text-gray-500'}>
                {metaDescription.length || Math.min(summary.length, 160)}/160 chars
              </span>
            </div>
            <textarea
              rows={3}
              value={metaDescription}
              onChange={e => setMetaDescription(e.target.value)}
              placeholder={summary ? summary.substring(0, 160) : 'Provide an SEO-friendly summary excerpt for Google search listings...'}
              maxLength={160}
              className="w-full px-4 py-3 bg-[#020C1B]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition-all text-sm resize-none"
            />
            {fieldErrors.metaDescription && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.metaDescription[0]}</p>
            )}
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest">
              Keywords (Comma-separated)
            </label>
            <input
              type="text"
              value={keywordsInput}
              onChange={e => setKeywordsInput(e.target.value)}
              placeholder="e.g. express entry, canada visa, draw results, crs score"
              className="w-full px-4 py-3 bg-[#020C1B]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition-all text-sm"
            />
            {fieldErrors.keywords && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.keywords[0]}</p>
            )}
          </div>

          {/* Canonical & OG Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest">
                Canonical URL
              </label>
              <input
                type="text"
                value={canonicalUrl}
                onChange={e => setCanonicalUrl(e.target.value)}
                placeholder="https://growmedlink.com/blog/express-entry-draws..."
                className="w-full px-4 py-3 bg-[#020C1B]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition-all text-sm"
              />
              {fieldErrors.canonicalUrl && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.canonicalUrl[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest">
                Open Graph Image URL (optional)
              </label>
              <input
                type="text"
                value={ogImage}
                onChange={e => setOgImage(e.target.value)}
                placeholder="Auto-filled from featured image if left empty"
                className="w-full px-4 py-3 bg-[#020C1B]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition-all text-sm"
              />
              {fieldErrors.ogImage && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.ogImage[0]}</p>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/blogs"
            className="px-6 py-3.5 bg-white/5 hover:bg-white/10 hover:text-white text-gray-300 border border-white/10 rounded-xl font-bold text-sm transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-secondary hover:bg-secondary-dark text-[#020C1B] font-bold rounded-xl shadow-lg shadow-secondary/15 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-[#020C1B]/20 border-t-[#020C1B] rounded-full animate-spin" />
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>Save Article</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Media Selector Modal */}
      <MediaSelectorModal
        isOpen={isMediaOpen}
        onClose={() => setIsMediaOpen(false)}
        selectedId={selectedImage?._id}
        onSelect={setSelectedImage}
      />
    </div>
  );
}
