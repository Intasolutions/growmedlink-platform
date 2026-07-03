'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Loader2, 
  Star, 
  MessageSquare, 
  Check, 
  X, 
  Trash2, 
  Edit, 
  Plus, 
  Inbox, 
  CheckCircle, 
  AlertTriangle,
  Bookmark
} from 'lucide-react';
import { REVIEW_STATUSES } from '@intelligen/constants';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface ReviewItem {
  _id: string;
  studentName: string;
  studentImage?: string;
  rating: number;
  comment: string;
  service?: {
    _id: string;
    title: string;
    category: string;
  } | null;
  status: string;
  isFeatured: boolean;
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [isLoading, setIsLoading] = useState(true);
  
  // Search & Filter State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);
  const [formData, setFormData] = useState({
    studentName: '',
    rating: 5,
    comment: '',
    service: '',
    status: REVIEW_STATUSES.PENDING as string,
    isFeatured: false,
  });

  const [modalError, setModalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic Metrics derived from admin dashboard list or queries
  const [metrics, setMetrics] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    featured: 0
  });

  const fetchReviews = async (page = 1) => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });
      if (search) query.append('search', search);
      if (statusFilter) query.append('status', statusFilter);
      if (featuredFilter) query.append('isFeatured', featuredFilter);

      const res = await fetch(`${API_BASE_URL}/api/reviews/admin?${query.toString()}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReviews(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch metrics and services
  const fetchAuxiliaryData = async () => {
    try {
      // Fetch services for select menu
      const sRes = await fetch(`${API_BASE_URL}/api/services`);
      if (sRes.ok) {
        const sData = await sRes.json();
        setServices(sData.data || []);
      }

      // Fetch all reviews (without limit) to count statuses for metrics
      const mRes = await fetch(`${API_BASE_URL}/api/reviews/admin?limit=1000`, {
        credentials: 'include'
      });
      if (mRes.ok) {
        const mData = await mRes.json();
        const allList: ReviewItem[] = mData.data || [];
        setMetrics({
          total: allList.length,
          pending: allList.filter(r => r.status === REVIEW_STATUSES.PENDING).length,
          approved: allList.filter(r => r.status === REVIEW_STATUSES.APPROVED).length,
          featured: allList.filter(r => r.isFeatured).length
        });
      }
    } catch (error) {
      console.error('Failed to fetch auxiliary review data:', error);
    }
  };

  useEffect(() => {
    fetchAuxiliaryData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReviews(1);
    }, 450); // Debounce search
    return () => clearTimeout(timer);
  }, [search, statusFilter, featuredFilter]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      fetchReviews(newPage);
    }
  };

  // Quick action: Change status (Approve/Reject)
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include',
      });
      if (res.ok) {
        fetchReviews(pagination.page);
        fetchAuxiliaryData();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  // Quick action: Toggle featured
  const handleToggleFeatured = async (id: string, currentVal: boolean) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !currentVal }),
        credentials: 'include',
      });
      if (res.ok) {
        fetchReviews(pagination.page);
        fetchAuxiliaryData();
      }
    } catch (error) {
      console.error('Failed to toggle featured status:', error);
    }
  };

  // Quick action: Delete review
  const handleDeleteReview = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        fetchReviews(pagination.page);
        fetchAuxiliaryData();
      }
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  // Add / Edit Modal setup
  const openModal = (review: ReviewItem | null = null) => {
    setEditingReview(review);
    setModalError(null);
    if (review) {
      setFormData({
        studentName: review.studentName,
        rating: review.rating,
        comment: review.comment,
        service: review.service?._id || '',
        status: review.status,
        isFeatured: review.isFeatured,
      });
    } else {
      setFormData({
        studentName: '',
        rating: 5,
        comment: '',
        service: '',
        status: REVIEW_STATUSES.PENDING as string,
        isFeatured: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleRatingClick = (rate: number) => {
    setFormData((prev) => ({ ...prev, rating: rate }));
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModalError(null);

    try {
      const payload = {
        studentName: formData.studentName.trim(),
        rating: formData.rating,
        comment: formData.comment.trim(),
        service: formData.service || undefined,
        status: formData.status,
        isFeatured: formData.isFeatured,
      };

      const url = editingReview 
        ? `${API_BASE_URL}/api/reviews/${editingReview._id}` 
        : `${API_BASE_URL}/api/reviews`;
      const method = editingReview ? 'PUT' : 'POST';

      // For creating manual reviews by admin, we bypass pending if admin marks as approved directly
      // Wait, POST /api/reviews defaults to pending on backend, let's check if the admin wants to approve it immediately.
      // If we create a review, we save it (it goes in as pending), and then if status was approved, we can make an immediate PUT to approve it!
      // This is a robust fallback for model constraints.
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Validation failed. Check your fields.');
      }

      // If creating a new review and admin selected APPROVED or FEATURED immediately:
      if (!editingReview && (formData.status !== REVIEW_STATUSES.PENDING || formData.isFeatured)) {
        const createdId = data.data?._id;
        if (createdId) {
          await fetch(`${API_BASE_URL}/api/reviews/${createdId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              status: formData.status, 
              isFeatured: formData.isFeatured 
            }),
            credentials: 'include',
          });
        }
      }

      setIsModalOpen(false);
      fetchReviews(editingReview ? pagination.page : 1);
      fetchAuxiliaryData();
    } catch (error: any) {
      setModalError(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initials generator
  const getInitials = (name: string) => {
    if (!name) return 'S';
    return name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();
  };

  return (
    <div className="space-y-6 font-['Power_Grotesk'] text-white">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-black tracking-wide text-white">
            Student Reviews
          </h1>
          <p className="text-gray-400 text-sm font-light mt-1">
            Moderate, feature, and manage student testimonials displayed on the homepage.
          </p>
        </div>
        <button
          onClick={() => openModal(null)}
          className="flex items-center gap-2 px-5 py-2.5 bg-secondary text-[#020C1B] font-bold text-sm rounded-xl hover:bg-secondary/90 transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Plus className="w-4.5 h-4.5" />
          Add Review
        </button>
      </div>

      {/* METRICS SUMMARY */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Reviews', value: metrics.total, icon: <MessageSquare className="h-5 w-5" />, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { title: 'Pending Approval', value: metrics.pending, icon: <Inbox className="h-5 w-5" />, color: 'text-red-400', bg: 'bg-red-400/10' },
          { title: 'Approved', value: metrics.approved, icon: <CheckCircle className="h-5 w-5" />, color: 'text-green-400', bg: 'bg-green-400/10' },
          { title: 'Featured on Home', value: metrics.featured, icon: <Bookmark className="h-5 w-5" />, color: 'text-purple-400', bg: 'bg-purple-400/10' },
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

      {/* FILTERS & SEARCH */}
      <div className="bg-[#0A192F] border border-[#1E2D3D] p-4 rounded-2xl flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by student name or review content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#020C1B] border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
          />
        </div>
        
        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-[#020C1B] border border-white/5 rounded-xl px-3 py-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-sm text-white focus:outline-none w-32 cursor-pointer"
            >
              <option value="" className="bg-[#0A192F]">All Status</option>
              <option value={REVIEW_STATUSES.PENDING} className="bg-[#0A192F]">Pending</option>
              <option value={REVIEW_STATUSES.APPROVED} className="bg-[#0A192F]">Approved</option>
              <option value={REVIEW_STATUSES.REJECTED} className="bg-[#0A192F]">Rejected</option>
            </select>
          </div>

          {/* Featured Filter */}
          <div className="flex items-center gap-2 bg-[#020C1B] border border-white/5 rounded-xl px-3 py-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value)}
              className="bg-transparent text-sm text-white focus:outline-none w-36 cursor-pointer"
            >
              <option value="" className="bg-[#0A192F]">All Visibility</option>
              <option value="true" className="bg-[#0A192F]">Featured Only</option>
              <option value="false" className="bg-[#0A192F]">Non-Featured</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE LIST VIEW */}
      <div className="bg-[#0A192F] border border-[#1E2D3D] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-[#020C1B] text-xs uppercase font-bold tracking-wider text-gray-500 border-b border-[#1E2D3D]">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Review comment</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Featured</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-secondary mx-auto" />
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No reviews found matching the search criteria.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => {
                  return (
                    <tr key={review._id} className="border-b border-[#1E2D3D] hover:bg-white/[0.02] transition-colors">
                      
                      {/* Name / Avatar / Service */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {review.studentImage ? (
                            <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-white/10">
                              <img
                                src={review.studentImage}
                                alt={review.studentName}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center font-bold text-secondary text-xs shrink-0">
                              {getInitials(review.studentName)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-bold text-white truncate max-w-[150px]">{review.studentName}</div>
                            {review.service ? (
                              <span className="text-[10px] text-secondary font-medium tracking-wide bg-secondary/5 border border-secondary/15 px-1.5 py-0.5 rounded block w-max truncate max-w-[150px]">
                                {review.service.title}
                              </span>
                            ) : (
                              <span className="text-[10px] text-gray-500 block">General Feedback</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Comment text snippet */}
                      <td className="px-6 py-4 max-w-[280px]">
                        <p className="text-gray-300 font-sans text-xs line-clamp-2 leading-relaxed">
                          "{review.comment}"
                        </p>
                        <span className="text-[9px] text-gray-500 block mt-1">
                          Submitted: {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Rating stars */}
                      <td className="px-6 py-4 shrink-0">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < review.rating
                                  ? 'fill-secondary text-secondary'
                                  : 'text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </td>

                      {/* Moderation Status */}
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold border ${
                          review.status === REVIEW_STATUSES.APPROVED ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          review.status === REVIEW_STATUSES.REJECTED ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                          'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                        }`}>
                          {review.status}
                        </span>
                      </td>

                      {/* Featured Home Toggle */}
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(review._id, review.isFeatured)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
                            review.isFeatured
                              ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-md shadow-purple-500/10'
                              : 'bg-transparent border-[#1E2D3D] text-gray-600 hover:border-gray-500 hover:text-gray-400'
                          }`}
                          title={review.isFeatured ? 'Featured (Click to disable)' : 'Not Featured (Click to enable)'}
                        >
                          <Bookmark className="w-4.5 h-4.5" />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          {/* Approve option if pending */}
                          {review.status === REVIEW_STATUSES.PENDING && (
                            <>
                              <button
                                onClick={() => handleStatusChange(review._id, REVIEW_STATUSES.APPROVED)}
                                className="p-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors border border-green-500/10 hover:border-green-500/30"
                                title="Approve Review"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleStatusChange(review._id, REVIEW_STATUSES.REJECTED)}
                                className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors border border-rose-500/10 hover:border-rose-500/30"
                                title="Reject Review"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => openModal(review)}
                            className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors border border-blue-500/10 hover:border-blue-500/30"
                            title="Edit Review"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/10 hover:border-red-500/30"
                            title="Delete Review"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION PANEL */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-[#1E2D3D] flex items-center justify-between bg-[#020C1B]">
            <span className="text-xs text-gray-500">
              Showing page {pagination.page} of {pagination.pages} ({pagination.total} total)
            </span>
            <div className="flex gap-2">
              <button
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="px-3.5 py-1.5 bg-[#0A192F] border border-[#1E2D3D] rounded-lg text-xs text-white disabled:opacity-50 hover:bg-white/5 transition-colors cursor-pointer"
              >
                Previous
              </button>
              <button
                disabled={pagination.page === pagination.pages}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="px-3.5 py-1.5 bg-[#0A192F] border border-[#1E2D3D] rounded-lg text-xs text-white disabled:opacity-50 hover:bg-white/5 transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ADD / EDIT DIALOG BOX */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Blur Overlay */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => !isSubmitting && setIsModalOpen(false)}
          />

          {/* Modal Card */}
          <div className="bg-[#0A192F] border border-[#1E2D3D] w-full max-w-lg rounded-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-[#1E2D3D] flex items-center justify-between">
              <h3 className="text-lg font-black text-white uppercase flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-secondary" />
                {editingReview ? 'EDIT STUDENT REVIEW' : 'ADD NEW MANUAL REVIEW'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                disabled={isSubmitting}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {modalError && (
                <div className="p-3 bg-red-500/10 border border-red-500/25 text-red-400 rounded-lg text-xs font-sans">
                  {modalError}
                </div>
              )}

              {/* Student Name */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Student Name *
                </label>
                <input
                  type="text"
                  name="studentName"
                  required
                  value={formData.studentName}
                  onChange={handleInputChange}
                  placeholder="e.g. Rohan Sharma"
                  className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-secondary font-sans"
                  disabled={isSubmitting}
                />
              </div>

              {/* Rating Star Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Rating Rating (1 to 5) *
                </label>
                <div className="flex items-center gap-1.5 py-1">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const starVal = i + 1;
                    const active = starVal <= formData.rating;
                    return (
                      <button
                        type="button"
                        key={i}
                        onClick={() => handleRatingClick(starVal)}
                        className="p-0.5 focus:outline-none"
                        disabled={isSubmitting}
                      >
                        <Star
                          className={`w-6.5 h-6.5 cursor-pointer hover:scale-110 transition-transform ${
                            active
                              ? 'fill-secondary text-secondary'
                              : 'text-gray-600'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Linked Service */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Linked Service / Course
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-secondary cursor-pointer font-sans"
                  disabled={isSubmitting}
                >
                  <option value="">-- No linked service (General review) --</option>
                  {services.map((svc) => {
                    const catName = svc.category ? (typeof svc.category === 'object' ? (svc.category as any).name : svc.category) : '';
                    return (
                      <option key={svc._id} value={svc._id}>
                        [{catName.toUpperCase()}] {svc.title}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Moderation Status *
                </label>
                <select
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-secondary cursor-pointer font-sans"
                  disabled={isSubmitting}
                >
                  <option value={REVIEW_STATUSES.PENDING}>Pending Approval</option>
                  <option value={REVIEW_STATUSES.APPROVED}>Approved</option>
                  <option value={REVIEW_STATUSES.REJECTED}>Rejected</option>
                </select>
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-3 py-1.5">
                <input
                  type="checkbox"
                  name="isFeatured"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleCheckboxChange}
                  className="w-4.5 h-4.5 bg-[#020C1B] border border-white/5 rounded focus:ring-0 text-secondary cursor-pointer"
                  disabled={isSubmitting}
                />
                <label htmlFor="isFeatured" className="text-xs font-bold text-gray-300 uppercase tracking-wider cursor-pointer">
                  Feature on Homepage Carousel
                </label>
              </div>

              {/* Comment Description */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Review comment *
                </label>
                <textarea
                  name="comment"
                  required
                  rows={4}
                  value={formData.comment}
                  onChange={handleInputChange}
                  placeholder="Insert feedback comment..."
                  className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-secondary resize-none font-sans"
                  disabled={isSubmitting}
                />
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-[#1E2D3D] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#1E2D3D] hover:bg-white/5 text-gray-300 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-secondary text-[#020C1B] hover:bg-secondary/90 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving changes...' : editingReview ? 'Save Changes' : 'Create Review'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
