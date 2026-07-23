'use client';
import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { GraduationCap, Award, Briefcase, ArrowUpRight, Plus, X, Star, Check, MessageSquare } from "lucide-react";
import CropUploader from "@/components/CropUploader";
import { IMedia } from "@intelligen/types";
import { useRouter } from "next/navigation";
import styles from "./CtaBannerSection.module.css";

/* =========================================================================
   START OF HomeIntro.tsx
   ========================================================================= */
const HomeIntro_STYLES = `
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
const HomeIntro_SPARKLE_POSITIONS = [
  { top:'18%', left:'12%', sd:'2.8s', ss:'0.4s', sz:'18px' },
  { top:'22%', right:'14%', sd:'3.2s', ss:'1.0s', sz:'14px' },
  { top:'72%', left:'10%', sd:'2.5s', ss:'0.7s', sz:'12px' },
  { top:'68%', right:'12%', sd:'3.5s', ss:'0.2s', sz:'16px' },
  { top:'45%', left:'6%',  sd:'2.2s', ss:'1.4s', sz:'10px' },
  { top:'38%', right:'7%', sd:'3.0s', ss:'0.9s', sz:'12px' },
];
const HomeIntro_PARTICLES = Array.from({ length: 20 }, (_, i) => {
  const angle = (i / 20) * Math.PI * 2;
  const dist  = 70 + ((i * 53) % 120);
  return {
    px: `${Math.cos(angle) * dist}px`,
    py: `${Math.sin(angle) * dist}px`,
    delay: `${(0.3 + ((i * 37) % 60) / 100).toFixed(2)}s`,
  };
});
function HomeIntro() {
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
      <style dangerouslySetInnerHTML={{ __html: HomeIntro_STYLES }} />
      <div className={`hi-wrap${show && !exiting ? ' hi-active' : ''}${!show ? ' hi-gone' : ''}`}>

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
          {HomeIntro_SPARKLE_POSITIONS.map((s, i) => (
            <div key={i} className="hi-sparkle" style={s as React.CSSProperties}>
              ✦
            </div>
          ))}

          {/* particle burst */}
          <div className="hi-particles">
            {HomeIntro_PARTICLES.map((p, i) => (
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
/* === END OF HomeIntro.tsx === */

/* =========================================================================
   START OF Hero.tsx
   ========================================================================= */
interface Hero_Country {
  id: string;
  name: string;
  mapSrc: string;
  percentage: number;
}
const Hero_COUNTRIES: Hero_Country[] = [
  { id: 'australia',     name: 'Australia',  mapSrc: '/australia-map.png',     percentage: 54 },
  { id: 'india',         name: 'India',      mapSrc: '/india-map.png',         percentage: 28 },
  { id: 'south-america', name: 'S. America', mapSrc: '/south-america-map.png', percentage:  25 },
  { id: 'africa',        name: 'Africa',     mapSrc: '/africa-map.png',        percentage: 12 },
];
const Hero_GREEN_TINT = 'brightness(0) saturate(100%) invert(68%) sepia(60%) saturate(500%) hue-rotate(40deg) brightness(110%)';
const Hero_AUTO_CYCLE_MS = 3200;
const Hero_LETTERS = 'Here'.split('');
const Hero_COL_SPIN  = '#3B82F6';
const Hero_COL_GREEN = '#97C93D';
const Hero_COL_WHITE = '#FFFFFF';
function Hero_SlotWord() {
  const reelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const midRefs  = useRef<(HTMLSpanElement | null)[]>([]);
  const running  = useRef(false);
  const tlRef    = useRef<gsap.core.Timeline | null>(null);

  /* yPercent values — % of reel height (3 rows), so 1 row = 33.33% */
  const REST = -(100 / 3);   /* row B centred in clip */
  const UP   = 0;            /* row A in clip (roll up)   */
  const DOWN = -(200 / 3);   /* row C in clip (roll down) */

  const play = useCallback((hoverIn: boolean) => {
    if (running.current) return;
    running.current = true;

    if (tlRef.current) tlRef.current.kill();
    const settle = hoverIn ? Hero_COL_GREEN : Hero_COL_WHITE;
    const tl = gsap.timeline({
      onComplete: () => {
        midRefs.current.forEach(el => el && gsap.set(el, { color: settle }));
        reelRefs.current.forEach(el => el && gsap.set(el, { yPercent: REST }));
        running.current = false;
      },
    });
    tlRef.current = tl;

    Hero_LETTERS.forEach((_, i) => {
      const reel = reelRefs.current[i];
      const mid  = midRefs.current[i];
      if (!reel || !mid) return;

      /* Alternate direction: even = up, odd = down */
      const target  = i % 2 === 0 ? UP : DOWN;
      const stagger = i * 0.048;

      /* Flash blue while rolling */
      tl.set(mid, { color: Hero_COL_SPIN }, stagger);
      tl.to(reel, {
        yPercent: target,
        duration: 0.65,
        ease: 'back.out(1.4)',   /* smooth overshoot — mechanical snap feel */
      }, stagger);
    });
  }, [REST]);

  useEffect(() => () => { tlRef.current?.kill(); }, []);

  return (
    <span
      onMouseEnter={() => play(true)}
      onMouseLeave={() => play(false)}
      style={{ display: 'inline-flex', whiteSpace: 'nowrap',
               cursor: 'default', userSelect: 'none' }}
    >
      {Hero_LETTERS.map((ch, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            height: '1em',
            lineHeight: '1em',
            verticalAlign: 'baseline',
          }}
        >
          <span
            ref={el => { reelRefs.current[i] = el; }}
            style={{
              display: 'block',
              willChange: 'transform',
              transform: `translateY(${REST}%)`,
            }}
          >
            <span style={{ display: 'block', color: Hero_COL_SPIN,  lineHeight: '1em' }}>{ch}</span>
            <span ref={el => { midRefs.current[i] = el; }}
                  style={{ display: 'block', color: Hero_COL_WHITE, lineHeight: '1em' }}>{ch}</span>
            <span style={{ display: 'block', color: Hero_COL_SPIN,  lineHeight: '1em' }}>{ch}</span>
          </span>
        </span>
      ))}
    </span>
  );
}
function Hero_WaveDots() {
  const containerRef = useRef<HTMLDivElement>(null);
  const DOT_POSITIONS = [
    { left: 0,   top: 22 }, { left: 31,  top: 6  }, { left: 60,  top: 22 },
    { left: 90,  top: 12 }, { left: 118, top: 22 }, { left: 139, top: 16 },
    { left: 170, top: 22 }, { left: 196, top: 19 }, { left: 219, top: 22 },
    { left: 244, top: 22 },
  ];

  useEffect(() => {
    if (!containerRef.current) return;
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
    const els = Array.from(containerRef.current.querySelectorAll<HTMLElement>('.wdot'));
    const tweens = els.map((el, i) =>
      gsap.to(el, {
        y: -7,
        opacity: 1,
        duration: 1.2 + i * 0.09,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: i * 0.11,
      })
    );
    return () => tweens.forEach(t => t.kill());
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: 260, height: 38, flexShrink: 0 }}>
      {DOT_POSITIONS.map((d, i) => (
        <div
          key={i}
          className="wdot"
          style={{
            position: 'absolute',
            left: d.left,
            top: d.top,
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#96CA45',
            opacity: 0.5,
          }}
        />
      ))}
    </div>
  );
}
function Hero_CountryCard({ country, isActive, onClick }: {
  country: Hero_Country; isActive: boolean; onClick: () => void;
}) {
  const [contentReady, setContentReady] = useState(isActive);
  const [hovered,      setHovered     ] = useState(false);
  const countRef = useRef<HTMLSpanElement>(null);

  const prevActive = useRef(isActive);
  const showTmr    = useRef<ReturnType<typeof setTimeout>  | null>(null);
  const cntTmr     = useRef<ReturnType<typeof setTimeout>  | null>(null);

  const clearAll = () => {
    if (showTmr.current) clearTimeout(showTmr.current);
    if (cntTmr.current)  clearTimeout(cntTmr.current);
    gsap.killTweensOf(countRef.current);
  };

  useEffect(() => {
    const wasActive = prevActive.current;
    prevActive.current = isActive;

    clearAll();

    if (!isActive) {
      /* Only reset if we were previously active — avoids resetting on mount */
      if (wasActive) {
        setContentReady(false);
        if (countRef.current) countRef.current.innerHTML = '0';
      }
      return;
    }

    /* Only animate if this is a genuine inactive→active transition */
    if (!wasActive) {
      showTmr.current = setTimeout(() => setContentReady(true), 260);
      cntTmr.current  = setTimeout(() => {
        if (countRef.current) {
          gsap.fromTo(countRef.current,
            { innerHTML: 0 },
            { innerHTML: country.percentage, duration: 0.55, ease: 'none', snap: { innerHTML: 1 } }
          );
        }
      }, 380);
    } else {
      if (countRef.current) countRef.current.innerHTML = String(country.percentage);
    }

    return clearAll;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, country.percentage]);

  return (
    <div
      onClick={!isActive ? onClick : undefined}
      onMouseEnter={() => !isActive && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width:     isActive ? 'clamp(200px,52vw,380px)' : 'clamp(60px,12vw,110px)',
        minWidth:  isActive ? 'clamp(200px,52vw,380px)' : 'clamp(60px,12vw,110px)',
        height:    'clamp(140px,22vw,205px)',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden',
        cursor: isActive ? 'default' : 'pointer',
        backgroundColor: isActive ? '#ffffff' : '#2B2B2B',
        borderRadius: '8px',
        borderRight: isActive ? 'none' : '1px solid rgba(0,0,0,0.5)',
        boxShadow: isActive
          ? '0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(150,202,69,0.18)'
          : hovered ? 'inset 0 0 0 1.5px rgba(150,202,69,0.6)' : 'none',
        transition: [
          'width 0.55s cubic-bezier(0.34,1.56,0.64,1)',
          'min-width 0.55s cubic-bezier(0.34,1.56,0.64,1)',
          'background-color 0.38s ease',
          'box-shadow 0.28s ease',
          'transform 0.25s cubic-bezier(.22,.68,0,1.2)',
        ].join(', '),
        transform: hovered && !isActive ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      {/* Active content */}
      <div style={{
        position: 'absolute', inset: 0,
        padding: 'clamp(12px,2vw,18px) clamp(12px,2vw,20px) clamp(10px,1.5vw,16px) clamp(14px,2.5vw,24px)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        opacity: contentReady ? 1 : 0,
        transform: contentReady ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.32s ease, transform 0.36s cubic-bezier(.22,.68,0,1.2)',
        pointerEvents: 'none', zIndex: 2,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 4, minWidth: 0 }}>
          <span style={{ fontSize: 'clamp(12px,1.6vw,18px)', fontWeight: 400, lineHeight: '1.4', color: '#000', fontFamily: "'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif", minWidth: 0, flexShrink: 1 }}>
            {country.name}
          </span>
          {/* Fixed box — map fills it with object-fit:contain so tall shapes (S.America) never overflow */}
          <div style={{ width: 'clamp(44px,8vw,80px)', height: 'clamp(36px,6vw,64px)', flexShrink: 0, position: 'relative' }}>
            <Image src={country.mapSrc} alt={country.name} fill
              style={{ objectFit: 'contain', objectPosition: 'top right' }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 4, minWidth: 0 }}>
          <div style={{ flexShrink: 1, minWidth: 0, overflow: 'hidden' }}>
            <Image src="/avatars-group.png" alt="Students" width={200} height={56}
              style={{ height: 'clamp(26px,4vw,40px)', width: 'auto', display: 'block', maxWidth: '100%' }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
            />
          </div>
          <span style={{ fontSize: 'clamp(22px,4.5vw,48px)', fontWeight: 500, lineHeight: 1, color: '#96CA45', letterSpacing: '-0.02em', fontFamily: "'Haffer VF-TRIAL','Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif", flexShrink: 0, whiteSpace: 'nowrap' }}>
            <span ref={countRef}>{isActive ? country.percentage : 0}</span>%
          </span>
        </div>
      </div>

      {/* Inactive content */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: isActive ? 0 : 1,
        transition: 'opacity 0.22s ease',
        pointerEvents: 'none', zIndex: 2,
      }}>
        <Image src={country.mapSrc} alt={country.name} width={65} height={65}
          style={{ width: 'clamp(40px,8vw,62px)', height: 'auto', filter: Hero_GREEN_TINT }}
          onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
        />
      </div>
    </div>
  );
}
function Hero_AutoCycleBar({ duration }: { duration: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    setWidth(0);
    const raf = requestAnimationFrame(() => setWidth(100));
    return () => cancelAnimationFrame(raf);
  }, [duration]);
  return (
    <div style={{ width: '100%', height: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden', marginTop: 6, transform: 'translateZ(0)' }}>
      <div style={{ height: '100%', background: '#96CA45', borderRadius: 2, width: `${width}%`, transition: `width ${duration}ms linear`, willChange: 'width' }} />
    </div>
  );
}
function Hero() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [cycleKey,  setCycleKey ] = useState(0);

  const sectionRef  = useRef<HTMLElement>(null);
  const sunburstRef = useRef<HTMLDivElement>(null);
  const h1Ref       = useRef<HTMLHeadingElement>(null);
  const avatarsRef  = useRef<HTMLDivElement>(null);
  const leftColRef  = useRef<HTMLDivElement>(null);
  const cardsRef    = useRef<HTMLDivElement>(null);
  const arrowRef    = useRef<HTMLDivElement>(null);
  const autoTimer   = useRef<ReturnType<typeof setInterval> | null>(null);
  const gsapCtx     = useRef<gsap.Context | null>(null);

  /* ── GSAP entrance + persistent animations ── */
  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    /* On mobile: skip ALL GSAP — just make elements visible immediately */
    if (isTouch) {
      if (h1Ref.current)      h1Ref.current.style.opacity      = '1';
      if (avatarsRef.current) avatarsRef.current.style.opacity  = '1';
      if (leftColRef.current) leftColRef.current.style.opacity  = '1';
      if (cardsRef.current)   cardsRef.current.style.opacity    = '1';
      if (arrowRef.current)   arrowRef.current.style.opacity    = '1';
      return;
    }

    /* Desktop only: full GSAP animations */
    gsapCtx.current = gsap.context(() => {

      if (sunburstRef.current) {
        gsap.to(sunburstRef.current, {
          rotation: 360,
          duration: 80,
          ease: 'none',
          repeat: -1,
          transformOrigin: '50% 50%',
        });
      }

      const tl = gsap.timeline({ delay: 0.06 });

      if (h1Ref.current) {
        tl.fromTo(h1Ref.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.05);
      }
      if (avatarsRef.current) {
        tl.fromTo(avatarsRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.22);
      }
      if (leftColRef.current) {
        tl.fromTo(leftColRef.current,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.38);
      }
      if (cardsRef.current) {
        tl.fromTo(cardsRef.current,
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.5);
      }

      if (arrowRef.current) {
        gsap.set(arrowRef.current, { opacity: 0, y: 14 });
        gsap.to(arrowRef.current, {
          opacity: 1, y: 0,
          duration: 0.7, ease: 'power3.out', delay: 0.82,
          onComplete: () => {
            gsap.to(arrowRef.current, {
              y: -8, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: -1,
            });
          },
        });
      }

    }, sectionRef);

    return () => gsapCtx.current?.revert();
  }, []);

  /* ── Auto-cycle — faster on mobile so users aren't waiting to scroll ── */
  const cycleMs = typeof window !== 'undefined' && window.matchMedia('(hover: none) and (pointer: coarse)').matches
    ? 2000
    : Hero_AUTO_CYCLE_MS;

  const startAutoPlay = useCallback(() => {
    if (autoTimer.current) clearInterval(autoTimer.current);
    autoTimer.current = setInterval(() => {
      setActiveIdx(i => { setCycleKey(k => k + 1); return (i + 1) % Hero_COUNTRIES.length; });
    }, cycleMs);
  }, [cycleMs]);

  useEffect(() => {
    startAutoPlay();
    return () => { if (autoTimer.current) clearInterval(autoTimer.current); };
  }, [startAutoPlay]);

  const handleCardClick = (idx: number) => {
    setActiveIdx(idx);
    setCycleKey(k => k + 1);
    startAutoPlay();
  };

  return (
    <>
      <style>{`
        .cards-scroll::-webkit-scrollbar { display: none; }
        .cards-scroll { scrollbar-width: none; -ms-overflow-style: none; }

        @media (max-width: 767px) {
          .hero-cards-desktop { display: none !important; }
          .hero-cards-mobile  { display: flex !important; }
          .hero-map-wrap      { margin: -20px 0 !important; }
        }
        @media (min-width: 768px) {
          .hero-cards-desktop { display: flex !important; }
          .hero-cards-mobile  { display: none !important; }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="hero-section relative w-full bg-black overflow-x-hidden font-['Power_Grotesk'] text-white"
        style={{ paddingBottom: 'clamp(60px,8vw,100px)' }}
      >
        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">

          {/* ── ROW 1: Heading + avatars ── */}
          <div
            className="flex flex-col items-center text-center"
            style={{ paddingTop: 'clamp(160px,18vh,220px)' }}
          >
            {/* Sunburst + H1 + Avatars */}
            <div className="relative inline-flex flex-col items-center justify-center" style={{ pointerEvents: 'none' }}>
              <div
                ref={sunburstRef}
                className="absolute pointer-events-none"
                style={{
                  width:  'clamp(340px,90vw,860px)',
                  height: 'clamp(340px,90vw,860px)',
                  top: '50%', left: '50%',
                  marginLeft: 'calc(clamp(340px,90vw,860px) / -2)',
                  marginTop:  'calc(clamp(340px,90vw,860px) / -2)',
                  zIndex: -1,
                }}
              >
                <Image src="/sunburst-lines.png" alt="" fill className="object-contain" priority />
              </div>

              <h1
                ref={h1Ref}
                className="font-black tracking-tight"
                style={{
                  fontSize: 'clamp(28px,5vw,80px)',
                  lineHeight: 1.08,
                  opacity: 0,
                  padding: 'clamp(10px,2vw,24px) clamp(6px,1.5vw,12px) clamp(4px,1vw,8px)',
                  letterSpacing: '-0.02em',
                  maxWidth: '100%',
                  textAlign: 'center',
                }}
              >
                {'Your Global Nursing Career Starts '}
                <Hero_SlotWord />
                {'.'}
                <span style={{ color: '#96CA45' }}>{'!'}</span>
              </h1>

              {/* Avatars — directly below heading, full original color, responsive */}
              <div
                ref={avatarsRef}
                className="flex flex-row items-center justify-center gap-2 sm:gap-3"
                style={{ opacity: 0, marginTop: 'clamp(6px,1.2vw,14px)', zIndex: 1 }}
              >
                <Image
                  src="/avatars-group.png"
                  alt="Trusted Students"
                  width={160}
                  height={40}
                  style={{
                    height: 'clamp(28px,4vw,44px)',
                    width: 'auto',
                    display: 'block',
                  }}
                  priority
                />
                <span
                  className="font-medium tracking-wide"
                  style={{
                    color: '#CACACA',
                    fontSize: 'clamp(11px,1.1vw,15px)',
                  }}
                >
                  7000 + Trusted Students
                </span>
              </div>
            </div>
          </div>

          {/* ── ROW 2: World map — sits between heading and bottom content ── */}
          <div className="pointer-events-none flex justify-center hero-map-wrap" style={{ margin: 'clamp(-40px,-6vw,-80px) 0' }}>
            <Image
              src="/world-map-bg.png"
              alt="World Map"
              width={1400}
              height={800}
              className="w-full max-w-[1100px] object-contain opacity-90"
              priority
            />
          </div>

          {/* ── ROW 3: Left copy + Right carousel — BELOW the map ── */}
          <div
            className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10 lg:gap-8"
            style={{ marginTop: 'clamp(20px,4vw,48px)' }}
          >

            {/* Left: description + button + arrow callout */}
            <div
              ref={leftColRef}
              className="w-full lg:max-w-[360px] xl:max-w-[400px]"
              style={{ opacity: 0, pointerEvents: 'auto' }}
            >
              <p
                className="text-white font-bold leading-snug mb-3"
                style={{
                  fontFamily: "'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif",
                  fontSize: 'clamp(15px,1.6vw,22px)',
                  lineHeight: '1.4',
                }}
              >
                Build your global nursing future with people who truly understand your journey.
              </p>
              <p
                className="text-gray-400 leading-relaxed mb-6"
                style={{
                  fontFamily: "'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif",
                  fontSize: 'clamp(12px,1.05vw,15px)',
                  lineHeight: '1.7',
                }}
              >
                GrowMedLink provides expert nursing exam training, personalised guidance, and skill-focused preparation for nurses aiming to build successful international healthcare careers.
              </p>

              {/* CTA button */}
              <Link
                href="/products#products"
                className="hover:brightness-90 active:scale-95 transition-all"
                style={{
                  width: 'clamp(170px,36vw,228px)',
                  height: 'clamp(44px,5.5vw,54px)',
                  background: '#96CA45',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontFamily: "'Haffer XH Mono-TRIAL','Courier New',monospace",
                  fontSize: 'clamp(14px,1.3vw,18px)',
                  fontWeight: 600,
                  color: '#000',
                  letterSpacing: '0.01em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                }}
              >
                Explore Courses
              </Link>

              {/* Arrow callout — in normal flow directly below the button */}
              <div
                ref={arrowRef}
                style={{
                  marginTop: 'clamp(12px,2vw,18px)',
                  marginLeft: 'clamp(40px,6vw,64px)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  pointerEvents: 'none',
                  opacity: 0,
                }}
              >
                {/* Curly arrow — mirrored horizontally so it points toward the button */}
                <div style={{ transform: 'scaleX(-1)', display: 'inline-block', flexShrink: 0 }}>
                  <Image
                    src="/curly-arrow.png"
                    alt=""
                    width={72}
                    height={46}
                    style={{ width: 'clamp(52px,6vw,72px)', height: 'auto', display: 'block' }}
                    onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
                  />
                </div>
                {/* Handwritten text beside the arrow */}
                <span
                  style={{
                    fontFamily: "'Great Day Personal Use','Brush Script MT',cursive",
                    fontSize: 'clamp(18px,1.8vw,24px)',
                    lineHeight: 1.3,
                    color: '#96CA45',
                    display: 'inline-block',
                    transform: 'rotate(-4deg)',
                    transformOrigin: 'left top',
                    whiteSpace: 'nowrap',
                    WebkitFontSmoothing: 'antialiased',
                    paddingTop: 4,
                  }}
                >
                  100% <br />Exam Pass Guarantee
                </span>
              </div>
            </div>

            {/* Right: cards carousel + controls */}
            <div
              ref={cardsRef}
              className="w-full lg:w-auto flex flex-col gap-3"
              style={{ opacity: 0, flexShrink: 0, minWidth: 0 }}
            >
              {/* ── DESKTOP: horizontal accordion row ── */}
              <div className="hero-cards-desktop" style={{ flexDirection: 'column', gap: 12 }}>
                <div
                  className="cards-scroll"
                  style={{ display: 'flex', gap: 4, width: '100%', maxWidth: '100%' }}
                >
                  {Hero_COUNTRIES.map((country, idx) => (
                    <div key={country.id} style={{ flexShrink: 0 }}>
                      <Hero_CountryCard
                        country={country}
                        isActive={idx === activeIdx}
                        onClick={() => handleCardClick(idx)}
                      />
                    </div>
                  ))}
                </div>
                <Hero_AutoCycleBar key={cycleKey} duration={Hero_AUTO_CYCLE_MS} />
                <div className="flex items-center justify-end gap-1.5 pr-1">
                  {Hero_COUNTRIES.map((c, i) => (
                    <button key={c.id} onClick={() => handleCardClick(i)}
                      style={{
                        width: activeIdx === i ? 22 : 8, height: 8, borderRadius: 4,
                        background: activeIdx === i ? '#96CA45' : 'rgba(255,255,255,0.28)',
                        border: 'none', cursor: 'pointer', padding: 0,
                        transition: 'width 0.4s cubic-bezier(.34,1.56,.64,1), background 0.3s ease',
                      }}
                      aria-label={`Show ${c.name}`}
                    />
                  ))}
                </div>
                <Hero_WaveDots />
              </div>

              {/* ── MOBILE: compact vertical list — no onClick/touch handlers, auto-cycle only ── */}
              <div className="hero-cards-mobile" style={{ flexDirection: 'column', gap: 8, width: '100%', pointerEvents: 'none' }}>
                {Hero_COUNTRIES.map((country, idx) => {
                  const isActive = idx === activeIdx;
                  return (
                    <div
                      key={country.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '10px 14px',
                        borderRadius: 10,
                        background: isActive ? '#fff' : 'rgba(255,255,255,0.06)',
                        border: isActive ? '1.5px solid rgba(150,202,69,0.35)' : '1.5px solid rgba(255,255,255,0.08)',
                        boxShadow: isActive ? '0 4px 20px rgba(0,0,0,0.25)' : 'none',
                      }}
                    >
                      {/* Map icon */}
                      <div style={{ width: 36, height: 36, flexShrink: 0, position: 'relative' }}>
                        <Image src={country.mapSrc} alt={country.name} fill
                          style={{ objectFit: 'contain', filter: isActive ? 'none' : Hero_GREEN_TINT }}
                          onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
                        />
                      </div>
                      {/* Name */}
                      <span style={{
                        flex: 1,
                        fontFamily: "'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif",
                        fontSize: 14, fontWeight: 600,
                        color: isActive ? '#000' : '#fff',
                      }}>
                        {country.name}
                      </span>
                      {/* Avatars */}
                      {isActive && (
                        <Image src="/avatars-group.png" alt="Students" width={80} height={28}
                          style={{ height: 28, width: 'auto', display: 'block', flexShrink: 0 }}
                          onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
                        />
                      )}
                      {/* Percentage */}
                      <span style={{
                        fontFamily: "'Haffer VF-TRIAL','Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif",
                        fontSize: isActive ? 22 : 14,
                        fontWeight: 600,
                        color: '#96CA45',
                        letterSpacing: '-0.02em',
                        flexShrink: 0,
                        minWidth: 46,
                        textAlign: 'right',
                      }}>
                        {country.percentage}%
                      </span>
                    </div>
                  );
                })}
                {/* Progress bar */}
                <Hero_AutoCycleBar key={`mob-${cycleKey}`} duration={Hero_AUTO_CYCLE_MS} />
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
/* === END OF Hero.tsx === */

/* =========================================================================
   START OF StatsBanner.tsx
   ========================================================================= */
const StatsBanner_stats = [
  { value: '4,900+', label: 'Students Placed',           icon: GraduationCap },
  { value: '96%',    label: 'First-Attempt Pass Rate',   icon: Award         },
  { value: '20+',    label: 'Years of Pathway Guidance', icon: Briefcase     },
];
const StatsBanner_EASE = 'cubic-bezier(0.48, 0.01, 0.2, 1)';
function StatsBanner() {
  const prevIndex   = useRef(0);
  const paused      = useRef(false);
  const touchResumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRef  = useRef<HTMLElement>(null);
  const barRef      = useRef<HTMLDivElement>(null);
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const valueRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs    = useRef<(SVGSVGElement | null)[]>([]);
  const defaultRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animating   = useRef(false);

  /* ── Entrance animation ── */
  useEffect(() => {
    const section = sectionRef.current;
    const bar     = barRef.current;
    if (!section || !bar) return;

    gsap.set(bar, { y: 40, opacity: 0, scale: 0.97 });
    gsap.set(defaultRefs.current.filter(Boolean), { y: 16, opacity: 0 });

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.to(bar, { y: 0, opacity: 1, scale: 1, duration: 0.65, ease: 'back.out(1.3)' });
      tl.to(defaultRefs.current.filter(Boolean), { y: 0, opacity: 1, duration: 0.4, stagger: 0.09 }, '-=0.3');
      tl.call(() => activateCard(0, true), [], '+=0.15');
    }, { threshold: 0.2 });

    observer.observe(section);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Activate card — Figma-matching animation ── */
  const activateCard = useCallback((next: number, skipPrev = false) => {
    if (animating.current && !skipPrev) return;
    const prev = prevIndex.current;
    if (next === prev && !skipPrev) return;
    animating.current = true;
    prevIndex.current = next;

    const tl = gsap.timeline({
      onComplete: () => { animating.current = false; },
      defaults: { ease: StatsBanner_EASE, duration: 0.6 },
    });

    const prevCard = cardRefs.current[prev];
    const nextCard = cardRefs.current[next];
    const prevDef  = defaultRefs.current[prev];
    const nextDef  = defaultRefs.current[next];
    const nextVal  = valueRefs.current[next];
    const nextLbl  = labelRefs.current[next];
    const nextIcon = iconRefs.current[next];

    /* ── outgoing: collapse dark card, restore white text ── */
    if (!skipPrev && prevCard) {
      tl.to(prevCard, { scale: 0.85, opacity: 0, duration: 0.3, ease: 'power2.in' }, 0);
      tl.set(prevCard, { display: 'none' }, 0.31);
    } else if (prevCard) {
      gsap.set(prevCard, { opacity: 0, scale: 0.85, display: 'none' });
    }
    if (!skipPrev && prevDef) {
      tl.to(prevDef, { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: 'power2.out' }, 0.1);
    }

    /* ── incoming: white text fades out, dark card pops in ── */
    if (nextDef) tl.to(nextDef, { opacity: 0, y: -6, duration: 0.2, ease: 'power2.in' }, 0.04);

    if (nextCard) {
      gsap.set(nextCard, { display: 'flex', scale: 0.82, opacity: 0, y: 8 });
      tl.to(nextCard, { scale: 1, opacity: 1, y: 0, duration: 0.6 }, 0.15);
    }

    /* staggered content inside dark card */
    if (nextVal) {
      gsap.set(nextVal, { y: 20, opacity: 0 });
      tl.to(nextVal, { y: 0, opacity: 1, duration: 0.45 }, 0.3);
    }
    if (nextLbl) {
      gsap.set(nextLbl, { y: 14, opacity: 0 });
      tl.to(nextLbl, { y: 0, opacity: 1, duration: 0.4 }, 0.4);
    }
    if (nextIcon) {
      gsap.set(nextIcon, { rotate: -50, scale: 0.4, opacity: 0 });
      tl.to(nextIcon, { rotate: -15, scale: 1, opacity: 0.08, duration: 0.65, ease: 'power2.out' }, 0.18);
    }
  }, []);

  /* ── Auto-cycle every 2s ── */
  useEffect(() => {
    const id = setInterval(() => {
      if (!paused.current) activateCard((prevIndex.current + 1) % StatsBanner_stats.length);
    }, 2000);
    return () => clearInterval(id);
  }, [activateCard]);

  useEffect(() => () => {
    if (touchResumeTimer.current) clearTimeout(touchResumeTimer.current);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-white overflow-x-hidden"
      style={{ padding: 'clamp(20px,4vw,56px) 0' }}
    >
      <div className="max-w-[1440px] mx-auto" style={{ padding: '0 clamp(12px,3vw,48px)', overflowX: 'clip' }}>

        {/*
          Outer wrapper gives vertical room for the dark card to overflow
          above and below the green bar without clipping.
        */}
        <div
          className="relative"
          style={{ padding: 'clamp(18px,4vw,48px) 0' }}
          onMouseEnter={() => { paused.current = true; }}
          onMouseLeave={() => { paused.current = false; }}
        >
          {/* ── GREEN BAR ── */}
          <div
            ref={barRef}
            className="relative w-full bg-[#96CA45] shadow-lg"
            style={{
              height: 'clamp(80px,14vw,140px)',
              borderRadius: 'clamp(16px,2.5vw,28px)',
            }}
          >
            {/* Three stat columns */}
            <div className="flex h-full">
              {StatsBanner_stats.map((stat, i) => {
                const Icon = stat.icon;
                const isLast = i === StatsBanner_stats.length - 1;
                return (
                  <div
                    key={i}
                    className="relative flex flex-1 items-center justify-center cursor-pointer"
                    style={{
                      borderRight: !isLast ? '1px solid rgba(255,255,255,0.3)' : 'none',
                    }}
                    onMouseEnter={() => activateCard(i)}
                  >
                    {/*
                      Dark active card — absolutely positioned relative to THIS column,
                      overflows top/bottom via negative top/bottom values.
                      Width slightly wider than column, centred with left/right negatives.
                    */}
                    <div
                      ref={el => { cardRefs.current[i] = el; }}
                      className="absolute bg-[#252525] shadow-2xl overflow-hidden flex-col items-center justify-center"
                      style={{
                        display: 'none',
                        opacity: 0,
                        /* overflow above+below the bar */
                        top:    'clamp(-12px,-2.5vw,-32px)',
                        bottom: 'clamp(-12px,-2.5vw,-32px)',
                        /* no horizontal overflow — avoids page-level bleed on mobile */
                        left:   0,
                        right:  0,
                        borderRadius: 'clamp(14px,2vw,22px)',
                        zIndex: 20,
                      }}
                    >
                      {/* background icon silhouette */}
                      <Icon
                        ref={el => { iconRefs.current[i] = el as SVGSVGElement | null; }}
                        className="absolute text-white pointer-events-none"
                        style={{
                          opacity: 0,
                          width:  'clamp(80px,12vw,160px)',
                          height: 'clamp(80px,12vw,160px)',
                          bottom: 'clamp(-12px,-1.5vw,-20px)',
                          left:   'clamp(-10px,-1.2vw,-18px)',
                        }}
                      />
                      {/* stat value */}
                      <div
                        ref={el => { valueRefs.current[i] = el; }}
                        className="relative z-10 font-black leading-none text-[#96CA45]"
                        style={{ fontSize: 'clamp(26px,4.5vw,64px)', opacity: 0 }}
                      >
                        {stat.value}
                      </div>
                      {/* label */}
                      <div
                        ref={el => { labelRefs.current[i] = el; }}
                        className="relative z-10 font-medium text-center text-[#96CA45] mt-1"
                        style={{
                          fontSize: 'clamp(9px,1vw,14px)',
                          opacity: 0,
                          padding: '0 clamp(6px,1vw,12px)',
                        }}
                      >
                        {stat.label}
                      </div>
                    </div>

                    {/* Default white text (visible at rest) */}
                    <div
                      ref={el => { defaultRefs.current[i] = el; }}
                      className="flex flex-col items-center justify-center text-center relative z-10"
                      style={{
                        opacity: 0,
                        padding: '0 clamp(8px,1.5vw,20px)',
                      }}
                    >
                      <div
                        className="text-white font-black leading-none"
                        style={{ fontSize: 'clamp(22px,4vw,58px)' }}
                      >
                        {stat.value}
                      </div>
                      <div
                        className="text-white font-medium mt-1"
                        style={{ fontSize: 'clamp(9px,1vw,14px)' }}
                      >
                        {stat.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
/* === END OF StatsBanner.tsx === */

/* =========================================================================
   START OF PreNursingMatters.tsx
   ========================================================================= */
function PreNursingMatters_getProductImage(p: any): string {
  if (!p) return '';
  if (p.image && typeof p.image === 'object' && p.image.secureUrl) return p.image.secureUrl;
  if (typeof p.image === 'string' && p.image) return p.image;
  return '';
}
const PreNursingMatters_FALLBACK = ['/about/3.jpg', '/about/7.jpg'];
const PreNursingMatters_REST = [
  { x: '0%', rotate:  0, scale: 1, z: 1 },
  { x: '0%', rotate:  0, scale: 1, z: 3 },
  { x: '0%', rotate:  0, scale: 1, z: 2 },
];
const PreNursingMatters_FAN_DESKTOP = [
  { x: '-62%', rotate: -18, scale: 0.90, z: 1 },
  { x:   '0%', rotate:   0, scale: 1.00, z: 3 },
  { x:  '62%', rotate:  18, scale: 0.90, z: 2 },
];
const PreNursingMatters_FAN_MOBILE = [
  { x: '-38%', rotate: -10, scale: 0.88, z: 1 },
  { x:   '0%', rotate:   0, scale: 1.00, z: 3 },
  { x:  '38%', rotate:  10, scale: 0.88, z: 2 },
];
interface PreNursingMatters_Props { products?: any[] }
function PreNursingMatters({ products = [] }: PreNursingMatters_Props) {
  const [isMobile, setIsMobile] = React.useState(false);
  const sunburstRef  = useRef<HTMLDivElement>(null);
  const cardEls      = useRef<(HTMLDivElement | null)[]>([]);
  const cardStageRef = useRef<HTMLDivElement>(null);
  /* refs for the centre card's animated layers */
  const overlayRef   = useRef<HTMLDivElement>(null);
  const overlayTxtRef = useRef<HTMLDivElement>(null);
  const calloutRef   = useRef<HTMLDivElement>(null);
  const floatTweenRef = useRef<gsap.core.Tween | null>(null);
  const revealedRef  = useRef(false);
  const fannedRef    = useRef(false);

  /* Sort by order field (≥1 only), then take images */
  const sortedProducts = [...products].sort((a, b) => {
    const ao = a.order ?? 0, bo = b.order ?? 0;
    if (ao === 0 && bo === 0) return 0;
    if (ao === 0) return 1;
    if (bo === 0) return -1;
    return ao - bo;
  });
  const centreImg = PreNursingMatters_getProductImage(sortedProducts[0]) || '/pre-nursing-photo.png';
  const leftImg   = PreNursingMatters_getProductImage(sortedProducts[1]) || PreNursingMatters_FALLBACK[0];
  const rightImg  = PreNursingMatters_getProductImage(sortedProducts[2]) || PreNursingMatters_FALLBACK[1];

  /* ── detect mobile on mount ── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── rAF-throttled sunburst parallax ── */
  useEffect(() => {
    let ticking = false;
    const apply = () => {
      ticking = false;
      if (sunburstRef.current)
        sunburstRef.current.style.transform =
          `translate(-50%,-50%) rotate(${window.scrollY * 0.18}deg)`;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(apply); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    apply();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── one-time scroll-reveal + GSAP float loop for arrow callout ── */
  useEffect(() => {
    const el = calloutRef.current;
    if (!el) return;

    /* hide initially via GSAP (no inline style opacity:0 left in DOM) */
    gsap.set(el, { y: 20, opacity: 0 });

    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || revealedRef.current) return;
      revealedRef.current = true;
      io.disconnect();

      const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
      gsap.to(el, {
        y: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.2)',
        onComplete: () => {
          if (!isTouch) {
            floatTweenRef.current = gsap.to(el, {
              y: -6, duration: 1.3, ease: 'sine.inOut',
              yoyo: true, repeat: -1,
            });
          }
        },
      });
    }, { threshold: 0.2 });

    io.observe(el);
    return () => { io.disconnect(); floatTweenRef.current?.kill(); };
  }, []);

  /* ── set initial stack positions ── */
  useEffect(() => {
    /* overlay + text start fully transparent */
    if (overlayRef.current)    gsap.set(overlayRef.current,    { opacity: 0 });
    if (overlayTxtRef.current) gsap.set(overlayTxtRef.current, { opacity: 0, y: 10 });

    cardEls.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, {
        x: PreNursingMatters_REST[i].x, rotate: PreNursingMatters_REST[i].rotate,
        scale: PreNursingMatters_REST[i].scale, zIndex: PreNursingMatters_REST[i].z,
      });
    });
    /* reset fan state so scroll-trigger re-fans with correct spread */
    fannedRef.current = false;
  }, [isMobile]);

  /* ── fan out: back cards slide, centre overlay fades in ── */
  const fanOut = () => {
    if (fannedRef.current) return;
    fannedRef.current = true;

    const FAN = window.innerWidth < 768 ? PreNursingMatters_FAN_MOBILE : PreNursingMatters_FAN_DESKTOP;

    /* back cards */
    [0, 2].forEach(i => {
      const el = cardEls.current[i];
      if (!el) return;
      gsap.to(el, {
        x: FAN[i].x, rotate: FAN[i].rotate, scale: FAN[i].scale,
        duration: 0.55, ease: 'back.out(1.5)', overwrite: 'auto',
      });
    });

    /* centre overlay fades in on top of the clear photo */
    if (overlayRef.current)
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
    if (overlayTxtRef.current)
      gsap.to(overlayTxtRef.current, { opacity: 1, y: 0, duration: 0.45, delay: 0.12, ease: 'power2.out', overwrite: 'auto' });
  };

  /* ── fan in: overlay disappears first, then cards collapse ── */
  const fanIn = () => {
    if (!fannedRef.current) return;
    fannedRef.current = false;

    /* fade out overlay content quickly */
    if (overlayTxtRef.current)
      gsap.to(overlayTxtRef.current, { opacity: 0, y: 8, duration: 0.22, ease: 'power2.in', overwrite: 'auto' });
    if (overlayRef.current)
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.28, ease: 'power2.in', overwrite: 'auto' });

    /* then collapse back cards with slight delay */
    [0, 2].forEach(i => {
      const el = cardEls.current[i];
      if (!el) return;
      gsap.to(el, {
        x: PreNursingMatters_REST[i].x, rotate: PreNursingMatters_REST[i].rotate, scale: PreNursingMatters_REST[i].scale,
        duration: 0.42, delay: 0.08, ease: 'power3.inOut', overwrite: 'auto',
      });
    });
  };

  /* ── scroll-triggered fan-out (replaces hover trigger) ── */
  useEffect(() => {
    const el = cardStageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) fanOut();
    }, { threshold: 0.45 });
    io.observe(el);
    return () => io.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* card size — same for all three so they stack perfectly
     On mobile: fixed 52vw wide so the 3-card fan fits in 100vw with ~12px side padding.
     Math: centre(52vw) + 2 × side(52vw × 0.88 × 0.44) ≈ 52 + 40 = 92vw  ✓  */
  const cardStyle: React.CSSProperties = {
    width:  'clamp(180px,44vw,460px)',
    height: 'clamp(130px,26vw,300px)',
    position: 'absolute',
    left: '50%', top: '50%',
    marginLeft: 'calc(clamp(180px,44vw,460px) / -2)',
    marginTop:  'calc(clamp(130px,26vw,300px) / -2)',
    willChange: 'transform',
    transformOrigin: 'bottom center',
    borderRadius: '16px',
    overflow: 'hidden',
  };
  const mobileCardStyle: React.CSSProperties = {
    width:  '48vw',
    height: '30vw',
    position: 'absolute',
    left: '50%', top: '50%',
    marginLeft: 'calc(48vw / -2)',
    marginTop:  'calc(30vw / -2)',
    willChange: 'transform',
    transformOrigin: 'bottom center',
    borderRadius: '14px',
    overflow: 'hidden',
  };

  return (
    <section
      className="bg-white relative font-['Power_Grotesk'] text-[#252525] pnm-section"
      style={{ paddingTop: 'clamp(48px,8vw,96px)', paddingBottom: 'clamp(64px,10vw,128px)', overflowX: 'clip' }}
    >
      <style>{`
        @media (max-width: 767px) {
          .pnm-section { overflow: visible !important; }
          .pnm-watermark { display: none !important; }
          .pnm-stage {
            width: calc(100vw - 24px) !important;
            max-width: calc(100vw - 24px) !important;
            margin-left: calc(-1 * clamp(16px,4vw,64px) + 12px) !important;
            height: 40vw !important;
          }
        }
      `}</style>
      {/* crosshair lines */}
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gray-200 pointer-events-none z-0" />
      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gray-200 pointer-events-none z-0" />

      {/* rotating sunburst */}
      <div
        ref={sunburstRef}
        className="absolute top-1/2 left-1/2 pointer-events-none z-0 opacity-35 will-change-transform"
        style={{ width: 'clamp(600px,85vw,1100px)', height: 'clamp(600px,85vw,1100px)', transform: 'translate(-50%,-50%)' }}
      >
        <Image src="/light-sunburst.png" alt="" fill className="object-contain" />
      </div>

      <div
        className="max-w-[1440px] mx-auto relative z-10 flex flex-col items-center text-center"
        style={{ paddingLeft: 'clamp(16px,4vw,64px)', paddingRight: 'clamp(16px,4vw,64px)' }}
      >
        {/* heading */}
        <h2
          className="font-medium tracking-tight"
          style={{ fontSize: 'clamp(26px,4.5vw,56px)', marginBottom: 'clamp(14px,2vw,24px)' }}
        >
          Nursing Dreams,{' '}
          <span className="text-[#96CA45] font-bold">Made Possible.</span>
        </h2>

        {/* body copy */}
        <p
          className="leading-relaxed max-w-3xl text-[#252525] mx-auto"
          style={{ fontSize: 'clamp(14px,1.5vw,20px)', marginBottom: 'clamp(32px,5vw,64px)' }}
        >
          GrowMedLink helps nurses transform ambition into achievement through expert-led training,
          personalised support, and practical preparation for a successful global healthcare career.
        </p>

        {/* ── card fan stage ── */}
        <div
          ref={cardStageRef}
          className="relative flex items-center justify-center select-none pnm-stage"
          style={{
            width: '100%',
            maxWidth: 'clamp(320px,80vw,900px)',
            height: 'clamp(220px,40vw,460px)',
            marginBottom: 'clamp(16px,3vw,40px)',
          }}
        >
          {/* watermarks */}
          <span
            className="pnm-watermark absolute pointer-events-none select-none font-bold text-gray-200 tracking-widest"
            style={{ fontSize: 'clamp(20px,4vw,60px)', left: 0, top: '50%', transform: 'translateY(-50%) translateX(-30%)', whiteSpace: 'nowrap', zIndex: 0 }}
          >EXPLORE</span>
          <span
            className="pnm-watermark absolute pointer-events-none select-none font-bold text-gray-200 tracking-widest"
            style={{ fontSize: 'clamp(20px,4vw,60px)', right: 0, top: '50%', transform: 'translateY(-50%) translateX(30%)', whiteSpace: 'nowrap', zIndex: 0 }}
          >MORE !</span>

          {/* card 0 — left back (photo, dark tint) */}
          <div ref={el => { cardEls.current[0] = el; }} style={{ ...(isMobile ? mobileCardStyle : cardStyle), boxShadow: '0 25px 60px rgba(0,0,0,0.25)' }}>
            <Image src={leftImg} alt="Product" fill className="object-cover" sizes="50vw" />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} />
          </div>

          {/* card 1 — centre (first-order product image at rest, green overlay on hover) */}
          <div ref={el => { cardEls.current[1] = el; }} style={{ ...(isMobile ? mobileCardStyle : cardStyle), boxShadow: '0 30px 70px rgba(0,0,0,0.30)' }}>
            {/* always-visible clear photo — product with order=0 */}
            <Image src={centreImg} alt="GrowMedLink" fill className="object-cover" sizes="50vw" />

            {/* green tinted overlay — opacity controlled by GSAP */}
            <div
              ref={overlayRef}
              style={{ position: 'absolute', inset: 0, background: 'rgba(150,202,69,0.82)' }}
            />

            {/* text + button on overlay — opacity+y controlled by GSAP */}
            <div
              ref={overlayTxtRef}
              style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 'clamp(10px,1.5vw,20px)',
                padding: 'clamp(12px,2vw,32px)',
                zIndex: 10,
              }}
            >
              <p
                className="font-bold text-center leading-tight font-['Power_Grotesk'] text-[#252525]"
                style={{ fontSize: 'clamp(15px,2.6vw,30px)' }}
              >
                Your Global Nursing{' '}
                <span style={{ color: '#fff' }}>Career</span>{' '}
                Starts Here.
              </p>
              <Link
                href="/products#products"
                style={{
                  background: '#fff',
                  color: '#252525',
                  fontWeight: 600,
                  fontFamily: "'Power_Grotesk', sans-serif",
                  borderRadius: '9999px',
                  fontSize: 'clamp(11px,1.2vw,15px)',
                  padding: 'clamp(7px,0.9vw,13px) clamp(16px,2.2vw,32px)',
                  textDecoration: 'none',
                  transition: 'background 0.28s, color 0.28s',
                  display: 'inline-block',
                  pointerEvents: 'auto',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#252525'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.color = '#252525'; }}
              >
                Explore Courses
              </Link>
            </div>
          </div>

          {/* card 2 — right back (photo, dark tint) */}
          <div ref={el => { cardEls.current[2] = el; }} style={{ ...(isMobile ? mobileCardStyle : cardStyle), boxShadow: '0 25px 60px rgba(0,0,0,0.25)' }}>
            <Image src={rightImg} alt="Service" fill className="object-cover" sizes="50vw" />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} />
          </div>
        </div>

        {/* ── arrow callout ── */}
        <div
          ref={calloutRef}
          style={{
            alignSelf: 'flex-end',
            marginRight: 'clamp(8px,8vw,120px)',
            pointerEvents: 'none',
            width: 'clamp(150px,22vw,280px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <div style={{ transform: 'rotate(-10deg)', transformOrigin: 'top center', display: 'inline-block' }}>
            <Image
              src="/red-curly-arrow.png"
              alt=""
              width={100}
              height={100}
              style={{ width: 'clamp(32px,4vw,56px)', height: 'auto', marginLeft: '32px' }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
            />
          </div>
          <span
            style={{
              display: 'block',
              fontFamily: "'Great Day Personal Use','Great Day Bold Personal Use','Brush Script MT',cursive",
              fontSize: 'clamp(20px,2.8vw,36px)',
              lineHeight: 1.3,
              paddingBottom: '12px',
              color: '#b31b1b',
              transform: 'rotate(-3deg)',
              transformOrigin: 'left top',
              marginLeft: '36px',
              marginTop: '2px',
              whiteSpace: 'nowrap',
              WebkitFontSmoothing: 'antialiased',
            }}
          >
            Start Your Journey Today!
          </span>
        </div>

        {/* ── social proof ── */}
        <div
          className="flex flex-row items-center justify-center gap-3 relative z-10"
          style={{ marginTop: 'clamp(20px,3.5vw,40px)' }}
        >
          <Image
            src="/avatars-group.png"
            alt="Trusted Students"
            width={160}
            height={40}
            style={{ height: 'clamp(22px,3vw,34px)', width: 'auto' }}
          />
          <span
            className="text-[#252525] font-medium tracking-wide"
            style={{ fontSize: 'clamp(11px,1vw,14px)' }}
          >
            8,600+ Trusted Global Graduates
          </span>
        </div>
      </div>
    </section>
  );
}
/* === END OF PreNursingMatters.tsx === */

/* =========================================================================
   START OF ServicesCarouselSection.tsx
   ========================================================================= */
const ServicesCarouselSection_FS = "'Great Day Personal Use','Brush Script MT',cursive";
function ServicesCarouselSection({ services }: { services: any[] }) {
  const sectionRef   = useRef<HTMLElement>(null);
  const headingRef   = useRef<HTMLHeadingElement>(null);
  const arrowWrapRef = useRef<HTMLDivElement>(null);
  const labelRef     = useRef<HTMLSpanElement>(null);
  const leftColRef   = useRef<HTMLDivElement>(null);
  const rightColRef  = useRef<HTMLDivElement>(null);
  const carouselRef  = useRef<HTMLDivElement>(null);
  const progressRef  = useRef<HTMLDivElement>(null);
  const dotRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const triggered    = useRef(false);

  const items = services ?? [];
  const numDots = 10;

  /* ── Progress bar + dot wave on carousel scroll ── */
  const handleScroll = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const progress = el.scrollWidth > el.clientWidth
      ? el.scrollLeft / (el.scrollWidth - el.clientWidth)
      : 0;
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: `${Math.max(15, progress * 100)}%`,
        duration: 0.12, ease: 'none', overwrite: true,
      });
    }
    dotRefs.current.forEach((dot, i, all) => {
      if (!dot) return;
      const phase = (i / all.length) * Math.PI * 2 + progress * Math.PI * 4;
      gsap.to(dot, {
        y: Math.sin(phase) * 8,
        opacity: 0.45 + 0.55 * ((Math.sin(phase) + 1) / 2),
        duration: 0.1, ease: 'none', overwrite: true,
      });
    });
  }, []);

  /* ── Scroll-triggered entrance ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    /* Set initial hidden states */
    gsap.set(headingRef.current,   { opacity: 0, y: 40 });
    gsap.set(arrowWrapRef.current, { opacity: 0 });
    gsap.set(labelRef.current,     { opacity: 0 });
    gsap.set(leftColRef.current,   { opacity: 0, x: -50 });
    gsap.set(rightColRef.current,  { opacity: 0, x: 50 });
    gsap.set(progressRef.current,  { opacity: 0 });
    if (cardRefs.current.length) {
      gsap.set(cardRefs.current.filter(Boolean), { opacity: 0, y: 50 });
    }
    dotRefs.current.forEach(d => d && gsap.set(d, { opacity: 0.45 }));

    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || triggered.current) return;
      triggered.current = true;
      io.disconnect();

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      /* 1. Heading rises */
      tl.to(headingRef.current, { opacity: 1, y: 0, duration: 0.75, ease: 'back.out(1.3)' }, 0);

      /* 2. Arrow floats in */
      tl.to(arrowWrapRef.current, { opacity: 1, duration: 0.5 }, 0.35);

      /* 3. Handwritten label fades in with slight y */
      tl.fromTo(labelRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' },
        0.45
      );

      /* 4. Left column slides in */
      tl.to(leftColRef.current,  { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }, 0.25);

      /* 5. Right column slides in */
      tl.to(rightColRef.current, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }, 0.38);

      /* 6. Progress bar fades in */
      tl.to(progressRef.current, { opacity: 1, duration: 0.4 }, 0.5);

      /* 7. Cards stagger up */
      tl.to(cardRefs.current.filter(Boolean), {
        opacity: 1, y: 0,
        duration: 0.55,
        stagger: 0.12,
        ease: 'back.out(1.2)',
      }, 0.55);

      /* 8. Arrow bounce loop — desktop only (repeat:-1 competes with mobile scroll thread) */
      const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
      if (!isTouch) {
        tl.call(() => {
          gsap.to(arrowWrapRef.current, {
            y: -7, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: -1,
          });
        }, [], 0.9);
      }
    }, { threshold: 0.08 });

    io.observe(section);
    return () => io.disconnect();
  }, []);

  /* ── Carousel scroll listener ── */
  useEffect(() => {
    handleScroll();
    const el = carouselRef.current;
    if (el) el.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      if (el) el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [services, handleScroll]);

  return (
    <section
      ref={sectionRef}
      className="bg-white overflow-x-clip"
      style={{
        padding: 'clamp(40px,6vw,96px) 0',
        fontFamily: "'Power Grotesk', sans-serif",
      }}
    >
      {/* Hide scrollbar — minimal CSS, layout only */}
      <style>{`
        .scs-scrollbar::-webkit-scrollbar { display: none; }
        .scs-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }

        /* hide callout arrow on small/mid screens */
        @media (max-width: 767px) {
          .scs-callout  { display: none !important; }
          .scs-progress { display: none !important; }
          .scs-dots     { display: none !important; }
        }

        /* split layout: stack at ≤899px */
        @media (max-width: 899px) {
          .scs-split { flex-direction: column !important; gap: clamp(20px,4vw,36px) !important; }
          .scs-left  { flex: none !important; width: 100% !important; max-width: 100% !important; }
          .scs-right { width: 100% !important; flex: none !important; }
        }
        @media (max-width: 767px) {
          .scs-split { gap: 16px !important; }
          .scs-heading { font-size: clamp(36px,10vw,56px) !important; margin-bottom: 20px !important; }
        }
      `}</style>

      <div
        className="max-w-[1440px] mx-auto"
        style={{ padding: '0 clamp(16px,4vw,64px)' }}
      >

        {/* ════ HEADER ════ */}
        <div
          style={{ marginBottom: 'clamp(16px,4vw,80px)', position: 'relative' }}
        >
          {/* Heading + callout row — flex so callout stays beside heading on wide, hides on narrow */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'clamp(12px,2vw,28px)', flexWrap: 'wrap' }}>
            <h2
              ref={headingRef}
              className="scs-heading"
              style={{
                fontSize: 'clamp(32px,6.5vw,88px)',
                fontWeight: 500,
                color: '#252525',
                letterSpacing: '-0.03em',
                lineHeight: 1,
                margin: 0,
                flexShrink: 0,
              }}
            >
              OUR{' '}
              <span style={{ color: '#96CA45' }}>SERVICES</span>
            </h2>

            {/* Arrow + label — inline with heading, hidden below 600px */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
                paddingBottom: 'clamp(4px,0.5vw,10px)',
                overflow: 'hidden',
              }}
              className="scs-callout"
            >
              <div
                ref={arrowWrapRef}
                style={{
                  position: 'relative',
                  width: 'clamp(36px,4vw,60px)',
                  height: 'clamp(28px,3vw,48px)',
                  flexShrink: 0,
                  marginRight: '6px',
                }}
              >
                <Image src="/red-curly-arrow.png" alt="" fill className="object-contain" />
              </div>
              <span
                ref={labelRef}
                style={{
                  fontFamily: ServicesCarouselSection_FS,
                  fontSize: 'clamp(18px,2.4vw,34px)',
                  color: '#c94141',
                  display: 'inline-block',
                  rotate: '-4deg',
                }}
              >
                Services we offer
              </span>
            </div>
          </div>
        </div>

        {/* ════ SPLIT LAYOUT ════ */}
        <div
          className="scs-split"
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 'clamp(24px,4vw,80px)',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >

          {/* ── LEFT ── */}
          <div
            ref={leftColRef}
            className="scs-left"
            style={{
              flex: '0 0 clamp(240px,32%,380px)',
              minWidth: 0,
            }}
          >
            <h3 style={{
              fontSize: 'clamp(22px,2.4vw,36px)',
              fontWeight: 700,
              color: '#96CA45',
              marginBottom: 'clamp(12px,1.5vw,20px)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}>
              Careers Beyond Borders
            </h3>
            <p style={{
              color: '#252525',
              fontSize: 'clamp(13px,1.1vw,17px)',
              lineHeight: 1.7,
              marginBottom: 'clamp(20px,2.5vw,36px)',
              fontWeight: 500,
            }}>
               GrowMedLink provides expert nursing career guidance, exam training, documentation support, interview preparation, and global job assistance to help nurses achieve international opportunities confidently.
            </p>
            <ServicesCarouselSection_ExploreBtn />
          </div>

          {/* ── RIGHT ── */}
          <div
            ref={rightColRef}
            className="scs-right"
            style={{ flex: 1, minWidth: 0 }}
          >
            {/* Progress bar — hidden on mobile via .scs-progress */}
            <div className="scs-progress" style={{
              width: '100%', height: '4px',
              backgroundColor: '#f0f0f0',
              borderRadius: '2px',
              marginBottom: 'clamp(16px,2vw,28px)',
              overflow: 'hidden',
              position: 'relative',
            }}>
              <div
                ref={progressRef}
                style={{
                  position: 'absolute', top: 0, left: 0,
                  height: '100%', width: '15%',
                  backgroundColor: '#96CA45',
                  borderRadius: '2px',
                  boxShadow: '0 0 8px rgba(150,202,69,0.4)',
                }}
              />
            </div>

            {/* Cards */}
            <div
              ref={carouselRef}
              className="scs-scrollbar"
              style={{
                display: 'flex',
                gap: 'clamp(14px,1.8vw,24px)',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                paddingBottom: 'clamp(12px,1.5vw,20px)',
                paddingTop: '4px',
                scrollBehavior: 'smooth',
                touchAction: 'pan-y pan-x',
              }}
            >
              {items.map((service, idx) => {
                const imgSrc = service?.image && typeof service.image === 'object'
                  ? service.image.secureUrl
                  : (typeof service?.image === 'string' ? service.image : '') || '/pre-nursing-photo.png';

                return (
                  <div
                    key={service?._id || idx}
                    ref={el => { cardRefs.current[idx] = el; }}
                    style={{
                      flexShrink: 0,
                      width: 'clamp(260px,82vw,320px)',
                      scrollSnapAlign: 'start',
                      alignSelf: 'flex-start',
                    }}
                  >
                    <ServicesCarouselSection_ServiceCard
                      href={`/services/${service?.slug || '#'}`}
                      img={imgSrc}
                      title={service?.title || service?.name || 'Our Service'}
                      description={service?.description || ''}
                    />
                  </div>
                );
              })}
            </div>

            {/* Dot wave — hidden on mobile via .scs-dots */}
            <div className="scs-dots" style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 'clamp(8px,1vw,14px)',
              marginTop: 'clamp(12px,1.5vw,20px)',
              paddingRight: '4px',
            }}>
              {Array.from({ length: numDots }).map((_, i) => (
                <div
                  key={i}
                  ref={el => { dotRefs.current[i] = el; }}
                  style={{
                    width: 'clamp(7px,0.8vw,10px)',
                    height: 'clamp(7px,0.8vw,10px)',
                    borderRadius: '50%',
                    backgroundColor: '#96CA45',
                    opacity: 0.45,
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function ServicesCarouselSection_ServiceCard({
  href, img, title, description,
}: {
  href: string; img: string; title: string; description: string;
}) {
  const cardRef    = useRef<HTMLAnchorElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const btnRef     = useRef<HTMLDivElement>(null);
  const imgRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card    = cardRef.current;
    const overlay = overlayRef.current;
    const btn     = btnRef.current;
    const imgEl   = imgRef.current;
    if (!card || !overlay || !btn || !imgEl) return;

    /* Initial states — everything hidden, overlay opacity:0 is also set in JSX */
    gsap.set(btn, { opacity: 0, y: 14, scale: 0.9 });

    const enter = () => {
      gsap.killTweensOf([card, overlay, btn, imgEl]);
      gsap.to(card,    { y: -6, scale: 1.012, duration: 0.28, ease: 'power2.out', overwrite: true });
      gsap.to(imgEl,   { scale: 1.07, duration: 0.45, ease: 'power2.out', overwrite: true });
      gsap.to(overlay, { opacity: 1, duration: 0.28, ease: 'power2.out', overwrite: true });
      gsap.to(btn,     { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'back.out(1.5)', overwrite: true });
    };

    const leave = () => {
      gsap.killTweensOf([card, overlay, btn, imgEl]);
      gsap.to(card,    { y: 0, scale: 1, duration: 0.4, ease: 'power3.out', overwrite: true });
      gsap.to(imgEl,   { scale: 1, duration: 0.45, ease: 'power3.out', overwrite: true });
      gsap.to(overlay, { opacity: 0, duration: 0.28, ease: 'power2.in', overwrite: true });
      gsap.to(btn,     { opacity: 0, y: 14, scale: 0.9, duration: 0.2, ease: 'power2.in', overwrite: true });
    };

    card.addEventListener('mouseenter', enter);
    card.addEventListener('mouseleave', leave);
    return () => {
      card.removeEventListener('mouseenter', enter);
      card.removeEventListener('mouseleave', leave);
    };
  }, []);

  return (
    <Link
      ref={cardRef}
      href={href}
      style={{
        display: 'block',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
        textDecoration: 'none',
        willChange: 'transform',
        transformOrigin: 'center center',
        backgroundColor: '#fff',
      }}
    >
      {/* Image — full width, natural height, zero padding, never cropped */}
      <div ref={imgRef} style={{ position: 'relative', width: '100%', willChange: 'transform' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt={title}
          style={{ display: 'block', width: '100%', height: 'auto' }}
          loading="lazy"
        />
        {/* Hover overlay */}
        <div
          ref={overlayRef}
          style={{
            position: 'absolute', inset: 0,
            backgroundColor: 'rgba(120,175,35,0.78)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2, pointerEvents: 'none', opacity: 0,
          }}
        >
          <div
            ref={btnRef}
            style={{
              backgroundColor: '#fff', color: '#111', fontWeight: 700,
              fontSize: 'clamp(13px,1.2vw,17px)',
              padding: 'clamp(8px,0.9vw,12px) clamp(22px,2.5vw,36px)',
              borderRadius: '8px', letterSpacing: '0.01em',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)', whiteSpace: 'nowrap',
            }}
          >
            View Details
          </div>
        </div>
      </div>

      {/* Text area */}
      <div style={{
        backgroundColor: '#2a2a2a',
        padding: 'clamp(12px,1.4vw,20px)',
      }}>
        <h4 style={{
          color: '#96CA45', fontWeight: 600,
          fontSize: 'clamp(13px,1.3vw,18px)',
          marginBottom: 'clamp(4px,0.5vw,8px)',
          lineHeight: 1.25, letterSpacing: '-0.01em',
        }}>
          {title}
        </h4>
        <p style={{
          color: 'rgba(255,255,255,0.65)',
          fontSize: 'clamp(11px,0.9vw,13px)',
          lineHeight: 1.6, margin: 0,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {description}
        </p>
      </div>
    </Link>
  );
}
function ServicesCarouselSection_ExploreBtn() {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const enter = () => gsap.to(el, { y: -3, scale: 1.04, duration: 0.25, ease: 'back.out(2)', overwrite: true });
    const leave = () => gsap.to(el, { y: 0,  scale: 1,    duration: 0.35, ease: 'power3.out', overwrite: true });
    const down  = () => gsap.to(el, { scale: 0.97, duration: 0.1, overwrite: true });
    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);
    el.addEventListener('mousedown',  down);
    el.addEventListener('mouseup',    leave);
    return () => {
      el.removeEventListener('mouseenter', enter);
      el.removeEventListener('mouseleave', leave);
      el.removeEventListener('mousedown',  down);
      el.removeEventListener('mouseup',    leave);
    };
  }, []);

  return (
    <Link
      ref={ref}
      href="/services#services-grid"
      style={{
        backgroundColor: '#96CA45',
        color: '#111',
        fontWeight: 700,
        fontSize: 'clamp(14px,1.2vw,18px)',
        padding: 'clamp(10px,1.1vw,16px) clamp(24px,2.5vw,36px)',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(150,202,69,0.35)',
        willChange: 'transform',
        display: 'inline-block',
        textDecoration: 'none',
      }}
    >
      Explore Services
    </Link>
  );
}
/* === END OF ServicesCarouselSection.tsx === */

/* =========================================================================
   START OF FeaturedServices.tsx
   ========================================================================= */
function FeaturedServices({ services }: { services: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused]       = useState(false);

  const sectionRef   = useRef<HTMLElement>(null);
  const intervalRef  = useRef<NodeJS.Timeout | null>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef= useRef<HTMLDivElement>(null);
  const docColorRef  = useRef<HTMLDivElement>(null);
  const docBwRef     = useRef<HTMLDivElement>(null);
  const arrowBtnRef  = useRef<HTMLAnchorElement>(null);
  const docWrapRef   = useRef<HTMLDivElement>(null);
  const headingRef   = useRef<HTMLDivElement>(null);
  const leftHovered  = useRef(false);
  const enteredRef   = useRef(false);
  const progressRef  = useRef<HTMLDivElement>(null);
  const progressTween= useRef<gsap.core.Tween | null>(null);
  const dotRefs      = useRef<(HTMLButtonElement | null)[]>([]);

  /* ── Entrance: GSAP on intersection, no CSS classes ── */
  useEffect(() => {
    const left  = leftPanelRef.current;
    const right = rightPanelRef.current;
    const doc   = docWrapRef.current;
    const head  = headingRef.current;
    if (!left || !right) return;

    /* hide immediately via GSAP so there's no flash */
    gsap.set(left,  { opacity: 0, x: -60, scale: 0.97 });
    gsap.set(right, { opacity: 0, x:  60, scale: 0.97 });
    if (doc)  gsap.set(doc,  { opacity: 0, y: 28 });
    if (head) gsap.set(head, { opacity: 0, y: 16 });

    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || enteredRef.current) return;
      enteredRef.current = true;
      io.disconnect();

      gsap.to(left,  { opacity: 1, x: 0, scale: 1, duration: 0.85, ease: 'power3.out' });
      gsap.to(right, { opacity: 1, x: 0, scale: 1, duration: 0.85, ease: 'power3.out', delay: 0.12 });
      if (head) gsap.to(head, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.55 });
      if (doc)  gsap.to(doc,  { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out', delay: 0.45 });
    }, { threshold: 0.1 });

    if (sectionRef.current) io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  /* ── Left panel hover: colour ↔ B&W crossfade + arrow ── */
  useEffect(() => {
    const panel = leftPanelRef.current;
    const color = docColorRef.current;
    const bw    = docBwRef.current;
    const arrow = arrowBtnRef.current;
    if (!panel || !color || !bw || !arrow) return;

    gsap.set(bw,    { opacity: 0, scale: 1.04 });
    gsap.set(color, { opacity: 1, scale: 1 });
    gsap.set(arrow, { opacity: 0, y: -12, scale: 0.8, rotate: -8 });

    const onEnter = () => {
      if (leftHovered.current) return;
      leftHovered.current = true;
      gsap.to(color, { opacity: 0, scale: 0.97, duration: 0.65, ease: 'power2.inOut' });
      gsap.to(bw,    { opacity: 1, scale: 1,    duration: 0.70, ease: 'power2.out', delay: 0.05 });
      gsap.to(arrow, { opacity: 1, y: 0, scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(1.6)', delay: 0.18 });
    };
    const onLeave = () => {
      leftHovered.current = false;
      gsap.to(color, { opacity: 1, scale: 1,    duration: 0.55, ease: 'power2.out', delay: 0.05 });
      gsap.to(bw,    { opacity: 0, scale: 1.04, duration: 0.50, ease: 'power2.inOut' });
      gsap.to(arrow, { opacity: 0, y: -12, scale: 0.8, rotate: -8, duration: 0.3, ease: 'power2.in' });
    };

    panel.addEventListener('mouseenter', onEnter);
    panel.addEventListener('mouseleave', onLeave);
    return () => {
      panel.removeEventListener('mouseenter', onEnter);
      panel.removeEventListener('mouseleave', onLeave);
      gsap.killTweensOf([color, bw, arrow]);
    };
  }, []);

  /* ── Progress bar: pure GSAP tween, restarts on activeIndex ── */
  useEffect(() => {
    if (isPaused) {
      progressTween.current?.pause();
      return;
    }
    const bar = progressRef.current;
    if (!bar) return;
    progressTween.current?.kill();
    gsap.set(bar, { scaleX: 0, transformOrigin: 'left center' });
    progressTween.current = gsap.to(bar, {
      scaleX: 1, duration: 4, ease: 'none',
    });
    return () => { progressTween.current?.kill(); };
  }, [activeIndex, isPaused]);

  /* ── Pagination dots: GSAP width + colour ── */
  useEffect(() => {
    dotRefs.current.forEach((btn, idx) => {
      if (!btn) return;
      gsap.to(btn, {
        width: idx === activeIndex ? 28 : 16,
        backgroundColor: idx === activeIndex ? '#96CA45' : 'rgba(255,255,255,0.2)',
        duration: 0.35,
        ease: 'power2.out',
      });
    });
  }, [activeIndex]);

  const goTo = useCallback((idx: number) => {
    if (idx === activeIndex) return;
    setActiveIndex(idx);
  }, [activeIndex]);

  const goNext = useCallback(() => {
    if (!services?.length) return;
    goTo((activeIndex + 1) % services.length);
  }, [activeIndex, services?.length, goTo]);

  useEffect(() => {
    if (isPaused) { if (intervalRef.current) clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(goNext, 4000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPaused, goNext]);

  if (!services || services.length === 0) return null;

  const getImage = (s: any) =>
    s?.image
      ? typeof s.image === 'object' ? s.image.secureUrl : s.image
      : '/pre-nursing-photo.png';

  return (
    <section
      ref={sectionRef}
      style={{ background: '#fff', padding: 'clamp(24px,4vw,32px) 0 clamp(40px,6vw,64px)', overflowX: 'clip' }}
    >
      <style>{`
        .fs-row   { display: flex; flex-direction: row; gap: 20px; align-items: stretch; }
        .fs-left  { width: clamp(280px,42%,600px); flex: 0 0 auto; border-radius: 28px; position: relative; overflow: hidden; background: linear-gradient(150deg,#004a9c 0%,#002f6c 55%,#001a45 100%); height: clamp(340px,46vw,560px); cursor: default; }
        .fs-right { flex: 1; min-width: 0; border-radius: 28px; position: relative; display: flex; flex-direction: column; overflow: hidden; background-color: #1a1a1a; height: clamp(340px,46vw,560px); }

        /* ── Desktop: centred card inside the deck ── */
        .fs-deck  { flex: 1; display: flex; align-items: center; justify-content: center; padding: 12px 20px 16px; position: relative; }
        .fs-deck-card { position: absolute; width: calc(100% - 40px); }
        .fs-deck-card[data-active="false"] { pointer-events: none; }
        .fs-deck-card-img { display: block; width: 100%; height: auto; max-height: clamp(160px,18vw,240px); object-fit: contain; object-position: center; }

        /* pagination: vertical strip on right edge */
        .fs-pagination { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 10px; align-items: center; z-index: 20; }

        /* ── Mobile: stack, auto height, flow layout ── */
        @media (max-width: 767px) {
          .fs-row   { flex-direction: column !important; gap: 14px !important; }
          .fs-left  { width: 100% !important; flex: none !important; height: clamp(280px,75vw,380px) !important; }
          .fs-right { width: 100% !important; height: auto !important; }
          .fs-deck  { flex: none !important; display: block !important; padding: 0 12px 16px !important; }
          .fs-deck-card { position: relative !important; top: auto !important; left: auto !important; right: auto !important; width: 100% !important; margin: 0 !important; transform: none !important; }
          .fs-deck-card[data-active="false"] { display: none !important; }
          .fs-deck-card-img { max-height: none !important; object-fit: unset !important; }
          .fs-pagination { position: relative !important; top: auto !important; right: auto !important; transform: none !important; flex-direction: row !important; justify-content: center !important; padding: 10px 0 14px !important; }
        }
        @media (max-width: 479px) {
          .fs-left  { height: clamp(240px,72vw,300px) !important; border-radius: 20px !important; }
          .fs-right { border-radius: 20px !important; }
        }
      `}</style>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 clamp(16px,4vw,48px)' }}>
        <div className="fs-row">

          {/* ════ LEFT PANEL ════ */}
          <div
            ref={leftPanelRef}
            className="fs-left"
          >
            {/* Shimmer overlay — desktop only, costs GPU on mobile */}
            <div
              className="fs-shimmer-el"
              style={{
                position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
                background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent)',
                backgroundSize: '400px 100%',
                animation: 'fs-shimmer 3.5s ease-in-out infinite',
              }}
            />
            <style>{`@media(hover:none)and(pointer:coarse){.fs-shimmer-el,.fs-orb-el{animation:none!important;}}`}</style>

            {/* Ambient orb */}
            <div
              className="fs-orb-el"
              style={{
                position: 'absolute', pointerEvents: 'none',
                width: '280px', height: '280px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(150,202,69,0.2) 0%, transparent 70%)',
                bottom: '-40px', left: '50%', transform: 'translateX(-50%)',
                animation: 'fs-orbBreathe 7s ease-in-out infinite',
              }}
            />

            {/* Text heading */}
            <div
              ref={headingRef}
              style={{
                position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30,
                padding: 'clamp(20px,3vw,36px) clamp(20px,3vw,36px) 0',
              }}
            >
              <p
                style={{
                  fontWeight: 900, color: '#fff', lineHeight: 0.88,
                  fontSize: 'clamp(18px,2.8vw,40px)',
                  letterSpacing: '-0.025em',
                  textShadow: '0 2px 16px rgba(0,0,0,0.5)',
                  margin: 0, userSelect: 'none',
                }}
              >
                SELECT YOUR<br />
                <span style={{ color: '#96CA45' }}>CAREER</span><br />
                DESTINATION
              </p>
              <div style={{ marginTop: '12px', height: '3px', width: '48px', borderRadius: '2px', backgroundColor: 'rgba(150,202,69,0.85)' }} />
            </div>

            {/* Arrow button — GSAP-revealed on hover */}
            <Link
              ref={arrowBtnRef}
              href="/services#services-grid"
              style={{
                position: 'absolute', top: '20px', right: '20px', zIndex: 40,
                width: '42px', height: '42px', borderRadius: '12px',
                background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.22)',
              }}
              aria-label="Explore services"
            >
              <ArrowUpRight style={{ width: '20px', height: '20px', color: '#111' }} />
            </Link>

            {/* Doctor images — stacked, GSAP crossfade */}
            <div
              ref={docWrapRef}
              style={{
                position: 'absolute', bottom: 0,
                left: '18%',
                zIndex: 20, pointerEvents: 'none',
                width: 'clamp(55%,68%,78%)', height: '80%',
              }}
            >
              <div ref={docColorRef} style={{ position: 'absolute', inset: 0 }}>
                <Image src="/doctor-pointing.png" alt="Doctor" fill
                  className="object-contain object-bottom"
                  style={{ filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.55))' }} />
              </div>
              <div ref={docBwRef} style={{ position: 'absolute', inset: 0 }}>
                <Image src="/doctor-pointing_black.png" alt="Doctor" fill
                  className="object-contain object-bottom"
                  style={{ filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.55)) grayscale(100%)' }} />
              </div>
            </div>

            {/* Bottom fade */}
            <div
              style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', zIndex: 25,
                background: 'linear-gradient(to top, rgba(0,26,69,0.7), transparent)',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* ════ RIGHT PANEL ════ */}
          <div
            ref={rightPanelRef}
            className="fs-right"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Dot grid */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '26px 26px',
            }} />

            {/* Top-right glow */}
            <div style={{
              position: 'absolute', top: '-48px', right: '-48px', pointerEvents: 'none',
              width: '220px', height: '220px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(150,202,69,0.09) 0%, transparent 70%)',
            }} />

            {/* Header */}
            <div style={{ position: 'relative', zIndex: 10, paddingTop: '14px', paddingBottom: '0px', textAlign: 'center', flexShrink: 0 }}>
              <h2 style={{ color: '#fff', fontWeight: 500, fontSize: 'clamp(16px,1.6vw,22px)', margin: 0, letterSpacing: '-0.01em' }}>
                Our Featured{' '}
                <span style={{ fontWeight: 700, color: '#96CA45' }}>Products</span>
              </h2>
              <div style={{ margin: '5px auto 0', height: '2px', width: '40px', borderRadius: '1px', backgroundColor: 'rgba(150,202,69,0.4)' }} />
            </div>

            {/* Stacked card deck */}
            <FeaturedServices_DeckStack
              services={services}
              activeIndex={activeIndex}
              getImage={getImage}
            />

            {/* Pagination dots */}
            <div className="fs-pagination">
              {services.map((_, idx) => (
                <button
                  key={idx}
                  ref={el => { dotRefs.current[idx] = el; }}
                  onClick={() => { setIsPaused(true); goTo(idx); setTimeout(() => setIsPaused(false), 5000); }}
                  aria-label={`Go to slide ${idx + 1}`}
                  style={{
                    height: '3px', borderRadius: '2px', border: 'none',
                    cursor: 'pointer', padding: 0,
                    /* initial state — GSAP will update width+color */
                    width: '16px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                  }}
                />
              ))}
            </div>

            {/* Progress bar */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              height: '3px', overflow: 'hidden', borderRadius: '0 0 28px 28px', zIndex: 20,
            }}>
              <div
                ref={progressRef}
                style={{
                  height: '100%', width: '100%', borderRadius: '2px',
                  backgroundColor: 'rgba(150,202,69,0.8)',
                  transformOrigin: 'left center', transform: 'scaleX(0)',
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
const FeaturedServices_CARD_REST: { x: number; y: number; rotation: number; scale: number }[] = [
  { x:   0, y:  0, rotation:  0,   scale: 1    },
  { x:  -6, y:  5, rotation: -2,   scale: 0.97 },
  { x:   8, y: -4, rotation:  3,   scale: 0.94 },
  { x: -10, y:  8, rotation: -4,   scale: 0.91 },
  { x:   6, y:  6, rotation:  2.5, scale: 0.88 },
];
const FeaturedServices_CARD_FAN: { x: number; y: number; rotation: number; scale: number }[] = [
  { x:  -5, y: -12, rotation: -5,  scale: 1.02 },
  { x:  18, y:  10, rotation:  4,  scale: 0.98 },
  { x: -14, y: -15, rotation: -2,  scale: 1.00 },
  { x:  20, y:   8, rotation:  6,  scale: 0.99 },
  { x:  -8, y: -10, rotation: -3,  scale: 0.97 },
];
function FeaturedServices_DeckStack({
  services, activeIndex, getImage,
}: {
  services: any[];
  activeIndex: number;
  getImage: (s: any) => string;
}) {
  const n            = services.length;
  const wrapRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const arrowRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const animating    = useRef(false);
  const prevActive   = useRef(activeIndex);
  const mounted      = useRef(false);

  const posOf = (i: number, active: number) => ((i - active) % n + n) % n;

  const restOf = (pos: number) => FeaturedServices_CARD_REST[Math.min(pos, FeaturedServices_CARD_REST.length - 1)];

  /* Snap every card to rest positions without animation */
  const snapAll = useCallback((active: number) => {
    for (let i = 0; i < n; i++) {
      const el = wrapRefs.current[i];
      if (!el) continue;
      const pos = posOf(i, active);
      const r   = restOf(pos);
      gsap.set(el, { ...r, zIndex: n - pos, opacity: pos >= 4 ? 0 : 1, transformOrigin: 'center center' });
      el.style.pointerEvents = pos === 0 ? 'auto' : 'none';
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  /* Mount: stagger cards rising from far below, settle to rest */
  useEffect(() => {
    /* Start all cards well below the panel, invisible */
    for (let i = 0; i < n; i++) {
      const el = wrapRefs.current[i];
      if (!el) continue;
      gsap.set(el, { y: 180, x: 0, opacity: 0, scale: 0.88, rotation: 0, zIndex: n - i, transformOrigin: 'center center' });
      el.style.pointerEvents = 'none';
    }

    /* Back card enters first so front card lands on top last */
    const tl = gsap.timeline({
      onComplete: () => {
        snapAll(activeIndex);
        mounted.current = true;
      },
    });

    for (let i = n - 1; i >= 0; i--) {
      const el = wrapRefs.current[i];
      if (!el) continue;
      const pos = posOf(i, activeIndex);
      const r   = restOf(pos);
      /* back cards enter first, each 0.13s after the previous */
      const delay = (n - 1 - i) * 0.13;
      /* two-phase per card: rise from bottom → settle into stack position */
      tl.fromTo(el,
        { y: 180, opacity: 0, scale: 0.88 },
        {
          y: r.y - 6,       /* overshoot slightly above rest */
          opacity: pos >= 4 ? 0 : 1,
          scale: r.scale * 1.04,
          rotation: r.rotation * 0.3,
          zIndex: n - pos,
          duration: 0.58,
          ease: 'power4.out',
        },
        delay
      );
      /* settle: drop into exact rest position with a spring bounce */
      tl.to(el, {
        y: r.y, x: r.x,
        scale: r.scale,
        rotation: r.rotation,
        duration: 0.32,
        ease: 'back.out(1.8)',
        onComplete: () => { el.style.pointerEvents = pos === 0 ? 'auto' : 'none'; },
      }, delay + 0.58);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Physical card shuffle on every index change */
  useEffect(() => {
    if (!mounted.current) return;
    if (animating.current) {
      /* If already animating, snap immediately and restart */
      gsap.globalTimeline.clear();
      snapAll(activeIndex);
      prevActive.current = activeIndex;
      return;
    }
    animating.current = true;
    const prev = prevActive.current;
    const next = activeIndex;

    const tl = gsap.timeline({
      onComplete: () => {
        animating.current  = false;
        prevActive.current = next;
        /* Guarantee clean rest state */
        snapAll(next);
      },
    });

    /* ── STEP 1 (0s → 0.25s): Stack loosens — small spread ── */
    for (let i = 0; i < n; i++) {
      const el = wrapRefs.current[i];
      if (!el) continue;
      const pos = posOf(i, prev);
      const r   = restOf(pos);
      tl.to(el, {
        x: r.x + FeaturedServices_CARD_FAN[i % FeaturedServices_CARD_FAN.length].x * 0.35,
        y: r.y + FeaturedServices_CARD_FAN[i % FeaturedServices_CARD_FAN.length].y * 0.35,
        rotation: r.rotation + FeaturedServices_CARD_FAN[i % FeaturedServices_CARD_FAN.length].rotation * 0.4,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: true,
      }, 0);
    }

    /* ── STEP 2 (0.1s → 0.45s): Full fan-out ── */
    for (let i = 0; i < n; i++) {
      const el = wrapRefs.current[i];
      if (!el) continue;
      const fan = FeaturedServices_CARD_FAN[i % FeaturedServices_CARD_FAN.length];
      tl.to(el, {
        x: fan.x, y: fan.y, rotation: fan.rotation, scale: fan.scale,
        duration: 0.35,
        ease: 'power3.inOut',
        overwrite: true,
      }, 0.1);
    }

    /* ── STEP 3 (0.3s): Next card claims front z-index + micro scale-up ── */
    const nextEl = wrapRefs.current[next];
    if (nextEl) {
      tl.set(nextEl, { zIndex: n + 5 }, 0.3);
      tl.to(nextEl, { scale: 1.03, duration: 0.15, ease: 'power2.out', overwrite: true }, 0.3);
    }

    /* ── STEP 4 (0.45s → 0.85s): Collapse to new rest positions ── */
    for (let i = 0; i < n; i++) {
      const el = wrapRefs.current[i];
      if (!el) continue;
      const pos = posOf(i, next);
      const r   = restOf(pos);
      tl.to(el, {
        x: r.x, y: r.y, rotation: r.rotation, scale: r.scale,
        zIndex: n - pos,
        opacity: pos >= 4 ? 0 : 1,
        duration: 0.38,
        ease: 'back.out(1.3)',
        overwrite: true,
      }, 0.47);
    }

    /* Update pointer-events after animation completes */
    tl.call(() => {
      for (let i = 0; i < n; i++) {
        const el = wrapRefs.current[i];
        if (el) el.style.pointerEvents = posOf(i, next) === 0 ? 'auto' : 'none';
      }
    }, [], 0.85);

    prevActive.current = next;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  /* Hover lift on active card only */
  const onEnter = (i: number) => {
    if (animating.current) return;
    if (posOf(i, activeIndex) !== 0) return;
    gsap.to(wrapRefs.current[i],  { y: -8, scale: 1.02, duration: 0.28, ease: 'power2.out', overwrite: 'auto' });
    gsap.to(arrowRefs.current[i], { scale: 1.18, rotation: 8, duration: 0.25, ease: 'back.out(2)' });
  };
  const onLeave = (i: number) => {
    if (posOf(i, activeIndex) !== 0) return;
    gsap.to(wrapRefs.current[i],  { y: 0, scale: 1, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
    gsap.to(arrowRefs.current[i], { scale: 1, rotation: 0, duration: 0.3, ease: 'power2.out' });
  };

  return (
    <div className="fs-deck" style={{ zIndex: 10 }}>
      {services.map((svc, i) => (
        <div
          key={i}
          ref={el => { wrapRefs.current[i] = el; }}
          className="fs-deck-card"
          data-active={posOf(i, activeIndex) === 0 ? 'true' : 'false'}
          style={{
            willChange: 'transform, opacity',
            transformOrigin: 'center center',
          }}
          onMouseEnter={() => onEnter(i)}
          onMouseLeave={() => onLeave(i)}
        >
          {(() => {
            const pos    = posOf(i, activeIndex);
            const isGreen = i % 2 === 1;
            const bg     = isGreen ? '#96CA45' : '#fff';
            const accent = isGreen ? '#fff'    : '#96CA45';
            const title  = isGreen ? '#fff'    : '#111';
            const body   = isGreen ? 'rgba(255,255,255,0.85)' : '#444';
            return (
              <Link
                href={`/services/${svc?.slug || '#'}`}
                style={{ display: 'block', textDecoration: 'none' }}
                tabIndex={pos === 0 ? 0 : -1}
              >
                <div style={{
                  backgroundColor: bg,
                  borderRadius: '20px',
                  border: `3px solid ${accent}`,
                  overflow: 'hidden',
                  boxShadow: isGreen
                    ? '0 10px 36px rgba(150,202,69,0.35)'
                    : '0 10px 36px rgba(0,0,0,0.22)',
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getImage(svc)}
                    alt={svc?.title || 'Service'}
                    className="fs-deck-card-img"
                    loading="lazy"
                  />

                  {/* Text below the image */}
                  <div style={{ padding: 'clamp(10px,1.4vw,16px)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <h3 style={{
                      fontFamily: "'Courier New', monospace", fontWeight: 900,
                      fontSize: 'clamp(13px,1.5vw,18px)', color: title,
                      margin: 0, lineHeight: 1.2,
                    }}>
                      {svc?.title || 'Course Name'}
                    </h3>
                    <p style={{
                      fontSize: 'clamp(10px,0.88vw,13px)', color: body,
                      lineHeight: 1.6, margin: 0,
                      display: '-webkit-box', WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {svc?.description || ''}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <div
                        ref={el => { arrowRefs.current[i] = el; }}
                        style={{
                          width: '34px', height: '34px', borderRadius: '10px',
                          backgroundColor: accent,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: isGreen
                            ? '0 4px 14px rgba(255,255,255,0.3)'
                            : '0 4px 14px rgba(150,202,69,0.45)',
                        }}
                      >
                        <ArrowUpRight style={{ width: '16px', height: '16px', color: isGreen ? '#96CA45' : '#fff' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })()}
        </div>
      ))}
    </div>
  );
}
/* === END OF FeaturedServices.tsx === */

/* =========================================================================
   START OF WhySection.tsx
   ========================================================================= */
const WhySection_FS = "'Great Day Personal Use','Brush Script MT',cursive";
const WhySection_CW = 237.6, WhySection_CH = 238.48;
const WhySection_BRACKETS = [
  { left: 89.39, top: 0,      w: 148.21, h: 147.66, entryDelay: 0.55, floatDelay: 1.2,  floatDur: 3.4 },
  { left: 44.23, top: 86.59,  w: 107.92, h: 107.52, entryDelay: 0.70, floatDelay: 1.4,  floatDur: 2.9 },
  { left: 0,     top: 151.64, w: 87.16,  h: 86.83,  entryDelay: 0.85, floatDelay: 1.55, floatDur: 3.7 },
];
const WhySection_BRAND_TEXT = 'GrowMedLink';
const WhySection_WHY_POINTS = [
  { icon: '🎓', text: 'Expert-led training by internationally licensed nurses' },
  { icon: '🌍', text: 'Personalised pathway support for 20+ countries' },
  { icon: '📋', text: 'Step-by-step licensure guidance from day one' },
  { icon: '🏆', text: '96% first-attempt pass rate across all programmes' },
];
function WhySection() {
  const sectionRef    = useRef<HTMLElement>(null);
  const cardRef       = useRef<HTMLDivElement>(null);
  const imgWrapRef    = useRef<HTMLDivElement>(null);
  const wipeRef       = useRef<HTMLDivElement>(null);
  const imgInnerRef   = useRef<HTMLDivElement>(null);
  const bracketRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const bracketsWrap  = useRef<HTMLDivElement>(null);
  const whyLabelRef   = useRef<HTMLDivElement>(null);
  const whyWordRef    = useRef<HTMLSpanElement>(null);
  const charRefs      = useRef<(HTMLSpanElement | null)[]>([]);
  const underlineRef  = useRef<HTMLSpanElement>(null);
  const bodyRef       = useRef<HTMLParagraphElement>(null);
  const pointRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const triggeredRef  = useRef(false);

  /* ── Cursor trail — desktop mouse only ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

    const SRC        = `${window.location.origin}/cursor-trail.png`;
    const SIZE       = 96;
    const TRAIL_SIZE = 70;
    const MAX_TRAIL  = 12;
    const EVERY_MS   = 55;
    const OFFSET     = 18;
    const MAX_ROT    = 8;

    const makeNode = (s: number, z: number) => {
      const d = document.createElement('div');
      d.style.cssText = `position:fixed;top:0;left:0;width:${s}px;height:${s}px;`
        + `pointer-events:none;user-select:none;will-change:transform,opacity;`
        + `z-index:${z};background:url('${SRC}') center/contain no-repeat;opacity:0;`;
      return d;
    };

    const main = makeNode(SIZE, 9999);
    document.body.appendChild(main);
    gsap.set(main, { x: -SIZE * 3, y: -SIZE * 3, scale: 0.85, rotation: 0, opacity: 0 });

    const qX  = gsap.quickTo(main, 'x',        { duration: 0.5,  ease: 'power3.out' });
    const qY  = gsap.quickTo(main, 'y',        { duration: 0.5,  ease: 'power3.out' });
    const qRt = gsap.quickTo(main, 'rotation', { duration: 0.55, ease: 'power3.out' });
    const qSc = gsap.quickTo(main, 'scale',    { duration: 0.35, ease: 'power3.out' });
    const qOp = gsap.quickTo(main, 'opacity',  { duration: 0.25, ease: 'power2.out' });

    let inside = false, mx = 0, my = 0, prevMx = 0, velRot = 0, lastSpawn = 0;
    let trails: HTMLDivElement[] = [];

    const spawnTrail = (x: number, y: number, rot: number) => {
      if (trails.length >= MAX_TRAIL) {
        const d = trails.shift(); d?.parentNode?.removeChild(d);
      }
      const node = makeNode(TRAIL_SIZE, 9998);
      document.body.appendChild(node);
      trails.push(node);
      gsap.set(node, { x: x + OFFSET, y: y + OFFSET, rotation: rot * 0.35, scale: 0.7, opacity: 0.36 });
      gsap.to(node, { opacity: 0, scale: 0.4, duration: 0.5, ease: 'power2.out',
        onComplete: () => { node.parentNode?.removeChild(node); trails = trails.filter(n => n !== node); }
      });
    };

    const tick: gsap.TickerCallback = () => {
      if (!inside) return;
      const vx = mx - prevMx; prevMx = mx;
      velRot = velRot * 0.82 + Math.max(-MAX_ROT, Math.min(MAX_ROT, vx * 2.5)) * 0.18;
      qX(mx + OFFSET); qY(my + OFFSET); qRt(velRot);
    };
    gsap.ticker.add(tick);

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      const now = performance.now();
      if (now - lastSpawn < EVERY_MS) return;
      lastSpawn = now;
      spawnTrail(
        (gsap.getProperty(main, 'x') as number) - OFFSET,
        (gsap.getProperty(main, 'y') as number) - OFFSET,
        velRot
      );
    };

    const onEnter = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY; prevMx = mx;
      gsap.set(main, { x: mx + OFFSET, y: my + OFFSET });
      inside = true;
      section.style.cursor = 'none';
      qOp(1); qSc(1);
    };

    const onLeave = () => {
      inside = false;
      section.style.cursor = '';
      qOp(0); qSc(0.85); velRot = 0; qRt(0);
      const copy = [...trails]; trails = [];
      copy.forEach(n => gsap.to(n, { opacity: 0, duration: 0.15,
        onComplete: () => n.parentNode?.removeChild(n) }));
    };

    section.addEventListener('mousemove',  onMove);
    section.addEventListener('mouseenter', onEnter as EventListener);
    section.addEventListener('mouseleave', onLeave);

    return () => {
      section.removeEventListener('mousemove',  onMove);
      section.removeEventListener('mouseenter', onEnter as EventListener);
      section.removeEventListener('mouseleave', onLeave);
      section.style.cursor = '';
      gsap.ticker.remove(tick);
      gsap.killTweensOf(main);
      main.parentNode?.removeChild(main);
      trails.forEach(n => n.parentNode?.removeChild(n));
      trails = [];
    };
  }, []);

  /* ── rAF-throttled scroll parallax ── */
  useEffect(() => {
    const card    = cardRef.current;
    const imgWrap = imgWrapRef.current;
    const bWrap   = bracketsWrap.current;
    if (!card || !imgWrap || !bWrap) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const r = card.getBoundingClientRect();
      const par = r.top + r.height / 2 - window.innerHeight / 2;
      /* skip parallax on very small screens — layout is stacked, no room */
      if (window.innerWidth >= 768) {
        gsap.set(imgWrap, { y: par * -0.045 });
        gsap.set(bWrap,   { y: par *  0.022 });
      } else {
        gsap.set(imgWrap, { y: 0 });
        gsap.set(bWrap,   { y: 0 });
      }
    };
    const onScrollResize = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScrollResize, { passive: true });
    window.addEventListener('resize', onScrollResize, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScrollResize);
      window.removeEventListener('resize', onScrollResize);
    };
  }, []);

  /* ── Scroll-triggered entrance ── */
  useEffect(() => {
    const card  = cardRef.current;
    const wipe  = wipeRef.current;
    const inner = imgInnerRef.current;
    if (!card || !wipe || !inner) return;

    /* Hide everything via GSAP before viewport enters */
    gsap.set(card,  { opacity: 0, y: 80, scale: 0.94 });
    gsap.set(wipe,  { scaleX: 1, transformOrigin: 'right center' });
    gsap.set(inner, { scale: 1.14 });
    gsap.set(whyLabelRef.current,  { opacity: 0, x: -36 });
    gsap.set(whyWordRef.current,   { opacity: 0, y: 36 });
    gsap.set(charRefs.current.filter(Boolean), { opacity: 0, y: 32 });
    gsap.set(underlineRef.current, { scaleX: 0, transformOrigin: 'left center' });
    gsap.set(bodyRef.current,      { opacity: 0, y: 20 });
    gsap.set(pointRefs.current.filter(Boolean), { opacity: 0, x: 32 });
    bracketRefs.current.forEach(el => { if (el) gsap.set(el, { scale: 0, transformOrigin: 'top right' }); });

    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || triggeredRef.current) return;
      triggeredRef.current = true;
      io.disconnect();

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      /* 1. Card rises from below */
      tl.to(card, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'back.out(1.15)' }, 0);

      /* 2. Image wipe: scaleX 1→0 sweeps left revealing photo + Ken Burns */
      tl.to(wipe,  { scaleX: 0, duration: 1.15, ease: 'power3.inOut' }, 0.18);
      tl.to(inner, { scale: 1,  duration: 1.5,  ease: 'power2.out'   }, 0.18);

      /* 3. Handwritten "Why choose us" label slides in */
      tl.to(whyLabelRef.current, { opacity: 1, x: 0, duration: 0.6, ease: 'back.out(1.4)' }, 0.42);

      /* 4. "Why" word drops in */
      tl.to(whyWordRef.current, { opacity: 1, y: 0, duration: 0.55, ease: 'back.out(1.3)' }, 0.58);

      /* 5. "GrowMedLink" character wave */
      tl.to(charRefs.current.filter(Boolean), {
        opacity: 1, y: 0, duration: 0.42, stagger: 0.038, ease: 'back.out(1.5)',
      }, 0.72);

      /* 6. Underline draws left → right */
      tl.to(underlineRef.current, { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, 1.1);

      /* 7. Body text */
      tl.to(bodyRef.current, { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, 0.92);

      /* 8. Why points stagger in from right */
      tl.to(pointRefs.current.filter(Boolean), {
        opacity: 1, x: 0, duration: 0.48, stagger: 0.1, ease: 'back.out(1.3)',
      }, 1.05);

      /* 9. Brackets spring in then float (float only on desktop) */
      const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
      bracketRefs.current.forEach((el, i) => {
        if (!el) return;
        const b = WhySection_BRACKETS[i];
        tl.to(el, { scale: 1, duration: 0.62, ease: 'back.out(1.7)' }, b.entryDelay);
        if (!isTouch) {
          tl.call(() => {
            gsap.to(el, { y: -5, duration: b.floatDur / 2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
          }, [], b.entryDelay + 0.65);
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });

    io.observe(card);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-white flex items-center justify-center"
      style={{ padding: 'clamp(32px,5vw,64px) clamp(12px,3vw,32px)' }}
    >
      <div ref={cardRef} className="why-card">

        {/* ── IMAGE: D-shape, wipe-reveal + Ken Burns + parallax ── */}
        <div ref={imgWrapRef} className="why-img-wrap">
          {/* Ken Burns inner wrapper */}
          <div ref={imgInnerRef} style={{ position: 'absolute', inset: 0, willChange: 'transform' }}>
            <Image
              src="/why-image.png"
              alt="Why GrowMedLink"
              fill
              className="object-cover object-center"
              priority
              onError={e => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
            />
          </div>
          {/* GSAP wipe overlay — slides away on scroll entrance */}
          <div
            ref={wipeRef}
            style={{
              position: 'absolute', inset: 0,
              background: '#F0F0F0',
              zIndex: 3,
              willChange: 'transform',
            }}
          />
        </div>

        {/* ── BRACKETS: spring + float ── */}
        <div
          ref={bracketsWrap}
          className="absolute pointer-events-none why-brackets-wrap"
          style={{
            /* positioned over the image/text boundary */
            left:   'clamp(28%, 30%, 32%)',
            top:    'clamp(60%, 70%, 76%)',
            width:  'clamp(10%, 16.5%, 20%)',
            /* height is aspect-ratio driven */
            aspectRatio: '1',
            zIndex: 10,
          }}
        >
          {WhySection_BRACKETS.map(({ left, top, w, h }, i) => (
            <div
              key={i}
              ref={el => { bracketRefs.current[i] = el; }}
              className="absolute"
              style={{
                left:   `${(left / WhySection_CW) * 100}%`,
                top:    `${(top  / WhySection_CH) * 100}%`,
                width:  `${(w    / WhySection_CW) * 100}%`,
                height: `${(h    / WhySection_CH) * 100}%`,
              }}
            >
              <div className="step-icon-wrap">
                <WhySection_BracketIcon />
              </div>
            </div>
          ))}
        </div>

        {/* ── RIGHT COLUMN: text content ── */}
        <div
          className="flex flex-col justify-center why-text-col"
          style={{
            flex: 1,
            padding: 'clamp(20px,3vw,48px) clamp(20px,4.5vw,64px) clamp(20px,3vw,48px) clamp(12px,2.5vw,32px)',
            minWidth: 0,
          }}
        >
          {/* Handwritten "Why choose us" label */}
          <div
            ref={whyLabelRef}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              marginBottom: 'clamp(4px,0.6vw,8px)',
            }}
          >
            <span style={{
              display: 'inline-block', width: 'clamp(22px,2.2vw,32px)',
              height: '2px', background: '#96CA45', borderRadius: '1px', flexShrink: 0,
            }} />
            <span style={{
              fontFamily: WhySection_FS,
              fontSize: 'clamp(15px,1.8vw,26px)',
              color: '#96CA45',
            }}>
              Why choose us
            </span>
          </div>

          {/* "Why" */}
          <span
            ref={whyWordRef}
            style={{
              display: 'block',
              fontFamily: "'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif",
              fontWeight: 400,
              fontSize: 'clamp(24px,4.2vw,58px)',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: '#252525',
            }}
          >
            Why
          </span>

          {/* "GrowMedLink" character wave */}
          <span
            style={{
              display: 'block',
              fontFamily: "'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif",
              fontWeight: 400,
              fontSize: 'clamp(24px,4.2vw,58px)',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: '#96CA45',
              marginBottom: 'clamp(8px,1.2vw,14px)',
            }}
          >
            {WhySection_BRAND_TEXT.split('').map((char, i) => (
              <span
                key={i}
                ref={el => { charRefs.current[i] = el; }}
                style={{ display: 'inline-block' }}
              >
                {char}
              </span>
            ))}
            {/* underline draws left → right via GSAP scaleX */}
            <span
              ref={underlineRef}
              style={{
                display: 'block', height: '2px',
                background: '#96CA45', borderRadius: '1px',
                width: '100%',
              }}
            />
          </span>

          {/* Body copy */}
          <p
            ref={bodyRef}
            className="why-body-text"
            style={{
              fontFamily: "'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif",
              fontSize: 'clamp(12px,1.1vw,14px)',
              lineHeight: 1.7,
              color: '#555',
              fontWeight: 400,
              maxWidth: '400px',
              textAlign: 'justify',
              marginBottom: 'clamp(12px,1.5vw,20px)',
            }}
          >
            GrowMedLink transforms nursing ambition into international careers. Through
            expert-led training, personalised mentorship, and step-by-step pathway support,
            we've helped thousands of nurses achieve licensure abroad.
          </p>

          {/* Why points */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px,0.8vw,12px)' }}>
            {WhySection_WHY_POINTS.map((pt, i) => (
              <div
                key={i}
                ref={el => { pointRefs.current[i] = el; }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 'clamp(7px,0.8vw,10px)' }}
              >
                <span style={{ fontSize: 'clamp(12px,1.2vw,16px)', lineHeight: 1, flexShrink: 0, marginTop: '2px' }}>
                  {pt.icon}
                </span>
                <span style={{
                  fontSize: 'clamp(10px,0.88vw,13px)', color: '#333', lineHeight: 1.55,
                  fontFamily: "'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif",
                }}>
                  {pt.text}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
function WhySection_BracketIcon() {
  return (
    <svg
      width="100%" height="100%"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d={[
          'M 0,18.5',
          'Q 0,0 18.5,0',
          'L 88,0',
          'Q 100,0 100,12',
          'L 100,81.5',
          'Q 100,100 81.5,100',
          'Q 63,100 63,81.5',
          'L 63,42',
          'Q 63,37 58,37',
          'L 18.5,37',
          'Q 0,37 0,18.5',
          'Z',
        ].join(' ')}
        fill="#96CA45"
      />
    </svg>
  );
}
/* === END OF WhySection.tsx === */

/* =========================================================================
   START OF ReviewsSection.tsx
   ========================================================================= */
interface ReviewsSection_ReviewItem {
  _id: string;
  studentName: string;
  studentImage?: string;
  rating: number;
  comment: string;
  service?: string | null;
  date?: string;
  createdAt: string;
}
const ReviewsSection_FALLBACK: ReviewsSection_ReviewItem[] = [
  { _id:'f1', studentName:'Bruce Wayne',      studentImage:'', rating:5, comment:'GrowMedLink was instrumental in my transition to study nursing abroad. The guidance is top-notch and cleared up all my doubts about the registry requirements!',      service:'Immigration Consultation', createdAt: new Date('2025-12-25T10:10:00Z').toISOString() },
];
const ReviewsSection_AUTO_MS = 6000;
const ReviewsSection_STYLES = `
  /* ── Keyframes ── */
  @keyframes rvs-dot-ring {
    0%   { box-shadow: 0 0 0 0px rgba(150,202,69,0.7); }
    70%  { box-shadow: 0 0 0 7px rgba(150,202,69,0);   }
    100% { box-shadow: 0 0 0 0px rgba(150,202,69,0);   }
  }
  @keyframes rvs-glow-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(150,202,69,0.0), inset 0 0 0 1px rgba(150,202,69,0.09); }
    50%       { box-shadow: 0 0 18px 4px rgba(150,202,69,0.12), inset 0 0 0 1px rgba(150,202,69,0.22); }
  }
  @keyframes rvs-map-float {
    0%, 100% { transform: translateY(0px) scale(1); }
    50%       { transform: translateY(-5px) scale(1.06); }
  }
  @keyframes rvs-pct-count {
    from { opacity: 0; transform: translateY(8px) scale(0.85); }
    to   { opacity: 1; transform: translateY(0)   scale(1);    }
  }
  @keyframes rvs-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }

  /* ── Section shell ── */
  .rvs-section { background: #fff; padding: clamp(24px,4vw,40px) 0 clamp(40px,6vw,60px); }
  .rvs-section .rvs-outer {
    max-width: 1200px; margin: 0 auto;
    padding: 0 clamp(12px,3vw,24px); position: relative;
  }

  /* ── Wave dots ── */
  .rvs-section .rvs-dots { position: relative; height: clamp(26px,3.5vw,38px); margin-bottom: 6px; }
  .rvs-section .rvs-dot {
    position: absolute;
    width: clamp(6px,1vw,9px); height: clamp(6px,1vw,9px);
    border-radius: 50%; background: #96CA45;
    animation: rvs-dot-ring 2.2s ease-out infinite;
  }
  .rvs-section .rvs-dot:nth-child(1)  { animation-delay: 0.00s; }
  .rvs-section .rvs-dot:nth-child(2)  { animation-delay: 0.22s; }
  .rvs-section .rvs-dot:nth-child(3)  { animation-delay: 0.44s; }
  .rvs-section .rvs-dot:nth-child(4)  { animation-delay: 0.66s; }
  .rvs-section .rvs-dot:nth-child(5)  { animation-delay: 0.88s; }
  .rvs-section .rvs-dot:nth-child(6)  { animation-delay: 1.10s; }
  .rvs-section .rvs-dot:nth-child(7)  { animation-delay: 1.32s; }
  .rvs-section .rvs-dot:nth-child(8)  { animation-delay: 1.54s; }
  .rvs-section .rvs-dot:nth-child(9)  { animation-delay: 1.76s; }
  .rvs-section .rvs-dot:nth-child(10) { animation-delay: 1.98s; }

  /* ── Two-column grid ── */
  .rvs-section .rvs-grid {
    display: grid;
    grid-template-columns: 38fr 62fr;
    gap: clamp(12px,2vw,20px);
    align-items: start;
  }

  /* ══════════════════════════════════════
     LEFT panel
  ══════════════════════════════════════ */
  .rvs-section .rvs-left {
    height: clamp(320px,45vw,500px);
    background: #1e1e1e;
    border-radius: clamp(10px,1.5vw,16px);
    position: relative; overflow: hidden;
    display: flex; flex-direction: column; justify-content: space-between;
    /* subtle green inner rim that pulses */
    animation: rvs-glow-pulse 4s ease-in-out infinite;
  }
  /* decorative corner sparkle lines */
  .rvs-section .rvs-left::before,
  .rvs-section .rvs-left::after {
    content: '';
    position: absolute;
    width: 80px; height: 80px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(150,202,69,0.12) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .rvs-section .rvs-left::before { top: -20px; left: -20px; }
  .rvs-section .rvs-left::after  { bottom: -20px; right: -20px; }

  /* ── 2×2 card grid ── */
  .rvs-section .rvs-country-grid {
    flex: 1; display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(6px,1vw,12px);
    padding: clamp(14px,2.2vw,24px) clamp(14px,2.2vw,24px) clamp(8px,1.2vw,12px);
    position: relative; z-index: 1;
  }

  /* individual country card */
  .rvs-section .rvs-ccard {
    background: rgba(255,255,255,0.055);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: clamp(8px,1vw,12px);
    padding: clamp(10px,1.5vw,18px) clamp(8px,1.2vw,14px);
    display: flex; flex-direction: column; align-items: center; justify-content: space-between;
    gap: clamp(5px,0.7vw,9px);
    cursor: default;
    position: relative; overflow: hidden;
    /* base transition for hover */
    transition:
      background    0.3s ease,
      border-color  0.3s ease,
      transform     0.3s cubic-bezier(.22,.68,0,1.2),
      box-shadow    0.3s ease;
  }

  /* shimmer sweep on hover */
  .rvs-section .rvs-ccard::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(
      105deg,
      transparent 30%,
      rgba(150,202,69,0.10) 50%,
      transparent 70%
    );
    background-size: 200% 100%;
    background-position: -200% center;
    transition: background-position 0s;
    pointer-events: none;
  }
  .rvs-section .rvs-ccard:hover::before {
    animation: rvs-shimmer 0.65s ease forwards;
  }

  .rvs-section .rvs-ccard:hover {
    background:    rgba(150,202,69,0.10);
    border-color:  rgba(150,202,69,0.35);
    transform:     translateY(-4px) scale(1.02);
    box-shadow:    0 12px 28px rgba(0,0,0,0.25), 0 0 0 1px rgba(150,202,69,0.2);
  }

  /* map image wrapper */
  .rvs-section .rvs-ccard-map {
    width: clamp(38px,5.5vw,60px); height: clamp(38px,5.5vw,60px);
    position: relative; flex-shrink: 0;
    animation: rvs-map-float 4s ease-in-out infinite;
    will-change: transform;
  }
  .rvs-section .rvs-ccard:nth-child(2) .rvs-ccard-map { animation-delay: 1s;   }
  .rvs-section .rvs-ccard:nth-child(3) .rvs-ccard-map { animation-delay: 0.5s; }
  .rvs-section .rvs-ccard:nth-child(4) .rvs-ccard-map { animation-delay: 1.5s; }
  .rvs-section .rvs-ccard:hover .rvs-ccard-map { animation-play-state: paused; }
  @media (hover: none) and (pointer: coarse) {
    .rvs-section .rvs-dot { animation: none !important; }
    .rvs-section .rvs-left { animation: none !important; }
    .rvs-section .rvs-ccard-map { animation: none !important; will-change: auto; }
  }

  /* country label */
  .rvs-section .rvs-ccard-name {
    font-family:'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size: clamp(10px,0.85vw,12px); font-weight: 600;
    color: rgba(255,255,255,0.65);
    text-align: center; letter-spacing: 0.03em; line-height: 1.2;
    transition: color 0.25s;
  }
  .rvs-section .rvs-ccard:hover .rvs-ccard-name { color: rgba(255,255,255,0.95); }

  /* percentage number */
  .rvs-section .rvs-ccard-pct {
    font-family:'Haffer VF-TRIAL','Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size: clamp(20px,2.8vw,38px); font-weight: 500; color: #96CA45;
    letter-spacing: -0.02em; line-height: 1;
    transition: transform 0.25s cubic-bezier(.22,.68,0,1.2), text-shadow 0.25s;
  }
  .rvs-section .rvs-ccard:hover .rvs-ccard-pct {
    transform: scale(1.08);
    text-shadow: 0 0 18px rgba(150,202,69,0.5);
  }

  /* GSAP entrance: cards start invisible */
  .rvs-section .rvs-ccard.rvs-ccard-hidden {
    opacity: 0; transform: translateY(22px) scale(0.92);
  }

  /* ── Left footer ── */
  .rvs-section .rvs-left-footer {
    padding: clamp(12px,2vw,20px) clamp(16px,3vw,28px);
    border-top: 1px solid rgba(255,255,255,0.07);
    text-align: center; position: relative; z-index: 1;
  }
  .rvs-section .rvs-connect {
    font-family:'Haffer XH Mono-TRIAL','Courier New',monospace;
    font-size: clamp(10px,1vw,13px); font-weight:500;
    color: rgba(255,255,255,0.45); letter-spacing:0.09em; text-transform: uppercase;
    margin-bottom: 3px;
  }
  .rvs-section .rvs-community {
    font-family:'Great Day Personal Use','Brush Script MT',cursive;
    font-size: clamp(15px,1.7vw,21px); font-weight:400; color:#96CA45;
  }

  /* ══════════════════════════════════════
     RIGHT panel
  ══════════════════════════════════════ */
  .rvs-section .rvs-right {
    height: clamp(320px,45vw,500px);
    background: #F0F0F0; border-radius: clamp(10px,1.5vw,16px);
    position: relative; overflow: hidden;
  }
  .rvs-section .rvs-heading {
    position: absolute; top: clamp(14px,2.2vw,22px);
    left: 50%; transform: translateX(calc(-50% - 15px));
    font-family:'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size: clamp(28px,4.2vw,56px); font-weight:400;
    line-height: 1.22; letter-spacing: -0.03em;
    color: #252525; white-space: nowrap;
  }
  .rvs-section .rvs-heading-green { color: #96CA45; }
  .rvs-section .rvs-hw { display: inline-block; }

  .rvs-section .rvs-carousel-row {
    position: absolute;
    left: clamp(16px,3.5vw,45px); top: clamp(80px,10vw,115px); right: clamp(12px,2vw,24px);
    display: flex; align-items: center; gap: clamp(10px,1.5vw,20px);
  }

  /* review card */
  .rvs-section .rvs-card {
    width: 100%; height: clamp(240px,27vw,350px);
    background: #155BA9; border-radius: clamp(8px,1vw,12px);
    position: relative; overflow: hidden;
    will-change: transform;
  }
  .rvs-section .rvs-deco {
    position: absolute; left: clamp(14px,2.5vw,30px); top: 0;
    display: flex; gap: clamp(6px,0.8vw,9px);
  }
  .rvs-section .rvs-deco-strip {
    width: clamp(22px,3vw,40px); height: clamp(70px,8.5vw,100px);
    border-radius: 0 0 6px 6px;
  }
  .rvs-section .rvs-deco-white { background: #fff; }
  .rvs-section .rvs-deco-green { background: #96CA45; }
  .rvs-section .rvs-avatar {
    position: absolute; left: clamp(14px,2.8vw,35px); top: clamp(46px,5.5vw,65px);
    width: clamp(52px,6.5vw,80px); height: clamp(52px,6.5vw,80px);
    border-radius: 50%; background: #fff; box-shadow: 0 -6px 8px rgba(0,0,0,0.12);
    overflow: hidden; z-index: 2;
    display: flex; align-items: center; justify-content: center;
  }
  .rvs-section .rvs-text {
    position: absolute;
    right: clamp(12px,2vw,25px); top: clamp(46px,5.5vw,65px);
    width: clamp(140px,20vw,280px); height: clamp(110px,14vw,190px);
    overflow: hidden;
    font-family:'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size: clamp(11px,1.1vw,13.5px); font-weight:400; line-height:165%;
    letter-spacing:0.01em; text-transform:capitalize;
    color:#fff; text-align:right; padding-right:4px;
  }
  .rvs-section .rvs-name {
    position: absolute; left: clamp(14px,2.5vw,30px); top: clamp(112px,13.5vw,160px);
    font-family:'Great Day Personal Use','Brush Script MT',cursive;
    font-size: clamp(15px,1.6vw,20px); font-weight:400; color:#96CA45;
  }
  .rvs-section .rvs-role {
    position: absolute; left: clamp(14px,2.5vw,30px); top: clamp(133px,15.8vw,188px);
    font-family:'Haffer VF-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size: clamp(11px,1.1vw,14px); color:#fff;
    max-width: clamp(110px,13vw,170px); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
  }
  .rvs-section .rvs-date {
    position: absolute; left: clamp(14px,2.5vw,30px); bottom: clamp(14px,2.2vw,30px);
    font-family:'Haffer VF-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size: clamp(10px,1.1vw,14px); color: rgba(255,255,255,0.6);
  }
  .rvs-section .rvs-time {
    position: absolute; right: clamp(12px,2vw,25px); bottom: clamp(14px,2.2vw,30px);
    font-family:'Haffer VF-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size: clamp(10px,1.1vw,14px); text-align:right; color: rgba(255,255,255,0.6);
  }

  .rvs-section .rvs-indicator { display:flex; flex-direction:column; align-items:flex-end; gap:clamp(8px,1vw,12px); flex-shrink:0; }
  .rvs-section .rvs-bar { border-radius:6px; cursor:pointer; transition: opacity 0.2s; }
  .rvs-section .rvs-bar:hover { opacity: 0.65; }

  .rvs-section .rvs-write-btn { position: absolute; right: clamp(14px,2vw,24px); top: clamp(28px,3.5vw,40px); z-index: 10; }

  .rvs-glass {
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(0,0,0,0.08);
    box-shadow: 0 24px 60px rgba(0,0,0,0.15);
  }

  /* ══════════════════════════════════════
     RESPONSIVE
  ══════════════════════════════════════ */

  /* ── Tablet 768–1023px ── */
  @media (max-width: 1023px) {
    .rvs-section .rvs-grid { grid-template-columns: 1fr; }
    .rvs-section .rvs-left { height: auto; min-height: clamp(280px,48vw,400px); }
    .rvs-section .rvs-right { height: auto; overflow: visible; padding: clamp(20px,3.5vw,36px) clamp(16px,3vw,28px) clamp(28px,5vw,44px); }
    .rvs-section .rvs-heading { position: relative; top: auto; left: auto; transform: none; font-size: clamp(32px,5.5vw,52px); line-height: 1.15; text-align: center; display: block; margin-bottom: clamp(20px,3vw,32px); white-space: normal; }
    .rvs-section .rvs-carousel-row { position: relative; top: auto; left: auto; right: auto; justify-content: center; }
    .rvs-section .rvs-card { height: clamp(260px,36vw,360px); }
    .rvs-section .rvs-write-btn { position: relative; right: auto; top: auto; margin-bottom: 16px; display: inline-flex; }
    .rvs-section .rvs-indicator { flex-direction: row; align-items: center; gap: 10px; }
  }

  /* desktop: show desktop card, hide mobile card */
  @media (min-width: 768px) {
    .rvs-section .rvs-card-desktop { display: block; }
    .rvs-section .rvs-card-mobile  { display: none; }
  }

  /* ── Mobile card (clean flex layout, no absolute children) ── */
  .rvs-section .rvs-card-mobile {
    background: #155BA9; border-radius: 12px; overflow: hidden;
    display: none; flex-direction: column; width: 100%; box-sizing: border-box;
    will-change: transform;
  }
  .rvs-section .rvs-card-mobile .mob-deco { display: flex; gap: 8px; padding-left: 16px; }
  .rvs-section .rvs-card-mobile .mob-strip { width: 28px; height: 68px; border-radius: 0 0 6px 6px; }
  .rvs-section .rvs-card-mobile .mob-top { display: flex; align-items: flex-start; gap: 12px; padding: 12px 16px 0; }
  .rvs-section .rvs-card-mobile .mob-avatar { width: 50px; height: 50px; border-radius: 50%; background: #fff; overflow: hidden; flex-shrink: 0; display: flex; align-items: center; justify-content: center; box-shadow: 0 -4px 8px rgba(0,0,0,0.12); }
  .rvs-section .rvs-card-mobile .mob-comment { font-family:'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif; font-size: 12px; line-height: 1.6; color: #fff; flex: 1; }
  .rvs-section .rvs-card-mobile .mob-name { font-family:'Great Day Personal Use','Brush Script MT',cursive; font-size: 16px; color: #96CA45; padding: 10px 16px 0; display: block; }
  .rvs-section .rvs-card-mobile .mob-role { font-family:'Haffer VF-TRIAL','Helvetica Neue',Arial,sans-serif; font-size: 11px; color: #fff; padding: 2px 16px 0; display: block; }
  .rvs-section .rvs-card-mobile .mob-footer { display: flex; padding: 10px 16px 14px; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 10px; }
  .rvs-section .rvs-card-mobile .mob-date { font-family:'Haffer VF-TRIAL','Helvetica Neue',Arial,sans-serif; font-size: 10px; color: rgba(255,255,255,0.6); }

  /* ── Mobile ≤ 767px ── */
  @media (max-width: 767px) {
    .rvs-section .rvs-outer { padding: 0 12px; }
    .rvs-section .rvs-write-btn { position: relative !important; right: auto !important; top: auto !important; margin-bottom: 12px !important; display: inline-flex !important; }
    .rvs-section .rvs-left { height: auto !important; min-height: 0 !important; }
    .rvs-section .rvs-country-grid { gap: 8px !important; padding: 14px 14px 8px !important; }
    .rvs-section .rvs-ccard { padding: 10px 8px !important; gap: 6px !important; }
    .rvs-section .rvs-ccard-map { width: 40px !important; height: 40px !important; }
    .rvs-section .rvs-ccard-pct { font-size: 22px !important; }
    .rvs-section .rvs-ccard-name { font-size: 10px !important; }
    .rvs-section .rvs-right { height: auto !important; overflow: visible !important; padding: 18px 14px 20px !important; }
    .rvs-section .rvs-heading { position: relative !important; top: auto !important; left: auto !important; transform: none !important; font-size: 26px !important; white-space: normal !important; text-align: center !important; display: block !important; margin-bottom: 14px !important; }
    .rvs-section .rvs-carousel-row { position: relative !important; top: auto !important; left: auto !important; right: auto !important; flex-direction: column !important; gap: 12px !important; width: 100% !important; align-items: stretch !important; }
    .rvs-section .rvs-indicator { flex-direction: row !important; justify-content: center !important; align-items: center !important; gap: 8px !important; }
    /* hide desktop card, show mobile card */
    .rvs-section .rvs-card-desktop { display: none !important; }
    .rvs-section .rvs-card-mobile  { display: flex !important; }
  }

  /* ── Tiny ≤ 359px ── */
  @media (max-width: 359px) {
    .rvs-section .rvs-outer { padding: 0 10px; }
    .rvs-section .rvs-heading { font-size: 22px !important; }
    .rvs-section .rvs-ccard-pct { font-size: 18px !important; }
    .rvs-section .rvs-ccard-map { width: 32px !important; height: 32px !important; }
  }
`;
const ReviewsSection_HERO_COUNTRIES = [
  { name: 'Australia',  mapSrc: '/australia-map.png',     percentage: 54 },
  { name: 'India',      mapSrc: '/india-map.png',         percentage: 28 },
  { name: 'S. America', mapSrc: '/south-america-map.png', percentage: 25 },
  { name: 'Africa',     mapSrc: '/africa-map.png',        percentage: 12 },
];
const ReviewsSection_GREEN_TINT = 'brightness(0) saturate(100%) invert(68%) sepia(60%) saturate(500%) hue-rotate(40deg) brightness(110%)';
function ReviewsSection({ initialReviews = [] }: { initialReviews?: ReviewsSection_ReviewItem[] }) {
  const [reviews, setReviews]           = useState<ReviewsSection_ReviewItem[]>(initialReviews);
  const [activeIdx, setActiveIdx]       = useState(0);
  const timerRef                        = useRef<ReturnType<typeof setInterval> | null>(null);

  /* refs for GSAP */
  const sectionRef   = useRef<HTMLDivElement>(null);
  const leftRef      = useRef<HTMLDivElement>(null);
  const rightRef     = useRef<HTMLDivElement>(null);
  const connectRef   = useRef<HTMLParagraphElement>(null);
  const communityRef = useRef<HTMLParagraphElement>(null);
  const hw1Ref       = useRef<HTMLSpanElement>(null);
  const hw2Ref       = useRef<HTMLSpanElement>(null);
  const carouselRef  = useRef<HTMLDivElement>(null);
  const cardClipRef  = useRef<HTMLDivElement>(null);
  const cardRef      = useRef<HTMLDivElement>(null);
  const strip1Ref    = useRef<HTMLDivElement>(null);
  const strip2Ref    = useRef<HTMLDivElement>(null);
  const writeBtnRef  = useRef<HTMLDivElement>(null);
  const dotRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const barRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const ccardRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const triggeredRef = useRef(false);

  /* modal */
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [formData, setFormData]         = useState({ studentName:'', rating:5, comment:'', service:'' });
  const [photoMedia, setPhotoMedia]     = useState<IMedia | null>(null);
  const [hoverRating, setHoverRating]   = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError]   = useState<string | null>(null);

  /* ── fetch reviews ── */
  useEffect(() => {
    if (initialReviews.length > 0) return;
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${base}/api/reviews`).then(r => r.json())
      .then(d => { if (d?.success && d?.data?.length > 0) setReviews(d.data); })
      .catch(() => {});
  }, [initialReviews]);

  const list    = reviews.length > 0 ? reviews : ReviewsSection_FALLBACK;
  const listLen = list.length;

  /* ── GSAP scroll-triggered entrance ── */
  useEffect(() => {
    const els = {
      left:      leftRef.current,
      right:     rightRef.current,
      connect:   connectRef.current,
      community: communityRef.current,
      hw1:       hw1Ref.current,
      hw2:       hw2Ref.current,
      carousel:  carouselRef.current,
      card:      cardRef.current,
      strip1:    strip1Ref.current,
      strip2:    strip2Ref.current,
      writeBtn:  writeBtnRef.current,
    };
    if (!els.left || !els.right) return;

    /* On mobile skip entrance animation entirely — just show everything */
    if (window.innerWidth < 768) {
      triggeredRef.current = true;
      return;
    }

    gsap.set(els.left,      { opacity: 0, x: -56 });
    gsap.set(els.right,     { opacity: 0, x:  56 });
    gsap.set(els.connect,   { opacity: 0, y: 18 });
    gsap.set(els.community, { opacity: 0, y: 18 });
    gsap.set(els.hw1,       { opacity: 0, y: 34 });
    gsap.set(els.hw2,       { opacity: 0, y: 34 });
    gsap.set(els.carousel,  { opacity: 0, y: 24 });
    gsap.set(els.strip1,    { y: '-110%' });
    gsap.set(els.strip2,    { y: '-110%' });
    gsap.set(els.writeBtn,  { opacity: 0, x: 22 });
    dotRefs.current.forEach((d) => d && gsap.set(d, { scale: 0, opacity: 0, y: 0 }));
    ccardRefs.current.forEach((c) => c && gsap.set(c, { opacity: 0, y: 22, scale: 0.88 }));

    const trigger = () => {
      if (triggeredRef.current) return;
      triggeredRef.current = true;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      /* 1. Both panels slide in */
      tl.to(els.left,  { opacity: 1, x: 0, duration: 0.85 }, 0);
      tl.to(els.right, { opacity: 1, x: 0, duration: 0.85 }, 0.1);

      /* 2. Country cards stagger in */
      tl.to(ccardRefs.current.filter(Boolean), {
        opacity: 1, y: 0, scale: 1,
        duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)',
      }, 0.45);

      /* 3. Left footer text */
      tl.to(els.connect,   { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, 0.75);
      tl.to(els.community, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, 0.90);

      /* 4. Heading words drop in */
      tl.to(els.hw1, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.3)' }, 0.38);
      tl.to(els.hw2, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.3)' }, 0.54);

      /* 5. Carousel row rises */
      tl.to(els.carousel, { opacity: 1, y: 0, duration: 0.65 }, 0.52);

      /* 6. Deco strips drop */
      tl.to(els.strip1, { y: '0%', duration: 0.65 }, 0.72);
      tl.to(els.strip2, { y: '0%', duration: 0.65 }, 0.86);

      const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

      /* 7. Write-review button slides in */
      tl.to(els.writeBtn, { opacity: 1, x: 0, duration: 0.5, ease: 'back.out(1.4)' }, 0.6);
      if (!isTouch) {
        tl.call(() => {
          gsap.to(els.writeBtn, {
            boxShadow: '0 0 0 8px rgba(150,202,69,0)', duration: 1.4,
            ease: 'power2.out', repeat: -1, repeatDelay: 1.4,
          });
        }, [], 2.2);
      }

      /* 8. Dots pop in with stagger then wave loop (wave only on desktop) */
      tl.to(dotRefs.current.filter(Boolean), {
        scale: 1, opacity: 1, duration: 0.4, stagger: 0.055, ease: 'back.out(1.6)',
      }, 0.2);
      if (!isTouch) {
        tl.call(() => {
          dotRefs.current.forEach((d, i) => {
            if (!d) return;
            gsap.to(d, { y: -8, duration: 1.15, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.14 });
          });
        }, [], 0.9);
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) trigger();
    }, { threshold: 0.01 });

    if (sectionRef.current) io.observe(sectionRef.current);

    /* Fallback: if IO never fires (e.g. section already in view on load), trigger after 400ms */
    const fallback = setTimeout(trigger, 400);

    return () => { io.disconnect(); clearTimeout(fallback); };
  }, []);

  /* ── GSAP carousel: exit up-back, enter from below ── */
  const animateOut = useCallback((onDone: () => void) => {
    const card = cardRef.current;
    /* On mobile there is no desktop card to animate */
    if (!card || window.innerWidth < 768) { onDone(); return; }
    gsap.to(card, {
      y: '-60%', opacity: 0, scale: 0.88,
      duration: 0.38, ease: 'power2.in',
      onComplete: () => {
        gsap.set(card, { y: '70%', scale: 0.92 });
        onDone();
      },
    });
  }, []);

  const animateIn = useCallback(() => {
    const card = cardRef.current;
    if (!card || window.innerWidth < 768) return;
    gsap.to(card, { y: '0%', opacity: 1, scale: 1, duration: 0.48, ease: 'back.out(1.3)' });
  }, []);

  const goTo = useCallback((next: number) => {
    const t = ((next % listLen) + listLen) % listLen;
    if (t === activeIdx) return;
    animateOut(() => { setActiveIdx(t); animateIn(); });
  }, [activeIdx, listLen, animateOut, animateIn]);

  /* ── GSAP indicator bars ── */
  useEffect(() => {
    barRefs.current.forEach((bar, i) => {
      if (!bar) return;
      if (i === activeIdx) {
        gsap.to(bar, { width: 32, height: 3.5, backgroundColor: '#155BA9', duration: 0.35, ease: 'power2.out' });
      } else {
        gsap.to(bar, { width: 22, height: 1.8, backgroundColor: 'rgba(151,151,151,0.34)', duration: 0.35, ease: 'power2.out' });
      }
    });
  }, [activeIdx]);

  /* ── auto-cycle ── */
  const activeIdxRef = useRef(activeIdx);
  useEffect(() => { activeIdxRef.current = activeIdx; }, [activeIdx]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (listLen <= 1) return;
    timerRef.current = setInterval(() => {
      const next = (activeIdxRef.current + 1) % listLen;
      animateOut(() => { setActiveIdx(next); animateIn(); });
    }, ReviewsSection_AUTO_MS);
  }, [listLen, animateOut, animateIn]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  const handleDot = (i: number) => { goTo(i); resetTimer(); };

  /* modal */
  const openModal = () => {
    setIsModalOpen(true); setSubmitSuccess(false); setSubmitError(null);
    setFormData({ studentName:'', rating:5, comment:'', service:'' });
    setPhotoMedia(null);
  };
  const handleInput = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  };
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault(); setIsSubmitting(true); setSubmitError(null);
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const res  = await fetch(`${base}/api/reviews`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ studentName:formData.studentName.trim(), rating:formData.rating, comment:formData.comment.trim(), service:formData.service||undefined, studentImage: photoMedia?.secureUrl || '' }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Validation failed.');
      setSubmitSuccess(true);
      setTimeout(() => setIsModalOpen(false), 3000);
    } catch (err: any) { setSubmitError(err.message || 'Something went wrong.'); }
    finally { setIsSubmitting(false); }
  };

  const fmtDate = (s: string) => {
    if (!s) return '';
    /* YYYY-MM-DD from date input — parse as local to avoid UTC off-by-one */
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      const [y, m, d] = s.split('-');
      return `${d}/${m}/${y}`;
    }
    try { return new Date(s).toLocaleDateString('en-GB'); } catch { return ''; }
  };
  const getBg   = (n: string) => { const h = n.split('').reduce((a,c)=>a+c.charCodeAt(0),0); return `linear-gradient(135deg,hsl(${h%360},65%,65%),hsl(${(h+60)%360},65%,45%))`; };
  const getInit = (n: string) => n ? n.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase() : 'S';

  const dots = [
    {left:0,top:22},{left:28,top:4},{left:63,top:22},{left:90,top:10},
    {left:118,top:22},{left:139,top:16},{left:170,top:22},{left:196,top:19},
    {left:219,top:22},{left:244,top:22},
  ];

  const rev = list[activeIdx] ?? list[0];

  return (
    <section ref={sectionRef} className="rvs-section relative">
      <style dangerouslySetInnerHTML={{ __html: ReviewsSection_STYLES }} />

      <div className="rvs-outer">

        {/* Write review button */}
        <div ref={writeBtnRef} className="rvs-write-btn">
          <button
            onClick={openModal}
            className="flex items-center gap-2 px-4 py-2 bg-[rgba(150,202,69,1)] text-[#111] font-bold text-xs rounded-lg hover:bg-[rgba(150,202,69,0.9)] transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            Write a Review
          </button>
        </div>

        {/* Green wave dots */}
        <div className="rvs-dots">
          {dots.map((d, i) => (
            <div
              key={i}
              ref={el => { dotRefs.current[i] = el; }}
              className="rvs-dot"
              style={{ left: d.left, top: d.top }}
            />
          ))}
        </div>

        <div className="rvs-grid">

          {/* ═══════ LEFT PANEL — Country cards ═══════ */}
          <div ref={leftRef} className="rvs-left">
            <div className="rvs-country-grid">
              {ReviewsSection_HERO_COUNTRIES.map((c, i) => (
                <div
                  key={c.name}
                  ref={el => { ccardRefs.current[i] = el; }}
                  className="rvs-ccard"
                >
                  <div className="rvs-ccard-map">
                    <Image
                      src={c.mapSrc}
                      alt={c.name}
                      fill
                      sizes="64px"
                      style={{ objectFit: 'contain', filter: ReviewsSection_GREEN_TINT }}
                    />
                  </div>
                  <span className="rvs-ccard-name">{c.name}</span>
                  <span className="rvs-ccard-pct">{c.percentage}%</span>
                </div>
              ))}
            </div>
            <div className="rvs-left-footer">
              <p ref={connectRef}   className="rvs-connect">Placing students across</p>
              <p ref={communityRef} className="rvs-community">24+ Countries Worldwide</p>
            </div>
          </div>

          {/* ═══════ RIGHT PANEL ═══════ */}
          <div ref={rightRef} className="rvs-right">

            <h2 className="rvs-heading">
              <span ref={hw1Ref} className="rvs-hw">Students </span>
              <span ref={hw2Ref} className="rvs-hw rvs-heading-green">Reviews</span>
            </h2>

            <div ref={carouselRef} className="rvs-carousel-row">

              {/* ── DESKTOP card (absolute-positioned children) ── */}
              <div ref={cardClipRef} className="rvs-card-desktop" style={{ flex: '1 1 0', minWidth: 0, overflow: 'hidden', borderRadius: 12 }}>
                <div ref={cardRef} className="rvs-card" style={{ width: '100%' }}>
                  <div className="rvs-deco">
                    <div ref={strip1Ref} className="rvs-deco-strip rvs-deco-white" />
                    <div ref={strip2Ref} className="rvs-deco-strip rvs-deco-green" />
                  </div>
                  <div className="rvs-avatar">
                    {rev.studentImage
                      ? <Image src={rev.studentImage} alt={rev.studentName} fill style={{objectFit:'cover'}} onError={e=>{(e.currentTarget as HTMLImageElement).style.visibility='hidden';}} />
                      : <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl" style={{background:getBg(rev.studentName)}}>{getInit(rev.studentName)}</div>
                    }
                  </div>
                  <p className="rvs-text">&quot;{rev.comment}&quot;</p>
                  <div className="rvs-name">{rev.studentName}</div>
                  <div className="rvs-role">{rev.service || 'Verified Student'}</div>
                  <div className="rvs-date">{fmtDate(rev.date || rev.createdAt)}</div>
                </div>
              </div>

              {/* ── MOBILE card (flex column, no absolute children) ── */}
              <div className="rvs-card-mobile">
                <div className="mob-deco">
                  <div className="mob-strip" style={{ background: '#fff' }} />
                  <div className="mob-strip" style={{ background: '#96CA45' }} />
                </div>
                <div className="mob-top">
                  <div className="mob-avatar">
                    {rev.studentImage
                      /* eslint-disable-next-line @next/next/no-img-element */
                      ? <img src={rev.studentImage} alt={rev.studentName} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}} />
                      : <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:16,background:getBg(rev.studentName),borderRadius:'50%'}}>{getInit(rev.studentName)}</div>
                    }
                  </div>
                  <p className="mob-comment">&quot;{rev.comment}&quot;</p>
                </div>
                <span className="mob-name">{rev.studentName}</span>
                <span className="mob-role">{rev.service || 'Verified Student'}</span>
                <div className="mob-footer">
                  <span className="mob-date">{fmtDate(rev.date || rev.createdAt)}</span>
                </div>
              </div>

              {/* Indicator bars */}
              <div className="rvs-indicator">
                {Array.from({length: listLen}, (_, i) => (
                  <div
                    key={i}
                    ref={el => { barRefs.current[i] = el; }}
                    className="rvs-bar"
                    style={{
                      width: i === activeIdx ? 32 : 22,
                      height: i === activeIdx ? 3.5 : 1.8,
                      backgroundColor: i === activeIdx ? '#155BA9' : 'rgba(151,151,151,0.34)',
                      borderRadius: 6,
                    }}
                    onClick={() => handleDot(i)}
                    role="button"
                    aria-label={`Review ${i + 1}`}
                  />
                ))}
              </div>

            </div>
          </div>

        </div>

        {/* ═══════ MODAL ═══════ */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)} />
            <div className="rvs-glass w-full max-w-lg rounded-2xl overflow-hidden relative z-10 flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-[#252525] flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[rgba(150,202,69,1)]" />
                  SHARE YOUR STORY
                </h3>
                <button onClick={() => setIsModalOpen(false)} disabled={isSubmitting} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {submitSuccess ? (
                <div className="p-8 text-center flex flex-col items-center justify-center flex-1">
                  <div className="w-16 h-16 rounded-full bg-[rgba(150,202,69,0.1)] flex items-center justify-center text-[rgba(150,202,69,1)] mb-4 animate-bounce"><Check className="w-8 h-8" /></div>
                  <h4 className="text-2xl font-black text-[#252525] mb-2 uppercase">REVIEW SUBMITTED</h4>
                  <p className="text-gray-500 text-sm max-w-sm">Thank you! Your review is pending administrative approval.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
                  {submitError && <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm">{submitError}</div>}
                  <div>
                    <label htmlFor="studentName" className="block text-sm font-bold text-gray-700 mb-1">Your Name *</label>
                    <input type="text" name="studentName" id="studentName" required value={formData.studentName} onChange={handleInput} placeholder="e.g. Bruce Wayne" disabled={isSubmitting} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[rgba(150,202,69,1)] focus:ring-1 focus:ring-[rgba(150,202,69,1)] text-sm transition-all text-black" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Your Photo <span className="font-normal text-gray-400">(Optional)</span></label>
                    <CropUploader
                      value={photoMedia}
                      onUpload={setPhotoMedia}
                      onClear={() => setPhotoMedia(null)}
                      label="Upload Your Photo"
                      folder="reviews"
                      aspect={1}
                      outputWidth={400}
                      outputHeight={400}
                      publicUpload
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Rating *</label>
                    <div className="flex items-center gap-1.5">
                      {Array.from({length:5},(_,i)=>{
                        const v=i+1, on=hoverRating!==null?v<=hoverRating:v<=formData.rating;
                        return <button type="button" key={i} disabled={isSubmitting} onClick={()=>setFormData(p=>({...p,rating:v}))} onMouseEnter={()=>setHoverRating(v)} onMouseLeave={()=>setHoverRating(null)} className="p-1 focus:outline-none"><Star className={`w-7 h-7 ${on?'fill-[rgba(150,202,69,1)] text-[rgba(150,202,69,1)]':'text-gray-300'}`}/></button>;
                      })}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-sm font-bold text-gray-700 mb-1">Service / Course <span className="font-normal text-gray-400">(Optional)</span></label>
                    <input type="text" name="service" id="service" value={formData.service} onChange={handleInput} disabled={isSubmitting} placeholder="e.g. IELTS Coaching, Student Visa Pathway..." className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[rgba(150,202,69,1)] text-sm bg-white text-black" />
                  </div>
                  <div>
                    <label htmlFor="comment" className="block text-sm font-bold text-gray-700 mb-1">Review Description *</label>
                    <textarea name="comment" id="comment" required rows={4} value={formData.comment} onChange={handleInput} placeholder="Share your experience..." disabled={isSubmitting} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[rgba(150,202,69,1)] text-sm resize-none text-black" />
                    <span className="text-[11px] text-gray-400 block mt-1">Must be at least 10 characters.</span>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                    <button type="button" onClick={()=>setIsModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-sm rounded-lg transition-colors cursor-pointer">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-[rgba(150,202,69,1)] text-[#111] hover:bg-[rgba(150,202,69,0.9)] font-bold text-sm rounded-lg flex items-center gap-2 cursor-pointer shadow-sm transition-colors">
                      {isSubmitting ? 'Submitting…' : 'Submit Review'}
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
/* === END OF ReviewsSection.tsx === */

/* =========================================================================
   START OF LatestNewsSection.tsx
   ========================================================================= */
interface LatestNewsSection_NewsItem {
  id: string | number;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  time: string;
}
const LatestNewsSection_AUTO_MS = 5500;
const LatestNewsSection_FAN = {
  desktop: { w: 420, h: 288, off1: 148, off2: 262, r1: 4, r2: 8, s1: 0.82, s2: 0.68, op1: 0.82, op2: 0.54, stageH: 320 },
  tablet:  { w: 340, h: 234, off1: 120, off2: 212, r1: 4, r2: 8, s1: 0.82, s2: 0.68, op1: 0.78, op2: 0.50, stageH: 264 },
};
const LatestNewsSection_STYLES = `
  @keyframes lns-ring {
    0%,100% { box-shadow:0 0 0 0   rgba(150,202,69,0.55); }
    55%      { box-shadow:0 0 0 8px rgba(150,202,69,0);    }
  }
  @keyframes lns-orb-drift {
    0%,100% { transform:translate(0,0) scale(1);     }
    33%      { transform:translate(18px,-22px) scale(1.08); }
    66%      { transform:translate(-14px,16px) scale(0.94); }
  }

  .lns { background:#1e1e1e; padding:clamp(40px,6vw,72px) 0 clamp(48px,7vw,80px); position:relative; overflow-x:clip; }
  .lns-wrap { max-width:1200px; margin:0 auto; padding:0 clamp(16px,4vw,48px); position:relative; z-index:2; }

  /* ambient orbs */
  .lns-orb {
    position:absolute; border-radius:50%; pointer-events:none;
    animation:lns-orb-drift 9s ease-in-out infinite;
  }
  .lns-orb-1 { width:clamp(180px,28vw,380px); height:clamp(180px,28vw,380px); top:-8%; left:-6%; background:radial-gradient(circle,rgba(150,202,69,0.10) 0%,transparent 70%); animation-duration:11s; }
  .lns-orb-2 { width:clamp(140px,22vw,300px); height:clamp(140px,22vw,300px); bottom:-4%; right:-4%; background:radial-gradient(circle,rgba(150,202,69,0.07) 0%,transparent 70%); animation-duration:14s; animation-delay:-4s; }
  .lns-orb-3 { width:clamp(80px,12vw,160px);  height:clamp(80px,12vw,160px);  top:38%; right:12%;  background:radial-gradient(circle,rgba(255,255,255,0.03) 0%,transparent 70%); animation-duration:8s;  animation-delay:-7s; }

  /* heading row */
  .lns-top { display:flex; align-items:flex-start; justify-content:space-between; gap:24px; margin-bottom:clamp(24px,3.5vw,36px); }
  .lns-title {
    font-family:'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size:clamp(34px,5.5vw,80px); font-weight:400;
    line-height:1.14; letter-spacing:-0.03em; color:#fff;
    white-space:nowrap;
  }
  .lns-title-green { color:#96CA45; }
  .lns-sub {
    font-family:'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size:clamp(12.5px,1.3vw,16px); font-weight:400;
    line-height:1.65; color:rgba(255,255,255,0.55);
    max-width:420px; margin-top:clamp(6px,1vw,10px); flex-shrink:0;
  }

  /* handwritten label (top-right) */
  .lns-label {
    display:flex; flex-direction:column; align-items:flex-end; gap:2px;
    pointer-events:none; flex-shrink:0;
  }
  .lns-label-text {
    font-family:'Great Day Personal Use','Brush Script MT',cursive;
    font-size:clamp(16px,2vw,22px); color:#96CA45; white-space:nowrap;
  }

  /* ── FAN stage (desktop + tablet) ── */
  .lns-stage-outer { position:relative; overflow:visible; }
  .lns-stage { position:absolute; inset:0; }

  .lns-cw {
    position:absolute; left:50%; top:50%;
    border-radius:14px; will-change:transform,opacity;
    transform-origin:center bottom;
  }
  .lns-cw { cursor:pointer; }
  .lns-read-btn {
    font-family:'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size:11px; font-weight:700; color:#1a2e00;
    letter-spacing:0.04em;
  }

  .lns-card { width:100%; height:100%; border-radius:14px; overflow:hidden; position:relative; }
  .lns-card-active   { background:#96CA45; }
  .lns-card-inactive { background:#2e2e2e; }

  .lns-img { position:absolute; inset:0; height:71%; overflow:hidden; border-radius:10px 10px 0 0; }
  .lns-img-overlay { position:absolute; inset:0; border-radius:10px 10px 0 0; pointer-events:none; }
  .lns-card-active   .lns-img-overlay { background:rgba(0,0,0,0.06); }
  .lns-card-inactive .lns-img-overlay { background:rgba(0,0,0,0.38); }

  .lns-body {
    position:absolute; bottom:0; left:0; right:0;
    padding:clamp(8px,1.2vw,12px) clamp(10px,1.5vw,16px) clamp(10px,1.3vw,14px);
    height:30%; display:flex; flex-direction:column; justify-content:space-between;
  }
  .lns-card-active   .lns-body-title { color:#1a2e00; }
  .lns-card-inactive .lns-body-title { color:#96CA45; }
  .lns-body-title {
    font-family:'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size:clamp(12px,1.4vw,16px); font-weight:600; line-height:1.3;
    display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
  }
  .lns-body-meta { display:flex; justify-content:space-between; margin-top:auto; }
  .lns-card-active   .lns-body-date,
  .lns-card-active   .lns-body-time { color:rgba(0,0,0,0.38); }
  .lns-card-inactive .lns-body-date,
  .lns-card-inactive .lns-body-time { color:rgba(255,255,255,0.35); }
  .lns-body-date,.lns-body-time {
    font-family:'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size:clamp(10px,1vw,12px); letter-spacing:0.01em;
  }

  /* ── MOBILE single-card stack (< 640px) ── */
  .lns-mobile { display:none; flex-direction:column; gap:0; position:relative; }
  .lns-mobile-viewport { overflow:hidden; border-radius:16px; position:relative; }
  .lns-mobile-track { display:flex; will-change:transform; }
  .lns-mobile-card { flex-shrink:0; width:100%; border-radius:16px; overflow:hidden; position:relative; background:#2e2e2e; }
  .lns-mobile-img  { width:100%; aspect-ratio:16/9; position:relative; overflow:hidden; }
  .lns-mobile-overlay { position:absolute; inset:0; background:rgba(0,0,0,0.3); }
  .lns-mobile-body {
    padding:clamp(12px,4vw,18px); background:#96CA45;
  }
  .lns-mobile-title {
    font-family:'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size:clamp(14px,4vw,18px); font-weight:600; color:#1a2e00;
    line-height:1.3; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
    margin-bottom:6px;
  }
  .lns-mobile-exc {
    font-family:'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size:clamp(11px,3vw,13px); color:rgba(26,46,0,0.72); line-height:1.5;
    display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
    margin-bottom:8px;
  }
  .lns-mobile-meta { display:flex; justify-content:space-between; }
  .lns-mobile-date, .lns-mobile-time {
    font-family:'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size:11px; color:rgba(26,46,0,0.5);
  }

  /* nav + progress */
  .lns-nav {
    display:flex; align-items:center; justify-content:center;
    gap:8px; margin-top:clamp(16px,2.5vw,22px); position:relative; z-index:10;
  }
  .lns-dot {
    width:7px; height:7px; border-radius:50%;
    background:rgba(255,255,255,0.25); border:none; cursor:pointer; padding:0;
    transition:transform 0.25s ease;
  }
  .lns-dot.lns-dot-on {
    background:#96CA45; transform:scale(1.5);
    animation:lns-ring 2.4s ease-in-out infinite 0.3s;
  }
  .lns-prog-track { height:2px; background:rgba(255,255,255,0.08); margin-top:clamp(8px,1.5vw,12px); border-radius:2px; overflow:hidden; }
  .lns-prog-fill  { height:100%; background:#96CA45; transform-origin:left; width:100%; }

  /* ── breakpoints ── */
  @media (max-width:1099px) {
    .lns-title { white-space:normal; }
  }
  @media (max-width:899px) {
    .lns-label { display:none; }
    .lns-top { flex-direction:column; gap:10px; }
    .lns-sub { max-width:100%; }
  }
  @media (max-width:639px) {
    .lns-stage-outer { display:none; }
    .lns-mobile { display:flex; }
  }
  @media (min-width:640px) {
    .lns-mobile { display:none !important; }
  }

  @media (prefers-reduced-motion:reduce) {
    .lns-orb { animation:none !important; }
    .lns-dot { animation:none !important; }
  }
  @media (hover: none) and (pointer: coarse) {
    .lns-orb { animation:none !important; }
    .lns-dot.lns-dot-on { animation:none !important; }
  }
`;
function LatestNewsSection({ initialNews = [] }: { initialNews?: any[] }) {
  const router = useRouter();
  const [blogs, setBlogs]   = useState<any[]>(initialNews);
  const [active, setActive] = useState(0);
  const [breakpoint, setBreakpoint] = useState<'desktop' | 'tablet'>('desktop');

  const sectionRef   = useRef<HTMLDivElement>(null);
  const titleRef     = useRef<HTMLHeadingElement>(null);
  const subRef       = useRef<HTMLParagraphElement>(null);
  const labelRef     = useRef<HTMLDivElement>(null);
  const navRef       = useRef<HTMLDivElement>(null);
  const progFillRef  = useRef<HTMLDivElement>(null);
  const progTrackRef = useRef<HTMLDivElement>(null);
  const cardRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const orbRefs      = useRef<(HTMLDivElement | null)[]>([]);

  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const progTween   = useRef<gsap.core.Tween | null>(null);
  const touchRef    = useRef<{ x: number; y: number } | null>(null);
  const triggeredRef = useRef(false);
  const activeRef   = useRef(0);
  const bpRef       = useRef<'desktop' | 'tablet'>('desktop');

  /* ── fetch ── */
  useEffect(() => {
    if (initialNews && initialNews.length > 0) return;
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${base}/api/blogs?status=published`)
      .then(r => r.json())
      .then(d => { if (d?.success && Array.isArray(d?.data) && d.data.length > 0) setBlogs(d.data); })
      .catch(() => {});
  }, [initialNews]);

  const list: LatestNewsSection_NewsItem[] = (blogs && blogs.length > 0 ? blogs : []).map((item: any) => {
    if (item._id) {
      return {
        id: item._id,
        slug: item.slug || item._id,
        title: item.title,
        excerpt: item.summary || '',
        image: item.image ? (typeof item.image === 'object' ? item.image.secureUrl : item.image) : '/news/news-1.jpg',
        date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : '24/06/2026',
        time: item.createdAt ? new Date(item.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '10:00 AM',
      };
    }
    return item as LatestNewsSection_NewsItem;
  });

  const len = list.length;

  /* ── breakpoint tracking ── */
  useEffect(() => {
    const check = () => {
      const bp = window.innerWidth < 900 ? 'tablet' : 'desktop';
      setBreakpoint(bp);
      bpRef.current = bp;
    };
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── fan card positions ── */
  const positionFor = useCallback((cardIdx: number, cur: number) => {
    if (len === 0) return null;
    let o = cardIdx - cur;
    if (o >  len / 2) o -= len;
    if (o < -len / 2) o += len;
    if (Math.abs(o) > 2) return null;

    const f = LatestNewsSection_FAN[bpRef.current];
    const CFG = [
      { dx: -f.off2, r: -f.r2, s: f.s2, op: f.op2, z: 1 },
      { dx: -f.off1, r: -f.r1, s: f.s1, op: f.op1, z: 2 },
      { dx:  0,      r:  0,    s: 1,    op: 1,      z: 5 },
      { dx:  f.off1, r:  f.r1, s: f.s1, op: f.op1,  z: 2 },
      { dx:  f.off2, r:  f.r2, s: f.s2, op: f.op2,  z: 1 },
    ];
    return { ...CFG[o + 2], w: f.w, h: f.h, clickable: o !== 0 };
  }, [len]);

  /* ── GSAP: set fan card sizes + positions ── */
  const applyPositions = useCallback((cur: number, animate = true) => {
    const f = LatestNewsSection_FAN[bpRef.current];
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const pos = positionFor(i, cur);
      if (!pos) {
        gsap.set(el, { opacity: 0, zIndex: 0, pointerEvents: 'none' });
        return;
      }
      /* update size via CSS vars so the card itself stays responsive */
      el.style.width  = `${pos.w}px`;
      el.style.height = `${pos.h}px`;
      el.style.marginLeft = `${-pos.w / 2}px`;
      el.style.marginTop  = `${-pos.h / 2}px`;

      const target = {
        x: pos.dx, rotation: pos.r, scale: pos.s,
        opacity: pos.op, zIndex: pos.z,
        pointerEvents: pos.clickable ? 'auto' : 'none',
      };
      animate
        ? gsap.to(el, { ...target, duration: 0.68, ease: 'power3.out' })
        : gsap.set(el, target);
    });
  }, [positionFor]);

  /* ── GSAP: mobile track slide ── */
  const applyMobile = useCallback((cur: number, animate = true) => {
    const track = mobileTrackRef.current;
    if (!track) return;
    const pct = -cur * 100;
    animate
      ? gsap.to(track,  { x: `${pct}%`, duration: 0.55, ease: 'power3.out' })
      : gsap.set(track, { x: `${pct}%` });
  }, []);

  /* ── progress bar ── */
  const startProgress = useCallback(() => {
    const fill = progFillRef.current;
    if (!fill) return;
    if (progTween.current) progTween.current.kill();
    gsap.set(fill, { scaleX: 0, transformOrigin: 'left center' });
    progTween.current = gsap.to(fill, { scaleX: 1, duration: LatestNewsSection_AUTO_MS / 1000, ease: 'none' });
  }, []);

  /* ── entrance (fires once on scroll) ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    /* pre-hide */
    if (titleRef.current)    gsap.set(titleRef.current,     { opacity: 0, y: 40 });
    if (subRef.current)      gsap.set(subRef.current,       { opacity: 0, y: 24 });
    if (labelRef.current)    gsap.set(labelRef.current,     { opacity: 0, x: 22 });
    if (navRef.current)      gsap.set(navRef.current,       { opacity: 0, y: 16 });
    if (progTrackRef.current) gsap.set(progTrackRef.current, { opacity: 0 });
    orbRefs.current.forEach(o => o && gsap.set(o, { opacity: 0 }));
    cardRefs.current.forEach(c => c && gsap.set(c, { opacity: 0, scale: 0.8, x: 0, rotation: 0, zIndex: 0 }));

    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || triggeredRef.current) return;
      triggeredRef.current = true;
      io.disconnect();

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      /* orbs fade in slowly */
      tl.to(orbRefs.current.filter(Boolean), { opacity: 1, duration: 1.8, stagger: 0.3, ease: 'power1.out' }, 0);

      /* heading slides up */
      tl.to(titleRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.2)' }, 0.1);
      tl.to(subRef.current,   { opacity: 1, y: 0, duration: 0.6 }, 0.26);
      tl.to(labelRef.current, { opacity: 1, x: 0, duration: 0.6, ease: 'back.out(1.4)' }, 0.34);

      /* fan: cards appear from center and spring out */
      tl.call(() => {
        cardRefs.current.forEach((c, i) => {
          if (!c) return;
          const pos = positionFor(i, 0);
          if (!pos) return;
          c.style.width  = `${pos.w}px`;
          c.style.height = `${pos.h}px`;
          c.style.marginLeft = `${-pos.w / 2}px`;
          c.style.marginTop  = `${-pos.h / 2}px`;
          gsap.set(c, { opacity: 0, scale: 0.75, x: 0, rotation: 0, zIndex: pos.z });
          gsap.to(c, {
            opacity: pos.op, scale: pos.s, x: pos.dx, rotation: pos.r,
            duration: 0.82, ease: 'back.out(1.15)',
            delay: 0.1 + Math.abs(i) * 0.07,
          });
        });
        /* mobile track */
        applyMobile(0, false);
      }, [], 0.32);

      /* nav + progress */
      tl.to(navRef.current,       { opacity: 1, y: 0, duration: 0.5 }, 0.7);
      tl.to(progTrackRef.current, { opacity: 1, duration: 0.5 }, 0.78);
      tl.call(() => startProgress(), [], 1.15);

      /* auto-cycle */
      tl.call(() => {
        timerRef.current = setInterval(() => {
          const next = (activeRef.current + 1) % len;
          activeRef.current = next;
          setActive(next);
          applyPositions(next, true);
          applyMobile(next, true);
          startProgress();
        }, LatestNewsSection_AUTO_MS);
      }, [], 1.15);

    }, { threshold: 0.08 });

    io.observe(section);
    return () => {
      io.disconnect();
      if (timerRef.current) clearInterval(timerRef.current);
      if (progTween.current) progTween.current.kill();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [len]);

  /* ── re-layout on breakpoint change ── */
  useEffect(() => {
    if (!triggeredRef.current) return;
    applyPositions(activeRef.current, true);
  }, [breakpoint, applyPositions]);

  /* ── navigation ── */
  const goTo = useCallback((idx: number) => {
    if (len === 0) return;
    const next = ((idx % len) + len) % len;
    activeRef.current = next;
    setActive(next);
    applyPositions(next, true);
    applyMobile(next, true);
    startProgress();
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const n = (activeRef.current + 1) % len;
      activeRef.current = n;
      setActive(n);
      applyPositions(n, true);
      applyMobile(n, true);
      startProgress();
    }, LatestNewsSection_AUTO_MS);
  }, [len, applyPositions, applyMobile, startProgress]);

  const goNext = useCallback(() => goTo(activeRef.current + 1), [goTo]);
  const goPrev = useCallback(() => goTo(activeRef.current - 1), [goTo]);

  /* ── touch ── */
  const onTouchStart = (e: React.TouchEvent) => {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchRef.current) return;
    const dx = e.changedTouches[0].clientX - touchRef.current.x;
    const dy = e.changedTouches[0].clientY - touchRef.current.y;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 36) dx < 0 ? goNext() : goPrev();
    touchRef.current = null;
  };

  const f = LatestNewsSection_FAN[breakpoint];

  /* ══════════════════════════════════════════════════════════════════════ */
  return (
    <section ref={sectionRef} className="lns" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={{ touchAction: 'pan-y' }}>
      <style dangerouslySetInnerHTML={{ __html: LatestNewsSection_STYLES }} />

      {/* Ambient orbs */}
      <div ref={el => { orbRefs.current[0] = el; }} className="lns-orb lns-orb-1" />
      <div ref={el => { orbRefs.current[1] = el; }} className="lns-orb lns-orb-2" />
      <div ref={el => { orbRefs.current[2] = el; }} className="lns-orb lns-orb-3" />

      <div className="lns-wrap">

        {/* Top row: heading + label */}
        <div className="lns-top">
          <div>
            <h2 ref={titleRef} className="lns-title">
              Latest <span className="lns-title-green">News</span>
            </h2>
            <p ref={subRef} className="lns-sub">
              Stay updated with the latest nursing career news, global healthcare opportunities, exam updates, and expert guidance from GrowMedLink.
            </p>
          </div>
          <div ref={labelRef} className="lns-label">
            <svg width="72" height="52" viewBox="0 0 72 52" fill="none">
              <path d="M 68 8 C 55 6, 28 12, 8 42" stroke="#96CA45" strokeWidth="2" fill="none" strokeLinecap="round" />
              <polyline points="4,34 8,44 18,40" stroke="#96CA45" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="lns-label-text">Our Latest Blogs</span>
          </div>
        </div>

        {/* ── Fan stage (≥ 640px) ── */}
        <div className="lns-stage-outer" style={{ height: f.stageH }}>
          <div className="lns-stage">
            {list.map((news, i) => {
              const isActive = i === active;
              return (
                <div
                  key={news.id}
                  ref={el => { cardRefs.current[i] = el; }}
                  className="lns-cw"
                  data-clickable="true"
                  onClick={() => {
                    if (!isActive) { goTo(i); }
                    else { router.push(`/blog/${news.slug}`); }
                  }}
                >
                  <div className={`lns-card lns-card-${isActive ? 'active' : 'inactive'}`}>
                    <div className="lns-img">
                      <Image
                        src={news.image} alt={news.title} fill
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                        onError={e => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
                      />
                      <div className="lns-img-overlay" />
                    </div>
                    <div className="lns-body">
                      <h3 className="lns-body-title">{news.title}</h3>
                      <div className="lns-body-meta">
                        <span className="lns-body-date">{news.date}</span>
                        {isActive
                          ? <span className="lns-read-btn">Read →</span>
                          : <span className="lns-body-time">{news.time}</span>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Mobile single-card slider (< 640px) ── */}
        <div className="lns-mobile">
          {list.length === 0 && (
            <div style={{ textAlign:'center', padding:'32px 16px', color:'rgba(255,255,255,0.4)', fontFamily:"'Haffer XH-TRIAL',sans-serif", fontSize:14 }}>
              No news articles yet — check back soon.
            </div>
          )}
          <div className="lns-mobile-viewport">
            <div ref={mobileTrackRef} className="lns-mobile-track">
              {list.map((news, i) => (
                <div
                  key={news.id}
                  className="lns-mobile-card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => router.push(`/blog/${news.slug}`)}
                >
                  <div className="lns-mobile-img">
                    <Image
                      src={news.image} alt={news.title} fill
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                      onError={e => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
                    />
                    <div className="lns-mobile-overlay" />
                  </div>
                  <div className="lns-mobile-body">
                    <div className="lns-mobile-title">{news.title}</div>
                    <div className="lns-mobile-exc">{news.excerpt}</div>
                    <div className="lns-mobile-meta">
                      <span className="lns-mobile-date">{news.date}</span>
                      <span className="lns-mobile-time" style={{ fontWeight: 700, color: '#1a2e00' }}>Read →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots */}
        <div ref={navRef} className="lns-nav">
          {list.map((_, i) => (
            <button
              key={i}
              className={`lns-dot${i === active ? ' lns-dot-on' : ''}`}
              aria-label={`News ${i + 1}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div ref={progTrackRef} className="lns-prog-track">
          <div ref={progFillRef} className="lns-prog-fill" />
        </div>

      </div>
    </section>
  );
}
/* === END OF LatestNewsSection.tsx === */

/* =========================================================================
   START OF CtaBannerSection.tsx
   ========================================================================= */
function CtaBannerSection_DownloadIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      {/* Downward arrow shaft */}
      <path
        d="M7.5 1.5 V9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Downward arrow head */}
      <path
        d="M4.5 6.5 L7.5 9.5 L10.5 6.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Horizontal base line */}
      <path
        d="M2.5 12.5 H12.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function CtaBannerSection() {
  const [animate, setAnimate] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true);
          observer.disconnect(); // Fire only once
        }
      },
      { threshold: 0.15 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const handleDownload = () => {
    window.open('/brochure.pdf', '_blank');
  };

  const handleContact = () => {
    window.location.href = '/contact';
  };

  return (
    <div className={styles.section}>
      <div
        ref={cardRef}
        className={`${styles.card} ${animate ? styles.animateIn : ''}`}
      >
        {/* ── Left: green panel ── */}
        <div className={styles.green}>

          {/* Grayscale support-agent image at bottom-left */}
          <div className={styles.imgWrap}>
            <Image
              src="/cta-agent.png"
              alt="Support agent at laptop"
              width={215}
              height={230}
              style={{
                objectFit: 'contain',
                objectPosition: 'bottom center',
                filter: 'grayscale(100%)',
                width: '100%',
                height: 'auto',
              }}
              priority
              onError={e => {
                (e.currentTarget as HTMLImageElement).style.opacity = '0';
              }}
            />
          </div>

          {/* Paragraph text */}
          <div className={styles.textArea}>
            <p className={styles.text}>
              Explore our complete nursing career pathway, training support, documentation guidance, and global placement services. Download the GrowMedLink brochure to learn how we help nurses move confidently toward international opportunities.
            </p>
          </div>

        </div>

        {/* ── Right: dark panel with buttons ── */}
        <div className={styles.dark}>

          {/* Download Brochure — outlined, monospace */}
          <button
            onClick={handleDownload}
            className={styles.btnDl}
            type="button"
          >
            <CtaBannerSection_DownloadIcon />
            Download Brochure
          </button>

          {/* Contact Now! — solid green */}
          <button
            onClick={handleContact}
            className={styles.btnContact}
            type="button"
          >
            Contact Now!
          </button>

        </div>
      </div>
    </div>
  );
}
/* === END OF CtaBannerSection.tsx === */

/* =========================================================================
   MAIN HOMEPAGE COMPONENT
   ========================================================================= */

export default function HomePage({ 
  sortedProducts, 
  allServices, 
  featuredServices, 
  allReviews, 
  allBlogs 
}: any) {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <StatsBanner />
      <PreNursingMatters products={sortedProducts} />
      <ServicesCarouselSection services={allServices} />
      <FeaturedServices services={featuredServices} />
      <WhySection />
      <ReviewsSection initialReviews={allReviews} />
      <LatestNewsSection initialNews={allBlogs} />
      <CtaBannerSection />
    </div>
  );
}





















