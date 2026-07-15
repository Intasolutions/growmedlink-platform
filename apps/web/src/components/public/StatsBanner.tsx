'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { GraduationCap, Award, Briefcase } from 'lucide-react';
import gsap from 'gsap';

const stats = [
  { value: '4,900+', label: 'Students Placed',           icon: GraduationCap },
  { value: '96%',    label: 'First-Attempt Pass Rate',   icon: Award         },
  { value: '20+',    label: 'Years of Pathway Guidance', icon: Briefcase     },
];

/* Figma easing: cubic-bezier(0.48, 0.01, 0.2, 1) */
const EASE = 'cubic-bezier(0.48, 0.01, 0.2, 1)';

export default function StatsBanner() {
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
      defaults: { ease: EASE, duration: 0.6 },
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
      if (!paused.current) activateCard((prevIndex.current + 1) % stats.length);
    }, 2000);
    return () => clearInterval(id);
  }, [activateCard]);

  useEffect(() => () => {
    if (touchResumeTimer.current) clearTimeout(touchResumeTimer.current);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-white overflow-hidden"
      style={{ padding: 'clamp(20px,4vw,56px) 0' }}
    >
      <div className="max-w-[1440px] mx-auto" style={{ padding: '0 clamp(12px,3vw,48px)', overflow: 'hidden' }}>

        {/*
          Outer wrapper gives vertical room for the dark card to overflow
          above and below the green bar without clipping.
        */}
        <div
          className="relative"
          style={{ padding: 'clamp(18px,4vw,48px) 0' }}
          onMouseEnter={() => { paused.current = true; }}
          onMouseLeave={() => { paused.current = false; }}
          onTouchStart={() => {
            paused.current = true;
            if (touchResumeTimer.current) clearTimeout(touchResumeTimer.current);
            touchResumeTimer.current = setTimeout(() => { paused.current = false; }, 4000);
          }}
          style={{ touchAction: 'pan-y' }}
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
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                const isLast = i === stats.length - 1;
                return (
                  <div
                    key={i}
                    className="relative flex flex-1 items-center justify-center cursor-pointer"
                    style={{
                      borderRight: !isLast ? '1px solid rgba(255,255,255,0.3)' : 'none',
                    }}
                    onMouseEnter={() => activateCard(i)}
                    onTouchStart={() => activateCard(i)}
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
