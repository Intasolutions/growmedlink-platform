'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Star, ArrowLeft, ArrowRight, Quote, Plus, X, MessageSquare, Check } from 'lucide-react';

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
  createdAt: string;
}

export default function ReviewsSection({ initialReviews = [] }: { initialReviews?: ReviewItem[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [visible, setVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [services, setServices] = useState<any[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    studentName: '',
    rating: 5,
    comment: '',
    service: '',
  });
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Intersection Observer for section entry animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Fetch reviews client-side if initialReviews is empty or if we want to ensure fresh data
  useEffect(() => {
    if (initialReviews.length === 0) {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      fetch(`${API_BASE_URL}/api/reviews`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && data?.data) {
            setReviews(data.data);
          }
        })
        .catch((err) => console.error('Error fetching reviews:', err));
    }
  }, [initialReviews]);

  // Fetch services for linking review when modal opens
  const fetchServices = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE_URL}/api/services`);
      if (res.ok) {
        const data = await res.json();
        setServices(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching services for review modal:', err);
    }
  };

  const openReviewModal = () => {
    setIsModalOpen(true);
    setSubmitSuccess(false);
    setSubmitError(null);
    setFormData({
      studentName: '',
      rating: 5,
      comment: '',
      service: '',
    });
    fetchServices();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingClick = (rate: number) => {
    setFormData((prev) => ({ ...prev, rating: rate }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    try {
      const payload = {
        studentName: formData.studentName.trim(),
        rating: formData.rating,
        comment: formData.comment.trim(),
        service: formData.service || undefined,
        studentImage: '', // fallback avatar on server/frontend side
      };

      const res = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Validation failed. Please verify your fields.');
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
      }, 3000);
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Carousel control handlers
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  // A helper to generate consistent gradient background based on student name
  const getGradientBg = (name: string) => {
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue1 = hash % 360;
    const hue2 = (hash + 60) % 360;
    return `linear-gradient(135deg, hsl(${hue1}, 65%, 65%), hsl(${hue2}, 65%, 45%))`;
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <section
      ref={sectionRef}
      className="bg-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden font-['Power_Grotesk']"
      id="reviews"
    >
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .review-fade-up {
          opacity: 0;
        }
        .is-visible .review-fade-up {
          animation: fadeInUp 0.8s cubic-bezier(.22,.68,0,1.05) forwards;
        }

        .review-delay-1 { animation-delay: 0.1s; }
        .review-delay-2 { animation-delay: 0.2s; }
        .review-delay-3 { animation-delay: 0.3s; }
        .review-delay-4 { animation-delay: 0.4s; }

        .review-card-hover {
          transition: transform 0.3s cubic-bezier(.22,.68,0,1.1), 
                      box-shadow 0.3s ease, 
                      border-color 0.3s ease;
          will-change: transform, box-shadow;
        }
        @media (hover: hover) {
          .review-card-hover:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.06), 0 0 0 1px rgba(150,202,69,0.2);
            border-color: rgba(150,202,69,0.3);
          }
        }

        .stars-container svg {
          transition: transform 0.2s ease;
        }
        .stars-container svg:hover {
          transform: scale(1.2);
        }

        .glass-panel {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.12);
        }
      `}</style>

      <div className={`max-w-7xl mx-auto ${visible ? 'is-visible' : ''}`}>
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 review-fade-up">
          <div>
            <span className="text-[rgba(150,202,69,1)] font-semibold uppercase tracking-wider text-sm block mb-2">
              Testimonials
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-[#252525] leading-none uppercase">
              STUDENT <span className="text-[rgba(150,202,69,1)]">REVIEWS</span>
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl font-sans text-sm md:text-base leading-relaxed">
              Hear directly from our students who have successfully transitioned to global nursing careers, cleared exams, and relocated abroad.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={openReviewModal}
              className="flex items-center gap-2 px-5 py-3 bg-[rgba(150,202,69,1)] text-[#111] font-bold text-sm rounded-lg hover:bg-[rgba(150,202,69,0.9)] transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Write a Review
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={scrollLeft}
                className="w-11 h-11 rounded-full border border-gray-200 hover:border-[rgba(150,202,69,1)] hover:bg-[rgba(150,202,69,0.05)] flex items-center justify-center text-[#252525] hover:text-[rgba(150,202,69,1)] transition-all"
                aria-label="Previous Review"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollRight}
                className="w-11 h-11 rounded-full border border-gray-200 hover:border-[rgba(150,202,69,1)] hover:bg-[rgba(150,202,69,0.05)] flex items-center justify-center text-[#252525] hover:text-[rgba(150,202,69,1)] transition-all"
                aria-label="Next Review"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* REVIEWS CAROUSEL DECK */}
        {reviews.length === 0 ? (
          <div className="text-center py-16 bg-[#F9F9F9] rounded-2xl border border-dashed border-gray-200 review-fade-up review-delay-1 flex flex-col items-center justify-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-gray-500 font-sans">No approved reviews yet. Be the first to share your experience!</p>
            <button
              onClick={openReviewModal}
              className="mt-4 px-4 py-2 text-xs bg-[rgba(150,202,69,1)] text-[#111] font-bold rounded hover:bg-[rgba(150,202,69,0.9)] transition-all"
            >
              Write the first review
            </button>
          </div>
        ) : (
          <div
            ref={carouselRef}
            className="hide-scrollbar flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-2 scroll-smooth review-fade-up review-delay-1"
          >
            {reviews.map((review, idx) => {
              const delayClass = `review-delay-${Math.min((idx % 4) + 1, 4)}`;
              const hasAvatar = !!review.studentImage;

              return (
                <div
                  key={review._id}
                  className="flex-shrink-0 w-[300px] sm:w-[360px] snap-start"
                >
                  <div className="bg-[#FAF9F6] border border-gray-100/80 rounded-2xl p-6 md:p-8 flex flex-col justify-between h-[320px] review-card-hover relative">
                    
                    {/* Background floating quote mark for visual depth */}
                    <Quote className="absolute right-6 top-6 w-16 h-16 text-gray-200/50 pointer-events-none" />

                    <div>
                      {/* Rating Stars */}
                      <div className="flex items-center gap-1 mb-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-[rgba(150,202,69,1)] text-[rgba(150,202,69,1)]'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Comment text */}
                      <p className="text-[#333] font-sans text-sm md:text-base leading-relaxed line-clamp-5 mb-6">
                        "{review.comment}"
                      </p>
                    </div>

                    {/* Student Info Footer */}
                    <div className="flex items-center gap-3.5 border-t border-gray-200/50 pt-4 mt-auto">
                      {hasAvatar ? (
                        <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0">
                          <Image
                            src={review.studentImage!}
                            alt={review.studentName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div
                          className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm"
                          style={{ background: getGradientBg(review.studentName) }}
                        >
                          {getInitials(review.studentName)}
                        </div>
                      )}

                      <div className="min-w-0">
                        <h4 className="font-bold text-[#252525] text-sm md:text-base truncate">
                          {review.studentName}
                        </h4>
                        {review.service ? (
                          <span className="text-xs text-[rgba(150,202,69,1)] font-semibold block truncate">
                            {review.service.title}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 block">Verified Student</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* MODAL WINDOW FOR LEAVING A REVIEW */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
            
            {/* Backdrop with blur effect */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => !isSubmitting && setIsModalOpen(false)}
            />

            {/* Modal Body */}
            <div className="glass-panel w-full max-w-lg rounded-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
              
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-[#252525] flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[rgba(150,202,69,1)]" />
                  SHARE YOUR STORY
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
                  disabled={isSubmitting}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Success Screen */}
              {submitSuccess ? (
                <div className="p-8 text-center flex flex-col items-center justify-center flex-1">
                  <div className="w-16 h-16 rounded-full bg-[rgba(150,202,69,0.1)] flex items-center justify-center text-[rgba(150,202,69,1)] mb-4 animate-bounce">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-black text-[#252525] mb-2 uppercase">REVIEW SUBMITTED</h4>
                  <p className="text-gray-500 font-sans max-w-sm">
                    Thank you so much! Your review has been submitted successfully and is pending administrative approval before it goes public.
                  </p>
                </div>
              ) : (
                /* Form body */
                <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
                  
                  {submitError && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm font-sans">
                      {submitError}
                    </div>
                  )}

                  {/* Name field */}
                  <div>
                    <label htmlFor="studentName" className="block text-sm font-bold text-gray-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="studentName"
                      id="studentName"
                      required
                      value={formData.studentName}
                      onChange={handleInputChange}
                      placeholder="e.g. Emily Watson"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[rgba(150,202,69,1)] focus:ring-1 focus:ring-[rgba(150,202,69,1)] text-sm font-sans transition-all"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Rating field */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Rating *
                    </label>
                    <div className="flex items-center gap-1.5 stars-container">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const starValue = i + 1;
                        const active = hoverRating !== null ? starValue <= hoverRating : starValue <= formData.rating;
                        return (
                          <button
                            type="button"
                            key={i}
                            onClick={() => handleRatingClick(starValue)}
                            onMouseEnter={() => setHoverRating(starValue)}
                            onMouseLeave={() => setHoverRating(null)}
                            className="p-1 focus:outline-none"
                            disabled={isSubmitting}
                          >
                            <Star
                              className={`w-7 h-7 ${
                                active
                                  ? 'fill-[rgba(150,202,69,1)] text-[rgba(150,202,69,1)]'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Course/Service dropdown */}
                  <div>
                    <label htmlFor="service" className="block text-sm font-bold text-gray-700 mb-1">
                      Service / Course (Optional)
                    </label>
                    <select
                      name="service"
                      id="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[rgba(150,202,69,1)] focus:ring-1 focus:ring-[rgba(150,202,69,1)] text-sm font-sans transition-all bg-white"
                      disabled={isSubmitting}
                    >
                      <option value="">-- Select Service --</option>
                      {services.map((svc) => (
                        <option key={svc._id} value={svc._id}>
                          [{svc.category.toUpperCase()}] {svc.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Comment field */}
                  <div>
                    <label htmlFor="comment" className="block text-sm font-bold text-gray-700 mb-1">
                      Review Description *
                    </label>
                    <textarea
                      name="comment"
                      id="comment"
                      required
                      value={formData.comment}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Share your transition experience, visa process, or course quality details..."
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[rgba(150,202,69,1)] focus:ring-1 focus:ring-[rgba(150,202,69,1)] text-sm font-sans transition-all resize-none"
                      disabled={isSubmitting}
                    />
                    <span className="text-[11px] text-gray-400 font-sans block mt-1">
                      Must be at least 10 characters long.
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-sm rounded-lg transition-colors cursor-pointer"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[rgba(150,202,69,1)] text-[#111] hover:bg-[rgba(150,202,69,0.9)] font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        'Submit Review'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
