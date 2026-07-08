'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';

interface FooterProps {
  settings: any;
}

const FOOTER_STYLES = `
.ft-wrap {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  align-items: stretch;
}
@media (min-width: 1024px) {
  .ft-wrap { grid-template-columns: 1fr 2fr; }
}

/* Dark card inner: links panel + green panel side by side */
.ft-dark-card {
  border-radius: 24px;
  background: rgba(37,37,37,1);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
@media (min-width: 640px) {
  .ft-dark-card { flex-direction: row; }
}

.ft-links-panel {
  flex: 1;
  padding: clamp(16px, 3vw, 28px);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.ft-green-panel {
  background: rgba(150,202,69,1);
  border-radius: 16px;
  padding: clamp(20px, 3vw, 28px);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  overflow: hidden;
  min-height: 160px;
}
@media (min-width: 640px) {
  .ft-green-panel { width: 45%; flex-shrink: 0; }
}
@media (max-width: 639px) {
  .ft-green-panel { width: 100%; min-height: 120px; }
}

.ft-link-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 24px;
}
@media (min-width: 480px) {
  .ft-link-cols { grid-template-columns: 1fr 1fr; }
}
`;

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ background: '#fff', fontFamily: "'Power Grotesk','Helvetica Neue',Arial,sans-serif", borderTop: '2px solid rgba(150,202,69,1)' }}>
      <style dangerouslySetInnerHTML={{ __html: FOOTER_STYLES }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(32px,5vw,64px) clamp(16px,4vw,40px)' }}>
        <div className="ft-wrap">

          {/* LEFT: Logo + Description + Contact */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
              {settings?.logo ? (
                <Image
                  src={typeof settings.logo === 'object' ? settings.logo.secureUrl : settings.logo}
                  alt={settings.companyName || 'GrowMedLink'}
                  width={160} height={40}
                  style={{ height: 40, width: 'auto', objectFit: 'contain' }}
                />
              ) : (
                <Image
                  src="/logo.png"
                  alt="GrowMedLink"
                  width={180} height={48}
                  style={{ height: 40, width: 'auto', objectFit: 'contain' }}
                />
              )}
            </Link>

            <p style={{ color: '#555', fontSize: 'clamp(13px,1.2vw,15px)', lineHeight: '1.65' }}>
              {settings?.seoDefaultDescription || 'Empowering your global journey with expert immigration services and professional language training.'}
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {settings?.address && (
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <MapPin style={{ width: 18, height: 18, color: 'rgba(150,202,69,1)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <span style={{ color: '#1a5f97', fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 2 }}>Bangalore</span>
                    <span style={{ color: '#555', fontSize: 13, lineHeight: '1.55' }}>{settings.address}</span>
                  </div>
                </li>
              )}
              {settings?.contactEmail && (
                <li style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Mail style={{ width: 18, height: 18, color: 'rgba(150,202,69,1)', flexShrink: 0 }} />
                  <a href={`mailto:${settings.contactEmail}`}
                    style={{ color: '#555', fontSize: 13, textDecoration: 'none', wordBreak: 'break-all' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(150,202,69,1)')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#555')}>
                    {settings.contactEmail}
                  </a>
                </li>
              )}
              {settings?.contactPhone && (
                <li style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Phone style={{ width: 18, height: 18, color: 'rgba(150,202,69,1)', flexShrink: 0 }} />
                  <a href={`tel:${settings.contactPhone}`}
                    style={{ color: '#555', fontSize: 13, textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(150,202,69,1)')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#555')}>
                    {settings.contactPhone}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* RIGHT: Dark card */}
          <div className="ft-dark-card">

            {/* Links panel */}
            <div className="ft-links-panel">
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5,
                backgroundImage: "url('/footer-bg-dark.png')", backgroundSize: 'cover', backgroundPosition: 'center' }} />

              <div className="ft-link-cols" style={{ position: 'relative', zIndex: 1 }}>
                {/* Quick Links */}
                <div>
                  <h3 style={{ color: 'rgba(150,202,69,1)', fontWeight: 700, fontSize: 'clamp(14px,1.3vw,17px)', marginBottom: 10, letterSpacing: '0.02em' }}>
                    Quick Links
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' }}>
                    {[
                      { href: '/',              label: 'Home'            },
                      { href: '/about',         label: 'About Us'        },
                      { href: '/products',      label: 'Products'        },
                      { href: '/services',      label: 'Services'        },
                      { href: '/blog',          label: 'Blogs'           },
                      { href: '/talk-to-expert',label: 'Talk to an Expert'},
                    ].map(({ href, label }) => (
                      <li key={href} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '7px 0' }}>
                        <Link href={href} style={{ color: '#fff', fontSize: 'clamp(12px,1.1vw,14px)', textDecoration: 'none' }}
                          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(150,202,69,1)')}
                          onMouseLeave={e => (e.currentTarget.style.color = '#fff')}>
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Other */}
                <div>
                  <h3 style={{ color: 'rgba(150,202,69,1)', fontWeight: 700, fontSize: 'clamp(14px,1.3vw,17px)', marginBottom: 10, letterSpacing: '0.02em' }}>
                    Other
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' }}>
                    {[
                      { href: '/terms',   label: 'Terms & Conditions' },
                      { href: '/privacy', label: 'Privacy Policy'     },
                      { href: '/contact', label: 'Contact Us'         },
                    ].map(({ href, label }) => (
                      <li key={href} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '7px 0' }}>
                        <Link href={href} style={{ color: '#fff', fontSize: 'clamp(12px,1.1vw,14px)', textDecoration: 'none' }}
                          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(150,202,69,1)')}
                          onMouseLeave={e => (e.currentTarget.style.color = '#fff')}>
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Green panel */}
            <div className="ft-green-panel">
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5,
                backgroundImage: "url('/footer-bg-green.png')", backgroundSize: 'cover', backgroundPosition: 'center' }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{ color: 'rgba(0,0,0,0.75)', fontSize: 'clamp(13px,1.2vw,15px)', lineHeight: '1.5', marginBottom: 16, fontWeight: 500 }}>
                  Follow us and stay connected for updates.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  {settings?.socialLinks?.instagram && (
                    <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer"
                      style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(0,0,0,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#252525', textDecoration: 'none' }}>
                      <Instagram style={{ width: 16, height: 16 }} />
                    </a>
                  )}
                  {settings?.socialLinks?.facebook && (
                    <a href={settings.socialLinks.facebook} target="_blank" rel="noreferrer"
                      style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(0,0,0,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#252525', textDecoration: 'none' }}>
                      <Facebook style={{ width: 16, height: 16 }} />
                    </a>
                  )}
                  {settings?.socialLinks?.twitter && (
                    <a href={settings.socialLinks.twitter} target="_blank" rel="noreferrer"
                      style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(0,0,0,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#252525', textDecoration: 'none' }}>
                      <Twitter style={{ width: 16, height: 16 }} />
                    </a>
                  )}
                  {settings?.socialLinks?.linkedin && (
                    <a href={settings.socialLinks.linkedin} target="_blank" rel="noreferrer"
                      style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(0,0,0,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#252525', textDecoration: 'none' }}>
                      <Linkedin style={{ width: 16, height: 16 }} />
                    </a>
                  )}
                  {settings?.socialLinks?.youtube && (
                    <a href={settings.socialLinks.youtube} target="_blank" rel="noreferrer"
                      style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(0,0,0,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#252525', textDecoration: 'none' }}>
                      <Youtube style={{ width: 16, height: 16 }} />
                    </a>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ background: 'rgba(37,37,37,1)', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '18px 16px' }}>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(12px,1.1vw,14px)', textAlign: 'center', margin: 0 }}>
          © {currentYear} {settings?.companyName || 'GrowMedLink'}. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
