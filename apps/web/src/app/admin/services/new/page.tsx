'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, AlertCircle, Plus, Trash2 } from 'lucide-react';
import CropUploader from '../../../../components/CropUploader';
import { IMedia, ICategory } from '@intelligen/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function NewServicePage() {
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<ICategory[]>([]);

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
          if (data.data.length > 0) {
            setCategory(data.data[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);
  const [description, setDescription] = useState('');
  const [contentText, setContentText] = useState('');
  const [selectedImage, setSelectedImage] = useState<IMedia | null>(null);
  const [secondaryHeading, setSecondaryHeading] = useState('');
  const [secondaryImage, setSecondaryImage] = useState<IMedia | null>(null);
  const [features, setFeatures] = useState<{title: string, description: string}[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);

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

    // Process keywords
    const keywords = keywordsInput
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    const payload = {
      title,
      slug,
      category,
      description,
      content: { text: contentText },
      image: selectedImage._id,
      secondaryImage: secondaryImage?._id || '',
      secondaryHeading: secondaryHeading || '',
      features,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || description,
      keywords,
      canonicalUrl: canonicalUrl || undefined,
      ogImage: ogImage || selectedImage.secureUrl,
      isFeatured,
    };

    try {
      setIsSubmitting(true);
      const res = await fetch(`${API_BASE_URL}/api/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      const data = await res.json();
      if (res.status === 201 && data.success) {
        router.push('/admin/services');
      } else {
        setErrorMsg(data.message || 'Validation failed. Please review your inputs.');
        if (data.errors) {
          setFieldErrors(data.errors);
        }
      }
    } catch (err) {
      console.error('[NewService] Submit error:', err);
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
          href="/admin/services"
          className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl border border-white/5 transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-black tracking-wide text-white">
            Create Service
          </h1>
          <p className="text-gray-400 text-sm mt-0.5 font-light">
            Add a new immigration program or language coaching package.
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest">
                Service Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Canada Student Visa Program"
                className="w-full px-4 py-3 bg-[#020C1B]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition-all text-sm"
              />
              {fieldErrors.title && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.title[0]}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-3.5 bg-[#020C1B]/80 border border-white/10 rounded-xl text-white focus:outline-none focus:border-secondary transition-all text-sm"
              >
                <option value="" disabled>Select a category...</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
              {fieldErrors.category && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.category[0]}</p>
              )}
            </div>
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
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">/services/</span>
              <input
                type="text"
                required
                disabled={autoSlug}
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="canada-student-visa-program"
                className="w-full pl-24 pr-4 py-3 bg-[#020C1B]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition-all text-sm disabled:opacity-60"
              />
            </div>
            {fieldErrors.slug && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.slug[0]}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest">
              Short Description Summary
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Provide a brief summary card overview text for this offering..."
              className="w-full px-4 py-3 bg-[#020C1B]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition-all text-sm resize-none"
            />
            {fieldErrors.description && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.description[0]}</p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest">
              Detailed Content Body
            </label>
            <textarea
              required
              rows={8}
              value={contentText}
              onChange={e => setContentText(e.target.value)}
              placeholder="Write the full course curriculum details or visa procedures here..."
              className="w-full px-4 py-3 bg-[#020C1B]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition-all text-sm font-sans"
            />
            {fieldErrors.content && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.content[0]}</p>
            )}
          </div>

          {/* Image Upload Reference */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest mb-1">
              Featured Image
            </label>
            <CropUploader
              value={selectedImage}
              onUpload={setSelectedImage}
              onClear={() => setSelectedImage(null)}
              label="Upload Featured Image"
              folder="services"
              aspect={16 / 9}
              outputWidth={1600}
              outputHeight={900}
            />
            {fieldErrors.image && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.image[0]}</p>
            )}
          </div>

          {/* Secondary Heading */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest">
              Secondary Heading
            </label>
            <input
              type="text"
              value={secondaryHeading}
              onChange={e => setSecondaryHeading(e.target.value)}
              placeholder="e.g. What Sets Us Apart"
              className="w-full px-4 py-3 bg-[#020C1B]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition-all text-sm"
            />
            {fieldErrors.secondaryHeading && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.secondaryHeading[0]}</p>
            )}
          </div>

          {/* Secondary Image Upload Reference */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest mb-1">
              Secondary Image
            </label>
            <CropUploader
              value={secondaryImage}
              onUpload={setSecondaryImage}
              onClear={() => setSecondaryImage(null)}
              label="Upload Secondary Image"
              folder="services"
              aspect={1}
              outputWidth={800}
              outputHeight={800}
            />
            {fieldErrors.secondaryImage && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.secondaryImage[0]}</p>
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
                <p className="font-bold text-white text-sm">Feature this service</p>
                <p className="text-xs text-gray-400 font-light mt-0.5">Highlight this item on the landing pages and featured slides.</p>
              </div>
            </label>
          </div>
        </div>

        {/* Features Configuration */}
        <div className="bg-[#0A192F]/20 border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h2 className="text-lg font-bold text-white tracking-wide">Key Features (Max 6)</h2>
            <button
              type="button"
              onClick={() => features.length < 6 && setFeatures([...features, { title: '', description: '' }])}
              disabled={features.length >= 6}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Feature
            </button>
          </div>

          <div className="space-y-4">
            {features.map((feature, idx) => (
              <div key={idx} className="relative bg-[#020C1B]/50 border border-white/5 rounded-xl p-4">
                <button
                  type="button"
                  onClick={() => setFeatures(features.filter((_, i) => i !== idx))}
                  className="absolute top-4 right-4 text-gray-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-8">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Feature Title
                    </label>
                    <input
                      type="text"
                      required
                      value={feature.title}
                      onChange={e => {
                        const newF = [...features];
                        newF[idx].title = e.target.value;
                        setFeatures(newF);
                      }}
                      placeholder="e.g. Free Consultation"
                      className="w-full px-3 py-2 bg-[#020C1B]/80 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Feature Description
                    </label>
                    <input
                      type="text"
                      required
                      value={feature.description}
                      onChange={e => {
                        const newF = [...features];
                        newF[idx].description = e.target.value;
                        setFeatures(newF);
                      }}
                      placeholder="e.g. Talk with our experts for free..."
                      className="w-full px-3 py-2 bg-[#020C1B]/80 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-secondary transition-all text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
            {features.length === 0 && (
              <div className="text-center py-6 border border-dashed border-white/10 rounded-xl text-gray-500 text-sm">
                No features added yet. You can add up to 6 key features.
              </div>
            )}
            {fieldErrors.features && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.features[0]}</p>
            )}
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
                {metaTitle.length || title.length}/70 chars
              </span>
            </div>
            <input
              type="text"
              value={metaTitle}
              onChange={e => setMetaTitle(e.target.value)}
              placeholder={title || 'e.g. Best Canada Student Visa Consultancy | GrowMedLink'}
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
                {metaDescription.length || description.length}/160 chars
              </span>
            </div>
            <textarea
              rows={3}
              value={metaDescription}
              onChange={e => setMetaDescription(e.target.value)}
              placeholder={description || 'Provide a brief summary for Google search listings...'}
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
              placeholder="e.g. visa, canada study, express entry, ielts"
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
                placeholder="https://growmedlink.com/services/..."
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
            href="/admin/services"
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
                <span>Save Service</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
