'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const STYLES = `
@keyframes sl-bg-reveal {
  0%   { transform: scaleY(1); }
  100% { transform: scaleY(0); }
}
@keyframes sl-logo-in {
  0%   { opacity: 0; transform: scale(0.6) rotate(-12deg); }
  60%  { opacity: 1; transform: scale(1.08) rotate(2deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
}
@keyframes sl-logo-pulse {
  0%,100% { transform: scale(1); filter: drop-shadow(0 0 0px rgba(150,202,69,0)); }
  50%      { transform: scale(1.07); filter: drop-shadow(0 0 22px rgba(150,202,69,0.7)); }
}
@keyframes sl-bar-grow {
  0%   { transform: scaleX(0); }
  100% { transform: scaleX(1); }
}
@keyframes sl-bar-shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes sl-name-in {
  0%   { opacity: 0; letter-spacing: 0.4em; }
  100% { opacity: 1; letter-spacing: 0.18em; }
}
@keyframes sl-tagline-in {
  0%   { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes sl-exit-up {
  0%   { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(-100%); opacity: 0; }
}
@keyframes sl-dot-bounce {
  0%,80%,100% { transform: scale(0); opacity: 0; }
  40%          { transform: scale(1); opacity: 1; }
}
@keyframes sl-bracket-draw {
  0%   { stroke-dashoffset: 220; opacity: 0; }
  30%  { opacity: 1; }
  100% { stroke-dashoffset: 0; opacity: 1; }
}
@keyframes sl-bracket-spin {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes sl-particle {
  0%   { transform: translate(0,0) scale(1); opacity: 0.9; }
  100% { transform: translate(var(--px), var(--py)) scale(0); opacity: 0; }
}

.sl-overlay {
  position: fixed; inset: 0; z-index: 99999;
  display: flex; align-items: center; justify-content: center;
  background: #0d0d0d;
  will-change: transform, opacity;
  transform-origin: top center;
  touch-action: none;
}
.sl-overlay.sl-exit {
  animation: sl-exit-up 0.7s cubic-bezier(0.77,0,0.18,1) 0.12s both;
  pointer-events: none;
  touch-action: none;
}

/* subtle grid overlay */
.sl-grid {
  position: absolute; inset: 0; pointer-events: none;
  background-image:
    linear-gradient(rgba(150,202,69,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(150,202,69,0.04) 1px, transparent 1px);
  background-size: 48px 48px;
}

/* ambient glow orbs */
.sl-orb {
  position: absolute; border-radius: 50%; pointer-events: none;
  filter: blur(80px);
}
.sl-orb-1 {
  width: 380px; height: 380px;
  top: -80px; left: -60px;
  background: radial-gradient(circle, rgba(150,202,69,0.12) 0%, transparent 70%);
}
.sl-orb-2 {
  width: 300px; height: 300px;
  bottom: -60px; right: -40px;
  background: radial-gradient(circle, rgba(21,91,169,0.15) 0%, transparent 70%);
}

.sl-center {
  position: relative; z-index: 2;
  display: flex; flex-direction: column; align-items: center; gap: 0;
}

/* spinning bracket ring behind logo */
.sl-ring {
  position: absolute;
  width: 160px; height: 160px;
  animation: sl-bracket-spin 8s linear infinite;
}
.sl-ring-path {
  stroke-dasharray: 220;
  animation: sl-bracket-draw 1.1s cubic-bezier(.22,.68,0,1.2) 0.3s both;
}

/* logo mark */
.sl-logo-wrap {
  position: relative;
  width: 90px; height: 90px;
  animation: sl-logo-in 0.75s cubic-bezier(0.34,1.56,0.64,1) 0.2s both;
  margin-bottom: 28px;
}
.sl-logo-inner {
  animation: sl-logo-pulse 2.2s ease-in-out 1.1s infinite;
  width: 100%; height: 100%;
}

/* brand name */
.sl-name {
  font-family: 'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif;
  font-size: clamp(13px, 2.5vw, 17px);
  font-weight: 500;
  color: #fff;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  animation: sl-name-in 0.7s ease 0.85s both;
  margin-bottom: 20px;
}
.sl-name span { color: #96CA45; }

/* progress bar */
.sl-bar-track {
  width: clamp(180px, 40vw, 280px);
  height: 2px;
  background: rgba(255,255,255,0.08);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 16px;
}
.sl-bar-fill {
  height: 100%;
  border-radius: 2px;
  transform-origin: left center;
  background: linear-gradient(90deg, #4a8c00, #96CA45, #c8f060, #96CA45, #4a8c00);
  background-size: 200% 100%;
  animation:
    sl-bar-grow 1.5s cubic-bezier(0.4,0,0.2,1) 0.4s both,
    sl-bar-shimmer 1.4s linear 0.6s infinite;
}

/* loading dots */
.sl-dots {
  display: flex; gap: 7px; align-items: center;
}
.sl-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #96CA45;
  animation: sl-dot-bounce 1.4s ease-in-out infinite;
}
.sl-dot:nth-child(1) { animation-delay: 0s; }
.sl-dot:nth-child(2) { animation-delay: 0.18s; }
.sl-dot:nth-child(3) { animation-delay: 0.36s; }

/* tagline */
.sl-tagline {
  font-family: 'Haffer XH Mono-TRIAL','Courier New',monospace;
  font-size: clamp(9px, 1.5vw, 11px);
  color: rgba(255,255,255,0.32);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  animation: sl-tagline-in 0.6s ease 1.2s both;
  margin-top: 14px;
}

/* particle burst squares */
.sl-particles {
  position: absolute; inset: 0; pointer-events: none; overflow: hidden;
}
.sl-particle {
  position: absolute;
  width: 4px; height: 4px;
  border-radius: 1px;
  background: #96CA45;
  animation: sl-particle 1.2s ease-out var(--delay) both;
  top: 50%; left: 50%;
}
`;

const PARTICLES = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2;
  const dist  = 80 + Math.random() * 80;
  return {
    px: `${Math.cos(angle) * dist}px`,
    py: `${Math.sin(angle) * dist}px`,
    delay: `${0.6 + Math.random() * 0.4}s`,
    opacity: 0.4 + Math.random() * 0.6,
  };
});

export default function SiteLoader() {
  const [exiting, setExiting] = useState(false);
  const [gone,    setGone]    = useState(false);

  useEffect(() => {
    const onLoad = () => {
      setExiting(true);
      setTimeout(() => setGone(true), 800);
    };

    if (document.readyState === 'complete') {
      // Already loaded — show briefly so animation plays, then exit.
      // On mobile keep it short so users aren't waiting before they can scroll.
      const t = setTimeout(onLoad, 1200);
      return () => clearTimeout(t);
    }

    window.addEventListener('load', onLoad);
    // Fallback: never block longer than 2.5s on any device
    const fallback = setTimeout(onLoad, 2500);
    return () => {
      window.removeEventListener('load', onLoad);
      clearTimeout(fallback);
    };
  }, []);

  if (gone) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className={`sl-overlay${exiting ? ' sl-exit' : ''}`} role="status" aria-label="Loading GrowMedLink">

        {/* ambient */}
        <div className="sl-grid" />
        <div className="sl-orb sl-orb-1" />
        <div className="sl-orb sl-orb-2" />

        {/* particle burst */}
        <div className="sl-particles">
          {PARTICLES.map((p, i) => (
            <div
              key={i}
              className="sl-particle"
              style={{
                '--px': p.px,
                '--py': p.py,
                '--delay': p.delay,
                opacity: p.opacity,
              } as React.CSSProperties}
            />
          ))}
        </div>

        <div className="sl-center">
          {/* spinning SVG ring */}
          <svg className="sl-ring" style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%) rotate(0deg)', transformOrigin:'80px 80px' }} viewBox="0 0 160 160" fill="none">
            <circle
              className="sl-ring-path"
              cx="80" cy="80" r="74"
              stroke="rgba(150,202,69,0.25)"
              strokeWidth="1.5"
              strokeDasharray="12 8"
            />
            <circle
              cx="80" cy="80" r="68"
              stroke="rgba(150,202,69,0.12)"
              strokeWidth="0.5"
            />
            {/* four bracket corner marks */}
            {[[6,6],[154,6],[154,154],[6,154]].map(([x,y],i)=>(
              <g key={i} transform={`rotate(${i*90} 80 80)`}>
                <path d={`M ${x < 80 ? x+10 : x-10} ${y} L ${x} ${y} L ${x} ${y < 80 ? y+10 : y-10}`}
                  stroke="#96CA45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
              </g>
            ))}
          </svg>

          {/* logo */}
          <div className="sl-logo-wrap">
            <div className="sl-logo-inner">
              <Image
                src="/Logo/logo_2.png"
                alt="GrowMedLink"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </div>

          {/* brand name */}
          <p className="sl-name">Grow<span>Med</span>Link</p>

          {/* progress bar */}
          <div className="sl-bar-track">
            <div className="sl-bar-fill" />
          </div>

          {/* dots */}
          <div className="sl-dots">
            <div className="sl-dot" />
            <div className="sl-dot" />
            <div className="sl-dot" />
          </div>

          <p className="sl-tagline">Your global nursing pathway</p>
        </div>

      </div>
    </>
  );
}
