/**
 * ServiceDetailPage — 'use client' content component
 *
 * SERVER WRAPPER (app/services/[slug]/page.tsx):
 * ─────────────────────────────────────────────
 * import { getServiceDetail } from '@/lib/api/services';
 * import ServiceDetailPage from '@/components/ServiceDetailPage';
 *
 * export default async function Page({ params }: { params: { slug: string } }) {
 *   const service = await getServiceDetail(params.slug);
 *   return <ServiceDetailPage service={service} />;
 * }
 */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FAQSection from '@/components/FAQSection';
import WhatsAppButton from '@/components/WhatsAppButton';

/* ══════════════════════════════════════════════════════════════════════
   CONSTANTS — same design tokens as the rest of the site
══════════════════════════════════════════════════════════════════════ */
const FH = "'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif";
const FM = "'Haffer XH Mono-TRIAL','Courier New',monospace";
const GREEN = '#96CA45';
const DARK  = '#252525';
const BLACK = '#000000';

/* ══════════════════════════════════════════════════════════════════════
   TYPES — flexible to match whatever shape the backend returns
══════════════════════════════════════════════════════════════════════ */
interface ServiceFeature {
  id?: string;
  title: string;
  description: string;
  icon?: string;
}

interface RelatedService {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  image?: string | { url: string } | null;
  imageUrl?: string;
}

export interface ServiceDetail {
  id: string;
  name: string;
  slug: string;
  /* Hero */
  image?:           string | { url: string } | null;
  imageUrl?:        string;
  description?:     string;
  shortDescription?: string;
  /* Excellence section */
  secondaryImage?:       string | { url: string } | null;
  excellenceHeading?:    string;
  excellenceDescription?: string;
  longDescription?:      string;
  /* Features grid */
  features?: ServiceFeature[];
  /* Related services */
  relatedServices?: RelatedService[];
  category?: string | { name: string; slug: string };
}

/* ══════════════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════════════ */
function resolveImg(src?: string | { url: string } | null): string | null {
  if (!src) return null;
  if (typeof src === 'string') return src;
  if ('url' in src) return src.url;
  return null;
}
function resolveDesc(s: RelatedService): string {
  return s.shortDescription ?? s.description ?? '';
}

/**
 * SplitHeading — first word dark #252525, remaining words green #96CA45
 * Works for any heading text regardless of word count.
 */
function SplitHeading({ text, fontSize }: { text: string; fontSize: string }) {
  const trimmed = text.trim();
  const space   = trimmed.indexOf(' ');
  const first   = space === -1 ? trimmed : trimmed.slice(0, space);
  const rest    = space === -1 ? ''      : trimmed.slice(space + 1);
  return (
    <h2 style={{
      fontFamily:FH, fontWeight:400, fontSize,
      lineHeight:'1.19', letterSpacing:'-0.03em', margin:0,
    }}>
      <span style={{ color:DARK }}>{first}</span>
      {rest && <span style={{ color:GREEN }}>{' '}{rest}</span>}
    </h2>
  );
}

/** 4-pointed sparkle star */
function SparkleIcon({ size = 59 }: { size?: number }) {
  const c = size / 2;
  // polygon: 4 outer + 4 inner points
  const pts: string[] = [];
  for (let i = 0; i < 8; i++) {
    const a   = (i * Math.PI) / 4 - Math.PI / 2;
    const r   = i % 2 === 0 ? c : c * 0.22;
    pts.push(`${(c + r * Math.cos(a)).toFixed(2)},${(c + r * Math.sin(a)).toFixed(2)}`);
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <polygon points={pts.join(' ')} fill={GREEN} />
    </svg>
  );
}

/** Layers / stack icon for feature cards */
function LayersIcon({ color = BLACK, size = 32 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   FEATURE CARD COLOUR PALETTE  (6-slot cycle, matches Figma)
   Row 1: [GREEN,  DARK,  BLACK]
   Row 2: [DARK,   GREEN, BLACK]
══════════════════════════════════════════════════════════════════════ */
const FEAT_PAL = [
  { bg:GREEN, iconBg:'#fff',   headC:'#000', bodyC:DARK  }, // Row 1: Green
  { bg:DARK,  iconBg:GREEN,    headC:'#fff', bodyC:'#fff' }, // Row 1: Dark
  { bg:GREEN, iconBg:'#fff',   headC:'#000', bodyC:DARK  }, // Row 1: Green
  { bg:DARK,  iconBg:GREEN,    headC:'#fff', bodyC:'#fff' }, // Row 2: Dark
  { bg:GREEN, iconBg:'#fff',   headC:'#000', bodyC:DARK  }, // Row 2: Green
  { bg:DARK,  iconBg:GREEN,    headC:'#fff', bodyC:'#fff' }, // Row 2: Dark
] as const;

/* ══════════════════════════════════════════════════════════════════════
   STYLES  — svc- prefix throughout
══════════════════════════════════════════════════════════════════════ */
const STYLES = `
.svc * { box-sizing:border-box; margin:0; padding:0; }
.svc a  { text-decoration:none; }
.svc img { display:block; }

/* ── keyframes ── */
@keyframes svc-fadein {
  from { opacity:0; transform:translate3d(0,22px,0); }
  to   { opacity:1; transform:translate3d(0,0,0);  }
}
@keyframes svc-wipe-off {
  from { transform:scaleX(1); }
  to   { transform:scaleX(0); }
}

/* ── scroll reveal base ── */
.svc-rv {
  opacity:0; transform:translateY(32px);
  transition:opacity 0.72s cubic-bezier(.22,.68,0,1.2),
             transform 0.72s cubic-bezier(.22,.68,0,1.2);
  will-change:opacity,transform;
}
.svc-rv.svc-in            { opacity:1; transform:translateY(0); }
.svc-rv.svc-d1            { transition-delay:0.10s; }
.svc-rv.svc-d2            { transition-delay:0.20s; }
.svc-rv.svc-d3            { transition-delay:0.30s; }
.svc-rv.svc-d4            { transition-delay:0.40s; }
.svc-rv.svc-d5            { transition-delay:0.50s; }
.svc-rv.svc-d6            { transition-delay:0.60s; }

/* ── Excellence section: right image wipe + Ken Burns ── */
.svc-exc-img { position:relative; border-radius:14px; overflow:hidden; }
.svc-exc-img::after {
  content:''; position:absolute; inset:0; z-index:3; background:#fff;
  transform-origin:right center; transform:scaleX(1);
  transition:transform 1.25s cubic-bezier(0.77,0,0.175,1) 0.12s;
  will-change:transform;
}
.svc-exc-img.svc-in::after { transform:scaleX(0); }
.svc-exc-img-inner {
  transform:scale(1.1);
  transition:transform 1.9s cubic-bezier(.22,.68,0,1.05) 0.12s;
  will-change:transform; position:absolute; inset:0;
}
.svc-exc-img.svc-in .svc-exc-img-inner { transform:scale(1); }

/* ── Feature card ── */
.svc-fc {
  transition:all 0.4s cubic-bezier(.175,.885,.32,1.275);
  will-change:transform,box-shadow;
  position: relative;
}
.svc-fc::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 50%; height: 100%;
  background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 100%);
  transform: skewX(-25deg);
  transition: all 0.7s ease;
  z-index: 1;
  pointer-events: none;
}
.svc-fc:hover::before {
  left: 200%;
}
.svc-fc:hover {
  transform:translateY(-8px) scale(1.03);
  box-shadow:0 22px 40px rgba(0,0,0,0.15);
  z-index: 2;
}
.svc-fc-icon {
  transition:transform 0.5s cubic-bezier(0.34,1.56,0.64,1);
  will-change:transform;
  z-index: 2;
}
.svc-fc:hover .svc-fc-icon { transform:scale(1.2) rotate(12deg); }


/* ── Related service card ── */
.svc-rc {
  transition:transform 0.32s cubic-bezier(.22,.68,0,1.2),
             box-shadow 0.32s ease;
  will-change:transform,box-shadow;
}
.svc-rc:hover {
  transform:translateY(-8px);
  box-shadow:0 24px 56px rgba(0,0,0,0.22);
}
.svc-rc-img-inner {
  transition:transform 0.55s cubic-bezier(.22,.68,0,1.2);
  will-change:transform; width:100%; height:100%;
}
.svc-rc:hover .svc-rc-img-inner { transform:scale(1.05); }
.svc-rc-arrow {
  display:inline-flex; align-items:center; justify-content:center;
  transition:transform 0.28s cubic-bezier(.22,.68,0,1.2);
  will-change:transform;
}
.svc-rc:hover .svc-rc-arrow { transform:translate(3px,-3px); }

/* ── Feature card on small screens: position:static ── */
.svc-exc-wrap {
  display: flex; gap: clamp(24px, 4vw, 64px); align-items: flex-start;
}
.svc-rc-wrap {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 26px; width: 100%;
}

/* decorative collage — scales with viewport */
.svc-exc-deco {
  position: relative; flex-shrink: 0;
  width: clamp(260px, 36vw, 440px);
  height: clamp(280px, 38vw, 380px);
}

@media (max-width:1199px) {
  .svc-feat-row { flex-wrap:wrap !important; }
  .svc-feat-col { width:calc(50% - 12px) !important; flex:unset !important; }
}
@media (max-width:991px) {
  .svc-exc-wrap { flex-direction: column; align-items: center; }
  .svc-exc-text { max-width: 100% !important; }
  /* hide the decorative collage when stacked — too large for column */
  .svc-exc-deco { display: none; }
}
@media (max-width:767px) {
  .svc-feat-row { flex-wrap:wrap !important; }
  .svc-feat-col { width:100% !important; flex:unset !important; }
  .svc-rc-wrap { grid-template-columns: 1fr; }
  .svc-feat-card-body { position:static !important; width:auto !important; padding:0 14px 14px !important; }
  .svc-feat-card-head { position:static !important; width:auto !important; padding:0 14px 8px !important; }
}
@media (max-width:479px) {
  .svc-rc-wrap { gap: 16px; }
}
@media (prefers-reduced-motion:reduce) {
  .svc-rv { opacity:1 !important; transform:none !important; transition:none !important; }
  .svc-exc-img::after { transform:scaleX(0) !important; transition:none !important; }
  .svc-fc,.svc-rc { transition:none !important; }
}
`;

/* ══════════════════════════════════════════════════════════════════════
   HOOK
══════════════════════════════════════════════════════════════════════ */
function useReveal(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('svc-in'); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

/* ══════════════════════════════════════════════════════════════════════
   §1  HERO
   765px tall, radial-gradient vignette over service hero image.
   Service name + short description animate in on mount.
══════════════════════════════════════════════════════════════════════ */
function HeroSection({ service }: { service: ServiceDetail }) {
  const heroImg = resolveImg(service.image) ?? service.imageUrl ?? null;
  const desc    = service.description ?? service.shortDescription ?? '';

  return (
    <section style={{
      position:'relative', width:'100%',
      height:'clamp(420px,53.1vw,765px)',
      overflow:'hidden', display:'flex', alignItems:'flex-end',
    }}>
      {/* Background photo */}
      <div style={{ position:'absolute', inset:0, zIndex:0 }}>
        {heroImg ? (
          <Image src={heroImg} alt={service.name} fill sizes="100vw"
            style={{ objectFit:'cover' }} priority />
        ) : (
          <div style={{ position:'absolute', inset:0, background:'#111' }} />
        )}
        {/* Radial vignette — exact Figma gradient */}
        <div style={{
          position:'absolute', inset:0,
          background:'radial-gradient(56.72% 50% at 50% 50%, rgba(0,0,0,0) 0%, #000 100%)',
        }} />
      </div>

      {/* Text content */}
      <div style={{
        position:'relative', zIndex:2, width:'100%', textAlign:'center',
        padding:'0 24px clamp(36px,5.5vw,80px)',
      }}>
        <h1 style={{
          fontFamily:FH, fontWeight:500, color:'#fff',
          fontSize:'clamp(24px,4vw,48px)',
          lineHeight:'1.19', letterSpacing:'-0.03em',
          marginBottom:'clamp(14px,2vw,28px)',
          animation:'svc-fadein 0.9s cubic-bezier(.22,.68,0,1.2) 0.18s both',
        }}>
          {(() => {
            const words = service.name.split(' ');
            const first = words[0];
            const rest  = words.slice(1).join(' ');
            return (
              <>
                <span style={{ color:'#96CA45' }}>{first}</span>
                {rest && <> {rest}</>}
              </>
            );
          })()}
        </h1>

        {desc && (
          <p style={{
            fontFamily:FH, fontWeight:400, fontSize:'clamp(14px,1.6vw,20px)', color:'#fff',
            lineHeight:'169%', letterSpacing:'0.01em', textTransform:'capitalize',
            maxWidth:1102, margin:'0 auto',
            animation:'svc-fadein 0.9s cubic-bezier(.22,.68,0,1.2) 0.42s both',
          }}>
            {desc}
          </p>
        )}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   §2  EXCELLENCE SECTION
   Full-width heading (first word dark / rest green).
   Left: long descriptive text.
   Right: decorative collage — green tilted rect, secondary photo (flipped),
          sparkle star, green arrow.
══════════════════════════════════════════════════════════════════════ */
function ExcellenceSection({ service }: { service: ServiceDetail }) {
  const heading  = service.excellenceHeading ?? 'Excellence You Can Rely On';
  const text     = service.excellenceDescription ?? service.longDescription
                   ?? service.description ?? '';
  const secImg   = resolveImg(service.secondaryImage);

  /* Separate observers for text block and image collage */
  const textRef  = useRef<HTMLDivElement>(null);
  const imgRef   = useRef<HTMLDivElement>(null);
  const [textVis, setTextVis] = useState(false);
  const [imgVis,  setImgVis]  = useState(false);

  useEffect(() => {
    const makeObs = (el: HTMLElement | null, set: (v:boolean)=>void) => {
      if (!el) return;
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { set(true); obs.disconnect(); }
      }, { threshold: 0.06 });
      obs.observe(el);
      return () => obs.disconnect();
    };
    const d1 = makeObs(textRef.current, setTextVis);
    const d2 = makeObs(imgRef.current,  setImgVis);
    return () => { d1?.(); d2?.(); };
  }, []);

  return (
    <section style={{ background:'#fff', padding:'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 60px)', overflow:'hidden' }}>
      <div style={{ maxWidth:1320, margin:'0 auto' }}>

        {/* ── Full-width heading ── */}
        <div
          className={`svc-rv${textVis?' svc-in':''}`}
          ref={textRef}
          style={{ marginBottom:48 }}
        >
          <SplitHeading text={heading} fontSize="clamp(24px,4vw,48px)" />
        </div>

        {/* ── Two columns ── */}
        <div className="svc-exc-wrap">

          {/* LEFT: text */}
          <div className="svc-exc-text" style={{ flex:1.2, minWidth:0 }}>
            {text.split('\n\n').filter(Boolean).map((para, i) => (
              <p key={i}
                className={`svc-rv${textVis?' svc-in':''}`}
                style={{
                  fontFamily:FH, fontWeight:400, fontSize:'clamp(14px,1.4vw,18px)', lineHeight:'169%',
                  letterSpacing:'0.01em', textTransform:'capitalize', color:'#000',
                  textAlign: 'justify',
                  marginBottom: i < text.split('\n\n').length - 1 ? 24 : 0,
                  transitionDelay:`${i * 0.1 + 0.18}s`,
                }}>
                {para}
              </p>
            ))}
            {/* Single-paragraph fallback */}
            {!text.includes('\n\n') && text && (
              <p className={`svc-rv${textVis?' svc-in':''}`} style={{
                fontFamily:FH, fontWeight:400, fontSize:'clamp(14px,1.4vw,18px)', lineHeight:'169%',
                letterSpacing:'0.01em', textTransform:'capitalize', color:'#000',
                textAlign: 'justify',
                transitionDelay:'0.18s',
              }}>
                {text}
              </p>
            )}
          </div>

          {/* RIGHT: decorative collage */}
          <div className="svc-exc-deco"
            ref={imgRef}>

            {/* Green tilted background rectangle */}
            <div style={{
              position:'absolute', left:90, top:0, width:310, height:325,
              background:GREEN, borderRadius:14,
              transform:'rotate(6.68deg)',
              transformOrigin:'center center',
              opacity: imgVis ? 1 : 0,
              transition:'opacity 0.9s ease 0.05s',
              willChange:'opacity',
            }} />

            {/* Main photo (flipped horizontally) with wipe reveal + Ken Burns */}
            <div
              className={`svc-exc-img${imgVis?' svc-in':''}`}
              style={{
                position:'absolute', left:0, top:34,
                width:335, height:335,
                borderRadius:14, zIndex:1,
              }}
            >
              <div className="svc-exc-img-inner">
                {secImg ? (
                  <Image src={secImg} alt="Excellence" fill sizes="335px"
                    style={{ objectFit:'cover', transform:'scaleX(-1)' }} />
                ) : (
                  <div style={{ position:'absolute', inset:0, background:'#ccc', borderRadius:14 }} />
                )}
              </div>
            </div>

            {/* Sparkle star — top-left of photo area */}
            <div style={{
              position:'absolute', left:20, top:53, zIndex:3,
              opacity: imgVis ? 1 : 0,
              transform: imgVis ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-30deg)',
              transition:'opacity 0.55s ease 0.55s, transform 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.55s',
              willChange:'opacity,transform',
            }}>
              <SparkleIcon size={42} />
            </div>

            {/* Green arrow — bottom of collage */}
            <div style={{
              position:'absolute', left:240, top:335, zIndex:3,
              opacity: imgVis ? 1 : 0,
              transform: imgVis ? 'scale(0.7) translateY(0)' : 'scale(0.7) translateY(10px)',
              transition:'opacity 0.55s ease 0.7s, transform 0.55s ease 0.7s',
              willChange:'opacity,transform',
              transformOrigin: 'top left'
            }}>
              <svg width={82} height={70} viewBox="0 0 82 70" fill="none">
                <path d="M5 65 C20 48 40 33 55 18 C65 8 73 2 77 0"
                  stroke={GREEN} strokeWidth={5} fill="none" strokeLinecap="round"/>
                <path d="M65 0 L77 0 L77 12"
                  stroke={GREEN} strokeWidth={5} fill="none"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   §3  OUR FEATURES
   2 rows × 3 = 6 cards (or however many features the API returns,
   displayed in groups of 3 per row). Each card: 424×290px fixed height,
   content positioned exactly per Figma.
══════════════════════════════════════════════════════════════════════ */
function FeaturesSection({ features }: { features: ServiceFeature[] }) {
  const secRef = useRef<HTMLDivElement>(null);
  const [vis,   setVis]  = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold: 0.05 });
    if (secRef.current) obs.observe(secRef.current);
    return () => obs.disconnect();
  }, []);

  if (!features?.length) return null;

  /* Chunk into rows of 3 */
  const rows: ServiceFeature[][] = [];
  for (let i = 0; i < features.length; i += 3)
    rows.push(features.slice(i, i + 3));

  let globalIdx = 0;

  return (
    <section ref={secRef} style={{ background:'#fff', padding:'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 60px)' }}>
      <div style={{ maxWidth:1320, margin:'0 auto' }}>

        {/* Heading */}
        <div className={`svc-rv${vis?' svc-in':''}`} style={{ marginBottom:40 }}>
          <h2 style={{
            fontFamily:FH, fontWeight:400,
            fontSize:'clamp(24px,4vw,48px)',
            lineHeight:'1.19', letterSpacing:'-0.03em',
          }}>
            <span style={{ color:DARK }}>Our </span>
            <span style={{ color:GREEN }}>Features</span>
          </h2>
        </div>

        {/* Rows */}
        {rows.map((row, ri) => (
          <div key={ri}
            className="svc-feat-row"
            style={{ display:'flex', gap:24, marginBottom: ri < rows.length-1 ? 24 : 0 }}>
            {row.map((feat) => {
              const idx = globalIdx++;
              const pal = FEAT_PAL[idx % FEAT_PAL.length];
              return (
                <div key={feat.id ?? idx}
                  className={`svc-fc svc-rv${vis?' svc-in':''} svc-feat-col`}
                  style={{
                    flex: '1 1 0',
                    minHeight: 'clamp(160px,18vw,203px)',
                    borderRadius:14,
                    background:pal.bg,
                    position:'relative', overflow:'hidden',
                    padding: '10px 14px 14px',
                    display: 'flex', flexDirection: 'column', gap: 8,
                    transitionDelay:`${0.08 + idx * 0.08}s`,
                  }}>
                  {/* Icon box */}
                  <div className="svc-fc-icon" style={{
                    width:40, height:40, borderRadius:4,
                    background:pal.iconBg, flexShrink: 0,
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    <LayersIcon size={24} color={BLACK} />
                  </div>

                  {/* Heading */}
                  <h3 className="svc-feat-card-head" style={{
                    fontFamily:FM, fontWeight:500,
                    fontSize:'clamp(14px,1.4vw,20px)', lineHeight:'1.2',
                    color:pal.headC,
                    zIndex: 2,
                  }}>
                    {feat.title}
                  </h3>

                  {/* Body */}
                  <p className="svc-feat-card-body" style={{
                    fontFamily:FH, fontWeight:400,
                    fontSize:'clamp(11px,1vw,13px)', lineHeight:'150%',
                    letterSpacing:'0.01em', textTransform:'capitalize',
                    color:pal.bodyC,
                    textAlign: 'justify',
                    zIndex: 2,
                  }}>
                    {feat.description}
                  </p>
                </div>
              );
            })}
            {/* Fill empty slots in the last row so layout doesn't break */}
            {row.length < 3 && Array.from({ length:3-row.length }).map((_,k) => (
              <div key={`fill-${k}`} style={{ flex:'1 1 0' }} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   §4  RELATIVE SERVICES
   Exactly 2 related service cards using the same card design
   as the Services listing page (647×568px narrow cards).
══════════════════════════════════════════════════════════════════════ */
function RelativeServicesSection({ services }: { services: RelatedService[] }) {
  const secRef = useRef<HTMLDivElement>(null);
  const [vis,   setVis]  = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold: 0.05 });
    if (secRef.current) obs.observe(secRef.current);
    return () => obs.disconnect();
  }, []);

  if (!services?.length) return null;

  const CARD_COLORS = [DARK, '#D9D9D9'] as const;

  return (
    <section ref={secRef} style={{ background:'#fff', padding:'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 60px)' }}>
      <div style={{ maxWidth:1320, margin:'0 auto' }}>

        {/* Heading */}
        <div className={`svc-rv${vis?' svc-in':''}`} style={{ marginBottom:40 }}>
          <h2 style={{
            fontFamily:FH, fontWeight:400,
            fontSize:'clamp(24px,4vw,48px)',
            lineHeight:'1.19', letterSpacing:'-0.03em',
          }}>
            <span style={{ color:DARK }}>Relative </span>
            <span style={{ color:GREEN }}>Services</span>
          </h2>
        </div>

        {/* Cards row */}
        <div className="svc-rc-wrap">

          {services.slice(0, 2).map((svc, i) => {
            const img     = resolveImg(svc.image) ?? svc.imageUrl ?? null;
            const desc    = resolveDesc(svc);
            const bg      = CARD_COLORS[i % CARD_COLORS.length];
            const isDark  = bg === DARK;

            return (
              <div key={svc.id ?? i}
                className={`svc-rc svc-rv${vis?' svc-in':''}`}
                style={{
                  background:bg, borderRadius:32,
                  display: 'flex', flexDirection: 'column',
                  padding: 24, position:'relative', overflow:'hidden',
                  transitionDelay:`${i * 0.15}s`,
                }}>

                {/* Photo */}
                <div className="svc-rc-img-h" style={{
                  position:'relative', width: '100%', height: 235, 
                  borderRadius:14, overflow:'hidden', flexShrink: 0,
                }}>
                  <div className="svc-rc-img-inner" style={{ position:'absolute', inset:0 }}>
                    {img ? (
                      <Image src={img} alt={svc.name} fill sizes="(max-width: 768px) 100vw, 50vw"
                        style={{ objectFit:'cover', borderRadius:14 }} />
                    ) : (
                      <div style={{
                        width:'100%', height:'100%', borderRadius:14,
                        background: isDark ? 'rgba(150,202,69,0.12)' : 'rgba(0,0,0,0.08)',
                      }} />
                    )}
                  </div>
                </div>

                {/* Service name */}
                <h3 style={{
                  fontFamily:FM, fontWeight:500, fontSize:'clamp(17px,2vw,24px)', lineHeight:'1.2',
                  color: isDark ? '#fff' : '#000', marginTop: 24,
                }}>
                  {svc.name}
                </h3>

                {/* Description */}
                <p style={{
                  fontFamily:FH, fontWeight:400, fontSize:'clamp(13px,1.3vw,16px)', lineHeight:'150%',
                  letterSpacing:'0.01em', textTransform:'capitalize', textAlign: 'justify',
                  color: isDark ? '#fff' : '#000', marginTop: 12, marginBottom: 24,
                }}>
                  {desc}
                </p>

                {/* CTA button */}
                <div style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>
                  <Link href={`/services/${svc.slug}`} style={{ textDecoration:'none' }}>
                    <div style={{
                      display:'flex', alignItems:'center', gap:12,
                      background:'#fff', borderRadius:6,
                      padding:'0 24px', height:48, width:'fit-content',
                    }}>
                      <span style={{
                        fontFamily:FM, fontWeight:600, fontSize:16,
                        color:'#000', textAlign:'center',
                      }}>
                        Explore Service
                      </span>
                      <span className="svc-rc-arrow">
                        <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                          <path d="M7 17L17 7M17 7H7M17 7V17"
                            stroke="#000" strokeWidth={2.2}
                            strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   ROOT EXPORT
══════════════════════════════════════════════════════════════════════ */
export default function ServiceDetailPage({ service }: { service: ServiceDetail }) {
  return (
    <main className="svc">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <HeroSection  service={service} />
      <ExcellenceSection service={service} />

      {!!service.features?.length && (
        <FeaturesSection features={service.features} />
      )}

      {!!service.relatedServices?.length && (
        <RelativeServicesSection services={service.relatedServices} />
      )}

      <FAQSection />
      <WhatsAppButton pageType="service_detail" itemName={service.name} />
    </main>
  );
}