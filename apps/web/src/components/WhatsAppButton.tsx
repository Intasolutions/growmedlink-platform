'use client';

import React, { useEffect, useState } from 'react';
import { getGlobalSettings } from '@/lib/api/settings';

type PageType =
  | 'home'
  | 'about'
  | 'products'
  | 'services'
  | 'blog'
  | 'contact'
  | 'product_detail'
  | 'service_detail'
  | 'blog_detail'
  | 'talk_to_expert';

interface WhatsAppButtonProps {
  pageType: PageType;
  itemName?: string;
}

function getMessage(pageType: PageType, itemName?: string): string {
  switch (pageType) {
    case 'home':           return 'Hello! I am interested in learning more about GrowMedLink. I would like to join and explore your nursing programs.';
    case 'about':          return 'Hello! I just learned about GrowMedLink and would like to join your nursing career programs.';
    case 'products':       return 'Hello! I am interested in joining one of your nursing programs. Could you share more details?';
    case 'services':       return 'Hello! I am interested in joining your services. Could you guide me on the best option for my nursing career?';
    case 'blog':           return 'Hello! I found your blog very insightful and would like to join GrowMedLink to advance my nursing career.';
    case 'contact':        return 'Hello! I would like to connect with GrowMedLink and join your nursing programs.';
    case 'talk_to_expert': return 'Hello! I would like to talk to an expert at GrowMedLink and join one of your nursing programs.';
    case 'product_detail': return `Hello! I am interested in joining the program: ${itemName || 'your nursing program'}. Please share more details.`;
    case 'service_detail': return `Hello! I am interested in joining the service: ${itemName || 'your nursing service'}. Please guide me further.`;
    case 'blog_detail':    return `Hello! I read your blog "${itemName || ''}" and would like to join GrowMedLink to start my nursing journey.`;
    default:               return 'Hello! I would like to join GrowMedLink and learn more about your nursing programs.';
  }
}

const STYLES = `
/* ── entry bounce-in ── */
@keyframes wa-entry {
  0%   { opacity: 0; transform: scale(0.4) translateY(40px); }
  60%  { opacity: 1; transform: scale(1.15) translateY(-6px); }
  80%  { transform: scale(0.94) translateY(2px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

/* ── idle float ── */
@keyframes wa-float {
  0%,100% { transform: translateY(0); }
  50%      { transform: translateY(-6px); }
}

/* ── pulse ring expanding out from circle ── */
@keyframes wa-ring {
  0%   { transform: scale(1); opacity: 0.7; }
  100% { transform: scale(2.2); opacity: 0; }
}

/* ── label slide-in from right ── */
@keyframes wa-label-in {
  0%   { opacity: 0; transform: translateX(12px); }
  100% { opacity: 1; transform: translateX(0); }
}

/* ── label shimmer ── */
@keyframes wa-shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}

/* ── wrapper ── */
.wa-wrap {
  position: fixed;
  bottom: clamp(14px, 4vw, 28px);
  right: clamp(14px, 4vw, 28px);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(5px, 1vw, 8px);
  animation: wa-entry 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.8s both;
}

/* idle float on the whole wrap */
.wa-wrap-float {
  animation: wa-float 3s ease-in-out infinite;
}

/* ── circle button ── */
.wa-btn {
  position: relative;
  width: clamp(46px, 7vw, 60px);
  height: clamp(46px, 7vw, 60px);
  border-radius: 50%;
  background: #25D366;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-decoration: none;
  box-shadow:
    0 4px 16px rgba(37,211,102,0.45),
    0 2px 6px rgba(0,0,0,0.18);
  transition:
    transform 0.25s cubic-bezier(0.34,1.56,0.64,1),
    box-shadow 0.25s ease;
  flex-shrink: 0;
}
.wa-btn:hover {
  transform: scale(1.14) translateY(-3px);
  box-shadow:
    0 10px 28px rgba(37,211,102,0.55),
    0 4px 10px rgba(0,0,0,0.22);
}
.wa-btn:active {
  transform: scale(0.95);
}

/* ── SVG icon inside circle ── */
.wa-icon {
  width: clamp(22px, 3.5vw, 30px);
  height: clamp(22px, 3.5vw, 30px);
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

/* ── pulse rings — two staggered ── */
.wa-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2.5px solid rgba(37,211,102,0.6);
  pointer-events: none;
  animation: wa-ring 2s ease-out infinite;
}
.wa-ring:nth-child(2) {
  animation-delay: 0.75s;
}

/* ── "Join Now" label — outside below the circle ── */
.wa-label {
  display: flex;
  align-items: center;
  gap: clamp(3px, 0.8vw, 5px);
  padding: clamp(3px, 0.6vw, 5px) clamp(8px, 1.5vw, 13px) clamp(3px, 0.6vw, 5px) clamp(6px, 1.2vw, 10px);
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 3px 12px rgba(37,211,102,0.28), 0 1px 4px rgba(0,0,0,0.12);
  animation: wa-label-in 0.5s cubic-bezier(0.22,0.68,0,1.2) 1.3s both;
  white-space: nowrap;
  cursor: pointer;
  text-decoration: none;
  border: 1.5px solid rgba(37,211,102,0.35);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.wa-label:hover {
  box-shadow: 0 6px 18px rgba(37,211,102,0.42), 0 2px 6px rgba(0,0,0,0.14);
  transform: translateY(-2px);
}

/* ── dot indicator ── */
.wa-label-dot {
  width: clamp(5px, 1vw, 7px);
  height: clamp(5px, 1vw, 7px);
  border-radius: 50%;
  background: #25D366;
  flex-shrink: 0;
  animation: wa-ring 1.6s ease-out infinite;
}

/* ── shimmer gradient text ── */
.wa-label-text {
  font-family: 'Haffer XH Mono-TRIAL','Courier New',monospace;
  font-size: clamp(9px, 1.4vw, 11px);
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: linear-gradient(90deg, #16a34a 0%, #25D366 40%, #96CA45 60%, #16a34a 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: wa-shimmer 2.5s linear 1.5s infinite;
  line-height: 1;
}

/* ── very small screens (≤360px) — shrink further ── */
@media (max-width: 360px) {
  .wa-wrap { bottom: 10px; right: 10px; gap: 4px; }
  .wa-btn  { width: 42px; height: 42px; }
  .wa-icon { width: 20px; height: 20px; }
  .wa-label-text { font-size: 8px; letter-spacing: 0.04em; }
}
`;

export default function WhatsAppButton({ pageType, itemName }: WhatsAppButtonProps) {
  const [phone, setPhone] = useState('');
  const [floatClass, setFloatClass] = useState('');

  useEffect(() => {
    getGlobalSettings()
      .then(settings => {
        if (settings?.contactPhone) {
          const cleaned = settings.contactPhone.replace(/[^0-9]/g, '');
          setPhone(cleaned);
        }
      })
      .catch(err => console.error('Failed to load settings for WhatsApp button:', err));
  }, []);

  /* start float after entry animation finishes */
  useEffect(() => {
    const t = setTimeout(() => setFloatClass(' wa-wrap-float'), 1600);
    return () => clearTimeout(t);
  }, []);

  if (!phone) return null;

  const text = getMessage(pageType, itemName);
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className={`wa-wrap${floatClass}`}>
        {/* Circle with WhatsApp icon */}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="wa-btn"
        >
          {/* pulse rings */}
          <div className="wa-ring" />
          <div className="wa-ring" />

          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="wa-icon"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18.403 5.633A8.919 8.919 0 0 0 12.053 3c-4.948 0-8.976 4.027-8.978 8.977 0 1.582.413 3.126 1.198 4.486L3 21l4.637-1.216a8.932 8.932 0 0 0 4.413 1.161h.004c4.947 0 8.975-4.027 8.977-8.977a8.922 8.922 0 0 0-2.628-6.335zm-6.35 13.812h-.003a7.446 7.446 0 0 1-3.798-1.041l-.272-.162-2.824.74.753-2.753-.178-.283a7.447 7.447 0 0 1-1.141-3.971c.002-4.114 3.349-7.461 7.465-7.461a7.413 7.413 0 0 1 5.275 2.188 7.42 7.42 0 0 1 2.183 5.279c-.002 4.114-3.348 7.462-7.46 7.462zm4.093-5.589c-.225-.113-1.327-.655-1.533-.73-.205-.075-.354-.112-.504.112-.149.224-.578.73-.709.879-.13.15-.26.168-.485.056-.225-.113-.949-.349-1.808-1.116-.669-.597-1.12-1.335-1.252-1.56-.13-.224-.014-.346.099-.458.101-.1.224-.262.337-.393.112-.13.149-.224.224-.374.075-.15.038-.281-.018-.393-.056-.113-.504-1.217-.691-1.666-.181-.435-.366-.377-.504-.383-.13-.007-.28-.008-.43-.008s-.392.056-.597.28c-.205.225-.784.767-.784 1.87 0 1.102.802 2.17.914 2.321.112.15 1.58 2.411 3.826 3.38.535.23 1.002.39 1.378.51.583.185 1.113.159 1.532.096.467-.07 1.327-.542 1.513-1.066.187-.524.187-.973.131-1.067-.056-.093-.205-.15-.43-.263z"
              fill="#FFF"
            />
          </svg>
        </a>

        {/* "Join Now" label — outside below the circle */}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="wa-label"
        >
          <div className="wa-label-dot" />
          <span className="wa-label-text">Join Now</span>
        </a>
      </div>
    </>
  );
}
