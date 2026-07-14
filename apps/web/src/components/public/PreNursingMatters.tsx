'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';

/* ── helpers ── */
function getProductImage(p: any): string {
  if (!p) return '';
  if (p.image && typeof p.image === 'object' && p.image.secureUrl) return p.image.secureUrl;
  if (typeof p.image === 'string' && p.image) return p.image;
  return '';
}

const FALLBACK = ['/about/3.jpg', '/about/7.jpg'];

/* ── rest: all three cards perfectly stacked (only centre visible) ── */
const REST = [
  { x: '0%', rotate:  0, scale: 1, z: 1 },
  { x: '0%', rotate:  0, scale: 1, z: 3 },
  { x: '0%', rotate:  0, scale: 1, z: 2 },
];

/* ── fanned: back cards slide out, centre stays put ── */
const FAN = [
  { x: '-62%', rotate: -18, scale: 0.90, z: 1 },
  { x:   '0%', rotate:   0, scale: 1.00, z: 3 },
  { x:  '62%', rotate:  18, scale: 0.90, z: 2 },
];

interface Props { products?: any[] }

export default function PreNursingMatters({ products = [] }: Props) {
  const sunburstRef  = useRef<HTMLDivElement>(null);
  const cardEls      = useRef<(HTMLDivElement | null)[]>([]);
  const cardStageRef = useRef<HTMLDivElement>(null);
  /* refs for the centre card's animated layers */
  const overlayRef   = useRef<HTMLDivElement>(null);
  const overlayTxtRef = useRef<HTMLDivElement>(null);
  const calloutRef   = useRef<HTMLDivElement>(null);
  const floatTweenRef = useRef<gsap.core.Tween | null>(null);
  const revealedRef  = useRef(false);
  const fannedRef    = useRef(false);

  /* Sort by order field (≥1 only), then take images */
  const sortedProducts = [...products].sort((a, b) => {
    const ao = a.order ?? 0, bo = b.order ?? 0;
    if (ao === 0 && bo === 0) return 0;
    if (ao === 0) return 1;
    if (bo === 0) return -1;
    return ao - bo;
  });
  const centreImg = getProductImage(sortedProducts[0]) || '/pre-nursing-photo.png';
  const leftImg   = getProductImage(sortedProducts[1]) || FALLBACK[0];
  const rightImg  = getProductImage(sortedProducts[2]) || FALLBACK[1];

  /* ── rAF-throttled sunburst parallax ── */
  useEffect(() => {
    let ticking = false;
    const apply = () => {
      ticking = false;
      if (sunburstRef.current)
        sunburstRef.current.style.transform =
          `translate(-50%,-50%) rotate(${window.scrollY * 0.18}deg)`;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(apply); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    apply();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── one-time scroll-reveal + GSAP float loop for arrow callout ── */
  useEffect(() => {
    const el = calloutRef.current;
    if (!el) return;

    /* hide initially via GSAP (no inline style opacity:0 left in DOM) */
    gsap.set(el, { y: 20, opacity: 0 });

    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || revealedRef.current) return;
      revealedRef.current = true;
      io.disconnect();

      /* slide in */
      gsap.to(el, {
        y: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.2)',
        onComplete: () => {
          /* pure GSAP float — no CSS keyframes at all */
          floatTweenRef.current = gsap.to(el, {
            y: -6, duration: 1.3, ease: 'sine.inOut',
            yoyo: true, repeat: -1,
          });
        },
      });
    }, { threshold: 0.2 });

    io.observe(el);
    return () => { io.disconnect(); floatTweenRef.current?.kill(); };
  }, []);

  /* ── set initial stack positions ── */
  useEffect(() => {
    /* overlay + text start fully transparent */
    if (overlayRef.current)    gsap.set(overlayRef.current,    { opacity: 0 });
    if (overlayTxtRef.current) gsap.set(overlayTxtRef.current, { opacity: 0, y: 10 });

    cardEls.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, {
        x: REST[i].x, rotate: REST[i].rotate,
        scale: REST[i].scale, zIndex: REST[i].z,
      });
    });
  }, []);

  /* ── fan out: back cards slide, centre overlay fades in ── */
  const fanOut = () => {
    if (fannedRef.current) return;
    fannedRef.current = true;

    /* back cards */
    [0, 2].forEach(i => {
      const el = cardEls.current[i];
      if (!el) return;
      gsap.to(el, {
        x: FAN[i].x, rotate: FAN[i].rotate, scale: FAN[i].scale,
        duration: 0.55, ease: 'back.out(1.5)', overwrite: 'auto',
      });
    });

    /* centre overlay fades in on top of the clear photo */
    if (overlayRef.current)
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
    if (overlayTxtRef.current)
      gsap.to(overlayTxtRef.current, { opacity: 1, y: 0, duration: 0.45, delay: 0.12, ease: 'power2.out', overwrite: 'auto' });
  };

  /* ── fan in: overlay disappears first, then cards collapse ── */
  const fanIn = () => {
    if (!fannedRef.current) return;
    fannedRef.current = false;

    /* fade out overlay content quickly */
    if (overlayTxtRef.current)
      gsap.to(overlayTxtRef.current, { opacity: 0, y: 8, duration: 0.22, ease: 'power2.in', overwrite: 'auto' });
    if (overlayRef.current)
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.28, ease: 'power2.in', overwrite: 'auto' });

    /* then collapse back cards with slight delay */
    [0, 2].forEach(i => {
      const el = cardEls.current[i];
      if (!el) return;
      gsap.to(el, {
        x: REST[i].x, rotate: REST[i].rotate, scale: REST[i].scale,
        duration: 0.42, delay: 0.08, ease: 'power3.inOut', overwrite: 'auto',
      });
    });
  };

  /* ── scroll-triggered fan-out (replaces hover trigger) ── */
  useEffect(() => {
    const el = cardStageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) fanOut();
    }, { threshold: 0.45 });
    io.observe(el);
    return () => io.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* card size — same for all three so they stack perfectly */
  const cardStyle: React.CSSProperties = {
    width:  'clamp(180px,44vw,460px)',
    height: 'clamp(130px,26vw,300px)',
    position: 'absolute',
    left: '50%', top: '50%',
    marginLeft: 'calc(clamp(180px,44vw,460px) / -2)',
    marginTop:  'calc(clamp(130px,26vw,300px) / -2)',
    willChange: 'transform',
    transformOrigin: 'bottom center',
    borderRadius: '16px',
    overflow: 'hidden',
  };

  return (
    <section
      className="bg-white relative overflow-hidden font-['Power_Grotesk'] text-[#252525]"
      style={{ paddingTop: 'clamp(48px,8vw,96px)', paddingBottom: 'clamp(64px,10vw,128px)' }}
    >
      {/* crosshair lines */}
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gray-200 pointer-events-none z-0" />
      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gray-200 pointer-events-none z-0" />

      {/* rotating sunburst */}
      <div
        ref={sunburstRef}
        className="absolute top-1/2 left-1/2 pointer-events-none z-0 opacity-35 will-change-transform"
        style={{ width: 'clamp(600px,85vw,1100px)', height: 'clamp(600px,85vw,1100px)', transform: 'translate(-50%,-50%)' }}
      >
        <Image src="/light-sunburst.png" alt="" fill className="object-contain" />
      </div>

      <div
        className="max-w-[1440px] mx-auto relative z-10 flex flex-col items-center text-center"
        style={{ paddingLeft: 'clamp(16px,4vw,64px)', paddingRight: 'clamp(16px,4vw,64px)' }}
      >
        {/* heading */}
        <h2
          className="font-medium tracking-tight"
          style={{ fontSize: 'clamp(26px,4.5vw,56px)', marginBottom: 'clamp(14px,2vw,24px)' }}
        >
          Nursing Dreams,{' '}
          <span className="text-[#96CA45] font-bold">Made Possible.</span>
        </h2>

        {/* body copy */}
        <p
          className="leading-relaxed max-w-3xl text-[#252525] mx-auto"
          style={{ fontSize: 'clamp(14px,1.5vw,20px)', marginBottom: 'clamp(32px,5vw,64px)' }}
        >
          GrowMedLink helps nurses transform ambition into achievement through expert-led training,
          personalised support, and practical preparation for a successful global healthcare career.
        </p>

        {/* ── card fan stage ── */}
        <div
          ref={cardStageRef}
          className="relative flex items-center justify-center select-none"
          style={{
            width: '100%',
            maxWidth: 'clamp(320px,80vw,900px)',
            height: 'clamp(220px,40vw,460px)',
            marginBottom: 'clamp(16px,3vw,40px)',
          }}
        >
          {/* watermarks */}
          <span
            className="absolute pointer-events-none select-none font-bold text-gray-200 tracking-widest"
            style={{ fontSize: 'clamp(20px,4vw,60px)', left: 0, top: '50%', transform: 'translateY(-50%) translateX(-30%)', whiteSpace: 'nowrap', zIndex: 0 }}
          >EXPLORE</span>
          <span
            className="absolute pointer-events-none select-none font-bold text-gray-200 tracking-widest"
            style={{ fontSize: 'clamp(20px,4vw,60px)', right: 0, top: '50%', transform: 'translateY(-50%) translateX(30%)', whiteSpace: 'nowrap', zIndex: 0 }}
          >MORE !</span>

          {/* card 0 — left back (photo, dark tint) */}
          <div ref={el => { cardEls.current[0] = el; }} style={{ ...cardStyle, boxShadow: '0 25px 60px rgba(0,0,0,0.25)' }}>
            <Image src={leftImg} alt="Product" fill className="object-cover" sizes="50vw" />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} />
          </div>

          {/* card 1 — centre (first-order product image at rest, green overlay on hover) */}
          <div ref={el => { cardEls.current[1] = el; }} style={{ ...cardStyle, boxShadow: '0 30px 70px rgba(0,0,0,0.30)' }}>
            {/* always-visible clear photo — product with order=0 */}
            <Image src={centreImg} alt="GrowMedLink" fill className="object-cover" sizes="50vw" />

            {/* green tinted overlay — opacity controlled by GSAP */}
            <div
              ref={overlayRef}
              style={{ position: 'absolute', inset: 0, background: 'rgba(150,202,69,0.82)' }}
            />

            {/* text + button on overlay — opacity+y controlled by GSAP */}
            <div
              ref={overlayTxtRef}
              style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 'clamp(10px,1.5vw,20px)',
                padding: 'clamp(12px,2vw,32px)',
                zIndex: 10,
              }}
            >
              <p
                className="font-bold text-center leading-tight font-['Power_Grotesk'] text-[#252525]"
                style={{ fontSize: 'clamp(15px,2.6vw,30px)' }}
              >
                Your Global Nursing{' '}
                <span style={{ color: '#fff' }}>Career</span>{' '}
                Starts Here.
              </p>
              <Link
                href="/products#products"
                style={{
                  background: '#fff',
                  color: '#252525',
                  fontWeight: 600,
                  fontFamily: "'Power_Grotesk', sans-serif",
                  borderRadius: '9999px',
                  fontSize: 'clamp(11px,1.2vw,15px)',
                  padding: 'clamp(7px,0.9vw,13px) clamp(16px,2.2vw,32px)',
                  textDecoration: 'none',
                  transition: 'background 0.28s, color 0.28s',
                  display: 'inline-block',
                  pointerEvents: 'auto',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#252525'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.color = '#252525'; }}
              >
                Explore Courses
              </Link>
            </div>
          </div>

          {/* card 2 — right back (photo, dark tint) */}
          <div ref={el => { cardEls.current[2] = el; }} style={{ ...cardStyle, boxShadow: '0 25px 60px rgba(0,0,0,0.25)' }}>
            <Image src={rightImg} alt="Service" fill className="object-cover" sizes="50vw" />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} />
          </div>
        </div>

        {/* ── arrow callout ── */}
        <div
          ref={calloutRef}
          style={{
            alignSelf: 'flex-end',
            marginRight: 'clamp(8px,8vw,120px)',
            pointerEvents: 'none',
            width: 'clamp(150px,22vw,280px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <div style={{ transform: 'rotate(-10deg)', transformOrigin: 'top center', display: 'inline-block' }}>
            <Image
              src="/red-curly-arrow.png"
              alt=""
              width={100}
              height={100}
              style={{ width: 'clamp(32px,4vw,56px)', height: 'auto', marginLeft: '32px' }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
            />
          </div>
          <span
            style={{
              display: 'block',
              fontFamily: "'Great Day Personal Use','Great Day Bold Personal Use','Brush Script MT',cursive",
              fontSize: 'clamp(20px,2.8vw,36px)',
              lineHeight: 1.3,
              paddingBottom: '12px',
              color: '#b31b1b',
              transform: 'rotate(-3deg)',
              transformOrigin: 'left top',
              marginLeft: '36px',
              marginTop: '2px',
              whiteSpace: 'nowrap',
              WebkitFontSmoothing: 'antialiased',
            }}
          >
            Start Your Journey Today!
          </span>
        </div>

        {/* ── social proof ── */}
        <div
          className="flex flex-row items-center justify-center gap-3 relative z-10"
          style={{ marginTop: 'clamp(20px,3.5vw,40px)' }}
        >
          <Image
            src="/avatars-group.png"
            alt="Trusted Students"
            width={160}
            height={40}
            style={{ height: 'clamp(22px,3vw,34px)', width: 'auto' }}
          />
          <span
            className="text-[#252525] font-medium tracking-wide"
            style={{ fontSize: 'clamp(11px,1vw,14px)' }}
          >
            8,600+ Trusted Global Graduates
          </span>
        </div>
      </div>
    </section>
  );
}
