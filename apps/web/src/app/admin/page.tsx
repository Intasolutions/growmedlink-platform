'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  Users, 
  FileText, 
  Globe, 
  MessageSquare, 
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Loader2
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/dashboard`, {
          credentials: 'include'
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message || 'Failed to fetch dashboard statistics');
        setStats(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-secondary mb-4" />
        <p className="text-gray-400 font-medium tracking-widest uppercase text-sm animate-pulse">Loading Analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-3">
        <AlertCircle className="h-6 w-6 shrink-0" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#020C1B] to-[#0A192F] p-8 rounded-3xl border border-white/5 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
            Welcome back, {user?.name.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-400 max-w-xl">
            Here's what's happening with your platform today. You have <strong className="text-secondary">{stats?.enquiries?.new || 0} new enquiries</strong> waiting for review.
          </p>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-[#0A192F] border border-[#1E2D3D] p-6 rounded-2xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-secondary/10 text-secondary rounded-xl group-hover:scale-110 transition-transform">
              <MessageSquare className="h-6 w-6" />
            </div>
            {stats?.enquiries?.new > 0 && (
              <span className="bg-secondary text-[#020C1B] text-xs font-bold px-2 py-1 rounded-md animate-pulse">
                {stats.enquiries.new} New
              </span>
            )}
          </div>
          <p className="text-3xl font-black text-white mb-1">{stats?.enquiries?.total || 0}</p>
          <p className="text-sm text-gray-400 font-medium">Total Enquiries</p>
        </div>

        <div className="bg-[#0A192F] border border-[#1E2D3D] p-6 rounded-2xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
              <FileText className="h-6 w-6" />
            </div>
            <span className="text-green-400 text-xs font-bold flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-md">
              <TrendingUp className="h-3 w-3" /> Published
            </span>
          </div>
          <p className="text-3xl font-black text-white mb-1">{stats?.blogs?.total || 0}</p>
          <p className="text-sm text-gray-400 font-medium">Blog Articles</p>
        </div>

        <div className="bg-[#0A192F] border border-[#1E2D3D] p-6 rounded-2xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl group-hover:scale-110 transition-transform">
              <Globe className="h-6 w-6" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mb-1">{stats?.services?.total || 0}</p>
          <p className="text-sm text-gray-400 font-medium">Active Services</p>
        </div>

        <div className="bg-[#0A192F] border border-[#1E2D3D] p-6 rounded-2xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mb-1">{stats?.enquiries?.resolved || 0}</p>
          <p className="text-sm text-gray-400 font-medium">Resolved Cases</p>
        </div>

      </div>

      {/* Two Column Layout for Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Leads */}
        <div className="lg:col-span-2 bg-[#0A192F] border border-[#1E2D3D] rounded-2xl flex flex-col">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Recent Enquiries</h3>
            <Link href="/admin/enquiries" className="text-sm text-secondary hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="p-6 flex-grow">
            {stats?.recentLeads?.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent enquiries found.</p>
            ) : (
              <div className="space-y-4">
                {stats?.recentLeads?.map((lead: any) => (
                  <div key={lead._id} className="flex items-center justify-between p-4 bg-[#020C1B] rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                    <div>
                      <p className="text-white font-bold text-sm">{lead.name}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                        <span>{lead.email}</span>
                        <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                        <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                        lead.status === 'new' ? 'bg-secondary/20 text-secondary' :
                        lead.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {lead.status.toUpperCase()}
                      </span>
                      <Link href={`/admin/enquiries/${lead._id}`} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Links / System Health */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#0A192F] border border-[#1E2D3D] rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/admin/blogs/new" className="flex flex-col items-center justify-center p-4 bg-[#020C1B] rounded-xl border border-white/5 hover:border-secondary/50 hover:text-secondary transition-colors text-gray-300 text-sm font-medium gap-3 text-center">
                <FileText className="h-6 w-6" />
                Write Article
              </Link>
              <Link href="/admin/services/new" className="flex flex-col items-center justify-center p-4 bg-[#020C1B] rounded-xl border border-white/5 hover:border-secondary/50 hover:text-secondary transition-colors text-gray-300 text-sm font-medium gap-3 text-center">
                <Globe className="h-6 w-6" />
                Add Service
              </Link>
              <Link href="/admin/settings" className="flex flex-col items-center justify-center p-4 bg-[#020C1B] rounded-xl border border-white/5 hover:border-secondary/50 hover:text-secondary transition-colors text-gray-300 text-sm font-medium gap-3 text-center col-span-2">
                <TrendingUp className="h-6 w-6" />
                Update Global Settings
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
