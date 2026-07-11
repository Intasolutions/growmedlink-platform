'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';

const FS = "'Great Day Personal Use','Brush Script MT',cursive";

export default function ServicesCarouselSection({ products }: { products: any[] }) {
  const services = products; // internal alias — carousel now shows products
  const sectionRef   = useRef<HTMLElement>(null);
  const headingRef   = useRef<HTMLHeadingElement>(null);
  const arrowWrapRef = useRef<HTMLDivElement>(null);
  const labelRef     = useRef<HTMLSpanElement>(null);
  const leftColRef   = useRef<HTMLDivElement>(null);
  const rightColRef  = useRef<HTMLDivElement>(null);
  const carouselRef  = useRef<HTMLDivElement>(null);
  const progressRef  = useRef<HTMLDivElement>(null);
  const dotRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const triggered    = useRef(false);

  const items   = services && services.length > 0 ? services : Array.from({ length: 4 });
  const numDots = 10;

  /* ── Progress bar + dot wave on carousel scroll ── */
  const handleScroll = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const progress = el.scrollWidth > el.clientWidth
      ? el.scrollLeft / (el.scrollWidth - el.clientWidth)
      : 0;
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: `${Math.max(15, progress * 100)}%`,
        duration: 0.12, ease: 'none', overwrite: true,
      });
    }
    dotRefs.current.forEach((dot, i, all) => {
      if (!dot) return;
      const phase = (i / all.length) * Math.PI * 2 + progress * Math.PI * 4;
      gsap.to(dot, {
        y: Math.sin(phase) * 8,
        opacity: 0.45 + 0.55 * ((Math.sin(phase) + 1) / 2),
        duration: 0.1, ease: 'none', overwrite: true,
      });
    });
  }, []);

  /* ── Scroll-triggered entrance ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    /* Set initial hidden states */
    gsap.set(headingRef.current,   { opacity: 0, y: 40 });
    gsap.set(arrowWrapRef.current, { opacity: 0 });
    gsap.set(labelRef.current,     { opacity: 0 });
    gsap.set(leftColRef.current,   { opacity: 0, x: -50 });
    gsap.set(rightColRef.current,  { opacity: 0, x: 50 });
    gsap.set(progressRef.current,  { opacity: 0 });
    if (cardRefs.current.length) {
      gsap.set(cardRefs.current.filter(Boolean), { opacity: 0, y: 50 });
    }
    dotRefs.current.forEach(d => d && gsap.set(d, { opacity: 0.45 }));

    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || triggered.current) return;
      triggered.current = true;
      io.disconnect();

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      /* 1. Heading rises */
      tl.to(headingRef.current, { opacity: 1, y: 0, duration: 0.75, ease: 'back.out(1.3)' }, 0);

      /* 2. Arrow floats in */
      tl.to(arrowWrapRef.current, { opacity: 1, duration: 0.5 }, 0.35);

      /* 3. Handwritten label fades in with slight y */
      tl.fromTo(labelRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' },
        0.45
      );

      /* 4. Left column slides in */
      tl.to(leftColRef.current,  { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }, 0.25);

      /* 5. Right column slides in */
      tl.to(rightColRef.current, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }, 0.38);

      /* 6. Progress bar fades in */
      tl.to(progressRef.current, { opacity: 1, duration: 0.4 }, 0.5);

      /* 7. Cards stagger up */
      tl.to(cardRefs.current.filter(Boolean), {
        opacity: 1, y: 0,
        duration: 0.55,
        stagger: 0.12,
        ease: 'back.out(1.2)',
      }, 0.55);

      /* 8. Arrow bounce loop — starts after arrow is visible */
      tl.call(() => {
        gsap.to(arrowWrapRef.current, {
          y: -7, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: -1,
        });
      }, [], 0.9);
    }, { threshold: 0.08 });

    io.observe(section);
    return () => io.disconnect();
  }, []);

  /* ── Carousel scroll listener ── */
  useEffect(() => {
    handleScroll();
    const el = carouselRef.current;
    if (el) el.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      if (el) el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [services, handleScroll]);

  return (
    <section
      ref={sectionRef}
      className="bg-white overflow-hidden"
      style={{
        padding: 'clamp(40px,6vw,96px) 0',
        fontFamily: "'Power Grotesk', sans-serif",
      }}
    >
      {/* Hide scrollbar — minimal CSS, layout only */}
      <style>{`
        .scs-scrollbar::-webkit-scrollbar { display: none; }
        .scs-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }

        /* hide callout arrow on small/mid screens */
        @media (max-width: 767px) {
          .scs-callout  { display: none !important; }
          .scs-progress { display: none !important; }
          .scs-dots     { display: none !important; }
        }

        /* split layout: stack at ≤899px */
        @media (max-width: 899px) {
          .scs-split { flex-direction: column !important; gap: clamp(20px,4vw,36px) !important; }
          .scs-left  { flex: none !important; width: 100% !important; max-width: 100% !important; }
          .scs-right { width: 100% !important; flex: none !important; }
        }
        @media (max-width: 767px) {
          .scs-split { gap: 16px !important; }
          .scs-heading { font-size: clamp(36px,10vw,56px) !important; margin-bottom: 20px !important; }
        }
      `}</style>

      <div
        className="max-w-[1440px] mx-auto"
        style={{ padding: '0 clamp(16px,4vw,64px)' }}
      >

        {/* ════ HEADER ════ */}
        <div
          style={{ marginBottom: 'clamp(16px,4vw,80px)', position: 'relative' }}
        >
          {/* Heading + callout row — flex so callout stays beside heading on wide, hides on narrow */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'clamp(12px,2vw,28px)', flexWrap: 'wrap' }}>
            <h2
              ref={headingRef}
              className="scs-heading"
              style={{
                fontSize: 'clamp(32px,6.5vw,88px)',
                fontWeight: 500,
                color: '#252525',
                letterSpacing: '-0.03em',
                lineHeight: 1,
                margin: 0,
                flexShrink: 0,
              }}
            >
              OUR{' '}
              <span style={{ color: '#96CA45' }}>SERVICES</span>
            </h2>

            {/* Arrow + label — inline with heading, hidden below 600px */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
                paddingBottom: 'clamp(4px,0.5vw,10px)',
                overflow: 'hidden',
              }}
              className="scs-callout"
            >
              <div
                ref={arrowWrapRef}
                style={{
                  position: 'relative',
                  width: 'clamp(36px,4vw,60px)',
                  height: 'clamp(28px,3vw,48px)',
                  flexShrink: 0,
                  marginRight: '6px',
                }}
              >
                <Image src="/red-curly-arrow.png" alt="" fill className="object-contain" />
              </div>
              <span
                ref={labelRef}
                style={{
                  fontFamily: FS,
                  fontSize: 'clamp(18px,2.4vw,34px)',
                  color: '#c94141',
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
        <div
          className="scs-split"
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 'clamp(24px,4vw,80px)',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >

          {/* ── LEFT ── */}
          <div
            ref={leftColRef}
            className="scs-left"
            style={{
              flex: '0 0 clamp(240px,32%,380px)',
              minWidth: 0,
            }}
          >
            <h3 style={{
              fontSize: 'clamp(22px,2.4vw,36px)',
              fontWeight: 700,
              color: '#96CA45',
              marginBottom: 'clamp(12px,1.5vw,20px)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}>
              Careers Beyond Borders
            </h3>
            <p style={{
              color: '#252525',
              fontSize: 'clamp(13px,1.1vw,17px)',
              lineHeight: 1.7,
              marginBottom: 'clamp(20px,2.5vw,36px)',
              fontWeight: 500,
            }}>
               GrowMedLink provides expert nursing career guidance, exam training, documentation support, interview preparation, and global job assistance to help nurses achieve international opportunities confidently.
            </p>
            <ExploreBtn />
          </div>

          {/* ── RIGHT ── */}
          <div
            ref={rightColRef}
            className="scs-right"
            style={{ flex: 1, minWidth: 0 }}
          >
            {/* Progress bar — hidden on mobile via .scs-progress */}
            <div className="scs-progress" style={{
              width: '100%', height: '4px',
              backgroundColor: '#f0f0f0',
              borderRadius: '2px',
              marginBottom: 'clamp(16px,2vw,28px)',
              overflow: 'hidden',
              position: 'relative',
            }}>
              <div
                ref={progressRef}
                style={{
                  position: 'absolute', top: 0, left: 0,
                  height: '100%', width: '15%',
                  backgroundColor: '#96CA45',
                  borderRadius: '2px',
                  boxShadow: '0 0 8px rgba(150,202,69,0.4)',
                }}
              />
            </div>

            {/* Cards */}
            <div
              ref={carouselRef}
              className="scs-scrollbar"
              style={{
                display: 'flex',
                gap: 'clamp(14px,1.8vw,24px)',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                paddingBottom: 'clamp(12px,1.5vw,20px)',
                paddingTop: '4px',
                scrollBehavior: 'smooth',
              }}
            >
              {items.map((service, idx) => {
                const img = (!service || !service.title)
                  ? '/pre-nursing-photo.png'
                  : (service.image && typeof service.image === 'object'
                      ? service.image.secureUrl
                      : service.image) || '/pre-nursing-photo.png';

                return (
                  <div
                    key={service?._id || idx}
                    ref={el => { cardRefs.current[idx] = el; }}
                    style={{
                      flexShrink: 0,
                      width: 'clamp(260px,82vw,320px)',
                      height: 'clamp(340px,55vw,420px)',
                      scrollSnapAlign: 'start',
                    }}
                  >
                    <ServiceCard
                      href={`/products/${service?.slug || '#'}`}
                      img={img}
                      title={service?.name || service?.title || 'NCLEX Exam application process'}
                      description={service?.description || 'Lorem Ipsum Dolor Sit Amet Consectetur. Purus In In Fames Sit Ac Vitae.'}
                    />
                  </div>
                );
              })}
            </div>

            {/* Dot wave — hidden on mobile via .scs-dots */}
            <div className="scs-dots" style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 'clamp(8px,1vw,14px)',
              marginTop: 'clamp(12px,1.5vw,20px)',
              paddingRight: '4px',
            }}>
              {Array.from({ length: numDots }).map((_, i) => (
                <div
                  key={i}
                  ref={el => { dotRefs.current[i] = el; }}
                  style={{
                    width: 'clamp(7px,0.8vw,10px)',
                    height: 'clamp(7px,0.8vw,10px)',
                    borderRadius: '50%',
                    backgroundColor: '#96CA45',
                    opacity: 0.45,
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Card with GSAP hover: green image half → "View Details" overlay, dark text half ── */
function ServiceCard({
  href, img, title, description,
}: {
  href: string; img: string; title: string; description: string;
}) {
  const cardRef    = useRef<HTMLAnchorElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const btnRef     = useRef<HTMLDivElement>(null);
  const imgRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card    = cardRef.current;
    const overlay = overlayRef.current;
    const btn     = btnRef.current;
    const imgEl   = imgRef.current;
    if (!card || !overlay || !btn || !imgEl) return;

    /* Initial states — everything hidden, overlay opacity:0 is also set in JSX */
    gsap.set(btn, { opacity: 0, y: 14, scale: 0.9 });

    const enter = () => {
      gsap.killTweensOf([card, overlay, btn, imgEl]);
      gsap.to(card,    { y: -6, scale: 1.012, duration: 0.28, ease: 'power2.out', overwrite: true });
      gsap.to(imgEl,   { scale: 1.07, duration: 0.45, ease: 'power2.out', overwrite: true });
      gsap.to(overlay, { opacity: 1, duration: 0.28, ease: 'power2.out', overwrite: true });
      gsap.to(btn,     { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'back.out(1.5)', overwrite: true });
    };

    const leave = () => {
      gsap.killTweensOf([card, overlay, btn, imgEl]);
      gsap.to(card,    { y: 0, scale: 1, duration: 0.4, ease: 'power3.out', overwrite: true });
      gsap.to(imgEl,   { scale: 1, duration: 0.45, ease: 'power3.out', overwrite: true });
      gsap.to(overlay, { opacity: 0, duration: 0.28, ease: 'power2.in', overwrite: true });
      gsap.to(btn,     { opacity: 0, y: 14, scale: 0.9, duration: 0.2, ease: 'power2.in', overwrite: true });
    };

    card.addEventListener('mouseenter', enter);
    card.addEventListener('mouseleave', leave);
    return () => {
      card.removeEventListener('mouseenter', enter);
      card.removeEventListener('mouseleave', leave);
    };
  }, []);

  return (
    <Link
      ref={cardRef}
      href={href}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'clamp(340px,55vw,420px)',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
        textDecoration: 'none',
        willChange: 'transform',
        transformOrigin: 'center center',
      }}
    >
      {/* Top: clean image at rest, green overlay + button on hover */}
      <div style={{
        position: 'relative',
        flex: '0 0 58%',
        backgroundColor: '#111',
        overflow: 'hidden',
      }}>
        {/* Clean image — no blend mode, full opacity */}
        <div
          ref={imgRef}
          style={{
            position: 'absolute', inset: 0,
            willChange: 'transform',
            transformOrigin: 'center center',
          }}
        >
          <Image
            src={img}
            alt={title}
            fill
            sizes="(max-width: 767px) 82vw, 320px"
            style={{ objectFit: 'cover', objectPosition: 'top' }}
          />
        </div>

        {/* Hover overlay — opacity:0 at rest, GSAP fades to 1 on hover */}
        <div
          ref={overlayRef}
          style={{
            position: 'absolute', inset: 0,
            backgroundColor: 'rgba(120,175,35,0.78)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2, pointerEvents: 'none',
            opacity: 0,
          }}
        >
          {/* Top-right icon inside overlay */}
          <div
            style={{
              position: 'absolute', top: '14px', right: '14px',
              width: '48px', height: '48px',
              pointerEvents: 'none',
            }}
          >
            <Image src="/service-hover-icon.png" alt="" fill style={{ objectFit: 'contain' }} />
          </div>
          <div
            ref={btnRef}
            style={{
              backgroundColor: '#fff',
              color: '#111',
              fontWeight: 700,
              fontSize: 'clamp(13px,1.2vw,17px)',
              padding: 'clamp(8px,0.9vw,12px) clamp(22px,2.5vw,36px)',
              borderRadius: '8px',
              letterSpacing: '0.01em',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              whiteSpace: 'nowrap',
            }}
          >
            View Details
          </div>
        </div>
      </div>

      {/* Bottom: dark text area */}
      <div style={{
        backgroundColor: '#2a2a2a',
        padding: 'clamp(14px,1.6vw,22px)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <h4 style={{
          color: '#96CA45',
          fontWeight: 600,
          fontSize: 'clamp(14px,1.4vw,20px)',
          marginBottom: 'clamp(6px,0.7vw,10px)',
          lineHeight: 1.25,
          letterSpacing: '-0.01em',
        }}>
          {title}
        </h4>
        <p style={{
          color: 'rgba(255,255,255,0.65)',
          fontSize: 'clamp(11px,0.9vw,14px)',
          lineHeight: 1.6,
          margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {description}
        </p>
      </div>
    </Link>
  );
}

/* ── Explore button with GSAP hover — links to /services ── */
function ExploreBtn() {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const enter = () => gsap.to(el, { y: -3, scale: 1.04, duration: 0.25, ease: 'back.out(2)', overwrite: true });
    const leave = () => gsap.to(el, { y: 0,  scale: 1,    duration: 0.35, ease: 'power3.out', overwrite: true });
    const down  = () => gsap.to(el, { scale: 0.97, duration: 0.1, overwrite: true });
    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);
    el.addEventListener('mousedown',  down);
    el.addEventListener('mouseup',    leave);
    return () => {
      el.removeEventListener('mouseenter', enter);
      el.removeEventListener('mouseleave', leave);
      el.removeEventListener('mousedown',  down);
      el.removeEventListener('mouseup',    leave);
    };
  }, []);

  return (
    <Link
      ref={ref}
      href="/services"
      style={{
        backgroundColor: '#96CA45',
        color: '#111',
        fontWeight: 700,
        fontSize: 'clamp(14px,1.2vw,18px)',
        padding: 'clamp(10px,1.1vw,16px) clamp(24px,2.5vw,36px)',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(150,202,69,0.35)',
        willChange: 'transform',
        display: 'inline-block',
        textDecoration: 'none',
      }}
    >
      Explore Services
    </Link>
  );
}
