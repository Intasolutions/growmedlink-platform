'use client';

import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { IMedia } from '@intelligen/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface ImageUploaderProps {
  value?: IMedia | null;
  onUpload: (media: IMedia) => void;
  onClear?: () => void;
  label?: string;
  folder?: string;
}

export default function ImageUploader({
  value,
  onUpload,
  onClear,
  label = 'Upload Image',
  folder = 'general',
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so the same file can be re-selected if needed
    e.target.value = '';

    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch(`${API_BASE_URL}/api/media/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await res.json();
      if (res.status === 201 && data.success) {
        onUpload(data.data as IMedia);
      } else {
        setError(data.message || 'Upload failed. Please try again.');
      }
    } catch (err) {
      setError('Upload failed. Please check your connection and try again.');
      console.error('[ImageUploader] Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {/* Hidden native file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {value ? (
        /* ── Preview ── */
        <div className="relative group max-w-sm rounded-xl overflow-hidden border border-white/10 aspect-video bg-[#020C1B]">
          <img
            src={value.secureUrl}
            alt={value.filename}
            className="w-full h-full object-cover"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-semibold text-white transition-all"
            >
              Change Image
            </button>
            {onClear && (
              <button
                type="button"
                onClick={onClear}
                className="p-2 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {/* Filename badge */}
          <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-[11px] text-gray-300 truncate">{value.filename}</p>
          </div>
        </div>
      ) : (
        /* ── Upload area ── */
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full max-w-sm aspect-video bg-[#020C1B]/80 hover:bg-[#020C1B] border border-dashed border-white/15 hover:border-secondary/50 rounded-xl flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-secondary" />
              <span className="text-xs font-semibold tracking-wider uppercase">Uploading...</span>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                <Upload className="h-5 w-5" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold tracking-wider uppercase">{label}</p>
                <p className="text-[11px] text-gray-500 mt-1">Click to browse · JPG, PNG, WEBP</p>
              </div>
            </>
          )}
        </button>
      )}

      {/* Uploading indicator below preview */}
      {value && uploading && (
        <div className="flex items-center gap-2 text-secondary text-xs font-medium">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Uploading new image...
        </div>
      )}

      {error && (
        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
