'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';

interface NewsItem {
  id: string | number;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  time: string;
}

const AUTO_MS = 5500;

/* ─── fan config per breakpoint ─── */
const FAN = {
  desktop: { w: 420, h: 288, off1: 148, off2: 262, r1: 4, r2: 8, s1: 0.82, s2: 0.68, op1: 0.82, op2: 0.54, stageH: 320 },
  tablet:  { w: 340, h: 234, off1: 120, off2: 212, r1: 4, r2: 8, s1: 0.82, s2: 0.68, op1: 0.78, op2: 0.50, stageH: 264 },
};

const STYLES = `
  @keyframes lns-ring {
    0%,100% { box-shadow:0 0 0 0   rgba(150,202,69,0.55); }
    55%      { box-shadow:0 0 0 8px rgba(150,202,69,0);    }
  }
  @keyframes lns-orb-drift {
    0%,100% { transform:translate(0,0) scale(1);     }
    33%      { transform:translate(18px,-22px) scale(1.08); }
    66%      { transform:translate(-14px,16px) scale(0.94); }
  }

  .lns { background:#1e1e1e; padding:clamp(40px,6vw,72px) 0 clamp(48px,7vw,80px); position:relative; overflow:hidden; }
  .lns-wrap { max-width:1200px; margin:0 auto; padding:0 clamp(16px,4vw,48px); position:relative; z-index:2; }

  /* ambient orbs */
  .lns-orb {
    position:absolute; border-radius:50%; pointer-events:none;
    animation:lns-orb-drift 9s ease-in-out infinite;
  }
  .lns-orb-1 { width:clamp(180px,28vw,380px); height:clamp(180px,28vw,380px); top:-8%; left:-6%; background:radial-gradient(circle,rgba(150,202,69,0.10) 0%,transparent 70%); animation-duration:11s; }
  .lns-orb-2 { width:clamp(140px,22vw,300px); height:clamp(140px,22vw,300px); bottom:-4%; right:-4%; background:radial-gradient(circle,rgba(150,202,69,0.07) 0%,transparent 70%); animation-duration:14s; animation-delay:-4s; }
  .lns-orb-3 { width:clamp(80px,12vw,160px);  height:clamp(80px,12vw,160px);  top:38%; right:12%;  background:radial-gradient(circle,rgba(255,255,255,0.03) 0%,transparent 70%); animation-duration:8s;  animation-delay:-7s; }

  /* heading row */
  .lns-top { display:flex; align-items:flex-start; justify-content:space-between; gap:24px; margin-bottom:clamp(24px,3.5vw,36px); }
  .lns-title {
    font-family:'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size:clamp(34px,5.5vw,80px); font-weight:400;
    line-height:1.14; letter-spacing:-0.03em; color:#fff;
    white-space:nowrap;
  }
  .lns-title-green { color:#96CA45; }
  .lns-sub {
    font-family:'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size:clamp(12.5px,1.3vw,16px); font-weight:400;
    line-height:1.65; color:rgba(255,255,255,0.55);
    max-width:420px; margin-top:clamp(6px,1vw,10px); flex-shrink:0;
  }

  /* handwritten label (top-right) */
  .lns-label {
    display:flex; flex-direction:column; align-items:flex-end; gap:2px;
    pointer-events:none; flex-shrink:0;
  }
  .lns-label-text {
    font-family:'Great Day Personal Use','Brush Script MT',cursive;
    font-size:clamp(16px,2vw,22px); color:#96CA45; white-space:nowrap;
  }

  /* ── FAN stage (desktop + tablet) ── */
  .lns-stage-outer { position:relative; overflow:visible; }
  .lns-stage { position:absolute; inset:0; }

  .lns-cw {
    position:absolute; left:50%; top:50%;
    border-radius:14px; will-change:transform,opacity;
    transform-origin:center bottom;
  }
  .lns-cw { cursor:pointer; }
  .lns-read-btn {
    font-family:'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size:11px; font-weight:700; color:#1a2e00;
    letter-spacing:0.04em;
  }

  .lns-card { width:100%; height:100%; border-radius:14px; overflow:hidden; position:relative; }
  .lns-card-active   { background:#96CA45; }
  .lns-card-inactive { background:#2e2e2e; }

  .lns-img { position:absolute; inset:0; height:71%; overflow:hidden; border-radius:10px 10px 0 0; }
  .lns-img-overlay { position:absolute; inset:0; border-radius:10px 10px 0 0; pointer-events:none; }
  .lns-card-active   .lns-img-overlay { background:rgba(0,0,0,0.06); }
  .lns-card-inactive .lns-img-overlay { background:rgba(0,0,0,0.38); }

  .lns-body {
    position:absolute; bottom:0; left:0; right:0;
    padding:clamp(8px,1.2vw,12px) clamp(10px,1.5vw,16px) clamp(10px,1.3vw,14px);
    height:30%; display:flex; flex-direction:column; justify-content:space-between;
  }
  .lns-card-active   .lns-body-title { color:#1a2e00; }
  .lns-card-inactive .lns-body-title { color:#96CA45; }
  .lns-body-title {
    font-family:'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size:clamp(12px,1.4vw,16px); font-weight:600; line-height:1.3;
    display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
  }
  .lns-body-meta { display:flex; justify-content:space-between; margin-top:auto; }
  .lns-card-active   .lns-body-date,
  .lns-card-active   .lns-body-time { color:rgba(0,0,0,0.38); }
  .lns-card-inactive .lns-body-date,
  .lns-card-inactive .lns-body-time { color:rgba(255,255,255,0.35); }
  .lns-body-date,.lns-body-time {
    font-family:'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size:clamp(10px,1vw,12px); letter-spacing:0.01em;
  }

  /* ── MOBILE single-card stack (< 640px) ── */
  .lns-mobile { display:none; flex-direction:column; gap:0; position:relative; }
  .lns-mobile-viewport { overflow:hidden; border-radius:16px; position:relative; }
  .lns-mobile-track { display:flex; will-change:transform; }
  .lns-mobile-card { flex-shrink:0; width:100%; border-radius:16px; overflow:hidden; position:relative; background:#2e2e2e; }
  .lns-mobile-img  { width:100%; aspect-ratio:16/9; position:relative; overflow:hidden; }
  .lns-mobile-overlay { position:absolute; inset:0; background:rgba(0,0,0,0.3); }
  .lns-mobile-body {
    padding:clamp(12px,4vw,18px); background:#96CA45;
  }
  .lns-mobile-title {
    font-family:'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size:clamp(14px,4vw,18px); font-weight:600; color:#1a2e00;
    line-height:1.3; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
    margin-bottom:6px;
  }
  .lns-mobile-exc {
    font-family:'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size:clamp(11px,3vw,13px); color:rgba(26,46,0,0.72); line-height:1.5;
    display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
    margin-bottom:8px;
  }
  .lns-mobile-meta { display:flex; justify-content:space-between; }
  .lns-mobile-date, .lns-mobile-time {
    font-family:'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size:11px; color:rgba(26,46,0,0.5);
  }

  /* nav + progress */
  .lns-nav {
    display:flex; align-items:center; justify-content:center;
    gap:8px; margin-top:clamp(16px,2.5vw,22px); position:relative; z-index:10;
  }
  .lns-dot {
    width:7px; height:7px; border-radius:50%;
    background:rgba(255,255,255,0.25); border:none; cursor:pointer; padding:0;
    transition:transform 0.25s ease;
  }
  .lns-dot.lns-dot-on {
    background:#96CA45; transform:scale(1.5);
    animation:lns-ring 2.4s ease-in-out infinite 0.3s;
  }
  .lns-prog-track { height:2px; background:rgba(255,255,255,0.08); margin-top:clamp(8px,1.5vw,12px); border-radius:2px; overflow:hidden; }
  .lns-prog-fill  { height:100%; background:#96CA45; transform-origin:left; width:100%; }

  /* ── breakpoints ── */
  @media (max-width:1099px) {
    .lns-title { white-space:normal; }
  }
  @media (max-width:899px) {
    .lns-label { display:none; }
    .lns-top { flex-direction:column; gap:10px; }
    .lns-sub { max-width:100%; }
  }
  @media (max-width:639px) {
    .lns-stage-outer { display:none; }
    .lns-mobile { display:flex; }
  }
  @media (min-width:640px) {
    .lns-mobile { display:none !important; }
  }

  @media (prefers-reduced-motion:reduce) {
    .lns-orb { animation:none !important; }
    .lns-dot { animation:none !important; }
  }
`;

/* ══════════════════════════════════════════════════════════════════════════ */
export default function LatestNewsSection({ initialNews = [] }: { initialNews?: any[] }) {
  const router = useRouter();
  const [blogs, setBlogs]   = useState<any[]>(initialNews);
  const [active, setActive] = useState(0);
  const [breakpoint, setBreakpoint] = useState<'desktop' | 'tablet'>('desktop');

  const sectionRef   = useRef<HTMLDivElement>(null);
  const titleRef     = useRef<HTMLHeadingElement>(null);
  const subRef       = useRef<HTMLParagraphElement>(null);
  const labelRef     = useRef<HTMLDivElement>(null);
  const navRef       = useRef<HTMLDivElement>(null);
  const progFillRef  = useRef<HTMLDivElement>(null);
  const progTrackRef = useRef<HTMLDivElement>(null);
  const cardRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const orbRefs      = useRef<(HTMLDivElement | null)[]>([]);

  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const progTween   = useRef<gsap.core.Tween | null>(null);
  const touchRef    = useRef<{ x: number; y: number } | null>(null);
  const triggeredRef = useRef(false);
  const activeRef   = useRef(0);
  const bpRef       = useRef<'desktop' | 'tablet'>('desktop');

  /* ── fetch ── */
  useEffect(() => {
    if (initialNews && initialNews.length > 0) return;
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${base}/api/blogs?status=published`)
      .then(r => r.json())
      .then(d => { if (d?.success && Array.isArray(d?.data) && d.data.length > 0) setBlogs(d.data); })
      .catch(() => {});
  }, [initialNews]);

  const list: NewsItem[] = (blogs && blogs.length > 0 ? blogs : []).map((item: any) => {
    if (item._id) {
      return {
        id: item._id,
        slug: item.slug || item._id,
        title: item.title,
        excerpt: item.summary || '',
        image: item.image ? (typeof item.image === 'object' ? item.image.secureUrl : item.image) : '/news/news-1.jpg',
        date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : '24/06/2026',
        time: item.createdAt ? new Date(item.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '10:00 AM',
      };
    }
    return item as NewsItem;
  });

  const len = list.length;

  /* ── breakpoint tracking ── */
  useEffect(() => {
    const check = () => {
      const bp = window.innerWidth < 900 ? 'tablet' : 'desktop';
      setBreakpoint(bp);
      bpRef.current = bp;
    };
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── fan card positions ── */
  const positionFor = useCallback((cardIdx: number, cur: number) => {
    if (len === 0) return null;
    let o = cardIdx - cur;
    if (o >  len / 2) o -= len;
    if (o < -len / 2) o += len;
    if (Math.abs(o) > 2) return null;

    const f = FAN[bpRef.current];
    const CFG = [
      { dx: -f.off2, r: -f.r2, s: f.s2, op: f.op2, z: 1 },
      { dx: -f.off1, r: -f.r1, s: f.s1, op: f.op1, z: 2 },
      { dx:  0,      r:  0,    s: 1,    op: 1,      z: 5 },
      { dx:  f.off1, r:  f.r1, s: f.s1, op: f.op1,  z: 2 },
      { dx:  f.off2, r:  f.r2, s: f.s2, op: f.op2,  z: 1 },
    ];
    return { ...CFG[o + 2], w: f.w, h: f.h, clickable: o !== 0 };
  }, [len]);

  /* ── GSAP: set fan card sizes + positions ── */
  const applyPositions = useCallback((cur: number, animate = true) => {
    const f = FAN[bpRef.current];
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const pos = positionFor(i, cur);
      if (!pos) {
        gsap.set(el, { opacity: 0, zIndex: 0, pointerEvents: 'none' });
        return;
      }
      /* update size via CSS vars so the card itself stays responsive */
      el.style.width  = `${pos.w}px`;
      el.style.height = `${pos.h}px`;
      el.style.marginLeft = `${-pos.w / 2}px`;
      el.style.marginTop  = `${-pos.h / 2}px`;

      const target = {
        x: pos.dx, rotation: pos.r, scale: pos.s,
        opacity: pos.op, zIndex: pos.z,
        pointerEvents: pos.clickable ? 'auto' : 'none',
      };
      animate
        ? gsap.to(el, { ...target, duration: 0.68, ease: 'power3.out' })
        : gsap.set(el, target);
    });
  }, [positionFor]);

  /* ── GSAP: mobile track slide ── */
  const applyMobile = useCallback((cur: number, animate = true) => {
    const track = mobileTrackRef.current;
    if (!track) return;
    const pct = -cur * 100;
    animate
      ? gsap.to(track,  { x: `${pct}%`, duration: 0.55, ease: 'power3.out' })
      : gsap.set(track, { x: `${pct}%` });
  }, []);

  /* ── progress bar ── */
  const startProgress = useCallback(() => {
    const fill = progFillRef.current;
    if (!fill) return;
    if (progTween.current) progTween.current.kill();
    gsap.set(fill, { scaleX: 0, transformOrigin: 'left center' });
    progTween.current = gsap.to(fill, { scaleX: 1, duration: AUTO_MS / 1000, ease: 'none' });
  }, []);

  /* ── entrance (fires once on scroll) ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    /* pre-hide */
    if (titleRef.current)    gsap.set(titleRef.current,     { opacity: 0, y: 40 });
    if (subRef.current)      gsap.set(subRef.current,       { opacity: 0, y: 24 });
    if (labelRef.current)    gsap.set(labelRef.current,     { opacity: 0, x: 22 });
    if (navRef.current)      gsap.set(navRef.current,       { opacity: 0, y: 16 });
    if (progTrackRef.current) gsap.set(progTrackRef.current, { opacity: 0 });
    orbRefs.current.forEach(o => o && gsap.set(o, { opacity: 0 }));
    cardRefs.current.forEach(c => c && gsap.set(c, { opacity: 0, scale: 0.8, x: 0, rotation: 0, zIndex: 0 }));

    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || triggeredRef.current) return;
      triggeredRef.current = true;
      io.disconnect();

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      /* orbs fade in slowly */
      tl.to(orbRefs.current.filter(Boolean), { opacity: 1, duration: 1.8, stagger: 0.3, ease: 'power1.out' }, 0);

      /* heading slides up */
      tl.to(titleRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.2)' }, 0.1);
      tl.to(subRef.current,   { opacity: 1, y: 0, duration: 0.6 }, 0.26);
      tl.to(labelRef.current, { opacity: 1, x: 0, duration: 0.6, ease: 'back.out(1.4)' }, 0.34);

      /* fan: cards appear from center and spring out */
      tl.call(() => {
        cardRefs.current.forEach((c, i) => {
          if (!c) return;
          const pos = positionFor(i, 0);
          if (!pos) return;
          c.style.width  = `${pos.w}px`;
          c.style.height = `${pos.h}px`;
          c.style.marginLeft = `${-pos.w / 2}px`;
          c.style.marginTop  = `${-pos.h / 2}px`;
          gsap.set(c, { opacity: 0, scale: 0.75, x: 0, rotation: 0, zIndex: pos.z });
          gsap.to(c, {
            opacity: pos.op, scale: pos.s, x: pos.dx, rotation: pos.r,
            duration: 0.82, ease: 'back.out(1.15)',
            delay: 0.1 + Math.abs(i) * 0.07,
          });
        });
        /* mobile track */
        applyMobile(0, false);
      }, [], 0.32);

      /* nav + progress */
      tl.to(navRef.current,       { opacity: 1, y: 0, duration: 0.5 }, 0.7);
      tl.to(progTrackRef.current, { opacity: 1, duration: 0.5 }, 0.78);
      tl.call(() => startProgress(), [], 1.15);

      /* auto-cycle */
      tl.call(() => {
        timerRef.current = setInterval(() => {
          const next = (activeRef.current + 1) % len;
          activeRef.current = next;
          setActive(next);
          applyPositions(next, true);
          applyMobile(next, true);
          startProgress();
        }, AUTO_MS);
      }, [], 1.15);

    }, { threshold: 0.08 });

    io.observe(section);
    return () => {
      io.disconnect();
      if (timerRef.current) clearInterval(timerRef.current);
      if (progTween.current) progTween.current.kill();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [len]);

  /* ── re-layout on breakpoint change ── */
  useEffect(() => {
    if (!triggeredRef.current) return;
    applyPositions(activeRef.current, true);
  }, [breakpoint, applyPositions]);

  /* ── navigation ── */
  const goTo = useCallback((idx: number) => {
    if (len === 0) return;
    const next = ((idx % len) + len) % len;
    activeRef.current = next;
    setActive(next);
    applyPositions(next, true);
    applyMobile(next, true);
    startProgress();
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const n = (activeRef.current + 1) % len;
      activeRef.current = n;
      setActive(n);
      applyPositions(n, true);
      applyMobile(n, true);
      startProgress();
    }, AUTO_MS);
  }, [len, applyPositions, applyMobile, startProgress]);

  const goNext = useCallback(() => goTo(activeRef.current + 1), [goTo]);
  const goPrev = useCallback(() => goTo(activeRef.current - 1), [goTo]);

  /* ── touch ── */
  const onTouchStart = (e: React.TouchEvent) => {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchRef.current) return;
    const dx = e.changedTouches[0].clientX - touchRef.current.x;
    const dy = e.changedTouches[0].clientY - touchRef.current.y;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 36) dx < 0 ? goNext() : goPrev();
    touchRef.current = null;
  };

  const f = FAN[breakpoint];

  /* ══════════════════════════════════════════════════════════════════════ */
  return (
    <section ref={sectionRef} className="lns" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* Ambient orbs */}
      <div ref={el => { orbRefs.current[0] = el; }} className="lns-orb lns-orb-1" />
      <div ref={el => { orbRefs.current[1] = el; }} className="lns-orb lns-orb-2" />
      <div ref={el => { orbRefs.current[2] = el; }} className="lns-orb lns-orb-3" />

      <div className="lns-wrap">

        {/* Top row: heading + label */}
        <div className="lns-top">
          <div>
            <h2 ref={titleRef} className="lns-title">
              Latest <span className="lns-title-green">News</span>
            </h2>
            <p ref={subRef} className="lns-sub">
              Stay up to date with the latest insights, success stories, and guidance for healthcare professionals navigating their international career journey.
            </p>
          </div>
          <div ref={labelRef} className="lns-label">
            <svg width="72" height="52" viewBox="0 0 72 52" fill="none">
              <path d="M 68 8 C 55 6, 28 12, 8 42" stroke="#96CA45" strokeWidth="2" fill="none" strokeLinecap="round" />
              <polyline points="4,34 8,44 18,40" stroke="#96CA45" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="lns-label-text">Our Latest Blogs</span>
          </div>
        </div>

        {/* ── Fan stage (≥ 640px) ── */}
        <div className="lns-stage-outer" style={{ height: f.stageH }}>
          <div className="lns-stage">
            {list.map((news, i) => {
              const isActive = i === active;
              return (
                <div
                  key={news.id}
                  ref={el => { cardRefs.current[i] = el; }}
                  className="lns-cw"
                  data-clickable="true"
                  onClick={() => {
                    if (!isActive) { goTo(i); }
                    else { router.push(`/blog/${news.slug}`); }
                  }}
                >
                  <div className={`lns-card lns-card-${isActive ? 'active' : 'inactive'}`}>
                    <div className="lns-img">
                      <Image
                        src={news.image} alt={news.title} fill
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                        onError={e => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
                      />
                      <div className="lns-img-overlay" />
                    </div>
                    <div className="lns-body">
                      <h3 className="lns-body-title">{news.title}</h3>
                      <div className="lns-body-meta">
                        <span className="lns-body-date">{news.date}</span>
                        {isActive
                          ? <span className="lns-read-btn">Read →</span>
                          : <span className="lns-body-time">{news.time}</span>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Mobile single-card slider (< 640px) ── */}
        <div className="lns-mobile">
          <div className="lns-mobile-viewport">
            <div ref={mobileTrackRef} className="lns-mobile-track">
              {list.map((news, i) => (
                <div
                  key={news.id}
                  className="lns-mobile-card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => router.push(`/blog/${news.slug}`)}
                >
                  <div className="lns-mobile-img">
                    <Image
                      src={news.image} alt={news.title} fill
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                      onError={e => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
                    />
                    <div className="lns-mobile-overlay" />
                  </div>
                  <div className="lns-mobile-body">
                    <div className="lns-mobile-title">{news.title}</div>
                    <div className="lns-mobile-exc">{news.excerpt}</div>
                    <div className="lns-mobile-meta">
                      <span className="lns-mobile-date">{news.date}</span>
                      <span className="lns-mobile-time" style={{ fontWeight: 700, color: '#1a2e00' }}>Read →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots */}
        <div ref={navRef} className="lns-nav">
          {list.map((_, i) => (
            <button
              key={i}
              className={`lns-dot${i === active ? ' lns-dot-on' : ''}`}
              aria-label={`News ${i + 1}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div ref={progTrackRef} className="lns-prog-track">
          <div ref={progFillRef} className="lns-prog-fill" />
        </div>

      </div>
    </section>
  );
}
