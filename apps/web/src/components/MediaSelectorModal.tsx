'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, Image as ImageIcon, Check } from 'lucide-react';
import { IMedia } from '@intelligen/types';

interface MediaSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: IMedia) => void;
  selectedId?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function MediaSelectorModal({ isOpen, onClose, onSelect, selectedId }: MediaSelectorModalProps) {
  const [mediaList, setMediaList] = useState<IMedia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFolder, setActiveFolder] = useState<string>('all');
  const [folders, setFolders] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchMedia = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/media`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        if (res.status === 200 && data.success) {
          setMediaList(data.data);
          
          // Extract unique folders
          const folderNames: string[] = Array.from(new Set(data.data.map((item: IMedia) => item.folder)));
          setFolders(folderNames);
        }
      } catch (err) {
        console.error('[MediaSelector] Error fetching media:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredMedia = mediaList.filter(item => {
    const matchesSearch = item.filename.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = activeFolder === 'all' || item.folder === activeFolder;
    return matchesSearch && matchesFolder;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-[#0A192F] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-secondary" />
            <h3 className="text-lg font-bold text-white tracking-wide">Select Featured Image</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filters and Search */}
        <div className="p-4 bg-[#020C1B]/40 border-b border-white/5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search filename..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#020C1B]/80 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-secondary transition-all"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveFolder('all')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all ${
                activeFolder === 'all'
                  ? 'bg-secondary/15 border-secondary/20 text-secondary'
                  : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
              }`}
            >
              All Folders
            </button>
            {folders.map(folder => (
              <button
                key={folder}
                onClick={() => setActiveFolder(folder)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap ${
                  activeFolder === folder
                    ? 'bg-secondary/15 border-secondary/20 text-secondary'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {folder}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#020C1B]/20 min-h-[300px]">
          {loading ? (
            <div className="h-full flex items-center justify-center flex-col gap-3">
              <div className="w-8 h-8 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin" />
              <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Loading Media...</span>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="h-full flex items-center justify-center flex-col text-center p-6 text-gray-500">
              <ImageIcon className="h-10 w-10 mb-2 text-gray-600 animate-pulse" />
              <p className="text-sm font-semibold">No matching media records found</p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs font-light">
                Please upload assets first from the Media Management page.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredMedia.map(item => {
                const isSelected = selectedId === item._id;
                return (
                  <div
                    key={item._id}
                    onClick={() => {
                      onSelect(item);
                      onClose();
                    }}
                    className={`relative aspect-square rounded-xl overflow-hidden border bg-[#020C1B] cursor-pointer group transition-all duration-300 ${
                      isSelected
                        ? 'border-secondary ring-1 ring-secondary'
                        : 'border-white/5 hover:border-white/20'
                    }`}
                  >
                    <img
                      src={item.secureUrl}
                      alt={item.filename}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                      <p className="text-[10px] text-white truncate font-medium">{item.filename}</p>
                      <p className="text-[8px] text-gray-400 truncate mt-0.5 uppercase tracking-wider">{item.folder}</p>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-secondary text-[#020C1B] flex items-center justify-center border border-[#020C1B]/50 shadow-md">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
