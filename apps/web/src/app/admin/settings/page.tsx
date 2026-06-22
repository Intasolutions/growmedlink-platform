'use client';

import React, { useState, useEffect } from 'react';
import { Save, Loader2, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import MediaSelectorModal from '@/components/MediaSelectorModal';
import Image from 'next/image';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    socialLinks: {
      facebook: '',
      instagram: '',
      linkedin: '',
      twitter: '',
    },
    seoDefaultTitle: '',
    seoDefaultDescription: '',
    logo: '' as any, // We will store either the ID or the populated object, and send the ID on save
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/settings`, {
          credentials: 'include'
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setFormData(data.data);
        } else {
          setError(data.message || 'Failed to load settings');
        }
      } catch (err) {
        setError('Error connecting to the server');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Format payload: extract ID if logo is populated
      const dataToSave = {
        ...formData,
        logo: formData.logo && typeof formData.logo === 'object' ? formData.logo._id : formData.logo,
      };

      const res = await fetch(`${API_BASE_URL}/api/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dataToSave),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || (data.errors ? Object.values(data.errors)[0] as string : 'Failed to update settings'));
      }

      setFormData(data.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMediaSelect = (media: any) => {
    setFormData({ ...formData, logo: media });
    setIsMediaModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <ProtectedRoute roles={['SUPER_ADMIN']}>
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between bg-[#0A192F] p-6 rounded-2xl border border-[#1E2D3D]">
        <div>
          <h1 className="text-2xl font-black text-white tracking-wide">
            Global Settings
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage site-wide configurations, contact details, and SEO defaults.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-secondary text-[#020C1B] px-6 py-2.5 rounded-xl font-bold hover:bg-secondary-dark transition-colors disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm font-medium text-center">
          Settings updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - General & Contact */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0A192F] border border-[#1E2D3D] rounded-2xl p-6 space-y-6">
            <h3 className="font-bold text-white text-lg border-b border-white/5 pb-4">General Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Company Name</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Contact Email</label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Contact Phone</label>
                  <input
                    type="text"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Office Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#0A192F] border border-[#1E2D3D] rounded-2xl p-6 space-y-6">
            <h3 className="font-bold text-white text-lg border-b border-white/5 pb-4">Global SEO Defaults</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Default Meta Title</label>
                <input
                  type="text"
                  value={formData.seoDefaultTitle}
                  onChange={(e) => setFormData({ ...formData, seoDefaultTitle: e.target.value })}
                  className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">Used as fallback title if a specific page doesn't have one.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Default Meta Description</label>
                <textarea
                  value={formData.seoDefaultDescription}
                  onChange={(e) => setFormData({ ...formData, seoDefaultDescription: e.target.value })}
                  rows={3}
                  className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">Used as fallback description for search engines.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Logo & Socials */}
        <div className="space-y-6">
          <div className="bg-[#0A192F] border border-[#1E2D3D] rounded-2xl p-6 space-y-6">
            <h3 className="font-bold text-white text-lg border-b border-white/5 pb-4">Company Logo</h3>
            
            <div className="space-y-4">
              {formData.logo ? (
                <div className="relative group rounded-xl overflow-hidden border border-white/10 bg-[#020C1B] aspect-video flex items-center justify-center p-4">
                  <Image 
                    src={typeof formData.logo === 'object' ? formData.logo.secureUrl : formData.logo} 
                    alt="Logo"
                    width={200}
                    height={100}
                    className="object-contain max-h-full"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button
                      onClick={() => setIsMediaModalOpen(true)}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                    >
                      <ImageIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, logo: null as any })}
                      className="p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsMediaModalOpen(true)}
                  className="w-full aspect-video rounded-xl border-2 border-dashed border-white/10 bg-[#020C1B] flex flex-col items-center justify-center gap-3 text-gray-500 hover:text-white hover:border-white/30 transition-colors"
                >
                  <ImageIcon className="h-8 w-8" />
                  <span className="text-sm font-medium">Select Logo</span>
                </button>
              )}
            </div>
          </div>

          <div className="bg-[#0A192F] border border-[#1E2D3D] rounded-2xl p-6 space-y-6">
            <h3 className="font-bold text-white text-lg border-b border-white/5 pb-4">Social Links</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Facebook</label>
                <input
                  type="url"
                  value={formData.socialLinks.facebook}
                  onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, facebook: e.target.value } })}
                  placeholder="https://facebook.com/..."
                  className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Instagram</label>
                <input
                  type="url"
                  value={formData.socialLinks.instagram}
                  onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, instagram: e.target.value } })}
                  placeholder="https://instagram.com/..."
                  className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">LinkedIn</label>
                <input
                  type="url"
                  value={formData.socialLinks.linkedin}
                  onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, linkedin: e.target.value } })}
                  placeholder="https://linkedin.com/..."
                  className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Twitter / X</label>
                <input
                  type="url"
                  value={formData.socialLinks.twitter}
                  onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, twitter: e.target.value } })}
                  placeholder="https://twitter.com/..."
                  className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <MediaSelectorModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={handleMediaSelect}
        selectedId={typeof formData.logo === 'object' ? formData.logo?._id : formData.logo}
      />
      </div>
    </ProtectedRoute>
  );
}
