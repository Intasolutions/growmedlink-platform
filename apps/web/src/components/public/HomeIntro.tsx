'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

const STYLES = `
/* ── keyframes ── */
@keyframes hi-curtain-left {
  0%   { transform: scaleX(1); transform-origin: left center; }
  100% { transform: scaleX(0); transform-origin: left center; }
}
@keyframes hi-curtain-right {
  0%   { transform: scaleX(1); transform-origin: right center; }
  100% { transform: scaleX(0); transform-origin: right center; }
}
@keyframes hi-logo-rise {
  0%   { opacity: 0; transform: translateY(40px) scale(0.7); }
  60%  { opacity: 1; transform: translateY(-6px) scale(1.05); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes hi-logo-exit {
  0%   { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(2.2); filter: blur(20px); }
}
@keyframes hi-line-draw {
  0%   { transform: scaleX(0); }
  100% { transform: scaleX(1); }
}
@keyframes hi-word-up {
  0%   { opacity: 0; transform: translateY(100%); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes hi-sparkle {
  0%,100% { opacity: 0; transform: scale(0) rotate(0deg); }
  40%      { opacity: 1; transform: scale(1) rotate(20deg); }
  70%      { opacity: 0.7; transform: scale(0.8) rotate(-10deg); }
}
@keyframes hi-counter {
  0%   { opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { opacity: 0; }
}
@keyframes hi-dot-wave {
  0%,100% { transform: translateY(0); }
  50%      { transform: translateY(-8px); }
}
@keyframes hi-bg-pan {
  0%   { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}
@keyframes hi-ring-spin {
  0%   { transform: translate(-50%,-50%) rotate(0deg); }
  100% { transform: translate(-50%,-50%) rotate(360deg); }
}
@keyframes hi-ring-spin-r {
  0%   { transform: translate(-50%,-50%) rotate(0deg); }
  100% { transform: translate(-50%,-50%) rotate(-360deg); }
}
@keyframes hi-particle-out {
  0%   { transform: translate(0,0) scale(1); opacity: 1; }
  100% { transform: translate(var(--hpx), var(--hpy)) scale(0); opacity: 0; }
}
@keyframes hi-scanline {
  0%   { top: 0; }
  100% { top: 100%; }
}

.hi-wrap {
  position: fixed; inset: 0; z-index: 99998;
  pointer-events: none;
}
.hi-wrap.hi-active { pointer-events: all; }

/* two curtain halves that split open */
.hi-curtain {
  position: absolute; top: 0; bottom: 0;
  width: 50%;
  background: #0d0d0d;
  z-index: 3;
}
.hi-curtain-l {
  left: 0;
  animation: hi-curtain-left 0.75s cubic-bezier(0.77,0,0.18,1) var(--delay, 1.6s) both;
}
.hi-curtain-r {
  right: 0;
  animation: hi-curtain-right 0.75s cubic-bezier(0.77,0,0.18,1) var(--delay, 1.6s) both;
}

/* centre stage */
.hi-stage {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  z-index: 2;
  background: #0d0d0d;
}

/* animated gradient bg */
.hi-bg {
  position: absolute; inset: 0; z-index: 0;
  background: linear-gradient(135deg, #040a04 0%, #0d1a05 40%, #061510 70%, #040a04 100%);
  background-size: 300% 300%;
  animation: hi-bg-pan 4s ease infinite;
}

/* scan line */
.hi-scan {
  position: absolute; left: 0; right: 0;
  height: 1px; background: rgba(150,202,69,0.15);
  z-index: 1; pointer-events: none;
  animation: hi-scanline 2s linear infinite;
}

/* grid overlay */
.hi-grid {
  position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background-image:
    linear-gradient(rgba(150,202,69,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(150,202,69,0.05) 1px, transparent 1px);
  background-size: 56px 56px;
}

/* spinning rings */
.hi-ring {
  position: absolute;
  top: 50%; left: 50%;
  border-radius: 50%;
  border: 1px solid rgba(150,202,69,0.15);
  pointer-events: none;
  z-index: 2;
}
.hi-ring-1 {
  width: 300px; height: 300px;
  border-style: dashed;
  border-color: rgba(150,202,69,0.12);
  animation: hi-ring-spin 12s linear infinite;
}
.hi-ring-2 {
  width: 220px; height: 220px;
  border-color: rgba(150,202,69,0.08);
  animation: hi-ring-spin-r 8s linear infinite;
}
.hi-ring-3 {
  width: 380px; height: 380px;
  border-color: rgba(150,202,69,0.06);
  animation: hi-ring-spin 20s linear infinite;
}

/* particles */
.hi-particles { position: absolute; inset: 0; z-index: 2; pointer-events: none; }
.hi-particle {
  position: absolute;
  top: 50%; left: 50%;
  width: 5px; height: 5px;
  border-radius: 2px;
  background: #96CA45;
  animation: hi-particle-out 1s ease-out var(--hd) both;
}

/* centre content */
.hi-content {
  position: relative; z-index: 5;
  display: flex; flex-direction: column; align-items: center;
  gap: 0;
}

/* logo */
.hi-logo {
  width: clamp(100px, 18vw, 140px);
  height: clamp(100px, 18vw, 140px);
  position: relative;
  animation: hi-logo-rise 0.9s cubic-bezier(0.34,1.56,0.64,1) 0.15s both;
  margin-bottom: 24px;
}
.hi-logo.hi-logo-exit {
  animation: hi-logo-exit 0.5s ease-in both;
}

/* text reveal — each word clips from mask */
.hi-text-mask {
  overflow: hidden;
  line-height: 1;
}
.hi-word {
  display: block;
  font-family: 'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif;
  font-weight: 400;
  letter-spacing: -0.03em;
  color: #fff;
  animation: hi-word-up 0.65s cubic-bezier(0.22,0.68,0,1.2) var(--wd) both;
}
.hi-word-green { color: #96CA45; }

/* divider line */
.hi-line {
  width: clamp(120px, 30vw, 220px);
  height: 1px;
  background: linear-gradient(90deg, transparent, #96CA45, transparent);
  transform-origin: center;
  animation: hi-line-draw 0.8s ease 0.8s both;
  margin: 16px 0;
}

/* tagline */
.hi-tagline {
  font-family: 'Haffer XH Mono-TRIAL','Courier New',monospace;
  font-size: clamp(9px, 1.5vw, 12px);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.4);
  animation: hi-word-up 0.5s ease 1.1s both;
  overflow: hidden;
}

/* progress counter */
.hi-counter {
  font-family: 'Haffer XH Mono-TRIAL','Courier New',monospace;
  font-size: clamp(10px, 1.4vw, 13px);
  color: rgba(150,202,69,0.7);
  letter-spacing: 0.1em;
  margin-top: 24px;
  animation: hi-counter 1.5s ease 0.2s both;
}

/* loading dots */
.hi-dots { display: flex; gap: 8px; margin-top: 16px; }
.hi-ldot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #96CA45; opacity: 0.8;
  animation: hi-dot-wave 1.2s ease-in-out infinite;
}
.hi-ldot:nth-child(1) { animation-delay: 0s; }
.hi-ldot:nth-child(2) { animation-delay: 0.2s; }
.hi-ldot:nth-child(3) { animation-delay: 0.4s; }

/* sparkles */
.hi-sparkle {
  position: absolute;
  pointer-events: none;
  animation: hi-sparkle var(--sd) ease-in-out var(--ss) infinite;
  z-index: 4;
  font-size: var(--sz);
}

/* gone */
.hi-wrap.hi-gone { display: none; }
`;

const SPARKLE_POSITIONS = [
  { top:'18%', left:'12%', sd:'2.8s', ss:'0.4s', sz:'18px' },
  { top:'22%', right:'14%', sd:'3.2s', ss:'1.0s', sz:'14px' },
  { top:'72%', left:'10%', sd:'2.5s', ss:'0.7s', sz:'12px' },
  { top:'68%', right:'12%', sd:'3.5s', ss:'0.2s', sz:'16px' },
  { top:'45%', left:'6%',  sd:'2.2s', ss:'1.4s', sz:'10px' },
  { top:'38%', right:'7%', sd:'3.0s', ss:'0.9s', sz:'12px' },
];

// Deterministic pseudo-random spread (not Math.random()) so server-rendered
// and client-hydrated markup match exactly — avoids a hydration mismatch.
const PARTICLES = Array.from({ length: 20 }, (_, i) => {
  const angle = (i / 20) * Math.PI * 2;
  const dist  = 70 + ((i * 53) % 120);
  return {
    px: `${Math.cos(angle) * dist}px`,
    py: `${Math.sin(angle) * dist}px`,
    delay: `${(0.3 + ((i * 37) % 60) / 100).toFixed(2)}s`,
  };
});

export default function HomeIntro() {
  const [show, setShow]     = useState(true);
  const [exiting, setExit]  = useState(false);
  const [curtainDelay, setCurtainDelay] = useState('1.8s');
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // only show once per session
    if (sessionStorage.getItem('hi-shown')) {
      setShow(false);
      return;
    }
    sessionStorage.setItem('hi-shown', '1');

    // animate counter 0→100
    let count = 0;
    const step = setInterval(() => {
      count = Math.min(count + Math.floor(Math.random() * 8) + 3, 100);
      if (counterRef.current) counterRef.current.textContent = `${count}%`;
      if (count >= 100) clearInterval(step);
    }, 28);

    // start exit
    const exitTimer = setTimeout(() => {
      setExit(true);
      setTimeout(() => setShow(false), 900);
    }, 2000);

    return () => { clearInterval(step); clearTimeout(exitTimer); };
  }, []);

  if (!show) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className={`hi-wrap${show ? ' hi-active' : ''}${!show ? ' hi-gone' : ''}`}>

        {/* curtain split */}
        <div className="hi-curtain hi-curtain-l" style={{ '--delay': exiting ? '0s' : '1.8s' } as React.CSSProperties} />
        <div className="hi-curtain hi-curtain-r" style={{ '--delay': exiting ? '0s' : '1.8s' } as React.CSSProperties} />

        {/* full-screen stage */}
        <div className="hi-stage">
          <div className="hi-bg" />
          <div className="hi-scan" />
          <div className="hi-grid" />

          {/* spinning rings */}
          <div className="hi-ring hi-ring-1" />
          <div className="hi-ring hi-ring-2" />
          <div className="hi-ring hi-ring-3" />

          {/* sparkle stars */}
          {SPARKLE_POSITIONS.map((s, i) => (
            <div key={i} className="hi-sparkle" style={s as React.CSSProperties}>
              ✦
            </div>
          ))}

          {/* particle burst */}
          <div className="hi-particles">
            {PARTICLES.map((p, i) => (
              <div key={i} className="hi-particle"
                style={{ '--hpx': p.px, '--hpy': p.py, '--hd': p.delay } as React.CSSProperties}
              />
            ))}
          </div>

          <div className="hi-content">
            {/* logo mark */}
            <div className={`hi-logo${exiting ? ' hi-logo-exit' : ''}`}>
              <Image
                src="/Logo/logo_2.png"
                alt="GrowMedLink"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>

            {/* title words */}
            <div className="hi-text-mask">
              <span className="hi-word" style={{ fontSize: 'clamp(32px,6vw,72px)', '--wd': '0.5s' } as React.CSSProperties}>
                Grow<span className="hi-word-green">Med</span>Link
              </span>
            </div>

            <div className="hi-line" />

            <div className="hi-text-mask">
              <span className="hi-tagline">Your global nursing pathway</span>
            </div>

            {/* counter */}
            <div className="hi-counter">
              <span ref={counterRef}>0%</span>
            </div>

            {/* dots */}
            <div className="hi-dots">
              <div className="hi-ldot" />
              <div className="hi-ldot" />
              <div className="hi-ldot" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
