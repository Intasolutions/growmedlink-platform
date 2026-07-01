'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';

/* Keyframes: pre-arrow-float — defined in globals.css */

/* ── helpers ── */
function getServiceImage(s: any): string {
  if (!s) return '';
  if (s.image && typeof s.image === 'object' && s.image.secureUrl) return s.image.secureUrl;
  if (typeof s.image === 'string' && s.image) return s.image;
  return '';
}

const FALLBACK = ['/about/3.jpg', '/about/7.jpg'];

/* ── stacking positions (rest = fully stacked behind centre) ── */
const REST = [
  { x:  '0%', rotate:  0, scale: 1,    z: 1 },   // left back
  { x:  '0%', rotate:  0, scale: 1,    z: 3 },   // centre (hero card)
  { x:  '0%', rotate:  0, scale: 1,    z: 2 },   // right back
];

/* ── fan-out targets on hover ── */
const FAN = [
  { x: '-62%', rotate: -18, scale: 0.90, z: 1 },
  { x:   '0%', rotate:   0, scale: 1.00, z: 3 },
  { x:  '62%', rotate:  18, scale: 0.90, z: 2 },
];

interface Props { services?: any[] }

export default function PreNursingMatters({ services = [] }: Props) {
  const sunburstRef = useRef<HTMLDivElement>(null);
  const cardEls     = useRef<(HTMLDivElement | null)[]>([]);
  const calloutRef  = useRef<HTMLDivElement>(null);
  const revealedRef = useRef(false);
  const fannedRef   = useRef(false);

  /* pick two service images, fall back to static about/ photos */
  const leftImg  = getServiceImage(services[0]) || FALLBACK[0];
  const rightImg = getServiceImage(services[1]) || FALLBACK[1];
  const leftLink  = services[0]?.slug ? `/services/${services[0].slug}` : '/services';
  const rightLink = services[1]?.slug ? `/services/${services[1].slug}` : '/services';

  /* ── Parallax sunburst ── */
  useEffect(() => {
    let ticking = false;
    const apply = () => {
      ticking = false;
      if (sunburstRef.current)
        sunburstRef.current.style.transform = `translate(-50%,-50%) rotate(${window.scrollY * 0.18}deg)`;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(apply); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    apply();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Scroll-reveal: callout arrow ── */
  useEffect(() => {
    const el = calloutRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || revealedRef.current) return;
      revealedRef.current = true;
      io.disconnect();
      gsap.fromTo(el,
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.2)',
          onComplete: () => { el.style.animation = 'pre-arrow-float 2.6s ease-in-out infinite'; },
        }
      );
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* ── Initial: stack all cards perfectly on top of each other ── */
  useEffect(() => {
    cardEls.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, { x: REST[i].x, rotate: REST[i].rotate, scale: REST[i].scale, zIndex: REST[i].z });
    });
  }, []);

  /* ── Fan out ── */
  const fanOut = () => {
    if (fannedRef.current) return;
    fannedRef.current = true;
    cardEls.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        x: FAN[i].x,
        rotate: FAN[i].rotate,
        scale: FAN[i].scale,
        zIndex: FAN[i].z,
        duration: 0.58,
        ease: 'back.out(1.5)',
        overwrite: 'auto',
      });
    });
  };

  /* ── Fan in ── */
  const fanIn = () => {
    if (!fannedRef.current) return;
    fannedRef.current = false;
    cardEls.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        x: REST[i].x,
        rotate: REST[i].rotate,
        scale: REST[i].scale,
        zIndex: REST[i].z,
        duration: 0.45,
        ease: 'power3.inOut',
        overwrite: 'auto',
      });
    });
  };

  return (
    <section
      className="bg-white relative overflow-hidden font-['Power_Grotesk'] text-[#252525]"
      style={{ paddingTop: 'clamp(48px,8vw,96px)', paddingBottom: 'clamp(64px,10vw,128px)' }}
    >
      {/* Crosshair lines */}
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gray-200 pointer-events-none z-0" />
      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gray-200 pointer-events-none z-0" />

      {/* Rotating sunburst */}
      <div
        ref={sunburstRef}
        className="absolute top-1/2 left-1/2 pointer-events-none z-0 opacity-35 will-change-transform"
        style={{
          width: 'clamp(600px,85vw,1100px)',
          height: 'clamp(600px,85vw,1100px)',
          transform: 'translate(-50%,-50%)',
        }}
      >
        <Image src="/light-sunburst.png" alt="" fill className="object-contain" />
      </div>

      <div
        className="max-w-[1440px] mx-auto relative z-10 flex flex-col items-center text-center"
        style={{ paddingLeft: 'clamp(16px,4vw,64px)', paddingRight: 'clamp(16px,4vw,64px)' }}
      >
        {/* ── Heading ── */}
        <h2
          className="font-medium tracking-tight"
          style={{ fontSize: 'clamp(26px,4.5vw,56px)', marginBottom: 'clamp(14px,2vw,24px)' }}
        >
          Nursing Dreams,{' '}
          <span className="text-[#96CA45] font-bold">Made Possible.</span>
        </h2>

        {/* ── Body copy ── */}
        <p
          className="leading-relaxed max-w-3xl text-[#252525] mx-auto"
          style={{
            fontSize: 'clamp(14px,1.5vw,20px)',
            marginBottom: 'clamp(32px,5vw,64px)',
          }}
        >
          GrowMedLink helps nurses transform ambition into achievement through expert-led training,
          personalised support, and practical preparation for a successful global healthcare career.
        </p>

        {/* ── Card fan stage ── */}
        <div
          className="relative flex items-center justify-center cursor-pointer select-none"
          style={{
            /* stage is wider than card to give room for fanned cards */
            width: '100%',
            maxWidth: 'clamp(320px,80vw,900px)',
            /* height = card height + some vertical breathing room */
            height: 'clamp(220px,40vw,460px)',
            marginBottom: 'clamp(16px,3vw,40px)',
          }}
          onMouseEnter={fanOut}
          onMouseLeave={fanIn}
          onTouchStart={fanOut}
          onTouchEnd={fanIn}
        >
          {/* Watermark words — rendered behind everything */}
          <span
            className="absolute pointer-events-none select-none font-bold text-gray-200 tracking-widest z-0"
            style={{
              fontSize: 'clamp(20px,4vw,60px)',
              left: '0',
              top: '50%',
              transform: 'translateY(-50%) translateX(-30%)',
              whiteSpace: 'nowrap',
            }}
          >
            EXPLORE
          </span>
          <span
            className="absolute pointer-events-none select-none font-bold text-gray-200 tracking-widest z-0"
            style={{
              fontSize: 'clamp(20px,4vw,60px)',
              right: '0',
              top: '50%',
              transform: 'translateY(-50%) translateX(30%)',
              whiteSpace: 'nowrap',
            }}
          >
            MORE !
          </span>

          {/* ── Card 0 — left photo (service / fallback) ── */}
          <div
            ref={el => { cardEls.current[0] = el; }}
            className="absolute rounded-2xl overflow-hidden shadow-2xl"
            style={{
              width:  'clamp(180px,44vw,460px)',
              height: 'clamp(130px,26vw,300px)',
              left: '50%', top: '50%',
              marginLeft: 'calc(clamp(180px,44vw,460px) / -2)',
              marginTop:  'calc(clamp(130px,26vw,300px) / -2)',
              willChange: 'transform',
              transformOrigin: 'bottom center',
            }}
          >
            <Image src={leftImg} alt="Service" fill className="object-cover" sizes="50vw" />
            <div className="absolute inset-0 bg-black/25" />
          </div>

          {/* ── Card 1 — centre: green overlay card ── */}
          <div
            ref={el => { cardEls.current[1] = el; }}
            className="absolute rounded-2xl overflow-hidden shadow-2xl"
            style={{
              width:  'clamp(180px,44vw,460px)',
              height: 'clamp(130px,26vw,300px)',
              left: '50%', top: '50%',
              marginLeft: 'calc(clamp(180px,44vw,460px) / -2)',
              marginTop:  'calc(clamp(130px,26vw,300px) / -2)',
              willChange: 'transform',
              transformOrigin: 'bottom center',
            }}
          >
            {/* Background photo */}
            <Image src="/pre-nursing-photo.png" alt="GrowMedLink" fill className="object-cover" sizes="50vw" />
            {/* Green overlay */}
            <div className="absolute inset-0" style={{ background: 'rgba(150,202,69,0.82)' }} />
            {/* Content on top of overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 sm:gap-5 px-4 sm:px-8 z-10">
              <p
                className="text-[#252525] font-bold text-center leading-tight font-['Power_Grotesk']"
                style={{ fontSize: 'clamp(16px,2.8vw,32px)' }}
              >
                Your Global Nursing{' '}
                <span className="text-white">Career</span>{' '}
                Starts Here.
              </p>
              <Link
                href="/services"
                className="bg-white text-[#252525] font-semibold font-['Power_Grotesk'] rounded-full hover:bg-[#252525] hover:text-white transition-colors duration-300"
                style={{
                  fontSize: 'clamp(11px,1.3vw,16px)',
                  padding: 'clamp(8px,1vw,14px) clamp(16px,2.5vw,36px)',
                }}
              >
                Explore Courses
              </Link>
            </div>
          </div>

          {/* ── Card 2 — right photo (service / fallback) ── */}
          <div
            ref={el => { cardEls.current[2] = el; }}
            className="absolute rounded-2xl overflow-hidden shadow-2xl"
            style={{
              width:  'clamp(180px,44vw,460px)',
              height: 'clamp(130px,26vw,300px)',
              left: '50%', top: '50%',
              marginLeft: 'calc(clamp(180px,44vw,460px) / -2)',
              marginTop:  'calc(clamp(130px,26vw,300px) / -2)',
              willChange: 'transform',
              transformOrigin: 'bottom center',
            }}
          >
            <Image src={rightImg} alt="Service" fill className="object-cover" sizes="50vw" />
            <div className="absolute inset-0 bg-black/25" />
          </div>
        </div>

        {/* ── Arrow callout ── */}
        <div
          ref={calloutRef}
          className="relative z-10 flex flex-col items-start"
          style={{
            opacity: 0,
            alignSelf: 'flex-end',
            marginRight: 'clamp(8px,8vw,120px)',
            pointerEvents: 'none',
            width: 'clamp(150px,22vw,280px)',
          }}
        >
          <div style={{ transform: 'rotate(-10deg)', transformOrigin: 'top center', display: 'inline-block' }}>
            <Image
              src="/red-curly-arrow.png"
              alt=""
              width={100}
              height={100}
              className="h-auto"
              style={{ width: 'clamp(32px,4vw,56px)', marginLeft: '32px' }}
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

        {/* ── Social proof ── */}
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
