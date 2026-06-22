'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, User, Mail, Phone, Calendar, CheckCircle } from 'lucide-react';
import { ENQUIRY_STATUSES } from '@intelligen/constants';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function EnquiryDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [enquiry, setEnquiry] = useState<any>(null);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [enquiryId, setEnquiryId] = useState('');

  useEffect(() => {
    const fetchEnquiry = async () => {
      try {
        const resolvedParams = await params;
        setEnquiryId(resolvedParams.id);

        const res = await fetch(`${API_BASE_URL}/api/enquiries/${resolvedParams.id}`, {
          credentials: 'include'
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setEnquiry(data.data);
          setStatus(data.data.status);
          setNotes(data.data.notes || '');
        } else {
          setError(data.message || 'Failed to load enquiry');
        }
      } catch (err) {
        setError('Error fetching enquiry details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEnquiry();
  }, [params]);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`${API_BASE_URL}/api/enquiries/${enquiryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status, notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update enquiry');
      
      setEnquiry(data.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  if (!enquiry) {
    return (
      <div className="text-center py-12 text-gray-500">
        Enquiry not found.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/enquiries"
            className="p-2 bg-[#020C1B] rounded-lg border border-white/5 hover:border-white/20 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white capitalize">
              Enquiry Details
            </h1>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-secondary text-[#020C1B] px-4 py-2 rounded-lg font-bold hover:bg-secondary-dark transition-colors disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isSaving ? 'Saving...' : 'Save Updates'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm">
          Enquiry updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0A192F] border border-[#1E2D3D] rounded-xl p-6 space-y-6">
            <h3 className="font-bold text-white text-lg border-b border-white/5 pb-3">Lead Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <User className="h-4 w-4 text-secondary" />
                  <span className="font-medium text-white">{enquiry.name}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail className="h-4 w-4 text-secondary" />
                  <a href={`mailto:${enquiry.email}`} className="text-secondary hover:underline">{enquiry.email}</a>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Phone className="h-4 w-4 text-secondary" />
                  <a href={`tel:${enquiry.phone}`} className="text-secondary hover:underline">{enquiry.phone}</a>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <span className="text-xs uppercase font-bold text-gray-500 w-20">Type</span>
                  <span className="font-medium text-white">{enquiry.type}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <span className="text-xs uppercase font-bold text-gray-500 w-20">Source</span>
                  <span className="font-medium text-white capitalize">{enquiry.source || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="h-4 w-4 text-secondary" />
                  <span>{new Date(enquiry.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {(enquiry.subject || enquiry.serviceOfInterest || enquiry.destinationCountry) && (
              <div className="bg-[#020C1B] p-4 rounded-xl border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-4">
                {enquiry.subject && (
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase">Subject</div>
                    <div className="text-white mt-1">{enquiry.subject}</div>
                  </div>
                )}
                {enquiry.serviceOfInterest && (
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase">Service</div>
                    <div className="text-white mt-1">{enquiry.serviceOfInterest}</div>
                  </div>
                )}
                {enquiry.destinationCountry && (
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase">Destination</div>
                    <div className="text-white mt-1">{enquiry.destinationCountry}</div>
                  </div>
                )}
              </div>
            )}

            <div className="pt-4 border-t border-white/5">
              <h4 className="text-xs uppercase font-bold text-gray-500 mb-3">Message</h4>
              <p className="text-white text-sm whitespace-pre-wrap leading-relaxed bg-[#020C1B] p-4 rounded-xl border border-white/5">
                {enquiry.message}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0A192F] border border-[#1E2D3D] rounded-xl p-6 space-y-6">
            <h3 className="font-bold text-white text-lg border-b border-white/5 pb-3">Resolution</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-[#020C1B] border border-white/5 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-secondary transition-colors"
              >
                <option value={ENQUIRY_STATUSES.PENDING}>Pending</option>
                <option value={ENQUIRY_STATUSES.IN_PROGRESS}>In Progress</option>
                <option value={ENQUIRY_STATUSES.RESOLVED}>Resolved</option>
              </select>
            </div>

            {enquiry.resolvedAt && (
              <div className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                <CheckCircle className="h-4 w-4" />
                Resolved on {new Date(enquiry.resolvedAt).toLocaleDateString()}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Internal Admin Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add private notes regarding this lead..."
                rows={8}
                className="w-full bg-[#020C1B] border border-white/5 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-secondary transition-colors resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
