'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function FeaturedServices({ services }: { services: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animState, setAnimState] = useState<'idle' | 'exit' | 'enter'>('idle');
  const [direction, setDirection] = useState<'up' | 'down'>('down');
  const [isPaused, setIsPaused] = useState(false);
  const [leftVisible, setLeftVisible] = useState(false);
  const [rightVisible, setRightVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  if (!services || services.length === 0) return null;

  const activeService = services[activeIndex];
  const getImage = (s: any) =>
    s?.image
      ? typeof s.image === 'object' ? s.image.secureUrl : s.image
      : '/pre-nursing-photo.png';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setLeftVisible(true), 100);
          setTimeout(() => setRightVisible(true), 400);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback((idx: number, dir: 'up' | 'down' = 'down') => {
    if (animState !== 'idle' || idx === activeIndex) return;
    setDirection(dir);
    setAnimState('exit');
    setTimeout(() => {
      setActiveIndex(idx);
      setAnimState('enter');
      setTimeout(() => setAnimState('idle'), 650);
    }, 360);
  }, [animState, activeIndex]);

  const goNext = useCallback(() => {
    goTo((activeIndex + 1) % services.length, 'down');
  }, [activeIndex, services.length, goTo]);

  useEffect(() => {
    if (isPaused) { if (intervalRef.current) clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(goNext, 4000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPaused, goNext]);

  const cardClass = animState === 'exit'
    ? direction === 'down' ? 'card-exit-up' : 'card-exit-down'
    : animState === 'enter'
    ? direction === 'down' ? 'card-enter-down' : 'card-enter-up'
    : '';

  return (
    <section
      ref={sectionRef}
      className="bg-white py-8 pb-16 overflow-hidden font-['Power_Grotesk']"
    >
      <style>{`
        /* Keyframes are in globals.css — only class rules here */
        .card-exit-up    { animation: fs-cardExitUp    0.36s cubic-bezier(.4,0,.6,1)      forwards; }
        .card-exit-down  { animation: fs-cardExitDown  0.36s cubic-bezier(.4,0,.6,1)      forwards; }
        .card-enter-down { animation: fs-cardEnterDown 0.65s cubic-bezier(.22,.68,0,1.12) forwards; }
        .card-enter-up   { animation: fs-cardEnterUp   0.65s cubic-bezier(.22,.68,0,1.12) forwards; }
        .reveal-left     { animation: fs-revealLeft    1.05s cubic-bezier(.22,.68,0,1.05) forwards; }
        .reveal-right    { animation: fs-revealRight   1.05s cubic-bezier(.22,.68,0,1.05) 0.15s forwards; }
        .panel-hidden    { opacity:0; }
        .heading-reveal  { animation: fs-headingReveal 0.85s cubic-bezier(.22,.68,0,1.1)  0.55s both; }
        .image-rise      { animation: fs-imageRise     1.1s  cubic-bezier(.22,.68,0,1.05) 0.4s  both; }
        .float-doc       { animation: fs-floatDoc      5s    ease-in-out infinite; }
        .orb-breathe     { animation: fs-orbBreathe    7s    ease-in-out infinite; }
        .progress-sweep  { animation: fs-progressSweep 4s   linear      forwards; }
        .service-card-inner {
          transition: transform 0.35s cubic-bezier(.22,.68,0,1.1), box-shadow 0.35s ease;
        }
        .service-card-inner:hover {
          transform: translateY(-3px) scale(1.01);
          box-shadow: 0 28px 65px rgba(150,202,69,0.28), 0 8px 20px rgba(0,0,0,0.4);
        }
        .shimmer {
          background: linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent);
          background-size: 400px 100%;
          animation: fs-shimmer 3.5s ease-in-out infinite;
        }
        .card-3d-wrap { perspective:900px; }
      `}</style>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-5">

          {/* ════ LEFT PANEL ════ */}
          <div
            className={`lg:w-[42%] rounded-[28px] relative overflow-hidden panel-hidden ${leftVisible ? 'reveal-left' : ''}`}
            style={{
              background: 'linear-gradient(150deg,#004a9c 0%,#002f6c 55%,#001a45 100%)',
              height: '420px',
            }}
          >
            {/* Shimmer */}
            <div className="absolute inset-0 z-[1] pointer-events-none shimmer" />

            {/* Ambient orb */}
            <div
              className="absolute orb-breathe pointer-events-none"
              style={{
                width: '280px', height: '280px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(150,202,69,0.2) 0%, transparent 70%)',
                bottom: '-40px', left: '50%', transform: 'translateX(-50%)',
              }}
            />

            {/* ── TEXT BLOCK — top third, z above image ── */}
            <div
              className={`absolute top-0 left-0 right-0 z-30 pt-8 px-8 heading-reveal ${leftVisible ? '' : 'opacity-0'}`}
            >
              <p
                className="font-black text-white leading-[0.88] select-none"
                style={{
                  fontSize: 'clamp(26px,3.6vw,44px)',
                  letterSpacing: '-0.025em',
                  textShadow: '0 2px 16px rgba(0,0,0,0.5)',
                }}
              >
                SELECT YOUR<br />
                <span style={{ color: 'rgba(150,202,69,1)' }}>CAREER</span><br />
                DESTINATION
              </p>
              <div
                className="mt-3 h-[3px] rounded-full"
                style={{ width: '48px', backgroundColor: 'rgba(150,202,69,0.85)' }}
              />
            </div>

            {/* ── DOCTOR IMAGE — bottom 58%, never goes above text ── */}
            <div
              className={`absolute bottom-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none float-doc ${leftVisible ? 'image-rise' : 'opacity-0'}`}
              style={{ width: '70%', height: '58%' }}
            >
              <Image
                src="/doctor-pointing.png"
                alt="Doctor"
                fill
                className="object-contain object-bottom"
                style={{ filter: 'drop-shadow(0 14px 28px rgba(0,0,0,0.6))' }}
              />
            </div>

            {/* Bottom gradient fade */}
            <div
              className="absolute bottom-0 left-0 right-0 h-20 z-[25] pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(0,26,69,0.7), transparent)' }}
            />
          </div>

          {/* ════ RIGHT PANEL ════ */}
          <div
            className={`flex-1 rounded-[28px] relative flex flex-col overflow-hidden panel-hidden ${rightVisible ? 'reveal-right' : ''}`}
            style={{ backgroundColor: '#1a1a1a', height: '420px' }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Dot grid */}
            <div
              className="absolute inset-0 z-0 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '26px 26px',
              }}
            />

            {/* Top-right glow accent */}
            <div
              className="absolute -top-12 -right-12 pointer-events-none"
              style={{
                width: '220px', height: '220px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(150,202,69,0.09) 0%, transparent 70%)',
              }}
            />

            {/* Header */}
            <div className="relative z-10 pt-7 pb-0 text-center flex-shrink-0 px-6">
              <h2 className="text-xl md:text-2xl text-white font-medium tracking-tight">
                Our Featured{' '}
                <span className="font-bold" style={{ color: 'rgba(150,202,69,1)' }}>
                  Products
                </span>
              </h2>
              <div className="mx-auto mt-1.5 h-[2px] w-10 rounded-full"
                style={{ backgroundColor: 'rgba(150,202,69,0.4)' }} />
            </div>

            {/* Card area */}
            <div className="card-3d-wrap flex-1 flex items-center justify-center px-6 md:px-10 relative z-10 py-3">
              <div className={`w-full ${cardClass}`}
                style={{ willChange: 'transform, opacity' }}>
                <ServiceCard service={activeService} image={getImage(activeService)} />
              </div>
            </div>

            {/* Vertical pagination */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2.5 items-center">
              {services.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsPaused(true);
                    goTo(idx, idx > activeIndex ? 'down' : 'up');
                    setTimeout(() => setIsPaused(false), 5000);
                  }}
                  className="rounded-full transition-all duration-500"
                  style={{
                    width: idx === activeIndex ? '28px' : '16px',
                    height: '3px',
                    backgroundColor: idx === activeIndex
                      ? 'rgba(150,202,69,1)'
                      : 'rgba(255,255,255,0.2)',
                    animation: idx === activeIndex ? 'fs-dotPulse 2.2s ease-in-out infinite' : 'none',
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Progress bar */}
            {!isPaused && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] overflow-hidden rounded-b-[28px] z-20">
                <div
                  key={`pb-${activeIndex}`}
                  className="h-full progress-sweep rounded-full"
                  style={{ backgroundColor: 'rgba(150,202,69,0.8)' }}
                />
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

// ── Service Card ──
function ServiceCard({ service, image }: { service: any; image: string }) {
  return (
    <div
      className="service-card-inner rounded-[18px] p-4 w-full flex flex-row gap-4"
      style={{
        backgroundColor: 'rgba(150,202,69,1)',
        boxShadow: '0 20px 50px rgba(150,202,69,0.2), 0 6px 16px rgba(0,0,0,0.4)',
      }}
    >
      {/* Image */}
      <div
        className="flex-shrink-0 relative rounded-xl overflow-hidden bg-white"
        style={{ width: '40%', aspectRatio: '1/1', minHeight: '140px' }}
      >
        <Image
          src={image}
          alt={service?.title || 'Service'}
          fill
          className="object-cover object-top"
          style={{ transition: 'transform 0.6s ease' }}
        />
        <div className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 18px rgba(0,0,0,0.07)' }} />
      </div>

      {/* Details */}
      <div className="flex flex-col py-0.5" style={{ width: '60%' }}>
        <h3
          className="font-black text-[#111] mb-1.5 leading-tight"
          style={{
            fontSize: 'clamp(15px,1.9vw,22px)',
            fontFamily: "'Courier New', monospace",
            letterSpacing: '-0.02em',
          }}
        >
          {service?.title || 'Course Name'}
        </h3>

        <div className="w-7 h-[2px] rounded-full mb-2.5"
          style={{ backgroundColor: 'rgba(0,0,0,0.15)' }} />

        <p className="text-[#333] leading-relaxed line-clamp-4 flex-1"
          style={{ fontSize: 'clamp(11px,0.95vw,13px)', fontWeight: 500 }}>
          {service?.description ||
            'Purus in fames sit ac vitae. Curabitur scelerisque nunc mauris blandit. Donec tristique placerat consectetur molestie est ornare.'}
        </p>

        {/* Arrow CTA */}
        <Link
          href={`/services/${service?.slug || '#'}`}
          className="mt-auto self-end w-9 h-9 bg-white rounded-lg flex items-center justify-center"
          style={{
            boxShadow: '0 3px 10px rgba(0,0,0,0.14)',
            transition: 'transform 0.22s cubic-bezier(.22,.68,0,1.2), box-shadow 0.22s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.transform = 'scale(1.14) rotate(6deg)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 18px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.transform = 'scale(1) rotate(0deg)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 3px 10px rgba(0,0,0,0.14)';
          }}
        >
          <ArrowUpRight className="w-4 h-4 text-black" />
        </Link>
      </div>
    </div>
  );
}