'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import CropUploader from '../../../../components/CropUploader';
import { IMedia, ICategory } from '@intelligen/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function NewProductPage() {
  const router = useRouter();

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);
  const [selectedImage, setSelectedImage] = useState<IMedia | null>(null);
  const [detailsText, setDetailsText] = useState('');
  const [fees, setFees] = useState('');
  const [duration, setDuration] = useState('');
  const [otherDetailsText, setOtherDetailsText] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [order, setOrder] = useState(0);

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
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [categoryId, setCategoryId] = useState('');

  // Fetch categories on load
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/categories`, {
          credentials: 'include'
        });
        const data = await res.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Auto-generate slug from name
  useEffect(() => {
    if (autoSlug) {
      const generated = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      setSlug(generated);
    }
  }, [name, autoSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setFieldErrors({});

    if (!selectedImage) {
      setErrorMsg('Please select a featured image from the media library.');
      return;
    }

    const keywords = keywordsInput
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    const payload = {
      name,
      slug,
      category: categoryId,
      image: selectedImage._id,
      details: { text: detailsText },
      fees,
      duration,
      otherDetails: otherDetailsText ? { text: otherDetailsText } : {},
      metaTitle: metaTitle || name,
      metaDescription: metaDescription || detailsText.slice(0, 160),
      keywords,
      canonicalUrl: canonicalUrl || undefined,
      ogImage: ogImage || selectedImage.secureUrl,
      order,
      isFeatured,
      videoUrl: videoUrl || undefined,
    };

    try {
      setIsSubmitting(true);
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      const data = await res.json();
      if (res.status === 201 && data.success) {
        router.push('/admin/products');
      } else {
        setErrorMsg(data.message || 'Validation failed. Please review your inputs.');
        if (data.errors) {
          setFieldErrors(data.errors);
        }
      }
    } catch (err) {
      console.error('[NewProduct] Submit error:', err);
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
          href="/admin/products"
          className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl border border-white/5 transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-black tracking-wide text-white">
            Create Product
          </h1>
          <p className="text-gray-400 text-sm mt-0.5 font-light">
            Add a new product offering to the public website.
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
          <h2 className="text-lg font-bold text-white tracking-wide border-b border-white/5 pb-3">Core Parameters</h2>

          {/* Name */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest">
              Product Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. IELTS Coaching Package"
              className="w-full px-4 py-3 bg-[#020C1B]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition-all text-sm"
            />
            {fieldErrors.name && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.name[0]}</p>
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
                <span>Auto-generate from Name</span>
              </label>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">/products/</span>
              <input
                type="text"
                required
                disabled={autoSlug}
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="ielts-coaching-package"
                className="w-full pl-24 pr-4 py-3 bg-[#020C1B]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition-all text-sm disabled:opacity-60"
              />
            </div>
            {fieldErrors.slug && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.slug[0]}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest">
              Category
            </label>
            <div className="relative">
              <select
                required
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 bg-[#020C1B]/80 border border-white/10 rounded-xl text-white focus:outline-none focus:border-secondary transition-all text-sm appearance-none"
              >
                <option value="" disabled className="bg-[#020C1B] text-gray-500">Select a category...</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id} className="bg-[#020C1B] text-white">
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                ▼
              </div>
            </div>
            {fieldErrors.category && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.category[0]}</p>
            )}
          </div>

          {/* Image */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest mb-1">
              Product Image
            </label>
            <CropUploader
              value={selectedImage}
              onUpload={setSelectedImage}
              onClear={() => setSelectedImage(null)}
              label="Upload Product Image"
              folder="products"
              aspect={16 / 9}
              outputWidth={1600}
              outputHeight={900}
            />
            {fieldErrors.image && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.image[0]}</p>
            )}
          </div>

          {/* Fees & Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest">
                Fees
              </label>
              <input
                type="text"
                required
                value={fees}
                onChange={e => setFees(e.target.value)}
                placeholder="e.g. ₹25,000"
                className="w-full px-4 py-3 bg-[#020C1B]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition-all text-sm"
              />
              {fieldErrors.fees && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.fees[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest">
                Duration
              </label>
              <input
                type="text"
                required
                value={duration}
                onChange={e => setDuration(e.target.value)}
                placeholder="e.g. 6 Weeks"
                className="w-full px-4 py-3 bg-[#020C1B]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition-all text-sm"
              />
              {fieldErrors.duration && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.duration[0]}</p>
              )}
            </div>
          </div>

          {/* Display Order */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest">
              Display Order
            </label>
            <input
              type="number"
              min={0}
              value={order}
              onChange={e => setOrder(Number(e.target.value))}
              placeholder="e.g. 1"
              className="w-full px-4 py-3 bg-[#020C1B]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition-all text-sm"
            />
            <p className="text-gray-500 text-xs">Lower numbers appear first in the homepage nursing section.</p>
          </div>

          {/* YouTube Video URL */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest">
              YouTube Video URL <span className="text-gray-500 normal-case font-normal">(optional)</span>
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              placeholder="e.g. https://youtu.be/abc123 or https://www.youtube.com/watch?v=abc123"
              className="w-full px-4 py-3 bg-[#020C1B]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition-all text-sm"
            />
            <p className="text-gray-500 text-xs">Paste any YouTube video link — the player will appear on the product detail page.</p>
          </div>

          {/* Details */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest">
              Details
            </label>
            <textarea
              required
              rows={8}
              value={detailsText}
              onChange={e => setDetailsText(e.target.value)}
              placeholder="Write the full product details here..."
              className="w-full px-4 py-3 bg-[#020C1B]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition-all text-sm font-sans"
            />
            {fieldErrors.details && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.details[0]}</p>
            )}
          </div>

          {/* Other Details */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest">
              Other Details (optional)
            </label>
            <textarea
              rows={5}
              value={otherDetailsText}
              onChange={e => setOtherDetailsText(e.target.value)}
              placeholder="Any additional notes, prerequisites, or terms..."
              className="w-full px-4 py-3 bg-[#020C1B]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition-all text-sm font-sans"
            />
            {fieldErrors.otherDetails && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.otherDetails[0]}</p>
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
                <p className="font-bold text-white text-sm">Feature this product</p>
                <p className="text-xs text-gray-400 font-light mt-0.5">Highlight this item on the landing pages and featured slides.</p>
              </div>
            </label>
          </div>
        </div>

        {/* SEO Information */}
        <div className="bg-[#0A192F]/20 border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
          <h2 className="text-lg font-bold text-white tracking-wide border-b border-white/5 pb-3">SEO / Metadata Configurations</h2>

          {/* Meta Title */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold uppercase tracking-widest text-gray-300">
              <label>Meta Title</label>
              <span className={metaTitle.length > 70 ? 'text-red-400' : 'text-gray-500'}>
                {metaTitle.length || name.length}/70 chars
              </span>
            </div>
            <input
              type="text"
              value={metaTitle}
              onChange={e => setMetaTitle(e.target.value)}
              placeholder={name || 'e.g. IELTS Coaching Package | GrowMedLink'}
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
                {metaDescription.length}/160 chars
              </span>
            </div>
            <textarea
              rows={3}
              value={metaDescription}
              onChange={e => setMetaDescription(e.target.value)}
              placeholder="Provide a brief summary for Google search listings..."
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
              placeholder="e.g. ielts, coaching, exam prep"
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
                placeholder="https://growmedlink.com/products/..."
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
                placeholder="Auto-filled from product image if left empty"
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
            href="/admin/products"
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
                <span>Save Product</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
