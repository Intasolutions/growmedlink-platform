'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import Image from 'next/image';
import { Turnstile } from '@marsidev/react-turnstile';
import { submitEnquiry } from '@/lib/api/enquiries';
import { ENQUIRY_TYPES } from '@intelligen/constants';

/* ══════════════════════════════════════════════════════════════════════
   CONSTANTS & STYLES
══════════════════════════════════════════════════════════════════════ */
const FONTS = {
  heading: 'var(--font-inter), sans-serif',
  mono:    'var(--font-geist-mono), monospace',
  sans:    'var(--font-inter), sans-serif',
};

const COLORS = {
  primaryGreen: '#A3E635', // Match the vibrant green in design
  darkBg: '#121212',
  inputBg: '#1C1C1C',
  inputBorder: '#333333',
};

const STYLES = `
.contact-hero {
  position: relative;
  background-color: #0d0d0d;
  color: #fff;
  padding: 120px 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Neon Green radial glows */
.contact-glow-left {
  position: absolute;
  top: 50%;
  left: -20%;
  width: 50vw;
  height: 50vw;
  background: radial-gradient(circle, rgba(163,230,53,0.15) 0%, rgba(0,0,0,0) 70%);
  transform: translateY(-50%);
  pointer-events: none;
}
.contact-glow-right {
  position: absolute;
  top: 50%;
  right: -20%;
  width: 50vw;
  height: 50vw;
  background: radial-gradient(circle, rgba(163,230,53,0.15) 0%, rgba(0,0,0,0) 70%);
  transform: translateY(-50%);
  pointer-events: none;
}

/* Clock Dial Graphic behind Title */
.contact-dial {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 600px;
  background: url("data:image/svg+xml,%3Csvg width='600' height='600' viewBox='0 0 600 600' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg opacity='0.15'%3E%3Cpath d='M300 40V60' stroke='%23A3E635' stroke-width='4' stroke-linecap='round'/%3E%3Cpath d='M300 540V560' stroke='white' stroke-width='4' stroke-linecap='round'/%3E%3Cpath d='M560 300H540' stroke='white' stroke-width='4' stroke-linecap='round'/%3E%3Cpath d='M60 300H40' stroke='white' stroke-width='4' stroke-linecap='round'/%3E%3Cpath d='M483.848 116.152L469.706 130.294' stroke='white' stroke-width='4' stroke-linecap='round'/%3E%3Cpath d='M130.294 469.706L116.152 483.848' stroke='white' stroke-width='4' stroke-linecap='round'/%3E%3Cpath d='M483.848 483.848L469.706 469.706' stroke='white' stroke-width='4' stroke-linecap='round'/%3E%3Cpath d='M130.294 130.294L116.152 116.152' stroke='white' stroke-width='4' stroke-linecap='round'/%3E%3Cpath d='M431.135 68.8647L421.378 85.7663' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M178.622 514.234L168.865 531.135' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M531.135 168.865L514.234 178.622' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M85.7663 421.378L68.8647 431.135' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M531.135 431.135L514.234 421.378' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M85.7663 178.622L68.8647 168.865' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M431.135 531.135L421.378 514.234' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M178.622 85.7663L168.865 68.8647' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3C/g%3E%3C/svg%3E") no-repeat center center;
  background-size: contain;
  pointer-events: none;
  z-index: 1;
}

.contact-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.contact-title {
  font-family: ${FONTS.heading};
  font-size: clamp(48px, 8vw, 84px);
  font-weight: 700;
  line-height: 1;
  text-align: center;
  margin-bottom: 24px;
  position: relative;
}

.contact-subtitle {
  font-family: ${FONTS.mono};
  font-size: clamp(16px, 3vw, 24px);
  color: ${COLORS.primaryGreen};
  text-align: center;
  margin-bottom: 60px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* Arrow Decoration */
.contact-arrow {
  position: absolute;
  top: -20px;
  right: -120px;
  width: 150px;
  height: 80px;
  pointer-events: none;
}
.contact-arrow svg {
  width: 100%;
  height: 100%;
}
.contact-arrow-text {
  font-family: 'Comic Sans MS', cursive, sans-serif;
  color: ${COLORS.primaryGreen};
  font-size: 18px;
  transform: rotate(-10deg);
  position: absolute;
  top: -15px;
  right: 0;
}

@media (max-width: 768px) {
  .contact-arrow {
    display: none;
  }
}

/* Form Styles */
.contact-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.contact-row {
  display: flex;
  gap: 24px;
  width: 100%;
}

@media (max-width: 640px) {
  .contact-row {
    flex-direction: column;
  }
}

.contact-group {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
}

.contact-label {
  font-family: ${FONTS.mono};
  font-size: 13px;
  color: ${COLORS.primaryGreen};
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.contact-input, .contact-textarea {
  width: 100%;
  background-color: ${COLORS.inputBg};
  border: 1px solid ${COLORS.inputBorder};
  border-radius: 8px;
  padding: 16px 20px;
  color: #fff;
  font-family: ${FONTS.sans};
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s ease;
}

.contact-input:focus, .contact-textarea:focus {
  border-color: ${COLORS.primaryGreen};
}

.contact-input::placeholder, .contact-textarea::placeholder {
  color: #555;
}

.contact-textarea {
  resize: vertical;
  min-height: 140px;
}

.contact-submit {
  align-self: flex-end;
  background-color: ${COLORS.primaryGreen};
  color: #000;
  border: none;
  border-radius: 4px;
  padding: 16px 48px;
  font-family: ${FONTS.sans};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.2s ease;
  margin-top: 12px;
}
.contact-submit:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}
.contact-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Dots Decoration */
.contact-dots {
  position: absolute;
  bottom: 40px;
  left: 40px;
  display: flex;
  gap: 12px;
}
.contact-dot {
  width: 6px;
  height: 6px;
  background-color: ${COLORS.primaryGreen};
  border-radius: 50%;
}

/* Locations Section */
.locations-section {
  background-color: #fff;
  padding: 100px 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.locations-title {
  font-family: ${FONTS.heading};
  font-size: clamp(36px, 5vw, 56px);
  font-weight: 700;
  color: #000;
  margin-bottom: 80px;
}
.locations-title span {
  color: ${COLORS.primaryGreen};
}

.locations-list {
  width: 100%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.location-card {
  display: flex;
  gap: 40px;
  align-items: stretch;
  padding-bottom: 60px;
  border-bottom: 1px solid #eaeaea;
}

@media (max-width: 800px) {
  .location-card {
    flex-direction: column;
  }
}

.location-image-wrapper {
  flex: 1;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  min-height: 240px;
}

.location-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

.location-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.location-country {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.location-country-icon {
  width: 24px;
  height: 18px;
  border-radius: 3px;
  object-fit: cover;
}
.location-country-name {
  color: ${COLORS.primaryGreen};
  font-family: ${FONTS.heading};
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.location-address {
  font-family: ${FONTS.sans};
  font-size: 15px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 32px;
}

.location-contacts {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.location-contact-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.location-contact-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${COLORS.primaryGreen};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
}

.location-contact-text {
  font-family: ${FONTS.sans};
  font-size: 15px;
  font-weight: 500;
  color: #000;
}

.location-contact-item svg {
  width: 20px;
  height: 20px;
}
\`;

/* ══════════════════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════════════ */
const LOCATIONS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1587474260580-57521c7d23d9?auto=format&fit=crop&q=80&w=800',
    country: 'INDIA',
    flag: 'https://flagcdn.com/in.svg',
    address: 'Fabrex Nine Building, Event Glober 24/7 Spaces, 2427/B, Thodupuzha Kerala, India 685584',
    phone: '+91 9898989898',
    email: 'info@growmedlink.com',
    whatsapp: '+91 9898989898',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1587474260580-57521c7d23d9?auto=format&fit=crop&q=80&w=800',
    country: 'INDIA',
    flag: 'https://flagcdn.com/in.svg',
    address: 'Fabrex Nine Building, Event Glober 24/7 Spaces, 2427/B, Thodupuzha Kerala, India 685584',
    phone: '+91 9898989898',
    email: 'info@growmedlink.com',
    whatsapp: '+91 9898989898',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1587474260580-57521c7d23d9?auto=format&fit=crop&q=80&w=800',
    country: 'INDIA',
    flag: 'https://flagcdn.com/in.svg',
    address: 'Fabrex Nine Building, Event Glober 24/7 Spaces, 2427/B, Thodupuzha Kerala, India 685584',
    phone: '+91 9898989898',
    email: 'info@growmedlink.com',
    whatsapp: '+91 9898989898',
  },
];

/* ══════════════════════════════════════════════════════════════════════
   ROOT EXPORT
══════════════════════════════════════════════════════════════════════ */
export default function ContactPageClient() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [token, setToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // For hydration mismatch protection (Turnstile doesn't love SSR)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Please complete the verification.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const name = \`\${formData.firstName} \${formData.lastName}\`.trim();

    try {
      await submitEnquiry({
        name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        type: ENQUIRY_TYPES.CONTACT_FORM,
        source: 'contact',
        pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        turnstileToken: token,
      });
      setSuccess(true);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      
      {/* ── HERO SECTION ── */}
      <section className="contact-hero">
        <div className="contact-glow-left" />
        <div className="contact-glow-right" />
        <div className="contact-dial" />
        
        <div className="contact-dots">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="contact-dot" style={{ opacity: 1 - i * 0.1 }} />
          ))}
        </div>

        <div className="contact-content">
          <div style={{ position: 'relative' }}>
            <h1 className="contact-title">
              Contact Us<span style={{ color: COLORS.primaryGreen }}>.</span>
            </h1>
            <div className="contact-arrow">
              <span className="contact-arrow-text">Say Hello To Us!</span>
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 80 Q 40 20, 80 40" stroke={COLORS.primaryGreen} strokeWidth="3" fill="transparent" strokeLinecap="round" />
                <path d="M70 30 L 82 41 L 65 48" stroke={COLORS.primaryGreen} strokeWidth="3" fill="transparent" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          
          <p className="contact-subtitle">Tell Us What's on Your Mind?</p>

          {success ? (
            <div style={{ 
              background: 'rgba(163,230,53,0.1)', border: \`1px solid \${COLORS.primaryGreen}\`,
              padding: '40px', borderRadius: '12px', textAlign: 'center', width: '100%' 
            }}>
              <h3 style={{ color: COLORS.primaryGreen, fontSize: '24px', marginBottom: '12px', fontFamily: FONTS.heading }}>Message Sent!</h3>
              <p style={{ color: '#fff', fontSize: '16px' }}>Thank you for reaching out. We will get back to you shortly.</p>
              <button 
                onClick={() => setSuccess(false)}
                style={{
                  marginTop: '24px', background: 'transparent', border: '1px solid #fff', 
                  color: '#fff', padding: '10px 24px', borderRadius: '4px', cursor: 'pointer'
                }}
              >
                Send Another
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-row">
                <div className="contact-group">
                  <label className="contact-label">First Name*</label>
                  <input 
                    type="text" name="firstName" className="contact-input" placeholder="Enter"
                    value={formData.firstName} onChange={handleChange} required 
                  />
                </div>
                <div className="contact-group">
                  <label className="contact-label">Last Name*</label>
                  <input 
                    type="text" name="lastName" className="contact-input" placeholder="Enter"
                    value={formData.lastName} onChange={handleChange} required 
                  />
                </div>
              </div>

              <div className="contact-row">
                <div className="contact-group">
                  <label className="contact-label">Email*</label>
                  <input 
                    type="email" name="email" className="contact-input" placeholder="Enter"
                    value={formData.email} onChange={handleChange} required 
                  />
                </div>
                <div className="contact-group">
                  <label className="contact-label">Phone Number*</label>
                  <input 
                    type="tel" name="phone" className="contact-input" placeholder="Enter"
                    value={formData.phone} onChange={handleChange} required 
                  />
                </div>
              </div>

              <div className="contact-group">
                <label className="contact-label">Subject*</label>
                <input 
                  type="text" name="subject" className="contact-input" placeholder="Enter"
                  value={formData.subject} onChange={handleChange} required 
                />
              </div>

              <div className="contact-group">
                <label className="contact-label">Tell Us More...*</label>
                <textarea 
                  name="message" className="contact-textarea" placeholder="Enter"
                  value={formData.message} onChange={handleChange} required 
                />
              </div>

              {error && (
                <div style={{ color: '#ff4444', fontSize: '14px', marginTop: '-8px' }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ minHeight: '65px' }}>
                  {mounted && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                    <Turnstile
                      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                      onSuccess={setToken}
                      theme="dark"
                    />
                  )}
                </div>
                <button type="submit" className="contact-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ── LOCATIONS SECTION ── */}
      <section className="locations-section">
        <h2 className="locations-title">
          Our <span>Locations</span>
        </h2>

        <div className="locations-list">
          {LOCATIONS.map((loc) => (
            <div key={loc.id} className="location-card">
              <div className="location-image-wrapper">
                <img src={loc.image} alt={loc.country} />
              </div>
              
              <div className="location-info">
                <div className="location-country">
                  <img src={loc.flag} alt="Flag" className="location-country-icon" />
                  <span className="location-country-name">{loc.country}</span>
                </div>
                
                <p className="location-address">{loc.address}</p>
                
                <div className="location-contacts">
                  {loc.phone && (
                    <div className="location-contact-item">
                      <div className="location-contact-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                      </div>
                      <span className="location-contact-text">{loc.phone}</span>
                    </div>
                  )}
                  {loc.email && (
                    <div className="location-contact-item">
                      <div className="location-contact-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                      </div>
                      <span className="location-contact-text">{loc.email}</span>
                    </div>
                  )}
                  {loc.whatsapp && (
                    <div className="location-contact-item">
                      <div className="location-contact-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                        </svg>
                      </div>
                      <span className="location-contact-text">{loc.whatsapp}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
