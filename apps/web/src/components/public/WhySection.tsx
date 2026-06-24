'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

// Bracket data — positions/sizes from Figma CSS, within 237.6 × 238.48 container
const CW = 237.6, CH = 238.48;
const BRACKETS = [
  { left: 89.39, top: 0,      w: 148.21, h: 147.66, entryDelay: '0.45s', floatDelay: '1.15s', floatDur: '3.4s' },
  { left: 44.23, top: 86.59,  w: 107.92, h: 107.52, entryDelay: '0.62s', floatDelay: '1.35s', floatDur: '2.9s' },
  { left: 0,     top: 151.64, w: 87.16,  h: 86.83,  entryDelay: '0.79s', floatDelay: '1.55s', floatDur: '3.7s' },
];

const BRAND = 'GroMedLink'.split('');

export default function WhySection() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Intersection observer — triggers entrance animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  // Scroll parallax — sets --par CSS custom property on card
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const update = () => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--par', String(r.top + r.height / 2 - window.innerHeight / 2));
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const v = visible;

  return (
    <section className="bg-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <style>{`

        /* ══ CARD ══════════════════════════════════════════════════════════════
           Entrance: fades in + scales up from 96% to 100%.
        */
        .why-card {
          background: #F0F0F0;
          border-radius: 1000px;
          display: flex;
          flex-direction: row;
          align-items: center;
          width: 100%;
          max-width: 1200px;
          height: clamp(380px, 45vw, 620px);
          position: relative;
          overflow: hidden;
          opacity: 0;
          scale: 0.96;
          transition:
            opacity 0.8s ease,
            scale   0.8s cubic-bezier(.22,.68,0,1.1);
        }
        .why-card.is-visible {
          opacity: 1;
          scale: 1;
        }

        /* ══ IMAGE ═════════════════════════════════════════════════════════════
           1. Wipe overlay (::after) slides away from left→right, revealing image.
           2. The <img> starts slightly zoomed in (1.1×) and eases to 1× (Ken Burns).
           3. Scroll parallax: image drifts up as card moves through viewport.
        */
        .why-img-wrap {
          flex-shrink: 0;
          width: 52.2%;
          height: 82%;
          align-self: center;
          border-radius: 0 400px 400px 0;
          overflow: hidden;
          position: relative;
          filter: grayscale(100%);
          /* Parallax — image drifts upward as user scrolls past */
          transform: translateY(calc(var(--par, 0) * -0.045px));
          transition: transform 0.08s linear;
          will-change: transform;
        }

        /* Wipe overlay — covers image, slides away on .revealed */
        .why-img-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background: #F0F0F0;
          z-index: 2;
          transform-origin: right center;
          transform: scaleX(1);
          transition: transform 1.2s cubic-bezier(0.77, 0, 0.175, 1) 0.05s;
          will-change: transform;
        }
        .why-img-wrap.revealed::after {
          transform: scaleX(0);
        }

        /* Ken Burns zoom-out on the Next.js <img> element */
        .why-img-wrap img {
          transform: scale(1.1);
          transition: transform 1.8s cubic-bezier(.22,.68,0,1.05) 0.05s;
          will-change: transform;
        }
        .why-img-wrap.revealed img {
          transform: scale(1);
        }

        /* ══ BRACKETS ══════════════════════════════════════════════════════════
           1. Each bracket springs in from scale(0) — transform-origin at top-right
              (where the ⌐ corner lives), with a staggered spring easing.
           2. After entering, each bracket gently floats up and down at its own pace.
           3. Scroll parallax: brackets drift downward (opposite of image).
           4. Hover: scale up + brightness boost via .step-icon-wrap.
        */
        .step-icons {
          position: absolute;
          left: 30%;
          top: 72.8%;
          width: 16.5%;
          height: 25.9%;
          pointer-events: none;
          z-index: 10;
          /* Parallax — brackets drift downward opposite to image */
          transform: translateY(calc(var(--par, 0) * 0.022px));
          transition: transform 0.08s linear;
          will-change: transform;
        }

        /* Bracket entrance: spring scale from the ⌐ corner (top-right) */
        .bracket-item {
          position: absolute;
          scale: 0;
          transform-origin: top right;
          will-change: scale, translate;
        }
        .bracket-item.in {
          scale: 1;
          transition: scale 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) var(--entry-delay, 0s);
          animation-name: bfloat;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-fill-mode: both;
          animation-duration: var(--float-dur, 3.4s);
          animation-delay: var(--float-delay, 1.2s);
        }

        @keyframes bfloat {
          0%, 100% { translate: 0 0; }
          50%       { translate: 0 -5px; }
        }

        /* Hover — on the inner wrapper so it doesn't fight the float animation */
        .step-icon-wrap {
          width: 100%;
          height: 100%;
          display: block;
          transition:
            transform 0.38s cubic-bezier(0.34, 1.56, 0.64, 1),
            filter    0.38s ease;
        }
        @media (hover: hover) {
          .step-icon-wrap:hover {
            transform: scale(1.15) translateY(-5px);
            filter: brightness(1.2) saturate(1.15);
          }
        }

        /* ══ RIGHT COLUMN ══════════════════════════════════════════════════════ */
        .why-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 clamp(24px, 4.5vw, 64px) 0 clamp(16px, 2.5vw, 32px);
        }

        /* "Why" — slides up + fades in */
        .why-word {
          display: block;
          font-family: 'Haffer XH-TRIAL', 'Helvetica Neue', Arial, sans-serif;
          font-weight: 400;
          font-size: clamp(28px, 4.5vw, 60px);
          line-height: 1.15;
          letter-spacing: -0.03em;
          color: #252525;
          opacity: 0;
          translate: 0 36px;
          transition:
            opacity   0.65s ease                         0.18s,
            translate 0.65s cubic-bezier(.22,.68,0,1.3)  0.18s;
          will-change: opacity, translate;
        }
        .why-word.is-visible {
          opacity: 1;
          translate: 0 0;
        }

        /* "GroMedLink" — character-by-character wave */
        .brand-wrap {
          display: block;
          font-family: 'Haffer XH-TRIAL', 'Helvetica Neue', Arial, sans-serif;
          font-weight: 400;
          font-size: clamp(28px, 4.5vw, 60px);
          line-height: 1.15;
          letter-spacing: -0.03em;
          color: #96CA45;
          margin-bottom: clamp(10px, 2vw, 20px);
        }

        .char {
          display: inline-block;
          opacity: 0;
          translate: 0 30px;
          transition:
            opacity   0.45s ease,
            translate 0.45s cubic-bezier(.22,.68,0,1.35);
          will-change: opacity, translate;
        }
        .char.is-visible {
          opacity: 1;
          translate: 0 0;
        }

        /* Underline draws from left to right after text appears */
        .brand-underline {
          display: block;
          height: 2px;
          background: #96CA45;
          border-radius: 1px;
          width: 0;
          transition: width 1s cubic-bezier(0.77, 0, 0.175, 1) 0.82s;
          will-change: width;
        }
        .brand-underline.is-visible {
          width: 100%;
        }

        /* Body text — fades up */
        .why-body {
          font-family: 'Haffer XH-TRIAL', 'Helvetica Neue', Arial, sans-serif;
          font-size: clamp(12px, 1.25vw, 16px);
          line-height: 1.6;
          letter-spacing: 0.01em;
          text-transform: capitalize;
          color: #000;
          font-weight: 400;
          max-width: 440px;
          opacity: 0;
          translate: 0 14px;
          transition:
            opacity   0.7s ease                          0.74s,
            translate 0.7s cubic-bezier(.22,.68,0,1.1)  0.74s;
          will-change: opacity, translate;
        }
        .why-body.is-visible {
          opacity: 1;
          translate: 0 0;
        }

        /* ══ MOBILE ════════════════════════════════════════════════════════════ */
        @media (max-width: 767px) {
          .why-card {
            flex-direction: column;
            border-radius: 48px;
            height: auto;
            max-width: 480px;
            padding-bottom: 40px;
            overflow: hidden;
            gap: 24px;
          }
          .why-img-wrap {
            width: 100%;
            height: 220px;
            border-radius: 0 0 150px 150px;
            align-self: unset;
            transform: none !important;
          }
          .step-icons {
            left: auto;
            right: 8%;
            top: auto;
            bottom: 38%;
            width: 32%;
            height: auto;
            aspect-ratio: 1;
            transform: none !important;
          }
          .why-right { padding: 16px 24px 24px; }
        }

        /* ══ REDUCED MOTION ════════════════════════════════════════════════════ */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            transition-duration: 0.01ms !important;
            animation-duration:  0.01ms !important;
          }
        }
      `}</style>

      <div
        ref={cardRef}
        className={`why-card${v ? ' is-visible' : ''}`}
      >

        {/* ── IMAGE: D-shape, wipe + Ken Burns + parallax ── */}
        <div className={`why-img-wrap${v ? ' revealed' : ''}`}>
          <Image
            src="/why-image.png"
            alt="Why GroMedLink"
            fill
            className="object-cover object-center"
            priority
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.visibility = 'hidden';
            }}
          />
        </div>

        {/* ── BRACKETS: spring entrance + float + parallax ── */}
        <div className="step-icons">
          {BRACKETS.map(({ left, top, w, h, entryDelay, floatDelay, floatDur }, i) => (
            <div
              key={i}
              className={`bracket-item${v ? ' in' : ''}`}
              style={{
                left:   `${(left / CW) * 100}%`,
                top:    `${(top  / CH) * 100}%`,
                width:  `${(w    / CW) * 100}%`,
                height: `${(h    / CH) * 100}%`,
                '--entry-delay': entryDelay,
                '--float-delay': floatDelay,
                '--float-dur':   floatDur,
              } as React.CSSProperties}
            >
              <div className="step-icon-wrap">
                <BracketIcon />
              </div>
            </div>
          ))}
        </div>

        {/* ── TEXT: staggered character wave + underline ── */}
        <div className="why-right">

          {/* "Why" slides up */}
          <span className={`why-word${v ? ' is-visible' : ''}`}>
            Why
          </span>

          {/* "GroMedLink" — each character waves in sequentially */}
          <span className="brand-wrap">
            {BRAND.map((char, i) => (
              <span
                key={i}
                className={`char${v ? ' is-visible' : ''}`}
                style={{ transitionDelay: `${0.34 + i * 0.04}s` }}
              >
                {char}
              </span>
            ))}
            {/* Green underline draws left-to-right after text */}
            <span className={`brand-underline${v ? ' is-visible' : ''}`} />
          </span>

          {/* Body fades up */}
          <p className={`why-body${v ? ' is-visible' : ''}`}>
            Lorem ipsum dolor sit amet consectetur. Purus in in fames sit ac vitae.
            Curabitur scelerisque nunc mauris blandit. Donec tristique placerat
            consectetur molestie est ornare. Suspendisse aliquet semper quam volutpat
            bibendum est mattis. Sed neque etiam morbi a amet lacus phasellus ipsum
            nec.Lorem ipsum dolor sit amet consectetur.
          </p>

        </div>
      </div>
    </section>
  );
}

/* ── BracketIcon ────────────────────────────────────────────────────────────
   ⌐ shape — single unified SVG path (no seams, no two-piece look).

   Top arm (horizontal, full width) + Right arm (vertical, right side).
   Corner at top-right. Opening at bottom-left.

   Rounded:
     • Left end of top arm   → two Q beziers making a semicircle cap
     • Outer top-right corner → Q bezier (convex)
     • Bottom of right arm   → two Q beziers making a semicircle cap
     • Inner concave corner  → tiny Q bezier (smooth joint between arms)

   All in a 100×100 viewBox. T=37 (arm thickness as % of size).
*/
function BracketIcon() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d={[
          'M 0,18.5',        // left end of top arm, mid-height
          'Q 0,0 18.5,0',    // round top-left cap (convex)
          'L 88,0',          // across the top
          'Q 100,0 100,12',  // round outer top-right corner
          'L 100,81.5',      // down the right side
          'Q 100,100 81.5,100', // round bottom-right cap
          'Q 63,100 63,81.5',   // round bottom-left of right arm cap
          'L 63,42',            // up the inner right wall
          'Q 63,37 58,37',      // smooth inner concave corner
          'L 18.5,37',          // left along bottom of top arm
          'Q 0,37 0,18.5',      // round bottom-left cap
          'Z',
        ].join(' ')}
        fill="#96CA45"
      />
    </svg>
  );
}