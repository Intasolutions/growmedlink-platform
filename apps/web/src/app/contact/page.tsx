'use client';

import React, { useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
// 1x00000000000000000000AA is the Cloudflare always-pass dummy key for testing
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'; 

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
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
          type: 'Contact Form',
          source: 'contact',
          pageUrl: '/contact',
          turnstileToken,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || (data.errors ? Object.values(data.errors)[0] as string : 'Submission failed'));
      }

      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#020C1B] text-white py-24 px-6 relative">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#0A192F]/40 to-transparent pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight">
            Contact <span className="text-secondary">Us</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Have questions about our immigration or language services? Reach out to our team of experts and we'll get back to you shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-8 lg:col-span-1">
            <div className="bg-[#0A192F]/40 border border-white/5 p-8 rounded-3xl space-y-8 shadow-2xl">
              <div>
                <h3 className="text-xl font-bold mb-6">Get in Touch</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4 text-gray-300">
                    <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Email</p>
                      <a href="mailto:info@growmedlink.com" className="hover:text-secondary transition-colors font-medium">info@growmedlink.com</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 text-gray-300">
                    <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Phone</p>
                      <a href="tel:+1234567890" className="hover:text-secondary transition-colors font-medium">+1 (234) 567-890</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 text-gray-300">
                    <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Office</p>
                      <p className="font-medium leading-relaxed">123 Global Way, Suite 400<br/>Toronto, ON M5V 1A1<br/>Canada</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-[#0A192F]/40 border border-white/5 p-8 md:p-12 rounded-3xl shadow-2xl">
              {success ? (
                <div className="text-center py-12 space-y-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 text-green-400 mb-4">
                    <Send className="h-10 w-10" />
                  </div>
                  <h3 className="text-3xl font-bold">Message Sent!</h3>
                  <p className="text-gray-400">Thank you for reaching out. We will get back to you shortly.</p>
                  <button 
                    onClick={() => setSuccess(false)}
                    className="mt-8 px-6 py-2 border border-white/10 rounded-full hover:bg-white/5 transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
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
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Subject</label>
                      <input 
                        type="text" 
                        value={formData.subject}
                        onChange={e => setFormData({...formData, subject: e.target.value})}
                        className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors" 
                        placeholder="How can we help?" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Message *</label>
                    <textarea 
                      required
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors resize-none" 
                      rows={6}
                      placeholder="Tell us about your enquiry..." 
                    />
                  </div>

                  <div className="pt-2">
                    <Turnstile
                      siteKey={SITE_KEY}
                      onSuccess={(token) => setTurnstileToken(token)}
                      onError={() => setError('Verification failed. Please try again.')}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting || !turnstileToken}
                    className="w-full flex items-center justify-center gap-2 bg-secondary text-[#020C1B] font-bold py-4 rounded-xl hover:bg-secondary-dark transition-colors disabled:opacity-50 mt-4"
                  >
                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
