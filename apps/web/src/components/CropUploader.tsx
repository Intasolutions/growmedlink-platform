'use client';

import React, { useRef, useState, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Upload, X, Image as ImageIcon, Loader2, Crop as CropIcon } from 'lucide-react';
import { IMedia } from '@intelligen/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface CropUploaderProps {
  value?: IMedia | null;
  onUpload: (media: IMedia) => void;
  onClear?: () => void;
  label?: string;
  folder: string;
  aspect: number;       // e.g. 16/9 or 1
  outputWidth: number;  // pixels to store
  outputHeight: number;
  publicUpload?: boolean; // skip auth — uses public review upload endpoint
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight,
  );
}

function getCroppedBlob(
  image: HTMLImageElement,
  pixelCrop: PixelCrop,
  outputWidth: number,
  outputHeight: number,
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const ctx = canvas.getContext('2d')!;

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  ctx.drawImage(
    image,
    pixelCrop.x * scaleX,
    pixelCrop.y * scaleY,
    pixelCrop.width * scaleX,
    pixelCrop.height * scaleY,
    0,
    0,
    outputWidth,
    outputHeight,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => (blob ? resolve(blob) : reject(new Error('Canvas is empty'))),
      'image/jpeg',
      0.92,
    );
  });
}

export default function CropUploader({
  value,
  onUpload,
  onClear,
  label = 'Upload Image',
  folder,
  aspect,
  outputWidth,
  outputHeight,
  publicUpload = false,
}: CropUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [srcUrl, setSrcUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setError('');

    const maxBytes = publicUpload ? 2 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(`File is too large. Maximum size is ${publicUpload ? '2 MB' : '5 MB'}.`);
      return;
    }

    const allowedTypes = publicUpload
      ? ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      : ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      setError(publicUpload
        ? 'Invalid file type. Only JPG, PNG, and WEBP images are accepted.'
        : 'Invalid file type. Supported types are JPG, PNG, WEBP, and SVG.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setSrcUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspect));
  }, [aspect]);

  const handleCropAndUpload = async () => {
    if (!imgRef.current || !completedCrop) return;
    setError('');
    setUploading(true);
    try {
      const blob = await getCroppedBlob(imgRef.current, completedCrop, outputWidth, outputHeight);
      const fd = new FormData();
      fd.append('file', blob, `crop_${Date.now()}.jpg`);
      fd.append('folder', folder);
      const uploadUrl = publicUpload
        ? `${API_BASE_URL}/api/media/upload/public-review`
        : `${API_BASE_URL}/api/media/upload`;
      const res = await fetch(uploadUrl, {
        method: 'POST',
        body: fd,
        credentials: publicUpload ? 'omit' : 'include',
      });
      const data = await res.json();
      if (res.status === 201 && data.success) {
        onUpload(data.data as IMedia);
        setSrcUrl(null);
        setCrop(undefined);
        setCompletedCrop(undefined);
      } else {
        setError(data.message || 'Upload failed.');
      }
    } catch {
      setError('Upload failed. Check your connection.');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setSrcUrl(null);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setError('');
  };

  const ratioLabel = aspect === 1 ? '1:1' : `${Math.round(aspect * 9)}:9`;

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />

      {/* ── Crop modal ── */}
      {srcUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0A192F] border border-white/10 rounded-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <CropIcon className="h-4 w-4 text-secondary" />
                <span className="text-sm font-bold text-white tracking-wide">Crop Image</span>
                <span className="text-xs text-gray-400 font-mono">
                  {ratioLabel} · {outputWidth}×{outputHeight}px
                </span>
              </div>
              <button
                type="button"
                onClick={handleCancel}
                disabled={uploading}
                className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Crop area */}
            <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-black/40">
              <ReactCrop
                crop={crop}
                onChange={c => setCrop(c)}
                onComplete={c => setCompletedCrop(c)}
                aspect={aspect}
                keepSelection
                minWidth={80}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imgRef}
                  src={srcUrl}
                  alt="Crop preview"
                  onLoad={onImageLoad}
                  style={{ maxHeight: '60vh', maxWidth: '100%', display: 'block' }}
                />
              </ReactCrop>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-white/10 flex items-center justify-between gap-3">
              {error && <p className="text-red-400 text-xs flex-1">{error}</p>}
              {!error && (
                <p className="text-gray-500 text-xs flex-1">
                  Drag the box to reposition · Resize from corners
                </p>
              )}
              <div className="flex gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={uploading}
                  className="px-4 py-2 text-sm font-semibold text-gray-300 border border-white/10 rounded-xl hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCropAndUpload}
                  disabled={uploading || !completedCrop}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-bold bg-secondary hover:bg-secondary/90 text-[#020C1B] rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading…
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Crop & Upload
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Preview / Upload button ── */}
      {value ? (
        <div className="relative group max-w-sm rounded-xl overflow-hidden border border-white/10 aspect-video bg-[#020C1B]">
          <img
            src={value.secureUrl}
            alt={value.filename}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
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
          <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-[11px] text-gray-300 truncate">{value.filename}</p>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full max-w-sm aspect-video bg-[#020C1B]/80 hover:bg-[#020C1B] border border-dashed border-white/15 hover:border-secondary/50 rounded-xl flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-white transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
            <ImageIcon className="h-5 w-5" />
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold tracking-wider uppercase">{label}</p>
            <p className="text-[11px] text-gray-500 mt-1">
              Click to browse · Will crop to {ratioLabel}
            </p>
            <p className="text-[11px] text-gray-600 mt-0.5">
              {publicUpload ? 'JPG, PNG or WEBP · Max 2 MB' : 'JPG, PNG, WEBP or SVG · Max 5 MB'}
            </p>
          </div>
        </button>
      )}

      {error && !srcUrl && (
        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
