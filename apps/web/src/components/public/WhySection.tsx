'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

/* All CSS lives in globals.css under the "why-" prefix — no <style> tag here */

const CW = 237.6, CH = 238.48;
const BRACKETS = [
  { left: 89.39, top: 0,      w: 148.21, h: 147.66, entryDelay: 0.45, floatDelay: 1.15, floatDur: 3.4 },
  { left: 44.23, top: 86.59,  w: 107.92, h: 107.52, entryDelay: 0.62, floatDelay: 1.35, floatDur: 2.9 },
  { left: 0,     top: 151.64, w: 87.16,  h: 86.83,  entryDelay: 0.79, floatDelay: 1.55, floatDur: 3.7 },
];

const BRAND_TEXT = 'GrowMedLink';

export default function WhySection() {
  const sectionRef    = useRef<HTMLElement>(null);
  const cardRef       = useRef<HTMLDivElement>(null);
  const imgWrapRef    = useRef<HTMLDivElement>(null);
  const bracketRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const bracketsWrap  = useRef<HTMLDivElement>(null);
  const whyWordRef    = useRef<HTMLSpanElement>(null);
  const charRefs      = useRef<(HTMLSpanElement | null)[]>([]);
  const underlineRef  = useRef<HTMLSpanElement>(null);
  const bodyRef       = useRef<HTMLParagraphElement>(null);
  const triggeredRef  = useRef(false);

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

  /* ── Scroll-triggered entrance (works on all screen sizes) ── */
  useEffect(() => {
    const card    = cardRef.current;
    const imgWrap = imgWrapRef.current;
    if (!card || !imgWrap) return;

    /* Set initial hidden states via GSAP */
    gsap.set(card, { opacity: 0, scale: 0.96 });
    gsap.set(whyWordRef.current, { opacity: 0, y: 36 });
    gsap.set(charRefs.current.filter(Boolean), { opacity: 0, y: 28 });
    gsap.set(underlineRef.current, { width: '0%' });
    gsap.set(bodyRef.current, { opacity: 0, y: 14 });
    bracketRefs.current.forEach(el => { if (el) gsap.set(el, { scale: 0, transformOrigin: 'top right' }); });

    /* Use a low threshold (0.08) so it fires early on mobile small viewports */
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || triggeredRef.current) return;
      triggeredRef.current = true;
      io.disconnect();

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      /* 1. Card fades + scales in */
      tl.to(card, { opacity: 1, scale: 1, duration: 0.75, ease: 'back.out(1.2)' }, 0);

      /* 2. Image wipe — add .revealed class which drives CSS transition on ::after */
      tl.call(() => { imgWrap.classList.add('revealed'); }, [], 0.05);

      /* 3. "Why" word */
      tl.to(whyWordRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.2);

      /* 4. "GrowMedLink" character wave */
      tl.to(charRefs.current.filter(Boolean), {
        opacity: 1, y: 0, duration: 0.42,
        stagger: 0.038,
        ease: 'back.out(1.4)',
      }, 0.36);

      /* 5. Underline draws across */
      tl.to(underlineRef.current, { width: '100%', duration: 0.9, ease: 'power2.inOut' }, 0.82);

      /* 6. Body text */
      tl.to(bodyRef.current, { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, 0.74);

      /* 7. Brackets spring in, then float */
      bracketRefs.current.forEach((el, i) => {
        if (!el) return;
        const b = BRACKETS[i];
        tl.to(el, {
          scale: 1,
          duration: 0.65,
          ease: 'back.out(1.6)',
          delay: 0,
        }, b.entryDelay);

        /* Float loop — starts after entry */
        tl.call(() => {
          gsap.to(el, {
            y: -5, duration: b.floatDur / 2,
            ease: 'sine.inOut', yoyo: true, repeat: -1,
            delay: b.floatDelay - b.entryDelay,
          });
        }, [], b.entryDelay + 0.65);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    io.observe(card);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-white flex items-center justify-center overflow-hidden"
      style={{ padding: 'clamp(32px,5vw,64px) clamp(12px,3vw,32px)' }}
    >
      <div ref={cardRef} className="why-card">

        {/* ── IMAGE: D-shape, wipe-reveal + Ken Burns + parallax ── */}
        <div ref={imgWrapRef} className="why-img-wrap">
          <Image
            src="/why-image.png"
            alt="Why GrowMedLink"
            fill
            className="object-cover object-center"
            priority
            onError={e => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
          />
        </div>

        {/* ── BRACKETS: spring + float ── */}
        <div
          ref={bracketsWrap}
          className="absolute pointer-events-none"
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
          {BRACKETS.map(({ left, top, w, h }, i) => (
            <div
              key={i}
              ref={el => { bracketRefs.current[i] = el; }}
              className="absolute"
              style={{
                left:   `${(left / CW) * 100}%`,
                top:    `${(top  / CH) * 100}%`,
                width:  `${(w    / CW) * 100}%`,
                height: `${(h    / CH) * 100}%`,
              }}
            >
              <div className="step-icon-wrap">
                <BracketIcon />
              </div>
            </div>
          ))}
        </div>

        {/* ── RIGHT COLUMN: text content ── */}
        <div
          className="flex flex-col justify-center"
          style={{
            flex: 1,
            padding: 'clamp(20px,3vw,48px) clamp(20px,4.5vw,64px) clamp(20px,3vw,48px) clamp(12px,2.5vw,32px)',
            /* on mobile this is the bottom section */
            minWidth: 0,
          }}
        >
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
              marginBottom: 'clamp(8px,1.5vw,18px)',
            }}
          >
            {BRAND_TEXT.split('').map((char, i) => (
              <span
                key={i}
                ref={el => { charRefs.current[i] = el; }}
                style={{ display: 'inline-block' }}
              >
                {char}
              </span>
            ))}
            {/* underline draws left → right */}
            <span
              ref={underlineRef}
              style={{
                display: 'block',
                height: '2px',
                background: '#96CA45',
                borderRadius: '1px',
                width: '0%',
              }}
            />
          </span>

          {/* Body copy */}
          <p
            ref={bodyRef}
            style={{
              fontFamily: "'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif",
              fontSize: 'clamp(11px,1.2vw,15px)',
              lineHeight: 1.65,
              letterSpacing: '0.01em',
              color: '#333',
              fontWeight: 400,
              maxWidth: '420px',
            }}
          >
            GrowMedLink transforms nursing ambition into international careers. Through expert-led
            training, personalised mentorship, and step-by-step pathway support, we've helped
            thousands of nurses achieve licensure abroad and build the global healthcare careers
            they deserve.
          </p>
        </div>

      </div>
    </section>
  );
}

/* ── BracketIcon — ⌐ shape SVG ── */
function BracketIcon() {
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
