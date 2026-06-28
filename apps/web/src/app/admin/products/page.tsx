'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Star, StarOff, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { IProduct, IMedia } from '@intelligen/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.status === 200 && data.success) {
        setProducts(data.data);
      } else {
        setErrorMsg(data.message || 'Failed to fetch products list.');
      }
    } catch (err) {
      console.error('[AdminProducts] Fetch error:', err);
      setErrorMsg('Could not establish connection to the API server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the product "${name}"? This is a soft-delete and can be restored.`)) {
      return;
    }

    try {
      setDeletingId(id);
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.status === 200 && data.success) {
        setProducts(prev => prev.filter(p => p._id !== id));
      } else {
        alert(data.message || 'Failed to delete product.');
      }
    } catch (err) {
      console.error('[AdminProducts] Delete error:', err);
      alert('Connection failed. Product could not be deleted.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-[#0A192F]/40 border border-white/5 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-black tracking-wide text-white">
            Products Management
          </h1>
          <p className="text-gray-400 text-sm mt-1 font-light">
            Manage the products visible on the public website.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center justify-center gap-2 px-5 py-3 bg-secondary hover:bg-secondary-dark text-[#020C1B] font-bold rounded-xl shadow-lg shadow-secondary/15 transition-all hover:scale-[1.01] active:scale-[0.99] shrink-0"
        >
          <Plus className="h-5 w-5" />
          <span>Create Product</span>
        </Link>
      </div>

      {/* Error View */}
      {errorMsg && (
        <div className="flex items-center gap-3 bg-red-500/15 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="leading-relaxed font-medium">{errorMsg}</span>
          <button
            onClick={fetchProducts}
            className="ml-auto flex items-center gap-1.5 px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold border border-red-500/20 transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Grid List view */}
      {loading ? (
        <div className="border border-dashed border-white/10 rounded-2xl h-80 flex items-center justify-center bg-[#0A192F]/10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin" />
            <span className="text-xs font-medium text-gray-400 tracking-wide uppercase">Retrieving products...</span>
          </div>
        </div>
      ) : products.length === 0 && !errorMsg ? (
        <div className="border border-dashed border-white/10 rounded-2xl h-80 flex flex-col items-center justify-center bg-[#0A192F]/10 text-center p-6">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 mb-4 text-gray-500">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-white font-bold text-base mb-1">No products registered</h3>
          <p className="text-gray-400 text-xs font-light max-w-sm mb-6">
            Get started by creating your first product offering.
          </p>
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg border border-white/10 text-xs transition-all"
          >
            Add First Product
          </Link>
        </div>
      ) : (
        <div className="bg-[#0A192F]/20 border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-[#020C1B]/40 text-xs font-bold text-gray-300 uppercase tracking-widest">
                  <th className="py-4 px-6">Product Name & Slug</th>
                  <th className="py-4 px-6">Fees</th>
                  <th className="py-4 px-6">Duration</th>
                  <th className="py-4 px-6 text-center">Featured</th>
                  <th className="py-4 px-6">Created Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {product.image && (
                          <img
                            src={(product.image as IMedia).secureUrl}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0"
                          />
                        )}
                        <div>
                          <div className="font-semibold text-white">{product.name}</div>
                          <div className="text-xs text-gray-400 font-mono mt-0.5 flex items-center gap-1">
                            <span>/{product.slug}</span>
                            <Link
                              href={`/products/${product.slug}`}
                              target="_blank"
                              className="hover:text-secondary inline-flex items-center mt-0.5"
                            >
                              <ExternalLink className="h-3 w-3 inline" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-300">{product.fees}</td>
                    <td className="py-4 px-6 text-gray-300">{product.duration}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center">
                        {product.isFeatured ? (
                          <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                        ) : (
                          <StarOff className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-400 font-light">
                      {new Date(product.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2 shrink-0">
                      <Link
                        href={`/admin/products/${product._id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 text-gray-300 rounded-lg text-xs font-semibold transition-all"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id, product.name)}
                        disabled={deletingId === product._id}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold border border-red-500/10 transition-all disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
