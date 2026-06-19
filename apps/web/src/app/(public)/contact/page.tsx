'use client';

import React, { useState, useEffect } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { submitEnquiry } from '@/lib/api/enquiries';
import { getGlobalSettings } from '@/lib/api/settings';
import { MapPin, Phone, Mail, Loader2, CheckCircle } from 'lucide-react';
import { ENQUIRY_TYPES } from '@intelligen/constants';

export default function ContactPage() {
  const [settings, setSettings] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [token, setToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getGlobalSettings().then(setSettings).catch(console.error);
  }, []);

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
        type: ENQUIRY_TYPES.CONTACT_FORM,
        source: 'contact',
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
      <section className="bg-[#0A192F] py-20 border-b border-[#1E2D3D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black font-heading text-white mb-6">Get in Touch</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
            Have questions about our services? We're here to help you navigate your global journey.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Contact Info Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-[#0A192F] border border-[#1E2D3D] rounded-3xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Contact Information</h3>
                <ul className="space-y-6">
                  {settings?.address && (
                    <li className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                        <MapPin className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Office</p>
                        <p className="text-white text-sm leading-relaxed">{settings.address}</p>
                      </div>
                    </li>
                  )}
                  {settings?.contactPhone && (
                    <li className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                        <Phone className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Phone</p>
                        <a href={`tel:${settings.contactPhone}`} className="text-white hover:text-secondary transition-colors font-medium">{settings.contactPhone}</a>
                      </div>
                    </li>
                  )}
                  {settings?.contactEmail && (
                    <li className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                        <Mail className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Email</p>
                        <a href={`mailto:${settings.contactEmail}`} className="text-white hover:text-secondary transition-colors font-medium">{settings.contactEmail}</a>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-[#0A192F] border border-[#1E2D3D] rounded-3xl p-8 shadow-2xl">
                {success ? (
                  <div className="text-center py-16">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                    <h3 className="text-3xl font-black text-white mb-4">Message Sent!</h3>
                    <p className="text-gray-400 text-lg">Thank you for reaching out. A member of our team will get back to you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h3 className="text-2xl font-bold text-white mb-8">Send us a Message</h3>
                    
                    {error && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium">
                        {error}
                      </div>
                    )}

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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <div>
                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Subject</label>
                        <input
                          type="text"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Message</label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-[#020C1B] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors resize-none"
                      ></textarea>
                    </div>

                    <div className="py-2">
                      <Turnstile
                        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
                        onSuccess={(t) => setToken(t)}
                        options={{ theme: 'dark' }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !token}
                      className="w-full md:w-auto bg-secondary text-[#020C1B] px-8 py-4 rounded-xl font-bold text-lg hover:bg-secondary-dark transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                      {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
