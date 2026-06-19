'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Loader2, UserPlus, Shield, ShieldAlert, Edit } from 'lucide-react';
import { ROLES } from '@intelligen/constants';
import { useAuth } from '@/context/AuthContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async (page = 1) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const query = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });
      if (search) query.append('search', search);

      const res = await fetch(`${API_BASE_URL}/api/users?${query.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(1);
    }, 400); // Debounce
    return () => clearTimeout(timer);
  }, [search]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      fetchUsers(newPage);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case ROLES.SUPER_ADMIN:
        return (
          <span className="flex w-max items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <ShieldAlert className="h-3 w-3" />
            Super Admin
          </span>
        );
      case ROLES.ADMIN:
        return (
          <span className="flex w-max items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Shield className="h-3 w-3" />
            Admin
          </span>
        );
      default:
        return (
          <span className="flex w-max items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold bg-gray-500/10 text-gray-400 border border-gray-500/20">
            <Edit className="h-3 w-3" />
            Editor
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-black tracking-wide text-white">
            Users & Roles
          </h1>
          <p className="text-gray-400 text-sm font-light mt-1">
            Manage administrative accounts and editor permissions.
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="flex items-center gap-2 bg-secondary text-[#020C1B] px-5 py-2.5 rounded-xl font-bold hover:bg-secondary-dark transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          Invite User
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#0A192F] border border-[#1E2D3D] p-4 rounded-2xl flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#020C1B] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0A192F] border border-[#1E2D3D] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-[#020C1B] text-xs uppercase font-bold tracking-wider text-gray-500 border-b border-[#1E2D3D]">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-secondary mx-auto" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="border-b border-[#1E2D3D] hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center font-bold text-secondary">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-white mb-0.5">{user.name} {user._id === currentUser?._id && <span className="text-xs text-gray-500 ml-2 font-normal">(You)</span>}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300">
                        {new Date(user.createdAt).toLocaleDateString(undefined, {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* Check if current user has permission to edit this user */}
                      {(currentUser?.role === ROLES.SUPER_ADMIN || (currentUser?.role === ROLES.ADMIN && user.role !== ROLES.SUPER_ADMIN)) ? (
                        <Link
                          href={`/admin/users/${user._id}`}
                          className="text-secondary hover:text-white font-bold text-xs transition-colors"
                        >
                          Edit Settings
                        </Link>
                      ) : (
                        <span className="text-xs text-gray-600 italic">No Access</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-[#1E2D3D] flex items-center justify-between bg-[#020C1B]">
            <span className="text-sm text-gray-500">
              Showing page {pagination.page} of {pagination.pages} ({pagination.total} total)
            </span>
            <div className="flex gap-2">
              <button
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="px-4 py-2 bg-[#0A192F] border border-[#1E2D3D] rounded-lg text-sm text-white disabled:opacity-50 hover:bg-white/5 transition-colors"
              >
                Previous
              </button>
              <button
                disabled={pagination.page === pagination.pages}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="px-4 py-2 bg-[#0A192F] border border-[#1E2D3D] rounded-lg text-sm text-white disabled:opacity-50 hover:bg-white/5 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
