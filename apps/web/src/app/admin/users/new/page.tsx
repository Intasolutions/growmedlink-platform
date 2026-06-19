'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import { ROLES } from '@intelligen/constants';
import { useAuth } from '@/context/AuthContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function NewUserPage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ROLES.EDITOR as string,
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || (data.errors ? Object.values(data.errors)[0] as string : 'Failed to create user'));
      }

      router.push('/admin/users');
    } catch (err: any) {
      setError(err.message);
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between bg-[#0A192F] p-6 rounded-2xl border border-[#1E2D3D]">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/users"
            className="p-2 bg-[#020C1B] rounded-lg border border-white/5 hover:border-white/20 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Invite New User
            </h1>
            <p className="text-sm text-gray-400 mt-1">Create an administrative or editor account.</p>
          </div>
        </div>
      </div>

      <div className="bg-[#0A192F] border border-[#1E2D3D] rounded-2xl p-6">
        <form onSubmit={handleSave} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Temporary Password</label>
              <input
                required
                type="password"
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors"
                placeholder="Min 6 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Assign Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors"
              >
                {currentUser?.role === ROLES.SUPER_ADMIN && (
                  <option value={ROLES.SUPER_ADMIN}>Super Admin (Full Access)</option>
                )}
                <option value={ROLES.ADMIN}>Admin (Management Access)</option>
                <option value={ROLES.EDITOR}>Editor (Content Only)</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">
                Super Admins can manage settings and other super admins. Standard Admins can manage content and editors.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 bg-secondary text-[#020C1B] px-8 py-3 rounded-xl font-bold hover:bg-secondary-dark transition-colors disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              {isSaving ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
