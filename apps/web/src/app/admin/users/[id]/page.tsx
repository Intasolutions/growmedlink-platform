'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { ROLES } from '@intelligen/constants';
import { useAuth } from '@/context/AuthContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    password: '', // Kept empty, only sent if typed
  });
  
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const resolvedParams = await params;
        setUserId(resolvedParams.id);

        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/api/users/${resolvedParams.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (res.ok && data.success) {
          setFormData({
            name: data.data.name,
            email: data.data.email,
            role: data.data.role,
            password: '', // do not populate password
          });
        } else {
          setError(data.message || 'Failed to load user');
        }
      } catch (err) {
        setError('Error fetching user details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [params]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const payload: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };
      if (formData.password) {
        payload.password = formData.password;
      }

      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || (data.errors ? Object.values(data.errors)[0] as string : 'Failed to update user'));
      }

      setFormData({ ...formData, password: '' }); // Clear password field after successful update
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) return;
    
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete user');
      
      router.push('/admin/users');
    } catch (err: any) {
      setError(err.message);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  // Restrict access if current user is ADMIN but target is SUPER_ADMIN
  const hasEditAccess = currentUser?.role === ROLES.SUPER_ADMIN || (currentUser?.role === ROLES.ADMIN && formData.role !== ROLES.SUPER_ADMIN);
  const isSelf = currentUser?._id === userId;

  if (!hasEditAccess) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white">Access Denied</h2>
        <p className="text-gray-400 mt-2">You do not have permission to modify a Super Admin account.</p>
        <Link href="/admin/users" className="text-secondary mt-4 inline-block hover:underline">Return to Users</Link>
      </div>
    );
  }

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
              Edit User Account
            </h1>
          </div>
        </div>
        {!isSelf && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors disabled:opacity-50"
            title="Delete User"
          >
            {isDeleting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
          </button>
        )}
      </div>

      <div className="bg-[#0A192F] border border-[#1E2D3D] rounded-2xl p-6">
        <form onSubmit={handleSave} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm font-medium text-center">
              User updated successfully!
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
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                disabled={isSelf} // Prevent self demotion
                className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors disabled:opacity-50"
              >
                {currentUser?.role === ROLES.SUPER_ADMIN && (
                  <option value={ROLES.SUPER_ADMIN}>Super Admin (Full Access)</option>
                )}
                <option value={ROLES.ADMIN}>Admin (Management Access)</option>
                <option value={ROLES.EDITOR}>Editor (Content Only)</option>
              </select>
              {isSelf && <p className="text-xs text-gray-500 mt-1">You cannot change your own role.</p>}
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 space-y-4">
            <h3 className="font-bold text-white">Reset Password</h3>
            <p className="text-xs text-gray-500">Leave this field blank unless you wish to change the password.</p>
            <div>
              <input
                type="password"
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors"
                placeholder="New password (optional)"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 bg-secondary text-[#020C1B] px-8 py-3 rounded-xl font-bold hover:bg-secondary-dark transition-colors disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
