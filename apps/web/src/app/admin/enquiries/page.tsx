'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Loader2, Inbox, Clock, CheckCircle, ListTodo } from 'lucide-react';
import { ENQUIRY_STATUSES } from '@intelligen/constants';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    pendingLeads: 0,
    inProgressLeads: 0,
    resolvedLeads: 0,
  });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [isLoading, setIsLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const fetchEnquiries = async (page = 1) => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });
      if (search) query.append('search', search);
      if (statusFilter) query.append('status', statusFilter);
      if (typeFilter) query.append('type', typeFilter);

      const res = await fetch(`${API_BASE_URL}/api/enquiries?${query.toString()}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setEnquiries(data.data);
        setPagination(data.pagination);
        if (data.metrics) {
          setMetrics(data.metrics);
        }
      }
    } catch (error) {
      console.error('Failed to fetch enquiries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEnquiries(1);
    }, 400); // Debounce
    return () => clearTimeout(timer);
  }, [search, statusFilter, typeFilter]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      fetchEnquiries(newPage);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-black tracking-wide text-white">
            Lead Enquiries
          </h1>
          <p className="text-gray-400 text-sm font-light mt-1">
            Manage incoming academy registrations and consultation requests.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: 'Total Leads', value: metrics.totalLeads, icon: <ListTodo className="h-5 w-5" />, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { title: 'Pending', value: metrics.pendingLeads, icon: <Inbox className="h-5 w-5" />, color: 'text-red-400', bg: 'bg-red-400/10' },
          { title: 'In Progress', value: metrics.inProgressLeads, icon: <Clock className="h-5 w-5" />, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
          { title: 'Resolved', value: metrics.resolvedLeads, icon: <CheckCircle className="h-5 w-5" />, color: 'text-green-400', bg: 'bg-green-400/10' },
        ].map((card, i) => (
          <div key={i} className="bg-[#0A192F] border border-[#1E2D3D] p-5 rounded-2xl flex items-center gap-4">
            <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{card.title}</p>
              <h4 className="text-2xl font-black text-white">{card.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-[#0A192F] border border-[#1E2D3D] p-4 rounded-2xl flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#020C1B] border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#020C1B] border border-white/5 rounded-xl px-3 py-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-sm text-white focus:outline-none w-32"
            >
              <option value="" className="bg-[#0A192F]">All Status</option>
              <option value={ENQUIRY_STATUSES.PENDING} className="bg-[#0A192F]">Pending</option>
              <option value={ENQUIRY_STATUSES.IN_PROGRESS} className="bg-[#0A192F]">In Progress</option>
              <option value={ENQUIRY_STATUSES.RESOLVED} className="bg-[#0A192F]">Resolved</option>
            </select>
          </div>
          <div className="flex items-center gap-2 bg-[#020C1B] border border-white/5 rounded-xl px-3 py-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent text-sm text-white focus:outline-none w-32"
            >
              <option value="" className="bg-[#0A192F]">All Types</option>
              <option value="Contact Form" className="bg-[#0A192F]">Contact Form</option>
              <option value="Talk to Expert" className="bg-[#0A192F]">Talk to Expert</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0A192F] border border-[#1E2D3D] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-[#020C1B] text-xs uppercase font-bold tracking-wider text-gray-500 border-b border-[#1E2D3D]">
              <tr>
                <th className="px-6 py-4">Name / Contact</th>
                <th className="px-6 py-4">Type / Source</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-secondary mx-auto" />
                  </td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No enquiries found matching your criteria.
                  </td>
                </tr>
              ) : (
                enquiries.map((enquiry) => (
                  <tr key={enquiry._id} className="border-b border-[#1E2D3D] hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white mb-1">{enquiry.name}</div>
                      <div className="text-xs text-gray-500 flex flex-col">
                        <span>{enquiry.email}</span>
                        <span>{enquiry.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium text-xs bg-white/5 px-2 py-1 rounded w-max mb-1">
                        {enquiry.type}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">Source: {enquiry.source || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(enquiry.createdAt).toLocaleDateString(undefined, {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold ${
                        enquiry.status === ENQUIRY_STATUSES.RESOLVED ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                        enquiry.status === ENQUIRY_STATUSES.IN_PROGRESS ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                        'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {enquiry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/enquiries/${enquiry._id}`}
                        className="text-secondary hover:text-white font-bold text-xs transition-colors"
                      >
                        View Details
                      </Link>
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
