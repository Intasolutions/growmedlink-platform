'use client';

import React, { useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { SERVICE_CATEGORIES } from '@intelligen/constants';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'; 

export default function TalkToExpertPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceOfInterest: '',
    destinationCountry: '',
    message: '',
  });
  const [turnstileToken, setTurnstileToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnstileToken) {
      setError('Please complete the verification check.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: 'Talk to Expert',
          source: 'talk-to-expert',
          pageUrl: '/talk-to-expert',
          turnstileToken,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || (data.errors ? Object.values(data.errors)[0] as string : 'Submission failed'));
      }

      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', serviceOfInterest: '', destinationCountry: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#020C1B] text-white py-24 px-6 relative">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#0A192F]/40 to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-bold uppercase tracking-widest mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Free Consultation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight">
            Talk to an <span className="text-secondary">Expert</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Book a one-on-one consultation with our immigration or language training experts to discuss your specific needs and goals.
          </p>
        </div>

        <div className="bg-[#0A192F]/40 border border-white/5 p-8 md:p-12 rounded-3xl shadow-2xl">
          {success ? (
            <div className="text-center py-16 space-y-6">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/10 text-green-400 mb-4">
                <CheckCircle className="h-12 w-12" />
              </div>
              <h3 className="text-3xl font-bold">Consultation Requested!</h3>
              <p className="text-gray-400 text-lg max-w-md mx-auto">
                Thank you for reaching out. One of our experts will contact you shortly to schedule your consultation.
              </p>
              <button 
                onClick={() => setSuccess(false)}
                className="mt-8 px-8 py-3 border border-white/10 rounded-full hover:bg-white/5 transition-colors font-bold"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm text-center font-medium">
                  {error}
                </div>
              )}
              
              <div className="space-y-6">
                <h3 className="text-xl font-bold border-b border-white/5 pb-4">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Full Name *</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors" 
                      placeholder="John Doe" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Email Address *</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors" 
                      placeholder="john@example.com" 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Phone Number *</label>
                    <input 
                      required
                      type="tel" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors" 
                      placeholder="+1 234 567 8900" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold border-b border-white/5 pb-4">Consultation Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Service of Interest</label>
                    <select 
                      value={formData.serviceOfInterest}
                      onChange={e => setFormData({...formData, serviceOfInterest: e.target.value})}
                      className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors" 
                    >
                      <option value="">Select a service...</option>
                      <option value={SERVICE_CATEGORIES.IMMIGRATION}>Immigration Services</option>
                      <option value={SERVICE_CATEGORIES.LANGUAGE}>Language Academy</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Destination Country</label>
                    <input 
                      type="text" 
                      value={formData.destinationCountry}
                      onChange={e => setFormData({...formData, destinationCountry: e.target.value})}
                      className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors" 
                      placeholder="e.g. Canada, UK, Australia" 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">How can we help you? *</label>
                    <textarea 
                      required
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors resize-none" 
                      rows={5}
                      placeholder="Please provide details about your goals and current situation..." 
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-white/5">
                <Turnstile
                  siteKey={SITE_KEY}
                  onSuccess={(token) => setTurnstileToken(token)}
                  onError={() => setError('Verification failed. Please try again.')}
                />
                
                <button 
                  type="submit" 
                  disabled={isSubmitting || !turnstileToken}
                  className="w-full md:w-auto flex items-center justify-center gap-2 bg-secondary text-[#020C1B] font-bold px-10 py-4 rounded-xl hover:bg-secondary-dark transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  {isSubmitting ? 'Requesting...' : 'Request Consultation'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

function CheckCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
