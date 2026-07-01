'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { GraduationCap, Award, Briefcase } from 'lucide-react';
import gsap from 'gsap';

const stats = [
  { value: '4,900+', label: 'Students placed',          icon: GraduationCap },
  { value: '96%',    label: 'First-Attempt Pass Rate',  icon: Award          },
  { value: '20+',    label: 'Years of Pathway Guidance', icon: Briefcase     },
];

export default function StatsBanner() {
  const prevIndex     = useRef(0);
  const paused        = useRef(false);
  const sectionRef    = useRef<HTMLElement>(null);
  const barRef        = useRef<HTMLDivElement>(null);
  const cardRefs      = useRef<(HTMLDivElement | null)[]>([]);   /* dark overlay cards */
  const valueRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs      = useRef<(SVGSVGElement | null)[]>([]);
  const defaultRefs   = useRef<(HTMLDivElement | null)[]>([]);   /* white default items */
  const animating     = useRef(false);

  /* ── Entrance animation on scroll into view ── */
  useEffect(() => {
    const section = sectionRef.current;
    const bar     = barRef.current;
    if (!section || !bar) return;

    gsap.set(bar, { y: 60, opacity: 0, scale: 0.96 });
    gsap.set(defaultRefs.current, { y: 24, opacity: 0 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        /* Bar slides up */
        tl.to(bar, { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.5)' });

        /* Default stat items stagger in */
        tl.to(defaultRefs.current, {
          y: 0, opacity: 1, duration: 0.5, stagger: 0.1,
        }, '-=0.35');

        /* Activate first card after entrance */
        tl.call(() => activateCard(0, true), [], '+=0.15');
      },
      { threshold: 0.25 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Activate a card with GSAP ── */
  const activateCard = useCallback((next: number, skipPrev = false) => {
    if (animating.current && !skipPrev) return;
    const prev = prevIndex.current;
    if (next === prev && !skipPrev) return;
    animating.current = true;
    prevIndex.current = next;

    const prevCard  = cardRefs.current[prev];
    const nextCard  = cardRefs.current[next];
    const nextVal   = valueRefs.current[next];
    const nextLbl   = labelRefs.current[next];
    const nextIcon  = iconRefs.current[next];
    const prevDef   = defaultRefs.current[prev];
    const nextDef   = defaultRefs.current[next];

    const tl = gsap.timeline({
      onComplete: () => { animating.current = false; },
      defaults: { ease: 'power3.out' },
    });

    /* Fade previous default text back in */
    if (!skipPrev && prevDef) {
      tl.to(prevDef, { opacity: 1, y: 0, scale: 1, duration: 0.3 }, 0);
    }

    /* Shrink & fade out previous dark card */
    if (!skipPrev && prevCard) {
      tl.to(prevCard, { scale: 0.92, opacity: 0, duration: 0.3, ease: 'power2.in' }, 0);
    } else if (prevCard) {
      gsap.set(prevCard, { scale: 0.92, opacity: 0 });
    }

    /* Hide next default text */
    if (nextDef) tl.to(nextDef, { opacity: 0, y: -8, scale: 0.92, duration: 0.25 }, 0.05);

    /* Scale in next dark card */
    if (nextCard) {
      gsap.set(nextCard, { scale: 0.88, opacity: 0, display: 'flex' });
      tl.to(nextCard, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.6)' }, 0.1);
    }

    /* Stagger value + label up inside the card */
    if (nextVal) {
      gsap.set(nextVal, { y: 18, opacity: 0 });
      tl.to(nextVal, { y: 0, opacity: 1, duration: 0.4 }, 0.22);
    }
    if (nextLbl) {
      gsap.set(nextLbl, { y: 14, opacity: 0 });
      tl.to(nextLbl, { y: 0, opacity: 1, duration: 0.38 }, 0.32);
    }

    /* Icon sweeps in */
    if (nextIcon) {
      gsap.set(nextIcon, { rotate: -45, scale: 0.5, opacity: 0 });
      tl.to(nextIcon, { rotate: -15, scale: 1, opacity: 0.06, duration: 0.6, ease: 'power2.out' }, 0.15);
    }

  }, []);

  /* ── Auto-cycle ── */
  useEffect(() => {
    const id = setInterval(() => {
      if (!paused.current) {
        const next = (prevIndex.current + 1) % stats.length;
        activateCard(next);
      }
    }, 2000);
    return () => clearInterval(id);
  }, [activateCard]);

  return (
    <section ref={sectionRef} className="bg-white py-20 md:py-32 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        <div
          ref={barRef}
          className="bg-[rgba(150,202,69,1)] rounded-[20px] h-32 md:h-40 flex items-stretch relative shadow-lg w-full"
          onMouseEnter={() => { paused.current = true; }}
          onMouseLeave={() => { paused.current = false; }}
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="flex-1 relative flex justify-center items-center cursor-pointer"
                onMouseEnter={() => activateCard(i)}
              >
                {/* Dark active card — controlled entirely by GSAP */}
                <div
                  ref={el => { cardRefs.current[i] = el; }}
                  className="absolute inset-x-[-10px] sm:inset-x-0 -inset-y-4 md:-inset-y-6 rounded-[20px] shadow-2xl bg-[#252525] flex-col justify-center items-center overflow-hidden"
                  style={{ display: 'none', opacity: 0, position: 'absolute' }}
                >
                  <Icon
                    ref={el => { iconRefs.current[i] = el as SVGSVGElement | null; }}
                    className="absolute -left-6 -bottom-6 w-40 h-40 md:w-56 md:h-56 text-white"
                    style={{ opacity: 0 }}
                  />
                  <div
                    ref={el => { valueRefs.current[i] = el; }}
                    className="text-[rgba(150,202,69,1)] text-5xl md:text-7xl font-black mb-1 md:mb-2 relative z-10"
                    style={{ opacity: 0 }}
                  >
                    {stat.value}
                  </div>
                  <div
                    ref={el => { labelRefs.current[i] = el; }}
                    className="text-[rgba(150,202,69,1)] text-xs md:text-base font-medium relative z-10"
                    style={{ opacity: 0 }}
                  >
                    {stat.label}
                  </div>
                </div>

                {/* Default white text — visible when inactive */}
                <div
                  ref={el => { defaultRefs.current[i] = el; }}
                  className="flex flex-col justify-center items-center relative z-10"
                  style={{ opacity: 0 }}
                >
                  <div className="text-white text-4xl md:text-6xl font-black mb-1 md:mb-2">
                    {stat.value}
                  </div>
                  <div className="text-white text-xs md:text-base font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
