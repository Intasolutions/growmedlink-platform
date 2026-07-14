'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

const FS = "'Great Day Personal Use','Brush Script MT',cursive";

const CW = 237.6, CH = 238.48;
const BRACKETS = [
  { left: 89.39, top: 0,      w: 148.21, h: 147.66, entryDelay: 0.55, floatDelay: 1.2,  floatDur: 3.4 },
  { left: 44.23, top: 86.59,  w: 107.92, h: 107.52, entryDelay: 0.70, floatDelay: 1.4,  floatDur: 2.9 },
  { left: 0,     top: 151.64, w: 87.16,  h: 86.83,  entryDelay: 0.85, floatDelay: 1.55, floatDur: 3.7 },
];

const BRAND_TEXT = 'GrowMedLink';

const WHY_POINTS = [
  { icon: '🎓', text: 'Expert-led training by internationally licensed nurses' },
  { icon: '🌍', text: 'Personalised pathway support for 20+ countries' },
  { icon: '📋', text: 'Step-by-step licensure guidance from day one' },
  { icon: '🏆', text: '96% first-attempt pass rate across all programmes' },
];

export default function WhySection() {
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

  /* ── Cursor trail ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

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

      /* 9. Brackets spring in then float */
      bracketRefs.current.forEach((el, i) => {
        if (!el) return;
        const b = BRACKETS[i];
        tl.to(el, { scale: 1, duration: 0.62, ease: 'back.out(1.7)' }, b.entryDelay);
        tl.call(() => {
          gsap.to(el, { y: -5, duration: b.floatDur / 2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        }, [], b.entryDelay + 0.65);
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
              fontFamily: FS,
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
            {BRAND_TEXT.split('').map((char, i) => (
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
            {WHY_POINTS.map((pt, i) => (
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
