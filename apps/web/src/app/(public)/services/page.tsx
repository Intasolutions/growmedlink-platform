'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getServices } from '@/lib/api/services';
import FAQSection from '@/components/FAQSection';
import WhatsAppButton from '@/components/WhatsAppButton';

/* ══════════════════════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════════════════════ */
const FH = "'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif";
const FM = "'Haffer XH Mono-TRIAL','Courier New',monospace";
const FP = "'Power Grotesk','Helvetica Neue',Arial,sans-serif";
const FS = "'Great Day Personal Use','Brush Script MT',cursive";
const GREEN = '#96CA45';
const DARK  = '#252525';

/* ══════════════════════════════════════════════════════════════════════
   SERVICE TYPE — flexible to handle any backend shape
══════════════════════════════════════════════════════════════════════ */
interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  image?: string | { url?: string; secureUrl?: string; alt?: string } | null;
  imageUrl?: string;
  category?: string | { name: string; slug: string };
}
function resolveImage(s: ServiceItem): string | null {
  if (typeof s.image === 'string' && s.image) return s.image;
  if (s.image && typeof s.image === 'object') {
    if ('secureUrl' in s.image && s.image.secureUrl) return s.image.secureUrl;
    if ('url' in s.image && s.image.url) return s.image.url;
  }
  if (s.imageUrl) return s.imageUrl;
  return null;
}
function resolveDesc(s: ServiceItem): string {
  return s.shortDescription ?? s.description ?? '';
}

/* ══════════════════════════════════════════════════════════════════════
   GEAR MATH — pre-computed once at module load (zero per-render cost)
══════════════════════════════════════════════════════════════════════ */
function gearPath(cx:number, cy:number, R:number, r:number, n:number, hr:number): string {
  const step = (2*Math.PI)/n, tt = step*0.18, gt = step*0.32;
  const pts:[number,number][] = [];
  for (let i=0;i<n;i++){
    const a = i*step - Math.PI/2;
    pts.push([cx+r*Math.cos(a-gt), cy+r*Math.sin(a-gt)]);
    pts.push([cx+R*Math.cos(a-tt), cy+R*Math.sin(a-tt)]);
    pts.push([cx+R*Math.cos(a+tt), cy+R*Math.sin(a+tt)]);
    pts.push([cx+r*Math.cos(a+gt), cy+r*Math.sin(a+gt)]);
  }
  const outer = 'M '+pts.map(p=>`${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' L ')+' Z';
  const hole  = `M ${(cx+hr).toFixed(2)},${cy} A ${hr},${hr} 0 1 0 ${(cx-hr).toFixed(2)},${cy} A ${hr},${hr} 0 1 0 ${(cx+hr).toFixed(2)},${cy} Z`;
  return `${outer} ${hole}`;
}
const G_MAIN = [
  { cx:124, cy:174, R:120, r:90,  n:14, hr:62, color:GREEN, dir:'cw'  as const, baseDur:12, icon:'search'    },
  { cx:356, cy:311, R:155, r:118, n:18, hr:82, color:DARK,  dir:'ccw' as const, baseDur:9,  icon:'handshake' },
  { cx:644, cy:232, R:155, r:118, n:18, hr:82, color:GREEN, dir:'cw'  as const, baseDur:10, icon:'bulb'      },
  { cx:948, cy:208, R:155, r:118, n:18, hr:82, color:DARK,  dir:'ccw' as const, baseDur:11, icon:'check'     },
];
const G_SMALL = [
  { cx:288, cy:79,  R:76, r:57, n:10, hr:38, color:'#3c3c3c', dir:'ccw' as const, dur:'8s' },
  { cx:119, cy:400, R:76, r:57, n:10, hr:38, color:'#3c3c3c', dir:'cw'  as const, dur:'7s' },
  { cx:814, cy:413, R:84, r:63, n:11, hr:42, color:'#3c3c3c', dir:'ccw' as const, dur:'6s' },
  { cx:841, cy:119, R:58, r:43, n:8,  hr:30, color:'#474747', dir:'cw'  as const, dur:'5s' },
];
const G_PATHS_MAIN  = G_MAIN.map(g  => gearPath(g.cx, g.cy, g.R, g.r, g.n, g.hr));

/* ══════════════════════════════════════════════════════════════════════
   STYLES
   Hero:       unchanged dimensions — exactly matches About page
   Non-hero:   all measurements × 0.7 vs original Figma values
══════════════════════════════════════════════════════════════════════ */
const STYLES = `
.srv * { box-sizing:border-box; margin:0; padding:0; }
.srv a  { text-decoration:none; }
.srv img { display:block; }

/* ── keyframes ── */
@keyframes srv-reveal {
  from { opacity:0; transform:translateY(16px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes srv-arrow-float {
  0%,100% { transform:translateY(0); }
  50%     { transform:translateY(-6px); }
}
@keyframes srv-pulse {
  0%,100% { opacity:0.55; transform:scale(1); }
  50%     { opacity:1;    transform:scale(1.25); }
}
/* Identical to About page abt-sunburst-spin — just srv- prefix */
@keyframes srv-sunburst-spin {
  0%   { transform:translate3d(-50%,-50%,0) rotate(0deg); }
  100% { transform:translate3d(-50%,-50%,0) rotate(360deg); }
}
@keyframes srv-cw  { to { transform:rotate(360deg);  } }
@keyframes srv-ccw { to { transform:rotate(-360deg); } }

/* ── hero gradient bar ── */
.srv-grad-bar {
  height:4px;
  background:linear-gradient(91deg,#155BA9 10%,#96CA45 82%);
  opacity:0.22;
}

/* ── generic scroll reveal ── */
.srv-rv {
  opacity:0; transform:translateY(38px);
  transition:opacity 0.72s cubic-bezier(.22,.68,0,1.2),
             transform 0.72s cubic-bezier(.22,.68,0,1.2);
}
.srv-rv.srv-in            { opacity:1; transform:translateY(0); }
.srv-rv.srv-d1            { transition-delay:0.12s; }
.srv-rv.srv-d2            { transition-delay:0.24s; }
.srv-rv.srv-d3            { transition-delay:0.36s; }
.srv-rv.srv-d4            { transition-delay:0.48s; }
.srv-rv.srv-d5            { transition-delay:0.60s; }
.srv-rv.srv-d6            { transition-delay:0.72s; }

/* ── WhatSetsUsApart: image wipe + Ken Burns ──
   border-radius: 24px × 0.7 = 17px                       */
.srv-apart-img { position:relative; overflow:hidden; border-radius:17px; }
.srv-apart-img::after {
  content:''; position:absolute; inset:0; z-index:5; background:#fff;
  transform-origin:right center; transform:scaleX(1);
  transition:transform 1.25s cubic-bezier(0.77,0,0.175,1) 0.08s;
  will-change:transform;
}
.srv-apart-img.srv-in::after          { transform:scaleX(0); }
.srv-apart-img-inner {
  transform:scale(1.1);
  transition:transform 1.9s cubic-bezier(.22,.68,0,1.05) 0.08s;
  will-change:transform; width:100%; height:100%;
}
.srv-apart-img.srv-in .srv-apart-img-inner { transform:scale(1); }
.srv-apart-img:hover .srv-apart-img-inner  { transform:scale(1.04); }

/* ── char wave ── */
.srv-char {
  display:inline-block; opacity:0; transform:translateY(30px);
  transition:opacity .45s ease, transform .45s cubic-bezier(.22,.68,0,1.35);
  will-change:opacity,transform;
}
.srv-char.srv-in { opacity:1; transform:translateY(0); }

/* ── word slide ── */
.srv-word {
  display:block; opacity:0; transform:translateY(36px);
  transition:opacity .65s ease .18s, transform .65s cubic-bezier(.22,.68,0,1.3) .18s;
  will-change:opacity,transform;
}
.srv-word.srv-in { opacity:1; transform:translateY(0); }

/* ── underline draw ── */
.srv-uline {
  display:block; height:2px; background:#96CA45; width:0;
  transition:width 1s cubic-bezier(0.77,0,0.175,1) .82s;
  will-change:width;
}
.srv-uline.srv-in { width:100%; }

/* ── spring scale-in ── */
.srv-spring {
  opacity:0; transform:scale(0);
  transition:opacity .5s ease, transform .6s cubic-bezier(0.34,1.56,0.64,1);
  will-change:opacity,transform;
}
.srv-spring.srv-in { opacity:1; transform:scale(1); }

/* ── service card ── */
.srv-card {
  transition:transform 0.32s cubic-bezier(.22,.68,0,1.2),
             box-shadow 0.32s ease;
  will-change:transform,box-shadow;
}
.srv-card:hover {
  transform:translateY(-8px);
  box-shadow:0 24px 56px rgba(0,0,0,0.22);
}
.srv-card-img { overflow:hidden; }
.srv-card-img-inner {
  transition:transform 0.55s cubic-bezier(.22,.68,0,1.2);
  will-change:transform; width:100%; height:100%;
}
.srv-card:hover .srv-card-img-inner { transform:scale(1.05); }
.srv-card-arrow {
  display:inline-flex; align-items:center; justify-content:center;
  transition:transform 0.28s cubic-bezier(.22,.68,0,1.2);
  will-change:transform;
}
.srv-card:hover .srv-card-arrow { transform:translate(3px,-3px); }

/* ── card stagger ── */
.srv-card-rv {
  opacity:0; transform:translateY(48px);
  transition:opacity .65s ease, transform .65s cubic-bezier(.22,.68,0,1.2);
  will-change:opacity,transform;
}
.srv-card-rv.srv-in { opacity:1; transform:translateY(0); }

/* ── gear hover ── */
.srv-gear-group { cursor:pointer; }
.srv-gear-group path.srv-gear-shape { transition:filter 0.25s ease; }
.srv-gear-group:hover path.srv-gear-shape { filter:brightness(1.2); }

/* ── responsive ── */
@media (max-width:1023px) {
  .srv-gears-svg   { display:none !important; }
  .srv-gears-pills { display:flex !important; }
}
@media (max-width:767px) {
  .srv-h1          { font-size:clamp(32px,8vw,64px) !important; }
  .srv-sh          { font-size:clamp(15px,4vw,22px) !important; line-height:1.25 !important; }
  .srv-wide-inner  { flex-direction:column !important; }
  .srv-wide-img    { width:calc(100% - 36px) !important; aspect-ratio:16/9 !important; min-height:unset !important; }
  .srv-narrow-card { flex:1 1 100% !important; }
  .srv-cards-wrap  { padding:0 14px !important; }
}
@media (max-width:479px) {
  .srv-h1 { font-size:28px !important; }
}
@media (prefers-reduced-motion:reduce) {
  .srv-rv,.srv-spring,.srv-word,.srv-char {
    opacity:1 !important; transform:none !important; transition:none !important;
  }
  .srv-apart-img::after { transform:scaleX(0) !important; transition:none !important; }
  .srv-uline            { width:100% !important; }
  .srv-card             { transition:none !important; }
}
`;

/* ══════════════════════════════════════════════════════════════════════
   UTILITIES
══════════════════════════════════════════════════════════════════════ */

function WaveDots({ flip = false }: { flip?: boolean }) {
  const dots = [
    {l:0,t:29},{l:31,t:24},{l:60,t:29},{l:93,t:20},
    {l:131,t:29},{l:157,t:13},{l:192,t:29},{l:226,t:6},{l:270,t:29},{l:305,t:0},
  ];
  return (
    <div style={{ position:'relative', width:318, height:42, flexShrink:0, transform:flip?'scaleX(-1)':'none' }}>
      {dots.map((d,i) => (
        <div key={i} style={{
          position:'absolute', left:d.l, top:d.t,
          width:13, height:13, borderRadius:'50%', background:GREEN,
          animation:`srv-pulse ${1.4+i*0.12}s ease-in-out ${i*0.08}s infinite`,
        }} />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   GEAR ICONS — SVG <image> elements using the exact exported assets
   Each icon is centred on the gear's cx,cy; size tuned per gear radius
══════════════════════════════════════════════════════════════════════ */
function GearIcon({ cx, cy, href, size }: { cx:number; cy:number; href:string; size:number }) {
  const half = size / 2;
  return (
    <image
      href={href}
      x={cx - half} y={cy - half}
      width={size} height={size}
      style={{ pointerEvents:'none' }}
    />
  );
}

/* ══════════════════════════════════════════════════════════════════════
   §0  GEAR ILLUSTRATION
   Uses exact exported SVG gear + icon assets from /service/
   Icon sizes: gear-1 (small, R=120) → 68px; gears 2-4 (R=155) → 90px
   Handshake icon is wider than tall so gets extra width
══════════════════════════════════════════════════════════════════════ */
const ICON_SRCS: Record<string, string> = {
  search:    '/service/icon-search.svg',
  handshake: '/service/icon-handshake.svg',
  bulb:      '/service/icon-bulb.svg',
  check:     '/service/icon-check.svg',
};
const ICON_SIZES: Record<string, number> = {
  search:    68,
  handshake: 100,
  bulb:      72,
  check:     88,
};

function GearIllustration() {
  const [hov, setHov] = useState<number|null>(null);

  return (
    <div style={{ width:'100%', maxWidth:900, margin:'0 auto', position:'relative', userSelect:'none' }}>
      {/* Desktop SVG */}
      <svg
        className="srv-gears-svg"
        viewBox="0 0 1104 498"
        style={{ width:'100%', height:'auto', overflow:'hidden', display:'block' }}
        aria-label="Interactive service gear illustration" role="img"
      >
        {/* Small connector gears — exact SVG assets, spinning */}
        {[
          { cx:312, cy:92,  size:152, href:'/service/gear-small-1-dark-dot.svg', dir:'ccw' as const, dur:'8s'  },
          { cx:98,  cy:388, size:152, href:'/service/gear-small-2-dark.svg',     dir:'cw'  as const, dur:'7s'  },
          { cx:798, cy:398, size:170, href:'/service/gear-small-3-dark-lg.svg',  dir:'ccw' as const, dur:'6s'  },
          { cx:790, cy:82,  size:118, href:'/service/gear-small-4-dark-sm.svg',  dir:'cw'  as const, dur:'5s'  },
        ].map((g,i) => {
          const half = g.size / 2;
          return (
            <image key={`sg-${i}`}
              href={g.href}
              x={g.cx - half} y={g.cy - half}
              width={g.size} height={g.size}
              style={{
                transformOrigin:`${g.cx}px ${g.cy}px`,
                animation:`${g.dir==='cw'?'srv-cw':'srv-ccw'} ${g.dur} linear infinite`,
              }}
            />
          );
        })}

        {/* Main gears — gear shape spins, icon stays fixed */}
        {G_MAIN.map((g,i) => {
          const isHov = hov===i;
          const dur   = `${isHov ? g.baseDur/2 : g.baseDur}s`;
          const iconSize = ICON_SIZES[g.icon] ?? 80;
          return (
            <g key={`mg-${i}`} className="srv-gear-group"
              onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}>
              {/* Spinning gear shape */}
              <path className="srv-gear-shape"
                d={G_PATHS_MAIN[i]} fill={g.color} fillRule="evenodd"
                style={{
                  transformOrigin:`${g.cx}px ${g.cy}px`,
                  animation:`${g.dir==='cw'?'srv-cw':'srv-ccw'} ${dur} linear infinite`,
                  filter: isHov ? 'brightness(1.18)' : 'none',
                  transition:'filter 0.2s ease',
                }} />
              {/* Static icon centred on gear */}
              <GearIcon cx={g.cx} cy={g.cy} href={ICON_SRCS[g.icon]} size={iconSize} />
            </g>
          );
        })}
      </svg>

      {/* Mobile pill fallback */}
      <div className="srv-gears-pills"
        style={{ display:'none', flexWrap:'wrap', justifyContent:'center', gap:20, padding:'28px 0' }}>
        {[
          { icon:'search',    label:'Discovery',    color:GREEN },
          { icon:'handshake', label:'Partnerships', color:DARK  },
          { icon:'bulb',      label:'Innovation',   color:GREEN },
          { icon:'check',     label:'Results',      color:DARK  },
        ].map((item,i) => (
          <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
            <div style={{ width:72, height:72, borderRadius:'50%', background:item.color,
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 6px 20px rgba(0,0,0,0.15)' }}>
              <img src={ICON_SRCS[item.icon]} alt={item.label}
                width={40} height={40} style={{ objectFit:'contain' }} />
            </div>
            <span style={{ fontFamily:FM, fontSize:12, fontWeight:600, color:'#fff' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   §1  HERO SECTION
   Background identical to About page:
   • background: '#000000'
   • /about-bg-wave.png   — full-height wave image, absolute, z-index 0
   • /sunburst-lines.png  — rotating 80s, opacity 0.25, behind h1
   • srv-grad-bar          — 4px gradient line at very top
   • paddingTop: clamp(110px, 15vh, 170px)   ← matches About exactly
   Hero dimensions are NOT reduced.
══════════════════════════════════════════════════════════════════════ */
function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <section style={{
      background:'#000000', position:'relative',
      overflowX:'hidden', overflowY:'visible',
      paddingTop:'clamp(120px,14vh,180px)', paddingBottom:0,
    }}>
      {/* Wave background */}
      <div style={{ position:'absolute', top:0, left:0, right:0, bottom:0, minHeight:'100%', zIndex:0 }}>
        <Image src="/about-bg-wave.png" alt="" fill
          style={{ objectFit:'cover' }} priority
          onError={e => { (e.currentTarget as HTMLImageElement).style.opacity='0'; }} />
      </div>

      {/* 4px gradient bar */}
      <div className="srv-grad-bar" style={{ position:'absolute', top:0, left:0, right:0, zIndex:5 }} />

      {/* Heading + sunburst halo + avatars */}
      <div style={{ textAlign:'center', padding:'0 clamp(16px,3vw,40px) clamp(12px,2vw,20px)', position:'relative', zIndex:5 }}>
        <div style={{ position:'relative', display:'inline-block' }}>

          {/* Rotating sunburst */}
          <div style={{
            position:'absolute', top:'50%', left:'50%',
            width:'clamp(260px,70vw,750px)', height:'clamp(260px,70vw,750px)',
            marginTop:'calc(clamp(260px,70vw,750px) / -2)',
            marginLeft:'calc(clamp(260px,70vw,750px) / -2)',
            opacity:0.22, pointerEvents:'none', zIndex:-1,
            animation:'srv-sunburst-spin 80s linear infinite',
            willChange:'transform',
          }}>
            <Image src="/sunburst-lines.png" alt="" fill
              style={{ objectFit:'contain' }} priority
              onError={e => { (e.currentTarget as HTMLImageElement).style.opacity='0'; }} />
          </div>

          <h1 className="srv-h1" style={{
            fontFamily:FH, fontWeight:500, letterSpacing:'-0.03em',
            fontSize:'clamp(36px,7vw,96px)', color:'#fff',
            lineHeight:1.15, marginBottom:'clamp(12px,1.8vw,20px)',
          }}>
            Our Services
          </h1>
        </div>

        {/* Avatar row */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'clamp(10px,1.5vw,18px)', marginBottom:'clamp(12px,2vw,20px)', flexWrap:'wrap' }}>
          <Image src="/avatars-group.png" alt="Students" width={221} height={38}
            style={{ height:'clamp(28px,3.5vw,38px)', width:'auto' }}
            onError={e => { (e.currentTarget as HTMLImageElement).style.display='none'; }} />
          <span style={{ fontFamily:FP, fontSize:'clamp(13px,1.4vw,16px)', color:'#CACACA', lineHeight:'1.4' }}>
            7000 + Trusted Students
          </span>
        </div>
      </div>

      {/* Gear illustration */}
      <div style={{ padding:'0 clamp(16px,3vw,40px)', position:'relative', zIndex:5 }}>
        <GearIllustration />
      </div>

      {/* CTA */}
      <div style={{ textAlign:'center', padding:'clamp(20px,2.5vw,36px) 24px 0', position:'relative', zIndex:5 }}>
        <button style={{
          width:'clamp(180px,20vw,228px)', height:'clamp(44px,5vw,54px)',
          background:GREEN, borderRadius:6,
          border:'none', cursor:'pointer', fontFamily:FM,
          fontSize:'clamp(14px,1.2vw,18px)', fontWeight:600, color:'#000',
        }}>
          Explore Services
        </button>
      </div>

      {/* Wave dots (left) + "What We Offer" script (right) */}
      <div style={{
        maxWidth:1440, margin:'0 auto',
        padding:'clamp(20px,3vw,40px) clamp(16px,3vw,40px) clamp(28px,4vw,52px)',
        display:'flex', justifyContent:'space-between', alignItems:'flex-end',
        position:'relative', zIndex:5, flexWrap:'wrap', gap:16,
      }}>
        <WaveDots flip />

        <div style={{
          position:'relative', flexShrink:0,
          opacity: mounted ? 1 : 0,
          animation: mounted
            ? 'srv-reveal 0.75s cubic-bezier(.22,.68,0,1.2) 760ms both, srv-arrow-float 2.6s ease-in-out 1.5s infinite'
            : 'none',
          willChange:'transform,opacity',
        }}>
          <svg viewBox="0 0 82 77" fill="none"
            style={{ position:'absolute', left:'clamp(-80px,-7vw,-52px)', top:'clamp(-44px,-4vw,-30px)', width:'clamp(52px,6vw,82px)', transform:'rotate(-20.36deg)' }}>
            <path d="M5 72 C20 55 40 40 55 25 C65 15 73 7 77 3"
              stroke={GREEN} strokeWidth={2} fill="none" strokeLinecap="round"/>
            <path d="M65 3 L77 3 L77 15"
              stroke={GREEN} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontFamily:FS, fontSize:'clamp(18px,2.2vw,28px)', color:GREEN, lineHeight:1.35, display:'block', transform:'rotate(-4deg)', transformOrigin:'left top', paddingBottom:8 }}>
            What We Offer
          </span>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   §2  WHAT SETS US APART
══════════════════════════════════════════════════════════════════════ */
function WhatSetsUsApart() {
  const secRef = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold: 0.15 });
    if (secRef.current) obs.observe(secRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={secRef} style={{ background:'#fff', padding:'clamp(32px,5vw,64px) clamp(16px,3vw,40px)', overflow:'hidden' }}>
      <style>{`
        .wsa-offset { margin-left: 0; }
        @media(min-width: 900px) {
          .wsa-offset { margin-left: -32%; }
        }
      `}</style>
      <div style={{ maxWidth:1150, margin:'0 auto' }}>
        <div style={{ display:'flex', gap:'clamp(32px, 5vw, 64px)', alignItems:'center', flexWrap:'wrap' }}>
          
          {/* ── LEFT: Image ── */}
          <div style={{ flex: '1 1 400px', position:'relative', maxWidth: 512, width: '100%' }}>
            <div style={{
              opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
            }}>
              <div style={{
                position:'relative', width:'100%', paddingTop:'100%',
                transition: 'transform 0.4s ease', cursor:'pointer'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                <Image src="/service/what-sets-us-apart.png" alt="What Sets Us Apart" fill quality={100} sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit:'contain' }} priority />
              </div>
            </div>
          </div>

          {/* ── RIGHT: Content ── */}
          <div style={{ flex: '1 1 320px', display:'flex', flexDirection:'column', alignItems:'flex-start', minWidth: 280 }}>
            
            {/* Loading Ring Icon */}
            <div style={{
              width: 38, height: 38, marginBottom: 20,
              opacity: vis ? 1 : 0, transform: vis ? 'scale(1)' : 'scale(0)',
              transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s'
            }}>
              <svg width={38} height={38} viewBox="0 0 80 80" fill="none">
                <circle cx={40} cy={40} r={32} stroke="rgba(150,202,69,0.25)" strokeWidth={6.67} />
                <path d="M40 8 A32 32 0 0 1 72 40" stroke={GREEN} strokeWidth={6.67} strokeLinecap="round" />
              </svg>
            </div>

            {/* Heading */}
            <div className="wsa-offset" style={{
              marginBottom: 20,
              opacity: vis ? 1 : 0, transform: vis ? 'translateX(0)' : 'translateX(20px)',
              transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.4s',
              position: 'relative', zIndex: 10
            }}>
              <h2 style={{
                fontFamily: FH, fontWeight: 400,
                fontSize: 'clamp(26px, 2.8vw, 38px)',
                color: DARK, lineHeight: '1.2', display: 'flex', flexWrap: 'wrap', gap: '0.25em'
              }}>
                <span>What Sets</span>
                <span style={{ color: GREEN }}>Us Apart</span>
              </h2>
            </div>

            {/* Top Paragraph */}
            <p className="wsa-offset" style={{
              fontFamily: FH, fontSize: 'clamp(14px, 1.2vw, 15px)', lineHeight: '160%',
              color: '#222', maxWidth: 480, marginBottom: 26,
              opacity: vis ? 1 : 0, transform: vis ? 'translateX(0)' : 'translateX(20px)',
              transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.55s',
              position: 'relative', zIndex: 10
            }}>
              Lorem ipsum dolor sit amet consectetur. Purus in in fames sit ac vitae. Curabitur
              scelerisque nunc mauris blandit. Donec tristique placerat consectetur molestie est
              ornare. Suspendisse aliquet semper quam volutpat bibendum est mattis. Sed neque
              etiam morbi a amet lacus phasellus ipsum nec.
            </p>

            {/* Atom Icon (right) */}
            <div style={{
              marginBottom: 26,
              opacity: vis ? 1 : 0, transform: vis ? 'scale(1) rotate(18.5deg)' : 'scale(0.3) rotate(-15deg)',
              transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.7s'
            }}>
              <svg width={35} height={35} viewBox="0 0 66 66" fill="none">
                <ellipse cx={33} cy={33} rx={30} ry={12} stroke={GREEN} strokeWidth={4.5} fill="none" />
                <ellipse cx={33} cy={33} rx={30} ry={12} stroke={GREEN} strokeWidth={4.5} fill="none" transform="rotate(60 33 33)" />
                <ellipse cx={33} cy={33} rx={30} ry={12} stroke={GREEN} strokeWidth={4.5} fill="none" transform="rotate(120 33 33)" />
                <circle cx={33} cy={33} r={5} fill={GREEN} />
              </svg>
            </div>

            {/* Bottom Paragraph */}
            <p style={{
              fontFamily: FH, fontSize: 'clamp(14px, 1.2vw, 15px)', lineHeight: '160%',
              color: '#222', maxWidth: 480, marginBottom: 32,
              opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.85s'
            }}>
              Lorem ipsum dolor sit amet consectetur. Purus in in fames sit ac vitae. Curabitur
              scelerisque nunc mauris blandit. Donec tristique placerat consectetur molestie est
              ornare. Suspendisse aliquet semper quam volutpat bibendum est mattis. Sed neque
              etiam morbi a amet lacus phasellus ipsum nec.
            </p>

            {/* CTA Button */}
            <div style={{
              opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1) 1s'
            }}>
              <button style={{
                padding: '13px 26px', background: GREEN, borderRadius: 8,
                border: 'none', cursor: 'pointer', fontFamily: FM,
                fontSize: 13, fontWeight: 600, color: '#000',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(150,202,69,0.4)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
              }}>
                Contact Us!
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   CARD BUTTON — × 0.7
   Original: 249×54 18px gap:12 padding:0 24px
   ×0.7:     174×38 13px gap:8  padding:0 17px
══════════════════════════════════════════════════════════════════════ */
function CardButton({ href, textColor='#000' }: { href:string; textColor?:string }) {
  return (
    <Link href={href} style={{ textDecoration:'none', display:'inline-block' }}>
      <div style={{
        display:'flex', alignItems:'center', gap:8,
        background:'#fff', borderRadius:6,
        padding:'0 17px', height:38, width:174,
      }}>
        <span style={{ fontFamily:FM, fontWeight:600, fontSize:13, color:textColor, flex:1, textAlign:'center' }}>
          Explore Services
        </span>
        <span className="srv-card-arrow">
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <path d="M7 17L17 7M17 7H7M17 7V17" stroke={textColor} strokeWidth={2.2}
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   §3  SERVICE CARDS — all card dimensions × 0.7
   Layout:  1 wide  → narrow pair  → 1 wide  → narrow pair  → …
══════════════════════════════════════════════════════════════════════ */
const WIDE_BG   = [GREEN, DARK];
const NARROW_BG = [DARK, '#D9D9D9'] as const;

interface CardGroup { wide:ServiceItem; pair:ServiceItem[]; index:number; }

function groupServices(services:ServiceItem[]): CardGroup[] {
  const groups:CardGroup[] = [];
  let i=0, gi=0;
  while (i < services.length) {
    const wide = services[i++];
    const pair = services.slice(i, i+2);
    i += pair.length;
    groups.push({ wide, pair, index:gi++ });
  }
  return groups;
}

function CardReveal({ children, delay }: { children:React.ReactNode; delay:number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('srv-in'); obs.disconnect(); }
    }, { threshold:0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="srv-card-rv"
      style={{ transitionDelay:`${delay}s`, flex:'inherit', width:'inherit' }}>
      {children}
    </div>
  );
}

function WideCard({ service, bg }: { service:ServiceItem; bg:string; index:number }) {
  const img     = resolveImage(service);
  const desc    = resolveDesc(service);
  const isGreen = bg === GREEN;

  return (
    <CardReveal delay={0}>
      <div className="srv-card srv-wide-card" style={{
        background:bg, borderRadius:22,
        width:'100%', position:'relative', overflow:'hidden',
      }}>
        <div className="srv-wide-inner" style={{ display:'flex', minHeight:280 }}>
          {/* Image */}
          <div className="srv-card-img srv-wide-img" style={{
            width:'clamp(160px,35%,420px)', flexShrink:0,
            margin:18, borderRadius:10, position:'relative', minHeight:200,
          }}>
            <div className="srv-card-img-inner" style={{ position:'absolute', inset:0 }}>
              {img ? (
                <Image src={img} alt={service.name} fill sizes="420px"
                  style={{ objectFit:'cover', borderRadius:10 }} />
              ) : (
                <div style={{ width:'100%', height:'100%', borderRadius:10,
                  background: isGreen ? 'rgba(0,0,0,0.15)' : 'rgba(150,202,69,0.15)' }} />
              )}
            </div>
          </div>
          {/* Text */}
          <div style={{
            flex:1, padding:'clamp(20px,3vw,37px) clamp(16px,2vw,22px) clamp(20px,3vw,37px) 0',
            display:'flex', flexDirection:'column', minWidth:0,
          }}>
            <h3 style={{
              fontFamily:FM, fontWeight:500,
              fontSize:'clamp(18px,2vw,25px)', lineHeight:1.3,
              color: isGreen ? '#000' : '#fff', marginBottom:12,
            }}>
              {service.name}
            </h3>
            <p style={{
              fontFamily:FH, fontSize:'clamp(13px,1.3vw,17px)', lineHeight:'165%',
              letterSpacing:'0.01em', textTransform:'capitalize',
              color: isGreen ? DARK : '#fff', flex:1,
            }}>
              {desc || 'Purus in in fames sit ac vitae. Curabitur scelerisque nunc mauris blandit.'}
            </p>
            <div style={{ marginTop:18 }}>
              <CardButton href={`/services/${service.slug}`} />
            </div>
          </div>
        </div>
      </div>
    </CardReveal>
  );
}

function NarrowCard({ service, bg, delay }: { service:ServiceItem; bg:string; delay:number }) {
  const img  = resolveImage(service);
  const desc = resolveDesc(service);
  const dark = bg === DARK;

  return (
    <CardReveal delay={delay}>
      <div className="srv-card srv-narrow-card" style={{
        background:bg, borderRadius:22,
        flex:'1 1 300px', minWidth:0,
        position:'relative', overflow:'hidden',
        display:'flex', flexDirection:'column',
      }}>
        {/* Image */}
        <div className="srv-card-img" style={{
          margin:17, borderRadius:10, position:'relative',
          aspectRatio:'5/2', flexShrink:0,
        }}>
          <div className="srv-card-img-inner" style={{ position:'absolute', inset:0 }}>
            {img ? (
              <Image src={img} alt={service.name} fill sizes="453px"
                style={{ objectFit:'cover', borderRadius:10 }} />
            ) : (
              <div style={{ width:'100%', height:'100%', borderRadius:10,
                background: dark ? 'rgba(150,202,69,0.12)' : 'rgba(0,0,0,0.08)' }} />
            )}
          </div>
        </div>
        {/* Text */}
        <div style={{ padding:'12px 17px 22px', flex:1, display:'flex', flexDirection:'column' }}>
          <h3 style={{
            fontFamily:FM, fontWeight:500,
            fontSize:'clamp(16px,1.8vw,22px)', lineHeight:1.3,
            color: dark ? '#fff' : '#000', marginBottom:10,
          }}>
            {service.name}
          </h3>
          <p style={{
            fontFamily:FH, fontSize:'clamp(13px,1.2vw,15px)', lineHeight:'165%',
            letterSpacing:'0.01em', textTransform:'capitalize',
            color: dark ? '#fff' : '#000', flex:1,
          }}>
            {desc || 'Purus in in fames sit ac vitae. Curabitur scelerisque nunc mauris blandit.'}
          </p>
          <div style={{ marginTop:18, display:'flex', justifyContent:'flex-end' }}>
            <CardButton href={`/services/${service.slug}`} />
          </div>
        </div>
      </div>
    </CardReveal>
  );
}

function ServiceCardsSection({ services }: { services:ServiceItem[] }) {
  if (!services.length) return null;
  const groups = groupServices(services);

  return (
    <section style={{ background:'#fff', padding:'clamp(20px,3vw,40px) 0 clamp(40px,5vw,72px)' }}>
      <div className="srv-cards-wrap" style={{
        maxWidth:1320, margin:'0 auto',
        padding:'0 clamp(16px,3vw,42px)',
        display:'flex', flexDirection:'column', gap:18,
      }}>
        {groups.map((g, gi) => {
          const wideBg = WIDE_BG[g.index % WIDE_BG.length];
          return (
            <React.Fragment key={g.wide.id ?? gi}>
              <WideCard service={g.wide} bg={wideBg} index={gi} />
              {g.pair.length > 0 && (
                <div className="srv-narrow-row"
                  style={{ display:'flex', gap:18, flexWrap:'wrap' }}>
                  {g.pair.map((svc,pi) => (
                    <NarrowCard key={svc.id ?? pi} service={svc}
                      bg={NARROW_BG[pi % NARROW_BG.length]}
                      delay={0.15*(pi+1)} />
                  ))}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   INNER — useSearchParams (Suspense required by Next.js App Router)
══════════════════════════════════════════════════════════════════════ */
function ServicesInner() {
  const searchParams = useSearchParams();
  const category     = searchParams.get('category') ?? undefined;
  const [services, setServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    getServices(category as any)
      .then((data: any) => {
        const raw: any[] = Array.isArray(data) ? data : (data?.data ?? []);
        setServices(raw.map((s: any) => ({
          ...s,
          id: s._id ?? s.id,
          name: s.name ?? s.title,
          shortDescription: s.shortDescription ?? s.description,
        })));
      })
      .catch((err: unknown) => { console.error('[ServicesPage]', err); });
  }, [category]);

  return (
    <>
      <HeroSection />
      <WhatSetsUsApart />
      <ServiceCardsSection services={services} />
      <FAQSection />
    </>
  );
}


export default function ServicesPage() {
  return (
    <main className="srv">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Suspense fallback={null}>
        <ServicesInner />
      </Suspense>
      <WhatsAppButton pageType="services" />
    </main>
  );
}