'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FAQSection from '@/components/FAQSection';
import WhatsAppButton from '@/components/WhatsAppButton';

const FH = "'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif";
const FM = "'Haffer XH Mono-TRIAL','Courier New',monospace";
const GREEN = '#96CA45';
const DARK = '#252525';
const BLACK = '#000000';

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  fees?: string;
  duration?: string;
  image?: string | { url: string } | null;
  imageUrl?: string;
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

export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  image?: string | { url: string } | null;
  imageUrl?: string;
  details?: string;
  fees?: string;
  duration?: string;
  otherDetails?: string;
  relatedProducts?: RelatedProduct[];
  relatedServices?: RelatedService[];
  videoUrl?: string;
}

function resolveImg(src?: string | { url: string } | null): string | null {
  if (!src) return null;
  if (typeof src === 'string') return src;
  if ('url' in src) return src.url;
  return null;
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  // youtu.be/ID
  const short = url.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
  if (short) return short[1];
  // youtube.com/watch?v=ID  /embed/ID  /v/ID  /shorts/ID
  const long = url.match(/youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)([A-Za-z0-9_-]{11})/);
  if (long) return long[1];
  // bare 11-char ID
  if (/^[A-Za-z0-9_-]{11}$/.test(url.trim())) return url.trim();
  return null;
}

function SplitHeading({ text, fontSize }: { text: string; fontSize: string }) {
  const trimmed = text.trim();
  const space = trimmed.indexOf(' ');
  const first = space === -1 ? trimmed : trimmed.slice(0, space);
  const rest = space === -1 ? '' : trimmed.slice(space + 1);
  return (
    <h2 style={{
      fontFamily: FH, fontWeight: 400, fontSize,
      lineHeight: '1.19', letterSpacing: '-0.03em', margin: 0,
    }}>
      <span style={{ color: DARK }}>{first}</span>
      {rest && <span style={{ color: GREEN }}>{' '}{rest}</span>}
    </h2>
  );
}

function SparkleIcon({ size = 59 }: { size?: number }) {
  const c = size / 2;
  const pts: string[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 - Math.PI / 2;
    const r = i % 2 === 0 ? c : c * 0.22;
    pts.push(`${(c + r * Math.cos(a)).toFixed(2)},${(c + r * Math.sin(a)).toFixed(2)}`);
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <polygon points={pts.join(' ')} fill={GREEN} />
    </svg>
  );
}

function ClockIcon({ size = 24, color = BLACK }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

function TagIcon({ size = 24, color = BLACK }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41 12 22l-9-9V4h9z" />
      <circle cx="7.5" cy="8.5" r="1.5" fill={color} stroke="none" />
    </svg>
  );
}

const STYLES = `
.pdt * { box-sizing:border-box; margin:0; padding:0; }
.pdt a  { text-decoration:none; }
.pdt img { display:block; }

@keyframes pdt-fadein {
  from { opacity:0; transform:translate3d(0,22px,0); }
  to   { opacity:1; transform:translate3d(0,0,0);  }
}

.pdt-rv {
  opacity:0; transform:translateY(32px);
  transition:opacity 0.72s cubic-bezier(.22,.68,0,1.2),
             transform 0.72s cubic-bezier(.22,.68,0,1.2);
  will-change:opacity,transform;
}
.pdt-rv.pdt-in { opacity:1; transform:translateY(0); }

.pdt-exc-img { position:relative; border-radius:14px; overflow:hidden; }
.pdt-exc-img::after {
  content:''; position:absolute; inset:0; z-index:3; background:#fff;
  transform-origin:right center; transform:scaleX(1);
  transition:transform 1.25s cubic-bezier(0.77,0,0.175,1) 0.12s;
  will-change:transform;
}
.pdt-exc-img.pdt-in::after { transform:scaleX(0); }
.pdt-exc-img-inner {
  transform:scale(1.1);
  transition:transform 1.9s cubic-bezier(.22,.68,0,1.05) 0.12s;
  will-change:transform; position:absolute; inset:0;
}
.pdt-exc-img.pdt-in .pdt-exc-img-inner { transform:scale(1); }

.pdt-stat {
  transition: transform 0.32s cubic-bezier(.22,.68,0,1.2), box-shadow 0.32s ease;
}
.pdt-stat:hover { transform: translateY(-4px); }

.pdt-rc {
  transition:transform 0.32s cubic-bezier(.22,.68,0,1.2),
             box-shadow 0.32s ease;
  will-change:transform,box-shadow;
}
.pdt-rc:hover {
  transform:translateY(-8px);
  box-shadow:0 24px 56px rgba(0,0,0,0.22);
}
.pdt-rc-img-inner {
  transition:transform 0.55s cubic-bezier(.22,.68,0,1.2);
  will-change:transform; width:100%; height:100%;
}
.pdt-rc:hover .pdt-rc-img-inner { transform:scale(1.05); }
.pdt-rc-arrow {
  display:inline-flex; align-items:center; justify-content:center;
  transition:transform 0.28s cubic-bezier(.22,.68,0,1.2);
  will-change:transform;
}
.pdt-rc:hover .pdt-rc-arrow { transform:translate(3px,-3px); }

.pdt-exc-wrap {
  display: flex; gap: clamp(24px, 4vw, 64px); align-items: flex-start;
}
.pdt-rc-wrap {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 26px; width: 100%;
}
.pdt-stat-row {
  display: flex; gap: 20px;
}

/* decorative collage — scales with viewport */
.pdt-exc-deco {
  position: relative; flex-shrink: 0;
  width: clamp(260px, 36vw, 440px);
  height: clamp(280px, 38vw, 380px);
}

@media (max-width:991px) {
  .pdt-exc-wrap { flex-direction: column; align-items: center; }
  .pdt-exc-text { max-width: 100% !important; }
  /* hide decorative collage when stacked */
  .pdt-exc-deco { display: none; }
}
@media (max-width:767px) {
  .pdt-rc-wrap { grid-template-columns: 1fr; }
  .pdt-stat-row { flex-direction: column; }
}
@media (max-width:479px) {
  .pdt-rc-wrap { gap: 16px; }
}
@media (prefers-reduced-motion:reduce) {
  .pdt-rv { opacity:1 !important; transform:none !important; transition:none !important; }
  .pdt-exc-img::after { transform:scaleX(0) !important; transition:none !important; }
  .pdt-rc { transition:none !important; }
}

/* ── Related service card (imported from ServiceDetailPage) ── */
.svc-rc-wrap {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 26px; width: 100%;
}
.svc-rc {
  transition:transform 0.32s cubic-bezier(.22,.68,0,1.2), box-shadow 0.32s ease;
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
.svc-rv {
  opacity:0; transform:translateY(32px);
  transition:opacity 0.72s cubic-bezier(.22,.68,0,1.2), transform 0.72s cubic-bezier(.22,.68,0,1.2);
  will-change:opacity,transform;
}
.svc-rv.svc-in { opacity:1; transform:translateY(0); }
`;

function useReveal(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('pdt-in'); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

/* ══════════════════════ §1 HERO ══════════════════════ */
function HeroSection({ product }: { product: ProductDetail }) {
  const heroImg = resolveImg(product.image) ?? product.imageUrl ?? null;

  return (
    <section style={{
      position: 'relative', width: '100%',
      height: 'clamp(420px,53.1vw,765px)',
      overflow: 'hidden', display: 'flex', alignItems: 'flex-end',
    }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {heroImg ? (
          <Image src={heroImg} alt={product.name} fill sizes="100vw"
            style={{ objectFit: 'cover' }} priority />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: '#111' }} />
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(56.72% 50% at 50% 50%, rgba(0,0,0,0) 0%, #000 100%)',
        }} />
      </div>

      <div style={{
        position: 'relative', zIndex: 2, width: '100%', textAlign: 'center',
        padding: '0 24px clamp(36px,5.5vw,80px)',
      }}>
        <h1 style={{
          fontFamily: FH, fontWeight: 500, color: '#fff',
          fontSize: 'clamp(24px,4vw,48px)',
          lineHeight: '1.19', letterSpacing: '-0.03em',
          marginBottom: 'clamp(14px,2vw,28px)',
          animation: 'pdt-fadein 0.9s cubic-bezier(.22,.68,0,1.2) 0.18s both',
        }}>
          {product.name}
        </h1>

        <div style={{
          display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap',
          animation: 'pdt-fadein 0.9s cubic-bezier(.22,.68,0,1.2) 0.42s both',
        }}>
          {product.fees && (
            <span style={{ fontFamily: FM, fontSize: 18, color: GREEN, fontWeight: 600 }}>
              {product.fees}
            </span>
          )}
          {product.duration && (
            <span style={{ fontFamily: FM, fontSize: 18, color: '#fff', fontWeight: 600 }}>
              {product.duration}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════ §1b VIDEO OVERVIEW ══════════════════════ */
function VideoSection({ videoUrl }: { videoUrl: string }) {
  const videoId = extractYouTubeId(videoUrl);
  if (!videoId) return null;
  return (
    <section style={{ background: '#f8f8f8', padding: 'clamp(40px,7vw,80px) clamp(20px,5vw,60px)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{
          fontFamily: FH, fontWeight: 400, fontSize: 'clamp(22px,3.5vw,40px)',
          letterSpacing: '-0.03em', marginBottom: 'clamp(20px,3vw,40px)', color: DARK,
        }}>
          Watch <span style={{ color: GREEN }}>Overview</span>
        </h2>
        {/* 16:9 responsive wrapper */}
        <div style={{
          position: 'relative', paddingBottom: '56.25%', height: 0,
          borderRadius: 14, overflow: 'hidden',
          boxShadow: '0 12px 48px rgba(0,0,0,0.12)',
        }}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
            title="Product Overview Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: 'absolute', top: 0, left: 0,
              width: '100%', height: '100%', border: 0,
            }}
          />
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════ §2 PRODUCT DETAILS ══════════════════════ */
function DetailsSection({ product }: { product: ProductDetail }) {
  const text = product.details ?? '';
  const secImg = resolveImg(product.image) ?? product.imageUrl ?? null;

  const textRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const [textVis, setTextVis] = useState(false);
  const [imgVis, setImgVis] = useState(false);

  useEffect(() => {
    const makeObs = (el: HTMLElement | null, set: (v: boolean) => void) => {
      if (!el) return;
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { set(true); obs.disconnect(); }
      }, { threshold: 0.06 });
      obs.observe(el);
      return () => obs.disconnect();
    };
    const d1 = makeObs(textRef.current, setTextVis);
    const d2 = makeObs(imgRef.current, setImgVis);
    return () => { d1?.(); d2?.(); };
  }, []);

  return (
    <section style={{ background: '#fff', padding: 'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 60px)', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>

        <div className={`pdt-rv${textVis ? ' pdt-in' : ''}`} ref={textRef} style={{ marginBottom: 48 }}>
          <SplitHeading text="Product Details" fontSize="clamp(24px,4vw,48px)" />
        </div>

        <div className="pdt-exc-wrap">
          <div className="pdt-exc-text" style={{ flex: 1.2, minWidth: 0 }}>
            {/* Fees / Duration stat chips */}
            <div className="pdt-stat-row" style={{ marginBottom: 28 }}>
              {product.fees && (
                <div className={`pdt-stat pdt-rv${textVis ? ' pdt-in' : ''}`} style={{
                  flex: 1, background: DARK, borderRadius: 14, padding: '18px 22px',
                  display: 'flex', alignItems: 'center', gap: 14, transitionDelay: '0.08s',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 8, background: GREEN,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <TagIcon size={22} color={BLACK} />
                  </div>
                  <div>
                    <p style={{ fontFamily: FH, fontSize: 'clamp(10px,0.9vw,12px)', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fees</p>
                    <p style={{ fontFamily: FM, fontSize: 'clamp(15px,1.6vw,20px)', fontWeight: 600, color: '#fff', marginTop: 2 }}>{product.fees}</p>
                  </div>
                </div>
              )}
              {product.duration && (
                <div className={`pdt-stat pdt-rv${textVis ? ' pdt-in' : ''}`} style={{
                  flex: 1, background: GREEN, borderRadius: 14, padding: '18px 22px',
                  display: 'flex', alignItems: 'center', gap: 14, transitionDelay: '0.16s',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 8, background: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <ClockIcon size={22} color={BLACK} />
                  </div>
                  <div>
                    <p style={{ fontFamily: FH, fontSize: 'clamp(10px,0.9vw,12px)', color: 'rgba(0,0,0,0.55)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Duration</p>
                    <p style={{ fontFamily: FM, fontSize: 'clamp(15px,1.6vw,20px)', fontWeight: 600, color: BLACK, marginTop: 2 }}>{product.duration}</p>
                  </div>
                </div>
              )}
            </div>

            {text.split('\n\n').filter(Boolean).map((para, i) => (
              <p key={i}
                className={`pdt-rv${textVis ? ' pdt-in' : ''}`}
                style={{
                  fontFamily: FH, fontWeight: 400, fontSize: 'clamp(14px,1.4vw,18px)', lineHeight: '169%',
                  letterSpacing: '0.01em', textTransform: 'capitalize', color: '#000',
                  textAlign: 'justify',
                  marginBottom: i < text.split('\n\n').length - 1 ? 24 : 0,
                  transitionDelay: `${i * 0.1 + 0.24}s`,
                }}>
                {para}
              </p>
            ))}
            {!text.includes('\n\n') && text && (
              <p className={`pdt-rv${textVis ? ' pdt-in' : ''}`} style={{
                fontFamily: FH, fontWeight: 400, fontSize: 'clamp(14px,1.4vw,18px)', lineHeight: '169%',
                letterSpacing: '0.01em', textTransform: 'capitalize', color: '#000',
                textAlign: 'justify',
                transitionDelay: '0.24s',
              }}>
                {text}
              </p>
            )}
          </div>

          <div className="pdt-exc-deco" ref={imgRef}>
            <div style={{
              position: 'absolute', left: 90, top: 0, width: 310, height: 325,
              background: GREEN, borderRadius: 14,
              transform: 'rotate(6.68deg)',
              transformOrigin: 'center center',
              opacity: imgVis ? 1 : 0,
              transition: 'opacity 0.9s ease 0.05s',
              willChange: 'opacity',
            }} />

            <div className={`pdt-exc-img${imgVis ? ' pdt-in' : ''}`} style={{
              position: 'absolute', left: 0, top: 34,
              width: 335, height: 335,
              borderRadius: 14, zIndex: 1,
            }}>
              <div className="pdt-exc-img-inner">
                {secImg ? (
                  <Image src={secImg} alt={product.name} fill sizes="335px"
                    style={{ objectFit: 'cover', transform: 'scaleX(-1)' }} />
                ) : (
                  <div style={{ position: 'absolute', inset: 0, background: '#ccc', borderRadius: 14 }} />
                )}
              </div>
            </div>

            <div style={{
              position: 'absolute', left: 20, top: 53, zIndex: 3,
              opacity: imgVis ? 1 : 0,
              transform: imgVis ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-30deg)',
              transition: 'opacity 0.55s ease 0.55s, transform 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.55s',
              willChange: 'opacity,transform',
            }}>
              <SparkleIcon size={42} />
            </div>

            <div style={{
              position: 'absolute', left: 240, top: 335, zIndex: 3,
              opacity: imgVis ? 1 : 0,
              transform: imgVis ? 'scale(0.7) translateY(0)' : 'scale(0.7) translateY(10px)',
              transition: 'opacity 0.55s ease 0.7s, transform 0.55s ease 0.7s',
              willChange: 'opacity,transform',
              transformOrigin: 'top left',
            }}>
              <svg width={82} height={70} viewBox="0 0 82 70" fill="none">
                <path d="M5 65 C20 48 40 33 55 18 C65 8 73 2 77 0"
                  stroke={GREEN} strokeWidth={5} fill="none" strokeLinecap="round" />
                <path d="M65 0 L77 0 L77 12"
                  stroke={GREEN} strokeWidth={5} fill="none"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════ §3 OTHER DETAILS ══════════════════════ */
function OtherDetailsSection({ text }: { text: string }) {
  const secRef = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold: 0.08 });
    if (secRef.current) obs.observe(secRef.current);
    return () => obs.disconnect();
  }, []);

  if (!text) return null;

  return (
    <section ref={secRef} style={{ background: '#f7f7f7', padding: 'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 60px)' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <div className={`pdt-rv${vis ? ' pdt-in' : ''}`} style={{ marginBottom: 32 }}>
          <SplitHeading text="Other Details" fontSize="clamp(24px,4vw,48px)" />
        </div>
        {text.split('\n\n').filter(Boolean).map((para, i) => (
          <p key={i}
            className={`pdt-rv${vis ? ' pdt-in' : ''}`}
            style={{
              fontFamily: FH, fontWeight: 400, fontSize: 'clamp(13px,1.3vw,17px)', lineHeight: '169%',
              letterSpacing: '0.01em', textTransform: 'capitalize', color: DARK,
              textAlign: 'justify', maxWidth: 900,
              marginBottom: i < text.split('\n\n').length - 1 ? 20 : 0,
              transitionDelay: `${i * 0.1 + 0.1}s`,
            }}>
            {para}
          </p>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════ §4 RELATED PRODUCTS ══════════════════════ */
function RelatedProductsSection({ products }: { products: RelatedProduct[] }) {
  const secRef = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold: 0.05 });
    if (secRef.current) obs.observe(secRef.current);
    return () => obs.disconnect();
  }, []);

  if (!products?.length) return null;

  const CARD_COLORS = [DARK, '#D9D9D9'] as const;

  return (
    <section ref={secRef} style={{ background: '#fff', padding: 'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 60px)' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <div className={`pdt-rv${vis ? ' pdt-in' : ''}`} style={{ marginBottom: 40 }}>
          <h2 style={{
            fontFamily: FH, fontWeight: 400,
            fontSize: 'clamp(24px,4vw,48px)',
            lineHeight: '1.19', letterSpacing: '-0.03em',
          }}>
            <span style={{ color: DARK }}>Related </span>
            <span style={{ color: GREEN }}>Products</span>
          </h2>
        </div>

        <div className="pdt-rc-wrap">
          {products.slice(0, 2).map((p, i) => {
            const img = resolveImg(p.image) ?? p.imageUrl ?? null;
            const bg = CARD_COLORS[i % CARD_COLORS.length];
            const isDark = bg === DARK;

            return (
              <div key={p.id ?? i}
                className={`pdt-rc pdt-rv${vis ? ' pdt-in' : ''}`}
                style={{
                  background: bg, borderRadius: 32,
                  display: 'flex', flexDirection: 'column',
                  padding: 24, position: 'relative', overflow: 'hidden',
                  transitionDelay: `${i * 0.15}s`,
                }}>
                <div style={{ position: 'relative', width: '100%', height: 235, borderRadius: 14, overflow: 'hidden', flexShrink: 0 }}>
                  <div className="pdt-rc-img-inner" style={{ position: 'absolute', inset: 0 }}>
                    {img ? (
                      <Image src={img} alt={p.name} fill sizes="(max-width: 768px) 100vw, 50vw"
                        style={{ objectFit: 'cover', borderRadius: 14 }} />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%', borderRadius: 14,
                        background: isDark ? 'rgba(150,202,69,0.12)' : 'rgba(0,0,0,0.08)',
                      }} />
                    )}
                  </div>
                </div>

                <h3 style={{
                  fontFamily: FM, fontWeight: 500, fontSize: 'clamp(17px,2vw,24px)', lineHeight: '1.2',
                  color: isDark ? '#fff' : '#000', marginTop: 24,
                }}>
                  {p.name}
                </h3>

                <p style={{
                  fontFamily: FH, fontWeight: 400, fontSize: 'clamp(13px,1.3vw,16px)', lineHeight: '150%',
                  letterSpacing: '0.01em', textTransform: 'capitalize',
                  color: isDark ? '#fff' : '#000', marginTop: 12, marginBottom: 24,
                }}>
                  {[p.fees, p.duration].filter(Boolean).join(' · ')}
                </p>

                <div style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>
                  <Link href={`/products/${p.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      background: '#fff', borderRadius: 6,
                      padding: '0 24px', height: 48, width: 'fit-content',
                    }}>
                      <span style={{ fontFamily: FM, fontWeight: 600, fontSize: 16, color: '#000', textAlign: 'center' }}>
                        Explore Product
                      </span>
                      <span className="pdt-rc-arrow">
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

function RelativeServicesSection({ services }: { services: RelatedService[] }) {
  const secRef = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

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
    <section ref={secRef} style={{ background: '#fff', padding: 'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 60px)' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        {/* Heading */}
        <div className={`svc-rv${vis ? ' svc-in' : ''}`} style={{ marginBottom: 40 }}>
          <h2 style={{
            fontFamily: FH, fontWeight: 400,
            fontSize: 'clamp(24px,4vw,48px)',
            lineHeight: '1.19', letterSpacing: '-0.03em',
          }}>
            <span style={{ color: DARK }}>Related </span>
            <span style={{ color: GREEN }}>Services</span>
          </h2>
        </div>

        {/* Cards row */}
        <div className="svc-rc-wrap">
          {services.slice(0, 2).map((svc, i) => {
            const img = resolveImg(svc.image) ?? svc.imageUrl ?? null;
            const desc = svc.shortDescription ?? svc.description ?? '';
            const bg = CARD_COLORS[i % CARD_COLORS.length];
            const isDark = bg === DARK;

            return (
              <div key={svc.id ?? i}
                className={`svc-rc svc-rv${vis ? ' svc-in' : ''}`}
                style={{
                  background: bg, borderRadius: 32,
                  display: 'flex', flexDirection: 'column',
                  padding: 24, position: 'relative', overflow: 'hidden',
                  transitionDelay: `${i * 0.15}s`,
                }}>

                {/* Photo */}
                <div className="svc-rc-img-h" style={{
                  position: 'relative', width: '100%', height: 235,
                  borderRadius: 14, overflow: 'hidden', flexShrink: 0,
                }}>
                  <div className="svc-rc-img-inner" style={{ position: 'absolute', inset: 0 }}>
                    {img ? (
                      <Image src={img} alt={svc.name} fill sizes="(max-width: 768px) 100vw, 50vw"
                        style={{ objectFit: 'cover', borderRadius: 14 }} />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%', borderRadius: 14,
                        background: isDark ? 'rgba(150,202,69,0.12)' : 'rgba(0,0,0,0.08)',
                      }} />
                    )}
                  </div>
                </div>

                {/* Service name */}
                <h3 style={{
                  fontFamily: FM, fontWeight: 500, fontSize: 'clamp(17px,2vw,24px)', lineHeight: '1.2',
                  color: isDark ? '#fff' : '#000', marginTop: 24,
                }}>
                  {svc.name}
                </h3>

                {/* Description */}
                <p style={{
                  fontFamily: FH, fontWeight: 400, fontSize: 'clamp(13px,1.3vw,16px)', lineHeight: '150%',
                  letterSpacing: '0.01em', textTransform: 'capitalize', textAlign: 'justify',
                  color: isDark ? '#fff' : '#000', marginTop: 12, marginBottom: 24,
                }}>
                  {desc}
                </p>

                {/* CTA button */}
                <div style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>
                  <Link href={`/services/${svc.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      background: '#fff', borderRadius: 6,
                      padding: '0 24px', height: 48, width: 'fit-content',
                    }}>
                      <span style={{
                        fontFamily: FM, fontWeight: 600, fontSize: 16,
                        color: '#000', textAlign: 'center',
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

/* ══════════════════════ ROOT EXPORT ══════════════════════ */
export default function ProductDetailPage({ product }: { product: ProductDetail }) {
  return (
    <main className="pdt">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <HeroSection product={product} />

      <DetailsSection product={product} />

      {!!product.videoUrl && (
        <VideoSection videoUrl={product.videoUrl} />
      )}

      {!!product.otherDetails && (
        <OtherDetailsSection text={product.otherDetails} />
      )}

      {!!product.relatedServices?.length && (
        <RelativeServicesSection services={product.relatedServices} />
      )}

      {!!product.relatedProducts?.length && (
        <RelatedProductsSection products={product.relatedProducts} />
      )}

      <FAQSection />
      <WhatsAppButton pageType="product_detail" itemName={product.name} />
    </main>
  );
}
