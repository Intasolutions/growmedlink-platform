'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';

export default function FeaturedServices({ services }: { services: any[] }) {
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
            {/* Shimmer overlay */}
            <div
              style={{
                position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
                background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent)',
                backgroundSize: '400px 100%',
                animation: 'fs-shimmer 3.5s ease-in-out infinite',
              }}
            />

            {/* Ambient orb */}
            <div
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
            <DeckStack
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

/* ── Stable rest positions for the stack (pos 0 = active front) ── */
const CARD_REST: { x: number; y: number; rotation: number; scale: number }[] = [
  { x:   0, y:  0, rotation:  0,   scale: 1    },
  { x:  -6, y:  5, rotation: -2,   scale: 0.97 },
  { x:   8, y: -4, rotation:  3,   scale: 0.94 },
  { x: -10, y:  8, rotation: -4,   scale: 0.91 },
  { x:   6, y:  6, rotation:  2.5, scale: 0.88 },
];

/* Fan transforms used at mid-shuffle peak */
const CARD_FAN: { x: number; y: number; rotation: number; scale: number }[] = [
  { x:  -5, y: -12, rotation: -5,  scale: 1.02 },
  { x:  18, y:  10, rotation:  4,  scale: 0.98 },
  { x: -14, y: -15, rotation: -2,  scale: 1.00 },
  { x:  20, y:   8, rotation:  6,  scale: 0.99 },
  { x:  -8, y: -10, rotation: -3,  scale: 0.97 },
];

function DeckStack({
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

  const restOf = (pos: number) => CARD_REST[Math.min(pos, CARD_REST.length - 1)];

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
        x: r.x + CARD_FAN[i % CARD_FAN.length].x * 0.35,
        y: r.y + CARD_FAN[i % CARD_FAN.length].y * 0.35,
        rotation: r.rotation + CARD_FAN[i % CARD_FAN.length].rotation * 0.4,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: true,
      }, 0);
    }

    /* ── STEP 2 (0.1s → 0.45s): Full fan-out ── */
    for (let i = 0; i < n; i++) {
      const el = wrapRefs.current[i];
      if (!el) continue;
      const fan = CARD_FAN[i % CARD_FAN.length];
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