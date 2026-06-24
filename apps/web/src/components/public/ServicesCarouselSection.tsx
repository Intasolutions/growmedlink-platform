'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ServicesCarouselSection({ services }: { services: any[] }) {
  const carouselRef  = useRef<HTMLDivElement>(null);
  const progressRef  = useRef<HTMLDivElement>(null);
  const sectionRef   = useRef<HTMLElement>(null);

  const [visible, setVisible] = useState(false);

  const handleScroll = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const progress = el.scrollWidth > el.clientWidth
      ? el.scrollLeft / (el.scrollWidth - el.clientWidth)
      : 0;
    if (progressRef.current) {
      progressRef.current.style.width = `${Math.max(15, progress * 100)}%`;
    }
    document.querySelectorAll<HTMLElement>('.dot-wave').forEach((dot, i, all) => {
      const phase = (i / all.length) * Math.PI * 2 + progress * Math.PI * 4;
      dot.style.transform = `translateY(${Math.sin(phase) * 8}px)`;
      dot.style.opacity = String(0.45 + 0.55 * ((Math.sin(phase) + 1) / 2));
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    handleScroll();
    const el = carouselRef.current;
    if (el) el.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      if (el) el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [services, handleScroll]);

  const items   = services && services.length > 0 ? services : Array.from({ length: 4 });
  const numDots = 10;

  return (
    <section
      ref={sectionRef}
      className="bg-white py-16 overflow-hidden"
      style={{ fontFamily: "'Power Grotesk', sans-serif" }}
    >
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }

        /*
          THE ONLY RULE THAT ELIMINATES VIBRATION:
          An element may own EITHER a CSS transition OR a CSS animation.
          Never both. Never inherited from a parent that also animates.
          We enforce this by making every animated element a leaf node
          with no animated ancestor or descendant.
        */

        /* ---- ARROW FLOAT ----
           The arrow image wrapper gets a pure CSS animation — always on,
           no class toggling, no React state changes ever touch this element.
           It fades in via opacity on the PARENT, so this element never
           changes class, never repaints, never fights anything.
        */
        @keyframes floatY {
          0%,100% { transform: translateY(0px);  }
          50%      { transform: translateY(-7px); }
        }
        .arrow-float {
          animation: floatY 2.8s ease-in-out infinite;
          will-change: transform;
        }

        /* ---- SECTION REVEAL ----
           Uses opacity + margin trick — NOT transform/translate at all.
           This avoids any possibility of fighting with child transforms.
        */
        @keyframes fadeInUp {
          from { opacity: 0; margin-top: 28px; }
          to   { opacity: 1; margin-top: 0px;  }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; margin-left: -40px; }
          to   { opacity: 1; margin-left: 0px;   }
        }
        @keyframes fadeInRight {
          from { opacity: 0; margin-right: -40px; }
          to   { opacity: 1; margin-right: 0px;   }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* Hidden until section visible */
        .anim-hidden { opacity: 0; }

        .anim-up    { animation: fadeInUp    0.8s cubic-bezier(.22,.68,0,1.05) forwards; }
        .anim-left  { animation: fadeInLeft  0.8s cubic-bezier(.22,.68,0,1.05) forwards; }
        .anim-right { animation: fadeInRight 0.8s cubic-bezier(.22,.68,0,1.05) 0.12s forwards; }
        .anim-fade  { animation: fadeIn      0.7s ease forwards; }

        .anim-d1 { animation-delay: 0.08s; }
        .anim-d2 { animation-delay: 0.22s; }
        .anim-d3 { animation-delay: 0.36s; }
        .anim-d4 { animation-delay: 0.50s; }

        /* Cards stagger */
        .card-s1 { animation: fadeInUp 0.55s cubic-bezier(.22,.68,0,1.1) 0.55s both; }
        .card-s2 { animation: fadeInUp 0.55s cubic-bezier(.22,.68,0,1.1) 0.70s both; }
        .card-s3 { animation: fadeInUp 0.55s cubic-bezier(.22,.68,0,1.1) 0.85s both; }
        .card-s4 { animation: fadeInUp 0.55s cubic-bezier(.22,.68,0,1.1) 1.00s both; }

        /* ---- CARD HOVER ----
           card-hover is a standalone element (the Link).
           It has NO animation on it — only a transition.
           Its parent has NO animation either (only opacity from fadeInUp which is done).
           So transform here is completely isolated.
        */
        .card-hover {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #2a2a2a;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0,0,0,0.25);
          /* Only transition here, no animation */
          transition: transform 0.28s cubic-bezier(.22,.68,0,1.1),
                      box-shadow 0.28s ease;
          will-change: transform;
        }
        @media (hover: hover) {
          .card-hover:hover {
            transform: translateY(-6px) scale(1.012);
            box-shadow: 0 20px 48px rgba(0,0,0,0.3), 0 0 0 1px rgba(150,202,69,0.18);
          }
          .card-hover:hover .card-img {
            transform: scale(1.07);
          }
          .card-hover:hover .card-title {
            background-size: 100% 2px;
          }
        }

        /* Card image — own element, own transition, no animation */
        .card-img {
          transition: transform 0.45s cubic-bezier(.22,.68,0,1.05);
          will-change: transform;
        }

        /* Title underline — background-size only, not transform */
        .card-title {
          background-image: linear-gradient(rgba(150,202,69,1), rgba(150,202,69,1));
          background-repeat: no-repeat;
          background-position: 0 100%;
          background-size: 0% 2px;
          transition: background-size 0.32s ease;
          padding-bottom: 2px;
        }

        /* Explore button */
        .explore-btn {
          transition: transform 0.25s cubic-bezier(.22,.68,0,1.2),
                      box-shadow 0.25s ease;
          will-change: transform;
        }
        @media (hover: hover) {
          .explore-btn:hover {
            transform: translateY(-3px) scale(1.03);
            box-shadow: 0 12px 28px rgba(150,202,69,0.35);
          }
        }
        .explore-btn:active { transform: scale(0.97) !important; }

        /* Progress bar */
        .progress-fill {
          transition: width 0.12s linear;
          box-shadow: 0 0 8px rgba(150,202,69,0.4);
        }

        /* Dot wave */
        .dot-wave {
          transition: transform 0.1s ease-out, opacity 0.1s ease-out;
        }

        @media (max-width: 639px) {
          .carousel-card { width: min(82vw, 270px) !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration:  0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ════ HEADER ════ */}
        <div className="text-center relative mb-16 md:mb-24 flex justify-center">
          <div style={{ display: 'inline-block', position: 'relative' }}>

            {/* Heading — fades up. Arrow is NOT inside this element. */}
            <h2
              className={`text-5xl md:text-[80px] font-medium text-[#252525] tracking-tight inline-block ${visible ? 'anim-up' : 'anim-hidden'}`}
            >
              OUR <span className="text-[rgba(150,202,69,1)]">SERVICES</span>
            </h2>

            {/*
              Arrow container — absolute, positioned relative to the outer div.
              It fades in via anim-fade (opacity only — no transform, no margin).
              The CHILD .arrow-float does the movement via its own isolated animation.
              These are completely separate elements with separate CSS rules.
            */}
            <div
              className={`pointer-events-none flex flex-row items-center ${visible ? 'anim-fade anim-d3' : 'anim-hidden'}`}
              style={{
                position: 'absolute',
                top: '80%',
                right: 0,
                marginLeft: '8px',
                transform: 'translateX(calc(100% + 8px))',
                whiteSpace: 'nowrap',
              }}
            >
              {/*
                This wrapper fades in (via parent anim-fade).
                The inner .arrow-float does the bounce.
                Parent: opacity animation. Child: transform animation.
                They are on SEPARATE elements — zero conflict.
              */}
              <div
                style={{
                  position: 'relative',
                  width: 'clamp(48px, 5vw, 80px)',
                  height: 'clamp(36px, 4vw, 64px)',
                  flexShrink: 0,
                  marginRight: '6px',
                }}
              >
                {/* This element ONLY has the float animation — nothing else */}
                <div className="arrow-float" style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image src="/red-curly-arrow.png" alt="" fill className="object-contain" />
                </div>
              </div>

              {/* Label — static, no animation of its own */}
              <span
                className={`font-['Great_Day_Personal_Use'] text-[#c94141]`}
                style={{
                  fontSize: 'clamp(24px, 3.2vw, 42px)',
                  marginTop: 'clamp(10px, 2vw, 24px)',
                  display: 'inline-block',
                  rotate: '-4deg',
                }}
              >
                Services we offer
              </span>
            </div>
          </div>
        </div>

        {/* ════ SPLIT LAYOUT ════ */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

          {/* ── LEFT ── */}
          <div className="lg:w-[35%] flex flex-col justify-center">
            <div className={visible ? 'anim-left' : 'anim-hidden'}>
              <h3 className="text-3xl md:text-4xl font-bold text-[rgba(150,202,69,1)] mb-6 tracking-tight">
                Lorem Ipsum Dolor
              </h3>
              <p className="text-[#252525] text-base md:text-lg leading-relaxed mb-8 font-medium">
                Lorem Ipsum Dolor Sit Amet Consectetur. Purus In In Fames Sit Ac Vitae.
                Curabitur Scelerisque Nunc Mauris Blandit. Donec Tristique Placerat
                Consectetur Molestie Est Ornare. Suspendisse Aliquet Semper Quam Volutpat
                Bibendum Est Mattis. Sed Neque Etiam Morbi A Amet Lacus Phasellus Ipsum Nec.
              </p>
              <button className="explore-btn self-start bg-[rgba(150,202,69,1)] text-[#111] font-bold text-lg px-8 py-3.5 rounded-md shadow-md">
                Explore Services
              </button>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="lg:w-[65%] flex flex-col min-w-0">
            <div className={visible ? 'anim-right' : 'anim-hidden'}>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-gray-100 rounded-full mb-6 relative overflow-hidden">
                <div
                  ref={progressRef}
                  className="progress-fill absolute top-0 left-0 h-full bg-[rgba(150,202,69,1)] rounded-full"
                  style={{ width: '15%' }}
                />
              </div>

              {/* Cards */}
              <div
                ref={carouselRef}
                className="hide-scrollbar flex gap-5 overflow-x-auto snap-x snap-mandatory pb-6 pt-2 scroll-smooth"
              >
                {items.map((service, idx) => {
                  const img = (!service || !service.title)
                    ? '/pre-nursing-photo.png'
                    : (service.image && typeof service.image === 'object'
                        ? service.image.secureUrl
                        : service.image) || '/pre-nursing-photo.png';

                  const sc = ['card-s1','card-s2','card-s3','card-s4'][Math.min(idx, 3)];

                  return (
                    /*
                      card-s* runs fadeInUp (margin + opacity) — finishes in ~1s.
                      card-hover has only a transition (transform on hover).
                      After fadeInUp completes, margin-top is 0 and animation is done.
                      The transition on card-hover then works in complete isolation.
                    */
                    <div
                      key={service?._id || idx}
                      className={`carousel-card flex-shrink-0 w-[280px] md:w-[340px] snap-start ${visible ? sc : 'anim-hidden'}`}
                    >
                      <Link
                        href={`/services/${service?.slug || '#'}`}
                        className="card-hover"
                      >
                        <div
                          className="w-full relative bg-white overflow-hidden"
                          style={{ height: '180px', flexShrink: 0 }}
                        >
                          <Image
                            src={img}
                            alt={service?.title || 'Service'}
                            fill
                            className="card-img object-cover object-top"
                          />
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                          <h4 className="text-[rgba(150,202,69,1)] font-medium text-[22px] mb-3 leading-tight tracking-tight">
                            <span className="card-title">
                              {service?.title || 'NCLEX Exam application process'}
                            </span>
                          </h4>
                          <p className="text-gray-300 text-[15px] leading-relaxed line-clamp-3 font-light">
                            {service?.description || 'Lorem Ipsum Dolor Sit Amet Consectetur. Purus In In Fames Sit Ac Vitae.'}
                          </p>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Dot wave */}
              <div className="flex justify-end gap-3 mt-4 pr-4">
                {Array.from({ length: numDots }).map((_, i) => (
                  <div
                    key={i}
                    className="dot-wave w-2.5 h-2.5 rounded-full bg-[rgba(150,202,69,1)]"
                    style={{ opacity: 0.45 }}
                  />
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}