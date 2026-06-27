'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

/*
  Handwritten callout animation rules (same pattern as Hero):
  ─ Outer wrapper: arrowFloat (translateY only) — GPU composited, no jitter
  ─ Static rotate(-Xdeg) lives on a non-animated inner element
  ─ Text has its own static rotate — NEVER nested inside animated element
*/
const KEYFRAMES = `
  @keyframes preNurseArrowFloat {
    0%,100% { transform: translate3d(0, 0px, 0);  }
    50%      { transform: translate3d(0, -6px, 0); }
  }
  @keyframes preNurseReveal {
    from { opacity: 0; transform: translate3d(0, 16px, 0); }
    to   { opacity: 1; transform: translate3d(0, 0px, 0);    }
  }
`;

export default function PreNursingMatters() {
  const sunburstRef  = useRef<HTMLDivElement>(null);
  const calloutRef   = useRef<HTMLDivElement>(null);
  const [calloutIn, setCalloutIn] = useState(false);

  /* Parallax sunburst on scroll — rAF-throttled so the style write happens
     at most once per rendered frame instead of once per raw scroll event
     (raw scroll events can fire far more often than 60fps and otherwise
     flood the main thread, which is what causes visible jitter/vibration
     across the page's other running animations). */
  useEffect(() => {
    let ticking = false;
    const applyTransform = () => {
      ticking = false;
      if (sunburstRef.current) {
        const rotation = window.scrollY * 0.2;
        sunburstRef.current.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
      }
    };
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(applyTransform);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    applyTransform();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* IntersectionObserver — trigger callout reveal when section scrolls into view */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCalloutIn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    if (calloutRef.current) observer.observe(calloutRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-white py-24 relative overflow-hidden font-['Power_Grotesk'] text-[#252525]">
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      {/* Crosshair lines */}
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gray-200 pointer-events-none z-0" />
      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gray-200 pointer-events-none z-0" />

      {/* Rotating sunburst */}
      <div
        ref={sunburstRef}
        className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] pointer-events-none z-0 opacity-40 will-change-transform"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <Image src="/light-sunburst.png" alt="" fill className="object-contain" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">

        {/* Heading */}
        <h2 className="text-4xl md:text-[56px] font-medium mb-6 tracking-tight bg-white px-8">
          Why <span className="text-[#96CA45] font-bold">Pre-Nursing</span> Matters
        </h2>

        {/* Body copy */}
        <div className="bg-white px-8 py-2 mb-10 z-10">
          <p className="text-base md:text-[22px] leading-relaxed max-w-4xl text-[#252525]">
            T Purus In In Fames Sit Ac Vitae. Curabitur Scelerisque Nunc Mauris Blandit. Donec
            Tristique Placerat Consectetur Molestie Est Ornare. Suspendisse Aliquet Semper Quam
            Volutpat Bibendum Est Mattis. Sed Neque Etiam Morbi A Amet Lacus Phasellus Ipsum Nec.
          </p>
        </div>

        {/* Centerpiece image container */}
        <div ref={calloutRef} className="relative w-full max-w-[700px] mt-2 mb-12">

          {/* Faint watermarks */}
          <div className="absolute bottom-1/2 mb-2 -left-4 md:-left-[180px] lg:-left-[220px] text-4xl md:text-5xl lg:text-6xl font-bold text-gray-200 tracking-widest pointer-events-none whitespace-nowrap opacity-50 select-none z-0">
            EXPLORE
          </div>
          <div className="absolute bottom-1/2 mb-2 -right-4 md:-right-[160px] lg:-right-[200px] text-4xl md:text-5xl lg:text-6xl font-bold text-gray-200 tracking-widest pointer-events-none whitespace-nowrap opacity-50 select-none z-0">
            MORE !
          </div>

          {/* The image */}
          <div className="relative z-10 w-full max-w-[350px] md:max-w-[450px] mx-auto h-[150px] md:h-[220px] rounded-[20px] overflow-hidden shadow-xl">
            <Image
              src="/pre-nursing-photo.png"
              alt="Pre-Nursing Matters"
              fill
              className="object-cover"
            />
          </div>

          {/*
            Handwritten callout — anti-jitter architecture (same as Hero):
            ┌─ outer div: scroll-reveal + arrowFloat (translateY only, willChange:transform)
            │   ├─ rotate wrapper: static rotate(-10deg), no animation
            │   │   └─ Image: curly arrow
            │   └─ span: static rotate(-4deg), no animation
          */}
          <div
            className="absolute bottom-[-80px] md:bottom-[-100px] right-[4%] sm:right-[8%] md:right-[10%] z-20"
            style={{
              pointerEvents: 'none',
              width: 'clamp(200px, 28vw, 320px)',
              /* Scroll-triggered reveal */
              opacity: calloutIn ? 1 : 0,
              animation: calloutIn
                ? `preNurseReveal 0.7s cubic-bezier(.22,.68,0,1.2) both,
                   preNurseArrowFloat 2.6s ease-in-out 0.8s infinite`
                : 'none',
              willChange: 'transform, opacity',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Arrow — static rotation, never animated */}
            <div style={{ transform: 'rotate(-10deg)', transformOrigin: 'top center', display: 'inline-block' }}>
              <Image
                src="/red-curly-arrow.png"
                alt=""
                width={100}
                height={100}
                className="w-12 md:w-16 h-auto"
                style={{ marginLeft: '40px' }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
              />
            </div>

            {/* Handwritten text — sibling to the arrow wrapper, own static rotate */}
            <span
              style={{
                display: 'block',
                fontFamily:
                  "'Great Day Personal Use','Great Day Bold Personal Use','Brush Script MT',cursive",
                fontSize: 'clamp(28px, 3.5vw, 38px)',
                lineHeight: 1.3,
                paddingBottom: '12px', /* Prevent script descender clipping */
                color: '#b31b1b',
                transform: 'rotate(-3deg)',
                transformOrigin: 'left top',
                marginLeft: '52px',
                marginTop: '2px',
                whiteSpace: 'nowrap',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
              }}
            >
              See How Its Work!
            </span>
          </div>

        </div>

        {/* Avatars at bottom */}
        <div className="mt-28 md:mt-32 flex flex-row items-center justify-center gap-3 relative z-10">
          <Image src="/avatars-group.png" alt="Trusted Students" width={160} height={40} className="h-6 md:h-8 w-auto" />
          <span className="text-[#252525] text-xs md:text-sm font-medium tracking-wide">
            1600 + Trusted Students
          </span>
        </div>

      </div>
    </section>
  );
}
