'use client';

import React, { useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { submitEnquiry } from '@/lib/api/enquiries';
import { Loader2, CheckCircle, Lightbulb } from 'lucide-react';
import { ENQUIRY_TYPES } from '@intelligen/constants';

export default function TalkToExpertPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceOfInterest: '',
    destinationCountry: '',
    message: '',
  });
  const [token, setToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Please complete the Turnstile verification.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await submitEnquiry({
        ...formData,
        type: ENQUIRY_TYPES.TALK_TO_EXPERT,
        source: 'talk-to-expert',
        pageUrl: window.location.href,
        turnstileToken: token,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020C1B]">
      {/* Header */}
      <section className="bg-gradient-to-b from-[#0A192F] to-[#020C1B] py-24 border-b border-[#1E2D3D]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-bold tracking-widest uppercase mb-8">
            <Lightbulb className="h-4 w-4" /> Priority Consultation
          </span>
          <h1 className="text-4xl md:text-6xl font-black font-heading text-white mb-6 leading-tight">
            Talk to an Expert
          </h1>
          <p className="text-xl text-gray-400 font-light leading-relaxed max-w-2xl mx-auto">
            Book a dedicated consultation session with our senior immigration and education advisors to map out your global pathway.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 -mt-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0A192F] border border-[#1E2D3D] rounded-3xl p-8 md:p-12 shadow-2xl relative z-10">
            {success ? (
              <div className="text-center py-16">
                <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
                <h3 className="text-3xl font-black text-white mb-4">Request Received!</h3>
                <p className="text-gray-400 text-lg max-w-md mx-auto">
                  Your consultation request has been placed in our priority queue. An expert will contact you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium">
                    {error}
                  </div>
                )}

                {/* Personal Details */}
                <div>
                  <h3 className="text-lg font-bold text-white border-b border-white/5 pb-4 mb-6">Personal Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Phone Number</label>
                      <input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Consultation Details */}
                <div>
                  <h3 className="text-lg font-bold text-white border-b border-white/5 pb-4 mb-6">Consultation Needs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Service of Interest</label>
                      <select
                        required
                        value={formData.serviceOfInterest}
                        onChange={(e) => setFormData({ ...formData, serviceOfInterest: e.target.value })}
                        className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors"
                      >
                        <option value="">Select a service...</option>
                        <option value="Student Visa">Student Visa</option>
                        <option value="Skilled Migration">Skilled Migration</option>
                        <option value="Visitor Visa">Visitor Visa</option>
                        <option value="IELTS Coaching">IELTS Coaching</option>
                        <option value="PTE Coaching">PTE Coaching</option>
                        <option value="OET Coaching">OET Coaching</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Destination Country</label>
                      <select
                        value={formData.destinationCountry}
                        onChange={(e) => setFormData({ ...formData, destinationCountry: e.target.value })}
                        className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors"
                      >
                        <option value="">Not sure yet / N/A</option>
                        <option value="Australia">Australia</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="New Zealand">New Zealand</option>
                        <option value="United States">United States</option>
                        <option value="Europe">Europe</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Brief Background / Questions</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please briefly explain your current situation and what you'd like to discuss..."
                      className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* Security & Submission */}
                <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <Turnstile
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
                    onSuccess={(t) => setToken(t)}
                    options={{ theme: 'dark' }}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !token}
                    className="w-full sm:w-auto bg-secondary text-[#020C1B] px-10 py-4 rounded-xl font-bold text-lg hover:bg-secondary-dark transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
                    Request Consultation
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
