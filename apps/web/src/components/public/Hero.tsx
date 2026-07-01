'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

/* ─── Types ─── */
interface Country {
  id: string;
  name: string;
  mapSrc: string;
  percentage: number;
}

/* ─── Data ─── */
const COUNTRIES: Country[] = [
  { id: 'australia',     name: 'Australia',  mapSrc: '/australia-map.png',     percentage: 54 },
  { id: 'india',         name: 'India',      mapSrc: '/india-map.png',         percentage: 28 },
  { id: 'africa',        name: 'Africa',     mapSrc: '/africa-map.png',        percentage: 12 },
  { id: 'south-america', name: 'S. America', mapSrc: '/south-america-map.png', percentage:  6 },
];

const GREEN_TINT = 'brightness(0) saturate(100%) invert(68%) sepia(60%) saturate(500%) hue-rotate(40deg) brightness(110%)';
const AUTO_CYCLE_MS = 3200;

const JOURNEY = 'Journey'.split('');

/* ══════════════════════════════════════════════════════════
   SlotWord — slot-machine on hover.
   Each letter has an overflow:hidden clip window (1em tall).
   Inside sits a reel <span> whose children are the real char
   repeated above/below dummy chars — GSAP tweens the reel's
   translateY in discrete pixel steps (one line-height each)
   so only one character shows at a time, no layout shift.
══════════════════════════════════════════════════════════ */
function SlotWord() {
  const clipRefs  = useRef<(HTMLSpanElement | null)[]>([]);
  const reelRefs  = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRef     = useRef<gsap.core.Timeline | null>(null);
  const isHovered = useRef(false);

  const runSlot = useCallback((toGreen: boolean) => {
    if (tlRef.current) tlRef.current.kill();
    tlRef.current = gsap.timeline();

    JOURNEY.forEach((_char, i) => {
      const clip = clipRefs.current[i];
      const reel = reelRefs.current[i];
      if (!clip || !reel) return;

      /* One slot row height = clip element height in px */
      const lineH = clip.getBoundingClientRect().height || 24;
      /* Total rows in reel = DUMMY_ROWS dummy + 1 real */
      const totalRows = 21; /* DUMMY_ROWS(20) + 1 real char at bottom */
      /* Steps to animate: vary per letter for stagger feel */
      const steps   = 8 + i * 2;
      const stepDur = 0.12; /* seconds per step — readable speed */
      const delay   = i * 0.07;

      /* Start reel at top (y = 0 → showing first dummy char) */
      gsap.set(reel, { y: 0 });

      /* Move DOWN by (totalRows - 1) rows to land on the real char at bottom.
         Use steps() easing so each tick is a discrete jump — true slot feel. */
      const targetY = (totalRows - 1) * lineH;

      tlRef.current!.to(reel, {
        y: targetY,
        duration: steps * stepDur,
        ease: `steps(${steps})`,
        delay,
        onComplete: () => {
          /* Colour the real char, then snap reel back to top silently */
          const real = reel.querySelector<HTMLSpanElement>('.slot-real');
          if (real) real.style.color = toGreen ? '#96CA45' : '#ffffff';
          gsap.set(reel, { y: 0 });
        },
      }, delay);
    });
  }, []);

  const handleEnter = useCallback(() => {
    if (isHovered.current) return;
    isHovered.current = true;
    runSlot(true);
  }, [runSlot]);

  const handleLeave = useCallback(() => {
    isHovered.current = false;
    runSlot(false);
  }, [runSlot]);

  /* Build a reel of (steps_max + 1) chars above the real one so there's
     always content to scroll through regardless of step count.
     The real char sits at position 0 (top). Dummy chars above scroll into
     view as the reel moves up, then reel resets to 0 instantly. */
  /* Dummy chars sit ABOVE the real char in the DOM.
     GSAP moves the reel DOWN (positive y) so dummy chars scroll into view
     from above, then after settling the reel resets to 0 showing the real char. */
  const DUMMY_ROWS  = 20;
  const DUMMY_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  return (
    <span
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ display: 'inline-block', cursor: 'default', userSelect: 'none' }}
    >
      {JOURNEY.map((char, i) => (
        <span
          key={i}
          ref={el => { clipRefs.current[i] = el; }}
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            height: '1.05em',
            verticalAlign: 'bottom',
            lineHeight: 1.05,
          }}
        >
          <span
            ref={el => { reelRefs.current[i] = el; }}
            style={{ display: 'block', willChange: 'transform' }}
          >
            {/* Dummy chars ABOVE — scroll downward into view during animation */}
            {Array.from({ length: DUMMY_ROWS }, (_, d) => (
              <span
                key={d}
                style={{ display: 'block', lineHeight: 1.05, color: '#96CA45', userSelect: 'none' }}
              >
                {DUMMY_CHARS[(char.toUpperCase().charCodeAt(0) - 65 + DUMMY_ROWS - d) % 26]}
              </span>
            ))}
            {/* Real char — always at the bottom of the reel (shown when y = DUMMY_ROWS * lineH) */}
            <span
              className="slot-real"
              style={{ display: 'block', lineHeight: 1.05, color: '#ffffff' }}
            >
              {char}
            </span>
          </span>
        </span>
      ))}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════
   Wave dots
══════════════════════════════════════════════════════════ */
function WaveDots() {
  const containerRef = useRef<HTMLDivElement>(null);
  const DOT_POSITIONS = [
    { left: 0,   top: 22 }, { left: 31,  top: 6  }, { left: 60,  top: 22 },
    { left: 90,  top: 12 }, { left: 118, top: 22 }, { left: 139, top: 16 },
    { left: 170, top: 22 }, { left: 196, top: 19 }, { left: 219, top: 22 },
    { left: 244, top: 22 },
  ];

  useEffect(() => {
    if (!containerRef.current) return;
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

/* ══════════════════════════════════════════════════════════
   CountryCard
══════════════════════════════════════════════════════════ */
function CountryCard({ country, isActive, onClick }: {
  country: Country; isActive: boolean; onClick: () => void;
}) {
  const [count,        setCount       ] = useState(0);
  const [contentReady, setContentReady] = useState(false);
  const [hovered,      setHovered     ] = useState(false);

  const showTmr = useRef<ReturnType<typeof setTimeout>  | null>(null);
  const cntTmr  = useRef<ReturnType<typeof setTimeout>  | null>(null);
  const intTmr  = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (showTmr.current) clearTimeout(showTmr.current);
    if (cntTmr.current)  clearTimeout(cntTmr.current);
    if (intTmr.current)  clearInterval(intTmr.current);

    if (!isActive) {
      setContentReady(false);
      setCount(0);
      return;
    }

    /* Show content quickly on first mount (no delay needed) */
    showTmr.current = setTimeout(() => setContentReady(true), 280);
    cntTmr.current  = setTimeout(() => {
      let v = 0;
      const step = country.percentage / (600 / 16);
      intTmr.current = setInterval(() => {
        v = Math.min(v + step, country.percentage);
        setCount(Math.round(v));
        if (v >= country.percentage) clearInterval(intTmr.current!);
      }, 16);
    }, 400);

    return () => {
      if (showTmr.current) clearTimeout(showTmr.current);
      if (cntTmr.current)  clearTimeout(cntTmr.current);
      if (intTmr.current)  clearInterval(intTmr.current);
    };
  }, [isActive, country.percentage]);

  return (
    <div
      onClick={!isActive ? onClick : undefined}
      onMouseEnter={() => !isActive && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width:     isActive ? 'clamp(240px,48vw,380px)' : 'clamp(80px,15vw,110px)',
        minWidth:  isActive ? 'clamp(240px,48vw,380px)' : 'clamp(80px,15vw,110px)',
        height:    'clamp(160px,24vw,205px)',
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span style={{ fontSize: 'clamp(14px,2vw,20px)', fontWeight: 400, lineHeight: '1.4', color: '#000', fontFamily: "'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif" }}>
            {country.name}
          </span>
          <Image src={country.mapSrc} alt={country.name} width={120} height={95}
            style={{ width: 'clamp(70px,12vw,115px)', height: 'auto', marginTop: '-4px', marginRight: '-4px' }}
            onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ width: 'clamp(80px,14vw,130px)', height: 'clamp(32px,5vw,48px)', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
            <Image src="/avatars-group.png" alt="Students" width={200} height={56}
              style={{ height: 'clamp(32px,5vw,48px)', width: 'auto', maxWidth: 'none', objectFit: 'cover', objectPosition: 'left' }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
            />
          </div>
          <span style={{ fontSize: 'clamp(36px,6vw,54px)', fontWeight: 500, lineHeight: 1, color: '#96CA45', letterSpacing: '-0.02em', fontFamily: "'Haffer VF-TRIAL','Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif" }}>
            {count}%
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
          style={{ width: 'clamp(40px,8vw,62px)', height: 'auto', filter: GREEN_TINT }}
          onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
        />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Progress bar
══════════════════════════════════════════════════════════ */
function AutoCycleBar({ duration }: { duration: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    setWidth(0);
    const raf = requestAnimationFrame(() => setWidth(100));
    return () => cancelAnimationFrame(raf);
  }, [duration]);
  return (
    <div style={{ width: '100%', height: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden', marginTop: 6 }}>
      <div style={{ height: '100%', background: '#96CA45', borderRadius: 2, width: `${width}%`, transition: `width ${duration}ms linear` }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Main Hero
══════════════════════════════════════════════════════════ */
export default function Hero() {
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
    gsapCtx.current = gsap.context(() => {

      /* Sunburst spin */
      if (sunburstRef.current) {
        gsap.to(sunburstRef.current, {
          rotation: 360,
          duration: 80,
          ease: 'none',
          repeat: -1,
          transformOrigin: '50% 50%',
        });
      }

      /* Staggered entrance */
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

      /* Arrow callout: reveal then float */
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

  /* ── Auto-cycle ── */
  const startAutoPlay = useCallback(() => {
    if (autoTimer.current) clearInterval(autoTimer.current);
    autoTimer.current = setInterval(() => {
      setActiveIdx(i => { setCycleKey(k => k + 1); return (i + 1) % COUNTRIES.length; });
    }, AUTO_CYCLE_MS);
  }, []);

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
      {/* Hide scrollbars on the cards row */}
      <style>{`
        .cards-scroll::-webkit-scrollbar { display: none; }
        .cards-scroll { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

      <section
        ref={sectionRef}
        className="relative w-full bg-black overflow-hidden font-['Power_Grotesk'] text-white"
        style={{ paddingBottom: 'clamp(60px,8vw,100px)' }}
      >
        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">

          {/* ── ROW 1: Heading + avatars ── */}
          <div
            className="flex flex-col items-center text-center"
            style={{ paddingTop: 'clamp(90px,12vh,140px)' }}
          >
            {/* Sunburst + H1 */}
            <div className="relative inline-flex items-center justify-center">
              <div
                ref={sunburstRef}
                className="absolute pointer-events-none"
                style={{
                  width:  'clamp(300px,70vw,680px)',
                  height: 'clamp(300px,70vw,680px)',
                  top: '50%', left: '50%',
                  marginLeft: 'calc(clamp(300px,70vw,680px) / -2)',
                  marginTop:  'calc(clamp(300px,70vw,680px) / -2)',
                  zIndex: -1,
                  willChange: 'transform',
                }}
              >
                <Image src="/sunburst-lines.png" alt="" fill className="object-contain" priority />
              </div>

              <h1
                ref={h1Ref}
                className="font-black tracking-tight"
                style={{
                  fontSize: 'clamp(32px,6.5vw,100px)',
                  lineHeight: 1.05,
                  opacity: 0,
                  padding: 'clamp(16px,3vw,32px) clamp(8px,2vw,16px)',
                  whiteSpace: 'nowrap',
                }}
              >
                Start Your <SlotWord />.<span style={{ color: '#96CA45' }}>!</span>
              </h1>
            </div>

            {/* Avatars */}
            <div
              ref={avatarsRef}
              className="flex flex-row items-center justify-center gap-3 mt-3"
              style={{ opacity: 0 }}
            >
              <Image src="/avatars-group.png" alt="Trusted Students" width={160} height={40} className="h-7 sm:h-9 w-auto" style={{ opacity: 1, filter: 'none' }} />
              <span className="text-[#CACACA] text-xs sm:text-sm font-medium tracking-wide">
                1600 + Trusted Students
              </span>
            </div>
          </div>

          {/* ── ROW 2: World map — sits between heading and bottom content ── */}
          <div className="pointer-events-none flex justify-center" style={{ margin: 'clamp(-40px,-6vw,-80px) 0' }}>
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
              style={{ opacity: 0 }}
            >
              <p
                className="text-white font-bold leading-snug mb-3"
                style={{
                  fontFamily: "'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif",
                  fontSize: 'clamp(15px,1.6vw,22px)',
                  lineHeight: '1.4',
                }}
              >
                Connect with the people who love building great websites as much as you do.
              </p>
              <p
                className="text-gray-400 leading-relaxed mb-6"
                style={{
                  fontFamily: "'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif",
                  fontSize: 'clamp(12px,1.05vw,15px)',
                  lineHeight: '1.7',
                }}
              >
                Our community is full of creative devs and designers exchanging feedback,
                ideas, and inspiration. Everyone&apos;s here to make the internet a little better.
              </p>

              {/* CTA button */}
              <button
                className="hover:brightness-90 active:scale-95 transition-all"
                style={{
                  width: 'clamp(170px,36vw,228px)',
                  height: 'clamp(44px,5.5vw,54px)',
                  background: '#96CA45',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Haffer XH Mono-TRIAL','Courier New',monospace",
                  fontSize: 'clamp(14px,1.3vw,18px)',
                  fontWeight: 600,
                  color: '#000',
                  letterSpacing: '0.01em',
                  display: 'block',
                }}
              >
                Explore Courses
              </button>

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
                  Finally, your kind<br />of group chat
                </span>
              </div>
            </div>

            {/* Right: cards carousel + controls */}
            <div
              ref={cardsRef}
              className="w-full lg:w-auto flex flex-col gap-3"
              style={{ opacity: 0, flexShrink: 0, minWidth: 0 }}
            >
              {/* Horizontal scroll-snap row, no scrollbar */}
              <div
                className="cards-scroll"
                style={{
                  display: 'flex',
                  gap: 4,
                  overflowX: 'auto',
                  scrollSnapType: 'x mandatory',
                  WebkitOverflowScrolling: 'touch',
                  width: '100%',
                  maxWidth: '100%',
                }}
              >
                {COUNTRIES.map((country, idx) => (
                  <div key={country.id} style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
                    <CountryCard
                      country={country}
                      isActive={activeIdx === idx}
                      onClick={() => handleCardClick(idx)}
                    />
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <AutoCycleBar key={cycleKey} duration={AUTO_CYCLE_MS} />

              {/* Dot indicators */}
              <div className="flex items-center justify-end gap-1.5 pr-1">
                {COUNTRIES.map((c, i) => (
                  <button
                    key={c.id}
                    onClick={() => handleCardClick(i)}
                    style={{
                      width: activeIdx === i ? 22 : 8,
                      height: 8,
                      borderRadius: 4,
                      background: activeIdx === i ? '#96CA45' : 'rgba(255,255,255,0.28)',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      transition: 'width 0.4s cubic-bezier(.34,1.56,.64,1), background 0.3s ease',
                    }}
                    aria-label={`Show ${c.name}`}
                  />
                ))}
              </div>

              {/* Wave dots */}
              <WaveDots />
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
