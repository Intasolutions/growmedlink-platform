'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

/* ─── Types ─── */
interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  time: string;
  author: { name: string; role: string; avatar?: string };
}

/* ─── Removed prefilled mock data ─── */

const AUTO_MS    = 5500;
const CARD_W     = 448;  /* center card width (px) — scales at smaller breakpoints */
const CARD_H     = 304;  /* center card height (px) */
const OFFSET_1   = 158;  /* translateX for ±1 position */
const OFFSET_2   = 278;  /* translateX for ±2 position */


/* ────────────────────────────────────────────────────────────────────────── */
/* CSS — module-level constant so React never re-creates the string           */
const STYLES = `
  /* ── keyframes ── all prefixed lns- to avoid global collisions ────── */
  @keyframes lns-fade-up {
    from { opacity:0; translate:0 24px; }
    to   { opacity:1; translate:0 0; }
  }
  @keyframes lns-progress {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
  @keyframes lns-pulse-ring {
    0%,100% { box-shadow: 0 0 0 0   rgba(150,202,69,0.45); }
    50%      { box-shadow: 0 0 0 8px rgba(150,202,69,0); }
  }

  /* ── section ────────────────────────────────────────────────────────── */
  .lns { background:#252525; padding:52px 0 64px; position:relative; overflow:hidden; }
  .lns-wrap { max-width:1200px; margin:0 auto; padding:0 40px; position:relative; }

  /* ── heading ─────────────────────────────────────────────────────────── */
  .lns-h { margin-bottom:14px; }
  .lns-title {
    font-family:'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size:clamp(38px,5.5vw,80px); font-weight:400;
    line-height:1.18; letter-spacing:-0.03em; color:#fff; white-space:nowrap;
  }
  .lns-title-green { color:#96CA45; }
  .lns-sub {
    font-family:'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size:clamp(13px,1.4vw,18px); font-weight:400;
    line-height:157%; letter-spacing:0.01em; text-transform:capitalize;
    color:#fff; max-width:860px;
  }

  /* ── 'Our Latest Blogs' label (top-right) ─────────────────────────── */
  .lns-label {
    position:absolute; top:0; right:40px;
    display:flex; flex-direction:column; align-items:flex-end; gap:2px;
    opacity:0; translate:16px 0;
    transition:opacity 0.7s ease 0.45s, translate 0.7s cubic-bezier(.22,.68,0,1.2) 0.45s;
    pointer-events:none;
  }
  .lns-label.lns-in { opacity:1; translate:0 0; }
  .lns-label-text {
    font-family:'Great Day Personal Use','Great Day Bold Personal Use','Brush Script MT',cursive;
    font-size:22px; color:#96CA45; white-space:nowrap; line-height:1;
  }

  /* ── card stage ──────────────────────────────────────────────────────── */
  .lns-stage-outer {
    position:relative; margin-top:28px;
    height:336px; /* accommodates card + side card vertical scale */
    overflow:visible; /* side cards bleed out horizontally */
  }
  .lns-stage {
    position:absolute; inset:0;
  }

  /* ── each card wrapper ─────────────────────────────────────────────── */
  /*
    Cards are centered via margin-left / margin-top, then offset by
    translateX for the fan position. Using margin for centering
    keeps transform purely for the fan/rotation effect.
  */
  .lns-cw {
    position:absolute;
    left:50%; top:50%;
    width:448px; height:304px;
    margin-left:-224px; margin-top:-152px;
    border-radius:12px;
    transition:
      transform 0.72s cubic-bezier(.22,.68,0,1.1),
      opacity   0.72s ease,
      filter    0.72s ease;
    will-change:transform,opacity;
  }
  /* Side card click cursor */
  .lns-cw[data-clickable=true] { cursor:pointer; }
  .lns-cw[data-clickable=true]:hover { filter:brightness(1.12); }

  /* ── card inner ──────────────────────────────────────────────────────── */
  .lns-card { width:100%; height:100%; border-radius:14px; overflow:hidden; position:relative; }
  .lns-card-active   { background:#96CA45; }
  .lns-card-inactive { background:#3c3c3c; }

  /* Image area (~72% height) */
  .lns-img {
    position:absolute; top:0; left:0; right:0;
    height:72%; overflow:hidden; border-radius:10px;
  }
  .lns-img-overlay {
    position:absolute; inset:0;
    border-radius:10px; pointer-events:none;
  }
  .lns-card-active   .lns-img-overlay { background:rgba(0,0,0,0.04); }
  .lns-card-inactive .lns-img-overlay { background:rgba(0,0,0,0.42); }

  /* Fallback image placeholder */
  .lns-img-ph {
    width:100%; height:100%; object-fit:cover; object-position:center;
    background:linear-gradient(135deg,#555,#333);
  }

  /* Author overlay on image */
  .lns-author {
    position:absolute; top:10px; left:10px; z-index:2;
    display:flex; align-items:center; gap:8px;
  }
  .lns-av {
    width:28px; height:28px; border-radius:50%;
    border:1px solid #fff; overflow:hidden; flex-shrink:0;
    background:linear-gradient(135deg,#96CA45,#5a9022);
    display:flex; align-items:center; justify-content:center;
    font-family:'Inter',sans-serif; font-size:10px; font-weight:700; color:#fff;
  }
  .lns-av-text { display:flex; flex-direction:column; line-height:1.3; }
  .lns-av-name { font-family:'Inter',sans-serif; font-size:10px; font-weight:600; color:#96CA45; }
  .lns-av-role { font-family:'Inter',sans-serif; font-size:10px; font-weight:400; color:#fff; }

  /* Card body (bottom 28%) */
  .lns-body {
    position:absolute; bottom:0; left:0; right:0;
    padding:10px 14px 12px;
    height:29%; display:flex; flex-direction:column; justify-content:space-between;
  }
  .lns-card-active   .lns-body-title { color:#252525; }
  .lns-card-inactive .lns-body-title { color:#96CA45; }
  .lns-body-title {
    font-family:'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size:clamp(14px,2.4vw,18px); font-weight:500; line-height:1.3;
    display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
  }
  .lns-card-active   .lns-body-exc { color:rgba(37,37,37,0.75); }
  .lns-card-inactive .lns-body-exc { color:rgba(255,255,255,0.75); }
  .lns-body-exc {
    font-family:'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size:11px; line-height:1.5;
    display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical; overflow:hidden;
    margin-top:2px;
  }
  .lns-body-meta { display:flex; justify-content:space-between; margin-top:4px; }
  .lns-card-active   .lns-body-date,
  .lns-card-active   .lns-body-time { color:rgba(0,0,0,0.4); }
  .lns-card-inactive .lns-body-date,
  .lns-card-inactive .lns-body-time { color:rgba(255,255,255,0.4); }
  .lns-body-date,.lns-body-time {
    font-family:'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size:11px; letter-spacing:0.01em;
  }

  /* ── bottom nav row ───────────────────────────────────────────────── */
  .lns-nav {
    display:flex; align-items:center; justify-content:center;
    gap:10px; margin-top:22px; position:relative; z-index:10;
  }
  .lns-arrow {
    width:34px; height:34px; border-radius:50%;
    border:1px solid rgba(255,255,255,0.2);
    background:rgba(255,255,255,0.04);
    color:#fff; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    font-size:14px;
    transition:background 0.25s, border-color 0.25s, color 0.25s;
    padding:0; line-height:1;
  }
  .lns-arrow:hover { background:rgba(150,202,69,0.15); border-color:#96CA45; color:#96CA45; }

  .lns-dots { display:flex; gap:7px; align-items:center; }
  .lns-dot {
    width:7px; height:7px; border-radius:50%;
    background:rgba(255,255,255,0.28); border:none; cursor:pointer; padding:0;
    transition:background 0.3s, transform 0.3s;
  }
  .lns-dot.lns-dot-on { background:#96CA45; transform:scale(1.45); animation:lns-pulse-ring 2.5s ease-in-out infinite 0.5s; }

  /* ── progress bar ─────────────────────────────────────────────────── */
  .lns-prog-track { height:2px; background:rgba(255,255,255,0.08); margin-top:10px; border-radius:1px; }
  .lns-prog-fill { height:100%; background:#96CA45; transform-origin:left; border-radius:1px; animation:lns-progress 5.5s linear both; }

  /* ── entrance animations ──────────────────────────────────────────── */
  .lns-title.lns-in  { animation:lns-fade-up 0.65s ease 0.05s both; }
  .lns-sub.lns-in    { animation:lns-fade-up 0.65s ease 0.2s  both; }
  .lns-nav.lns-in    { animation:lns-fade-up 0.6s  ease 0.55s both; }
  .lns-prog-track.lns-in { animation:lns-fade-up 0.6s ease 0.6s both; }

  /* ── responsive ────────────────────────────────────────────────────── */
  @media (max-width:1099px) {
    .lns-wrap { padding:0 24px; }
    .lns-label { right:24px; }
    .lns-stage-outer { height:296px; }
    .lns-cw { width:384px; height:264px; margin-left:-192px; margin-top:-132px; }
    .lns-body-title { font-size:14px; }
  }
  @media (max-width:899px) {
    .lns-label { display:none; }
    .lns-stage-outer { height:264px; }
    .lns-cw { width:336px; height:232px; margin-left:-168px; margin-top:-116px; }
    .lns-body-title { font-size:13.5px; }
  }
  @media (max-width:767px) {
    .lns-wrap { padding:0 16px; }
    .lns { padding:36px 0 48px; }
    .lns-stage-outer { height:240px; }
    .lns-cw {
      width:min(90vw,288px); height:200px;
      margin-left:min(-45vw,-144px); margin-top:-100px;
    }
    /* On mobile: hide ±2 cards entirely via JS; ±1 barely visible */
    .lns-body-title { font-size:12.5px; }
    .lns-body-exc { display:none; }
    .lns-arrow { width:30px; height:30px; font-size:12px; }
    .lns-dots { gap:5px; }
    .lns-dot { width:6px; height:6px; }
  }
  @media (max-width:479px) {
    .lns-stage-outer { height:208px; }
    .lns-cw {
      width:min(88vw,240px); height:168px;
      margin-left:min(-44vw,-120px); margin-top:-84px;
    }
  }

  @media (prefers-reduced-motion:reduce) {
    .lns *, .lns *::before, .lns *::after {
      animation-duration:0.01ms !important;
      transition-duration:0.01ms !important;
    }
  }
`;

/* ══════════════════════════════════════════════════════════════════════════ */
export default function LatestNewsSection({ initialNews = [] }: { initialNews?: any[] }) {
  const [blogs, setBlogs]     = useState<any[]>(initialNews);
  const [active, setActive]   = useState(0);
  const [spread, setSpread]   = useState(false);   /* fan spread after entrance */
  const [inView, setInView]   = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef  = useRef<HTMLDivElement>(null);
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchRef    = useRef<{ x:number; y:number } | null>(null);
  const progKey     = useRef(0);                   /* forces progress bar remount */

  useEffect(() => {
    if (initialNews && initialNews.length > 0) return;
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${base}/api/blogs?status=published`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.success && Array.isArray(d?.data) && d.data.length > 0) {
          setBlogs(d.data);
        }
      })
      .catch(() => {});
  }, [initialNews]);

  const list = (blogs && blogs.length > 0 ? blogs : []).map((item: any) => {
    if (item._id) {
      const imgUrl = item.image
        ? (typeof item.image === 'object' ? item.image.secureUrl : item.image)
        : '/news/news-1.jpg';
      
      const authorName = item.author?.name || 'Admin';
      const authorRole = item.author?.role || 'admin';
      const authorAvatar = item.author?.avatar || '';

      const formattedDate = item.createdAt
        ? new Date(item.createdAt).toLocaleDateString('en-GB')
        : '24/06/2026';
        
      const formattedTime = item.createdAt
        ? new Date(item.createdAt).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })
        : '10:00 AM';

      return {
        id: item._id,
        title: item.title,
        excerpt: item.summary,
        image: imgUrl,
        date: formattedDate,
        time: formattedTime,
        author: {
          name: authorName,
          role: authorRole,
          avatar: authorAvatar || undefined,
        },
      };
    }
    return item;
  });

  const len = list.length;

  /* ── viewport tracking ── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 600);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── IntersectionObserver — triggers entrance ── */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          /* Cards spread after a short pause */
          setTimeout(() => setSpread(true), 150);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* ── Carousel helpers ── */
  const goTo = useCallback((idx: number) => {
    setActive(((idx % len) + len) % len);
    progKey.current += 1;
  }, [len]);

  const goNext = useCallback(() => goTo(active + 1), [active, goTo]);
  const goPrev = useCallback(() => goTo(active - 1), [active, goTo]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(goNext, AUTO_MS);
  }, [goNext]);

  useEffect(() => {
    if (!spread) return;
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [spread, resetTimer]);

  /* ── Touch swipe ── */
  const onTouchStart = (e: React.TouchEvent) => {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchRef.current) return;
    const dx = e.changedTouches[0].clientX - touchRef.current.x;
    const dy = e.changedTouches[0].clientY - touchRef.current.y;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 38) {
      dx < 0 ? goNext() : goPrev();
      resetTimer();
    }
    touchRef.current = null;
  };

  /* ── Card transform ── */
  const cardTransform = useCallback((cardIdx: number) => {
    const offset = cardIdx - active;
    /* wrap offset so it stays in range -2..+2 */
    let o = offset;
    if (o >  len / 2) o -= len;
    if (o < -len / 2) o += len;

    /* Before spread: all cards at center, invisible */
    if (!spread) {
      return {
        style: { transform: 'translateX(0) rotate(0deg) scale(0.92)', opacity: 0, zIndex: 0 } as React.CSSProperties,
        clickable: false,
      };
    }

    /* Hide cards beyond ±2 positions */
    if (Math.abs(o) > 2) {
      const dir = Math.sign(o);
      return {
        style: {
          transform: `translateX(${dir * (OFFSET_2 + 160)}px) rotate(${o * 4}deg) scale(0.5)`,
          opacity: 0, zIndex: 0, transitionDuration: '0s',
        } as React.CSSProperties,
        clickable: false,
      };
    }

    /* On mobile, only show center and ±1 with reduced offset */
    const mo = isMobile ? 0.45 : 1; /* scale offsets on mobile */
    const mHide = isMobile && Math.abs(o) > 1;

    const CFG = [
      { dx: -OFFSET_2 * mo, r: -8, s: 0.68, op: mHide ? 0 : 0.56, z: 1, delay: '0.1s'  },
      { dx: -OFFSET_1 * mo, r: -4, s: 0.82, op: isMobile ? 0.45 : 0.82, z: 2, delay: '0.05s' },
      { dx:  0,              r:  0, s: 1,    op: 1,                    z: 5, delay: '0s'   },
      { dx:  OFFSET_1 * mo, r:  4, s: 0.82, op: isMobile ? 0.45 : 0.82, z: 2, delay: '0.05s' },
      { dx:  OFFSET_2 * mo, r:  8, s: 0.68, op: mHide ? 0 : 0.56, z: 1, delay: '0.1s'  },
    ];

    const c = CFG[o + 2];
    return {
      style: {
        transform: `translateX(${c.dx}px) rotate(${c.r}deg) scale(${c.s})`,
        opacity: c.op,
        zIndex: c.z,
        transitionDelay: c.delay,
      } as React.CSSProperties,
      clickable: o !== 0,
    };
  }, [active, spread, isMobile, len]);

  const v = inView;

  /* ══════════════════════════════════════════════════════════════════════ */
  return (
    <section
      ref={sectionRef}
      className="lns"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="lns-wrap">

        {/* 'Our Latest Blogs' — top right */}
        <div className={`lns-label${v ? ' lns-in' : ''}`}>
          {/* Curved arrow SVG */}
          <svg width="72" height="52" viewBox="0 0 72 52" fill="none" className="lns-arrow-svg">
            <path
              d="M 68 8 C 55 6, 28 12, 8 42"
              stroke="#96CA45" strokeWidth="2" fill="none"
              strokeLinecap="round"
            />
            <polyline
              points="4,34 8,44 18,40"
              stroke="#96CA45" strokeWidth="2" fill="none"
              strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
          <span className="lns-label-text">Our Latest Blogs</span>
        </div>

        {/* Heading */}
        <div className="lns-h">
          <h2 className={`lns-title${v ? ' lns-in' : ''}`}>
            Latest <span className="lns-title-green">News</span>
          </h2>
          <p className={`lns-sub${v ? ' lns-in' : ''}`}>
            Lorem Ipsum Dolor Sit Amet Consectetur. Purus In In Fames Sit Ac Vitae. Curabitur
            Scelerisque Nunc Mauris Blandit. Donec Tristique Placerat Consectetur Molestie Est
            Ornare. Suspendisse Aliquet Semper Quam Volutpat Bibendum Est Mattis. Sed Neque
            Etiam Morbi A Amet Lacus Phasellus Ipsum Nec.Lorem Ipsum Dolor Sit Amet Consectetur.
          </p>
        </div>

        {/* Card fan stage */}
        <div className="lns-stage-outer">
          <div className="lns-stage">
            {list.map((news, i) => {
              const { style, clickable } = cardTransform(i);
              const isActive = i === active;
              return (
                <div
                  key={news.id}
                  className="lns-cw"
                  style={style}
                  data-clickable={clickable}
                  onClick={() => {
                    if (!clickable) return;
                    goTo(i);
                    resetTimer();
                  }}
                >
                  <div className={`lns-card lns-card-${isActive ? 'active' : 'inactive'}`}>

                    {/* Image area */}
                    <div className="lns-img">
                      <Image
                        src={news.image}
                        alt={news.title}
                        fill
                        className="lns-img-ph"
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                        onError={e => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
                      />
                      <div className="lns-img-overlay" />

                      {/* Author overlay */}
                      <div className="lns-author">
                        <div className="lns-av">
                          {news.author.avatar
                            ? <Image src={news.author.avatar} alt={news.author.name} width={28} height={28} style={{ objectFit: 'cover', borderRadius: '50%' }} />
                            : news.author.name.charAt(0)
                          }
                        </div>
                        <div className="lns-av-text">
                          <span className="lns-av-name">{news.author.name}</span>
                          <span className="lns-av-role">{news.author.role}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom body */}
                    <div className="lns-body">
                      <div>
                        <h3 className="lns-body-title">{news.title}</h3>
                        <p className="lns-body-exc">{news.excerpt}</p>
                      </div>
                      <div className="lns-body-meta">
                        <span className="lns-body-date">{news.date}</span>
                        <span className="lns-body-time">{news.time}</span>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation: prev arrow + dots + next arrow */}
        <div className={`lns-nav${v ? ' lns-in' : ''}`}>
          <button
            className="lns-arrow" aria-label="Previous"
            onClick={() => { goPrev(); resetTimer(); }}
          >&#8592;</button>

          <div className="lns-dots">
            {list.map((_, i) => (
              <button
                key={i}
                className={`lns-dot${i === active ? ' lns-dot-on' : ''}`}
                aria-label={`News ${i + 1}`}
                onClick={() => { goTo(i); resetTimer(); }}
              />
            ))}
          </div>

          <button
            className="lns-arrow" aria-label="Next"
            onClick={() => { goNext(); resetTimer(); }}
          >&#8594;</button>
        </div>

        {/* Progress bar — key changes on every slide so animation resets */}
        <div className={`lns-prog-track${v ? ' lns-in' : ''}`}>
          <div key={progKey.current} className="lns-prog-fill" />
        </div>

      </div>
    </section>
  );
}
