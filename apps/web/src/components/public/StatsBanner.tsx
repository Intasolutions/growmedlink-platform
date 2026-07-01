'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { GraduationCap, Award, Briefcase } from 'lucide-react';
import gsap from 'gsap';

const stats = [
  { value: '4,900+', label: 'Students Placed',           icon: GraduationCap },
  { value: '96%',    label: 'First-Attempt Pass Rate',   icon: Award         },
  { value: '20+',    label: 'Years of Pathway Guidance', icon: Briefcase     },
];

export default function StatsBanner() {
  const prevIndex   = useRef(0);
  const paused      = useRef(false);
  const sectionRef  = useRef<HTMLElement>(null);
  const barRef      = useRef<HTMLDivElement>(null);
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const valueRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs    = useRef<(SVGSVGElement | null)[]>([]);
  const defaultRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animating   = useRef(false);

  /* ── Entrance ── */
  useEffect(() => {
    const section = sectionRef.current;
    const bar     = barRef.current;
    if (!section || !bar) return;

    gsap.set(bar, { y: 50, opacity: 0, scale: 0.97 });
    gsap.set(defaultRefs.current.filter(Boolean), { y: 20, opacity: 0 });

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.to(bar, { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.4)' });
      tl.to(defaultRefs.current.filter(Boolean), { y: 0, opacity: 1, duration: 0.45, stagger: 0.1 }, '-=0.3');
      tl.call(() => activateCard(0, true), [], '+=0.1');
    }, { threshold: 0.2 });

    observer.observe(section);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Activate card ── */
  const activateCard = useCallback((next: number, skipPrev = false) => {
    if (animating.current && !skipPrev) return;
    const prev = prevIndex.current;
    if (next === prev && !skipPrev) return;
    animating.current = true;
    prevIndex.current = next;

    const tl = gsap.timeline({ onComplete: () => { animating.current = false; }, defaults: { ease: 'power3.out' } });

    const prevCard = cardRefs.current[prev];
    const nextCard = cardRefs.current[next];
    const prevDef  = defaultRefs.current[prev];
    const nextDef  = defaultRefs.current[next];
    const nextVal  = valueRefs.current[next];
    const nextLbl  = labelRefs.current[next];
    const nextIcon = iconRefs.current[next];

    if (!skipPrev && prevDef)  tl.to(prevDef,  { opacity: 1, y: 0, scale: 1, duration: 0.28 }, 0);
    if (!skipPrev && prevCard) tl.to(prevCard,  { scale: 0.93, opacity: 0, duration: 0.28, ease: 'power2.in' }, 0);
    else if (prevCard)         gsap.set(prevCard, { scale: 0.93, opacity: 0 });

    if (nextDef)  tl.to(nextDef, { opacity: 0, y: -8, scale: 0.93, duration: 0.22 }, 0.04);

    if (nextCard) {
      gsap.set(nextCard, { scale: 0.9, opacity: 0, display: 'flex' });
      tl.to(nextCard, { scale: 1, opacity: 1, duration: 0.42, ease: 'back.out(1.5)' }, 0.08);
    }
    if (nextVal)  { gsap.set(nextVal,  { y: 16, opacity: 0 }); tl.to(nextVal,  { y: 0, opacity: 1, duration: 0.38 }, 0.2);  }
    if (nextLbl)  { gsap.set(nextLbl,  { y: 12, opacity: 0 }); tl.to(nextLbl,  { y: 0, opacity: 1, duration: 0.36 }, 0.3);  }
    if (nextIcon) { gsap.set(nextIcon, { rotate: -40, scale: 0.5, opacity: 0 }); tl.to(nextIcon, { rotate: -15, scale: 1, opacity: 0.06, duration: 0.55, ease: 'power2.out' }, 0.12); }
  }, []);

  /* ── Auto-cycle ── */
  useEffect(() => {
    const id = setInterval(() => {
      if (!paused.current) activateCard((prevIndex.current + 1) % stats.length);
    }, 2000);
    return () => clearInterval(id);
  }, [activateCard]);

  return (
    <section ref={sectionRef} className="bg-white py-10 sm:py-16 md:py-24 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
        <div
          ref={barRef}
          className="bg-[rgba(150,202,69,1)] rounded-2xl sm:rounded-[20px] w-full shadow-lg"
          style={{ minHeight: 'clamp(90px, 18vw, 160px)' }}
          onMouseEnter={() => { paused.current = true; }}
          onMouseLeave={() => { paused.current = false; }}
        >
          {/* ── Mobile: vertical stack ── Desktop: horizontal row ── */}
          <div className="flex flex-col sm:flex-row items-stretch w-full h-full">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              const isLast = i === stats.length - 1;
              return (
                <div
                  key={i}
                  className={`relative flex flex-1 justify-center items-center cursor-pointer
                    py-5 sm:py-0
                    ${!isLast ? 'border-b border-[rgba(255,255,255,0.25)] sm:border-b-0 sm:border-r sm:border-[rgba(255,255,255,0.25)]' : ''}
                  `}
                  onMouseEnter={() => activateCard(i)}
                  onTouchStart={() => activateCard(i)}
                >
                  {/* Dark active card */}
                  <div
                    ref={el => { cardRefs.current[i] = el; }}
                    className="absolute rounded-xl sm:rounded-[20px] shadow-2xl bg-[#252525] flex-col justify-center items-center overflow-hidden"
                    style={{
                      display: 'none',
                      opacity: 0,
                      position: 'absolute',
                      /* On mobile: inset horizontally flush, expand vertically */
                      inset: 'clamp(-10px,-2vw,-24px) clamp(-2px,-0.5vw,-8px)',
                      zIndex: 20,
                    }}
                  >
                    <Icon
                      ref={el => { iconRefs.current[i] = el as SVGSVGElement | null; }}
                      className="absolute -left-4 -bottom-4 sm:-left-6 sm:-bottom-6 text-white"
                      style={{ opacity: 0, width: 'clamp(80px,14vw,200px)', height: 'clamp(80px,14vw,200px)' }}
                    />
                    <div
                      ref={el => { valueRefs.current[i] = el; }}
                      className="text-[rgba(150,202,69,1)] font-black relative z-10 leading-none"
                      style={{ fontSize: 'clamp(28px,5vw,72px)', opacity: 0 }}
                    >
                      {stat.value}
                    </div>
                    <div
                      ref={el => { labelRefs.current[i] = el; }}
                      className="text-[rgba(150,202,69,1)] font-medium relative z-10 text-center px-2 mt-1"
                      style={{ fontSize: 'clamp(10px,1.2vw,16px)', opacity: 0 }}
                    >
                      {stat.label}
                    </div>
                  </div>

                  {/* Default white text */}
                  <div
                    ref={el => { defaultRefs.current[i] = el; }}
                    className="flex flex-col justify-center items-center relative z-10 px-2 text-center"
                    style={{ opacity: 0 }}
                  >
                    <div
                      className="text-white font-black leading-none"
                      style={{ fontSize: 'clamp(24px,4.5vw,64px)' }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="text-white font-medium mt-1"
                      style={{ fontSize: 'clamp(10px,1.1vw,15px)' }}
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
    </section>
  );
}
