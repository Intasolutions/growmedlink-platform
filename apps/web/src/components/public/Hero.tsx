'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

/* ─── Country data ─── */
interface Country {
  id: string;
  name: string;
  mapSrc: string;
  percentage: number;
}

const COUNTRIES: Country[] = [
  { id: 'australia',      name: 'Australia',  mapSrc: '/australia-map.png',     percentage: 54 },
  { id: 'india',          name: 'India',      mapSrc: '/india-map.png',         percentage: 28 },
  { id: 'africa',         name: 'Africa',     mapSrc: '/africa-map.png',        percentage: 12 },
  { id: 'south-america',  name: 'S. America', mapSrc: '/south-america-map.png', percentage:  6 },
];

/* Green CSS filter — tints a grayscale map to #96CA45 */
const GREEN_TINT =
  'brightness(0) saturate(100%) invert(68%) sepia(60%) saturate(500%) hue-rotate(40deg) brightness(110%)';

/* Auto-cycle interval in ms */
const AUTO_CYCLE_MS = 3200;

/* ─── Global keyframes injected once ──────────────────────────────────────── */
const KEYFRAMES = `
  @keyframes heroFadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes heroPulse {
    0%,100% { opacity: 0.55; transform: scale(1);    }
    50%     { opacity: 1;    transform: scale(1.25); }
  }
  @keyframes sunburstSpin {
    from { transform: translate(-50%,-50%) rotate(0deg);   }
    to   { transform: translate(-50%,-50%) rotate(360deg); }
  }
  @keyframes arrowBounce {
    0%,100% { transform: rotate(-20deg) translateY(0px);   }
    50%     { transform: rotate(-20deg) translateY(-5px);  }
  }
`;

/* ─── Wave dots ───────────────────────────────────────────────────────────── */
function WaveDots() {
  const dots = [
    { left: 0,   top: 29 }, { left: 31,  top: 24 }, { left: 60,  top: 29 },
    { left: 93,  top: 20 }, { left: 131, top: 29 }, { left: 157, top: 13 },
    { left: 192, top: 29 }, { left: 226, top: 6  }, { left: 270, top: 29 },
    { left: 305, top: 0  },
  ];
  return (
    <div style={{ position: 'relative', width: '318px', height: '42px', flexShrink: 0 }}>
      {dots.map((d, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: d.left,
            top: d.top,
            width: '13px',
            height: '13px',
            borderRadius: '50%',
            background: '#96CA45',
            animation: `heroPulse ${1.4 + i * 0.12}s ease-in-out ${i * 0.08}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function CountryCard({
  country,
  isActive,
  onClick,
}: {
  country: Country;
  isActive: boolean;
  onClick: () => void;
}) {
  const [count,        setCount       ] = useState(isActive ? country.percentage : 0);
  const [contentReady, setContentReady] = useState(isActive);
  const [hovered,      setHovered     ] = useState(false);

  const skipAnim = useRef(isActive);
  const showTmr  = useRef<ReturnType<typeof setTimeout>  | null>(null);
  const cntTmr   = useRef<ReturnType<typeof setTimeout>  | null>(null);
  const intTmr   = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    [showTmr, cntTmr].forEach(r => r.current && clearTimeout(r.current));
    if (intTmr.current) clearInterval(intTmr.current);

    if (!isActive) {
      setContentReady(false);
      setCount(0);
      return;
    }

    if (skipAnim.current) {
      skipAnim.current = false;
      setContentReady(true);
      setCount(country.percentage);
      return;
    }

    showTmr.current = setTimeout(() => setContentReady(true), 320);
    cntTmr.current  = setTimeout(() => {
      let v = 0;
      const step = country.percentage / (700 / 16);
      intTmr.current = setInterval(() => {
        v = Math.min(v + step, country.percentage);
        setCount(Math.round(v));
        if (v >= country.percentage) clearInterval(intTmr.current!);
      }, 16);
    }, 460);

    return () => {
      [showTmr, cntTmr].forEach(r => r.current && clearTimeout(r.current));
      if (intTmr.current) clearInterval(intTmr.current);
    };
  }, [isActive, country.percentage]);

  return (
    <div
      onClick={!isActive ? onClick : undefined}
      onMouseEnter={() => !isActive && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width:  isActive ? '380px' : '110px',
        height: '205px',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden',
        cursor: isActive ? 'default' : 'pointer',
        backgroundColor: isActive ? '#ffffff' : '#2B2B2B',
        borderRadius: isActive ? '8px' : '0 8px 8px 0',
        borderRight: isActive ? 'none' : '1px solid rgba(0,0,0,0.5)',
        boxShadow: isActive
          ? '0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(150,202,69,0.18)'
          : hovered
          ? 'inset 0 0 0 1.5px rgba(150,202,69,0.6)'
          : 'none',
        transition: [
          'width 0.55s cubic-bezier(0.34,1.56,0.64,1)',
          'background-color 0.38s ease',
          'box-shadow 0.28s ease',
          'transform 0.25s cubic-bezier(.22,.68,0,1.2)',
        ].join(', '),
        transform: hovered && !isActive ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      {/* Active card */}
      <div
        style={{
          position: 'absolute', inset: 0,
          padding: '18px 20px 16px 24px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          opacity:   contentReady ? 1 : 0,
          transform: contentReady ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.32s ease, transform 0.36s cubic-bezier(.22,.68,0,1.2)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span style={{
            fontSize: '20px', fontWeight: 400, lineHeight: '28px', color: '#000000',
            fontFamily: "'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif",
          }}>
            {country.name}
          </span>
          <Image
            src={country.mapSrc}
            alt={country.name}
            width={120}
            height={95}
            style={{ width: '115px', height: 'auto', marginTop: '-4px', marginRight: '-6px' }}
            onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ width: '130px', height: '48px', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
            <Image
              src="/avatars-group.png"
              alt="Students"
              width={200}
              height={56}
              style={{ height: '48px', width: 'auto', maxWidth: 'none', objectFit: 'cover', objectPosition: 'left' }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
            />
          </div>
          <span style={{
            fontSize: '54px', fontWeight: 500, lineHeight: 1, color: '#96CA45',
            letterSpacing: '-0.02em',
            fontFamily: "'Haffer VF-TRIAL','Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif",
          }}>
            {count}%
          </span>
        </div>
      </div>

      {/* Inactive card */}
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: isActive ? 0 : 1,
          transition: 'opacity 0.22s ease',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      >
        <Image
          src={country.mapSrc}
          alt={country.name}
          width={65}
          height={65}
          style={{ width: '62px', height: 'auto', filter: GREEN_TINT }}
          onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
        />
      </div>
    </div>
  );
}

/* ─── Progress bar under cards ────────────────────────────────────────────── */
function AutoCycleBar({ duration }: { duration: number }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(0);
    const raf = requestAnimationFrame(() => {
      setWidth(100);
    });
    return () => cancelAnimationFrame(raf);
  }, [duration]);

  return (
    <div style={{
      width: '100%', height: '2px', background: 'rgba(255,255,255,0.1)',
      borderRadius: '2px', overflow: 'hidden', marginTop: '6px',
    }}>
      <div style={{
        height: '100%', background: '#96CA45', borderRadius: '2px',
        width: `${width}%`,
        transition: `width ${AUTO_CYCLE_MS}ms linear`,
      }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
export default function Hero() {
  const [activeIdx,    setActiveIdx   ] = useState(0);
  const [heroVisible,  setHeroVisible ] = useState(false);
  const [cycleKey,     setCycleKey    ] = useState(0);   // resets the progress bar
  const sectionRef = useRef<HTMLElement>(null);
  const autoTimer  = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Entrance animation trigger ── */
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  /* ── Auto-cycle logic ── */
  const startAutoPlay = useCallback(() => {
    if (autoTimer.current) clearInterval(autoTimer.current);
    autoTimer.current = setInterval(() => {
      setActiveIdx(i => {
        const next = (i + 1) % COUNTRIES.length;
        setCycleKey(k => k + 1);
        return next;
      });
    }, AUTO_CYCLE_MS);
  }, []);

  useEffect(() => {
    startAutoPlay();
    return () => { if (autoTimer.current) clearInterval(autoTimer.current); };
  }, [startAutoPlay]);

  /* Manual click: switch card and restart timer */
  const handleCardClick = (idx: number) => {
    setActiveIdx(idx);
    setCycleKey(k => k + 1);
    startAutoPlay();
  };

  /* ── Stagger delay helper ── */
  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: heroVisible ? 1 : 0,
    transform: heroVisible ? 'translateY(0)' : 'translateY(32px)',
    transition: `opacity 0.75s cubic-bezier(.22,.68,0,1.2) ${delay}ms,
                 transform 0.75s cubic-bezier(.22,.68,0,1.2) ${delay}ms`,
  });

  return (
    <>
      {/* Inject keyframes once */}
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      <section
        ref={sectionRef}
        className="relative w-full min-h-screen bg-black overflow-visible flex flex-col items-center pt-20 font-['Power_Grotesk'] text-white"
        style={{ paddingBottom: '120px' }}
      >

        {/* ── Background world map ── */}
        <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-center opacity-95">
          <Image
            src="/world-map-bg.png"
            alt="World Map"
            width={1400}
            height={800}
            className="w-[90vw] md:w-[1200px] max-w-none object-contain mt-32"
            priority
          />
        </div>

        {/* ── Top centred content ── */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center mt-10 md:mt-16">

          {/* Sunburst — bigger, slowly rotating */}
          <div className="relative inline-block">
            <div
              className="absolute pointer-events-none z-[-1]"
              style={{
                top: '50%',
                left: '50%',
                width: '260%',
                height: '260%',
                animation: 'sunburstSpin 60s linear infinite',
              }}
            >
              <Image src="/sunburst-lines.png" alt="Sunburst" fill className="object-contain" priority />
            </div>

            <h1
              className="text-6xl sm:text-7xl md:text-8xl lg:text-[96px] font-black tracking-tight leading-none mb-6"
              style={fadeUp(100)}
            >
              Start Your Journey.<span className="text-[#96CA45]">!</span>
            </h1>
          </div>

          {/* Avatars + count */}
          <div className="flex flex-row items-center justify-center gap-3 mt-4" style={fadeUp(260)}>
            <Image
              src="/avatars-group.png"
              alt="Trusted Students"
              width={160}
              height={40}
              className="h-8 md:h-10 w-auto"
            />
            <span className="text-[#CACACA] text-xs md:text-sm font-medium tracking-wide">
              1600 + Trusted Students
            </span>
          </div>
        </div>

        {/* ── Bottom split ── */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-auto pt-48 md:pt-64 lg:pt-80 flex flex-col lg:flex-row items-end justify-between gap-12">

          {/* ── Left: description + CTA + arrow callout ── */}
          <div className="max-w-xs w-full relative z-20" style={{ paddingBottom: '120px' }}>
            <p
              className="text-white font-bold leading-snug mb-4"
              style={{
                ...fadeUp(400),
                fontFamily: "'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif",
                fontSize: 'clamp(18px,2vw,28px)',
                lineHeight: '33px',
              }}
            >
              Connect with the people who love building great websites as much as you do.
            </p>
            <p
              className="text-gray-400 leading-relaxed mb-6"
              style={{
                ...fadeUp(520),
                fontFamily: "'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif",
                fontSize: 'clamp(14px,1.4vw,20px)',
                lineHeight: '28px',
              }}
            >
              Our Slack is full of creative devs and designers exchanging feedback, ideas, and
              inspiration. Everyone&apos;s here to make the internet a little better.
            </p>

            {/* Button + arrow callout */}
            <div className="relative" style={fadeUp(640)}>
              <button
                className="hover:brightness-95 active:brightness-90 transition-all"
                style={{
                  width: '228px',
                  height: '54px',
                  background: '#96CA45',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Haffer XH Mono-TRIAL','Courier New','Lucida Console',monospace",
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#000000',
                  letterSpacing: '0.01em',
                  display: 'block',
                }}
              >
                Explore Courses
              </button>

              {/* Arrow + handwritten text — absolutely positioned BELOW the button */}
              <div
                style={{
                  position: 'absolute',
                  top: '60px',      /* sits below the 54px button */
                  left: '60px',
                  width: '300px',
                  pointerEvents: 'none',
                }}
              >
                {/* Bouncing curly arrow */}
                <Image
                  src="/curly-arrow.png"
                  alt="Arrow"
                  width={100}
                  height={60}
                  style={{
                    width: '96px',
                    height: 'auto',
                    animation: 'arrowBounce 2.4s ease-in-out infinite',
                  }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
                />

                {/* Handwritten label */}
                <span
                  style={{
                    position: 'absolute',
                    top: '18px',
                    left: '100px',
                    fontFamily:
                      "'Great Day Personal Use','Great Day Bold Personal Use','Brush Script MT',cursive",
                    fontSize: '26px',
                    lineHeight: '30px',
                    color: '#96CA45',
                    transform: 'rotate(-5deg)',
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Finally, your kind<br />of group chat
                </span>
              </div>
            </div>
          </div>

          {/* ── Right: country cards + wave dots ── */}
          <div
            className="flex flex-col items-end gap-3 w-full lg:w-auto"
            style={{ ...fadeUp(560), paddingBottom: '8px' }}
          >
            {/* Cards row */}
            <div className="flex items-stretch" style={{ gap: 0 }}>
              {COUNTRIES.map((country, idx) => (
                <CountryCard
                  key={country.id}
                  country={country}
                  isActive={activeIdx === idx}
                  onClick={() => handleCardClick(idx)}
                />
              ))}
            </div>

            {/* Auto-cycle progress bar */}
            <div style={{ width: '100%' }}>
              <AutoCycleBar key={cycleKey} duration={AUTO_CYCLE_MS} />
            </div>

            {/* Dot indicators */}
            <div style={{ display: 'flex', gap: '6px', alignSelf: 'flex-end', marginRight: '4px' }}>
              {COUNTRIES.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => handleCardClick(i)}
                  style={{
                    width: activeIdx === i ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: activeIdx === i ? '#96CA45' : 'rgba(255,255,255,0.3)',
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
      </section>
    </>
  );
}