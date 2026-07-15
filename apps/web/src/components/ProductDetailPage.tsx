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
  secondaryImage?: string | { url: string } | null;
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
  const short = url.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
  if (short) return short[1];
  const long = url.match(/youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)([A-Za-z0-9_-]{11})/);
  if (long) return long[1];
  if (/^[A-Za-z0-9_-]{11}$/.test(url.trim())) return url.trim();
  return null;
}

function SplitHeading({ text, fontSize }: { text: string; fontSize: string }) {
  const trimmed = text.trim();
  const space = trimmed.indexOf(' ');
  const first = space === -1 ? trimmed : trimmed.slice(0, space);
  const rest = space === -1 ? '' : trimmed.slice(space + 1);
  return (
    <h2 style={{ fontFamily: FH, fontWeight: 400, fontSize, lineHeight: '1.19', letterSpacing: '-0.03em', margin: 0 }}>
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

/* ── single reusable reveal hook ── */
function useReveal(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

const STYLES = `
.pdt * { box-sizing:border-box; margin:0; padding:0; }
.pdt a  { text-decoration:none; }
.pdt img { display:block; }

/* ── universal reveal ── */
.pdt-rv {
  opacity:0;
  transform:translateY(36px);
  transition:opacity 0.75s cubic-bezier(.22,.68,0,1.2),
             transform 0.75s cubic-bezier(.22,.68,0,1.2);
  will-change:opacity,transform;
}
.pdt-rv.pdt-in { opacity:1; transform:translateY(0); }

/* slide-in from left */
.pdt-sl {
  opacity:0;
  transform:translateX(-32px);
  transition:opacity 0.75s cubic-bezier(.22,.68,0,1.2),
             transform 0.75s cubic-bezier(.22,.68,0,1.2);
  will-change:opacity,transform;
}
.pdt-sl.pdt-in { opacity:1; transform:translateX(0); }

/* slide-in from right */
.pdt-sr {
  opacity:0;
  transform:translateX(32px);
  transition:opacity 0.75s cubic-bezier(.22,.68,0,1.2),
             transform 0.75s cubic-bezier(.22,.68,0,1.2);
  will-change:opacity,transform;
}
.pdt-sr.pdt-in { opacity:1; transform:translateX(0); }

/* scale-up pop */
.pdt-pop {
  opacity:0;
  transform:scale(0.88);
  transition:opacity 0.6s cubic-bezier(.22,.68,0,1.4),
             transform 0.6s cubic-bezier(.22,.68,0,1.4);
  will-change:opacity,transform;
}
.pdt-pop.pdt-in { opacity:1; transform:scale(1); }

/* accent underline wipe */
.pdt-wipe {
  transform:scaleX(0);
  transform-origin:left center;
  transition:transform 0.6s cubic-bezier(.77,0,.175,1);
  will-change:transform;
}
.pdt-wipe.pdt-in { transform:scaleX(1); }

/* image reveal wipe */
.pdt-exc-img { position:relative; border-radius:14px; overflow:hidden; }
.pdt-exc-img::after {
  content:''; position:absolute; inset:0; z-index:3; background:#fff;
  transform-origin:right center; transform:scaleX(1);
  transition:transform 1.25s cubic-bezier(0.77,0,0.175,1) 0.12s;
  will-change:transform;
}
.pdt-exc-img.pdt-in::after { transform:scaleX(0); }
.pdt-exc-img-inner {
  transform:scale(1.08);
  transition:transform 1.9s cubic-bezier(.22,.68,0,1.05) 0.12s;
  will-change:transform; position:absolute; inset:0;
}
.pdt-exc-img.pdt-in .pdt-exc-img-inner { transform:scale(1); }

/* stat chip hover */
.pdt-stat {
  transition:transform 0.32s cubic-bezier(.22,.68,0,1.2), box-shadow 0.32s ease;
}
.pdt-stat:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(0,0,0,0.14); }

/* related cards */
.pdt-rc {
  transition:transform 0.32s cubic-bezier(.22,.68,0,1.2), box-shadow 0.32s ease;
  will-change:transform,box-shadow;
}
.pdt-rc:hover { transform:translateY(-8px); box-shadow:0 24px 56px rgba(0,0,0,0.22); }
.pdt-rc-img-inner {
  transition:transform 0.55s cubic-bezier(.22,.68,0,1.2);
  will-change:transform; width:100%; height:100%;
}
.pdt-rc:hover .pdt-rc-img-inner { transform:scale(1.05); }
.pdt-rc-arrow {
  display:inline-flex; align-items:center; justify-content:center;
  transition:transform 0.28s cubic-bezier(.22,.68,0,1.2);
}
.pdt-rc:hover .pdt-rc-arrow { transform:translate(3px,-3px); }

/* related service cards */
.svc-rc {
  transition:transform 0.32s cubic-bezier(.22,.68,0,1.2), box-shadow 0.32s ease;
  will-change:transform,box-shadow;
}
.svc-rc:hover { transform:translateY(-8px); box-shadow:0 24px 56px rgba(0,0,0,0.22); }
.svc-rc-img-inner {
  transition:transform 0.55s cubic-bezier(.22,.68,0,1.2);
  will-change:transform; width:100%; height:100%;
}
.svc-rc:hover .svc-rc-img-inner { transform:scale(1.05); }
.svc-rc-arrow {
  display:inline-flex; align-items:center; justify-content:center;
  transition:transform 0.28s cubic-bezier(.22,.68,0,1.2);
}
.svc-rc:hover .svc-rc-arrow { transform:translate(3px,-3px); }

/* layout helpers */
.pdt-exc-wrap {
  display:flex; gap:clamp(24px,4vw,64px); align-items:flex-start;
}
.pdt-rc-wrap {
  display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:26px; width:100%;
}
.pdt-stat-row {
  display:flex; gap:16px; flex-wrap:wrap;
}
.pdt-stat-row > * { flex:1; min-width:180px; }

.pdt-exc-deco {
  position:relative; flex-shrink:0;
  width:clamp(260px,36vw,440px);
  height:clamp(280px,38vw,380px);
}

.svc-rc-wrap {
  display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:26px; width:100%;
}

/* ── responsive breakpoints ── */
@media (max-width:991px) {
  .pdt-exc-wrap { flex-direction:column; align-items:stretch; }
  .pdt-exc-deco { display:none; }
}
@media (max-width:767px) {
  .pdt-rc-wrap  { grid-template-columns:1fr; }
  .svc-rc-wrap  { grid-template-columns:1fr; }
  .pdt-stat-row { flex-direction:column; }
  .pdt-stat-row > * { min-width:0; }
}
@media (max-width:479px) {
  .pdt-rc-wrap  { gap:14px; }
  .svc-rc-wrap  { gap:14px; }
}

@media (prefers-reduced-motion:reduce) {
  .pdt-rv,.pdt-sl,.pdt-sr,.pdt-pop { opacity:1 !important; transform:none !important; transition:none !important; }
  .pdt-wipe { transform:scaleX(1) !important; transition:none !important; }
  .pdt-exc-img::after { transform:scaleX(0) !important; transition:none !important; }
  .pdt-rc,.svc-rc { transition:none !important; }
}
`;

/* ══════════════════════ §1 HERO ══════════════════════ */
function HeroSection({ product }: { product: ProductDetail }) {
  const heroImg = resolveImg(product.image) ?? product.imageUrl ?? null;
  return (
    <section style={{
      position: 'relative', width: '100%',
      height: 'clamp(260px,56vw,760px)',
      overflow: 'hidden',
    }}>
      {heroImg ? (
        <Image
          src={heroImg}
          alt={product.name}
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
          priority
        />
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: '#111' }} />
      )}
    </section>
  );
}

/* ══════════════════════ NAMEPLATE ══════════════════════ */
function NameplateSection({ name }: { name: string }) {
  const { ref, visible } = useReveal(0.1);
  return (
    <div ref={ref} style={{
      background: '#fff',
      padding: 'clamp(24px,3.5vw,44px) clamp(16px,5vw,60px) clamp(16px,2.5vw,28px)',
      borderBottom: '1px solid #f0f0f0',
    }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <h1 className={`pdt-sl${visible ? ' pdt-in' : ''}`} style={{
          fontFamily: FH, fontWeight: 600, color: DARK,
          fontSize: 'clamp(24px,3.8vw,52px)',
          lineHeight: 1.15, letterSpacing: '-0.03em',
          marginBottom: 14,
        }}>
          {name}
        </h1>
        <div className={`pdt-wipe${visible ? ' pdt-in' : ''}`} style={{
          width: 56, height: 4, borderRadius: 2, background: GREEN,
          transitionDelay: '0.3s',
        }} />
      </div>
    </div>
  );
}

/* ══════════════════════ §1b VIDEO OVERVIEW ══════════════════════ */
function VideoSection({ videoUrl }: { videoUrl: string }) {
  const videoId = extractYouTubeId(videoUrl);
  const { ref, visible } = useReveal(0.08);
  if (!videoId) return null;
  return (
    <section style={{ background: '#f8f8f8', padding: 'clamp(40px,7vw,80px) clamp(16px,5vw,60px)' }}>
      <div ref={ref} style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h2 className={`pdt-rv${visible ? ' pdt-in' : ''}`} style={{
          fontFamily: FH, fontWeight: 400, fontSize: 'clamp(22px,3.5vw,40px)',
          letterSpacing: '-0.03em', marginBottom: 'clamp(20px,3vw,40px)', color: DARK,
        }}>
          See It in <span style={{ color: GREEN }}>Action</span>
        </h2>
        <div className={`pdt-rv${visible ? ' pdt-in' : ''}`} style={{
          position: 'relative', paddingBottom: '56.25%', height: 0,
          borderRadius: 14, overflow: 'hidden',
          boxShadow: '0 12px 48px rgba(0,0,0,0.12)',
          transitionDelay: '0.15s',
        }}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
            title="Product Overview Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
          />
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════ §2 PRODUCT DETAILS ══════════════════════ */
function DetailsSection({ product }: { product: ProductDetail }) {
  const text = product.details ?? '';
  const heroImg = resolveImg(product.image) ?? product.imageUrl ?? null;
  const secImg = resolveImg(product.secondaryImage) ?? null;

  const { ref: textRef, visible: textVis } = useReveal(0.06);
  const { ref: imgRef,  visible: imgVis  } = useReveal(0.06);

  const paras = text.includes('\n\n')
    ? text.split('\n\n').filter(Boolean)
    : text ? [text] : [];

  return (
    <section style={{ background: '#fff', padding: 'clamp(36px,7vw,72px) clamp(16px,5vw,60px)', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <div className="pdt-exc-wrap">

          {/* ── text side ── */}
          <div ref={textRef} className="pdt-exc-text" style={{ flex: 1.2, minWidth: 0 }}>

            {/* stat chips */}
            <div className="pdt-stat-row" style={{ marginBottom: 28 }}>
              {product.fees && (
                <div className={`pdt-stat pdt-pop${textVis ? ' pdt-in' : ''}`} style={{
                  background: DARK, borderRadius: 14, padding: 'clamp(14px,1.5vw,18px) clamp(16px,1.8vw,22px)',
                  display: 'flex', alignItems: 'center', gap: 14,
                  transitionDelay: '0.08s',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 8, background: GREEN,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <TagIcon size={22} color={BLACK} />
                  </div>
                  <div>
                    <p style={{ fontFamily: FH, fontSize: 'clamp(10px,0.9vw,12px)', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fees</p>
                    <p style={{ fontFamily: FM, fontSize: 'clamp(15px,1.6vw,20px)', fontWeight: 600, color: '#fff', marginTop: 2 }}>₹{product.fees}</p>
                  </div>
                </div>
              )}
              {product.duration && (
                <div className={`pdt-stat pdt-pop${textVis ? ' pdt-in' : ''}`} style={{
                  background: GREEN, borderRadius: 14, padding: 'clamp(14px,1.5vw,18px) clamp(16px,1.8vw,22px)',
                  display: 'flex', alignItems: 'center', gap: 14,
                  transitionDelay: '0.18s',
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

            {/* paragraphs */}
            {paras.map((para, i) => (
              <p key={i}
                className={`pdt-rv${textVis ? ' pdt-in' : ''}`}
                style={{
                  fontFamily: FH, fontWeight: 400,
                  fontSize: 'clamp(14px,1.4vw,18px)', lineHeight: '169%',
                  letterSpacing: '0.01em', color: '#000', textAlign: 'justify',
                  marginBottom: i < paras.length - 1 ? 20 : 0,
                  transitionDelay: `${i * 0.1 + 0.3}s`,
                }}>
                {para}
              </p>
            ))}
          </div>

          {/* ── decorative collage (hidden below 992px via CSS) ── */}
          <div className="pdt-exc-deco" ref={imgRef}>
            {/* tilted back card */}
            <div style={{
              position: 'absolute', left: 90, top: 0, width: 310, height: 325,
              borderRadius: 14, transform: 'rotate(6.68deg)',
              opacity: imgVis ? 1 : 0,
              transition: 'opacity 0.9s ease 0.05s',
              willChange: 'opacity', overflow: 'hidden',
            }}>
              {heroImg && (
                <Image src={heroImg} alt={product.name} fill sizes="310px" style={{ objectFit: 'cover' }} />
              )}
            </div>

            {/* foreground card with wipe reveal */}
            <div className={`pdt-exc-img${imgVis ? ' pdt-in' : ''}`} style={{
              position: 'absolute', left: 0, top: 34, width: 335, height: 335,
              borderRadius: 14, zIndex: 1,
            }}>
              <div className="pdt-exc-img-inner">
                {secImg ? (
                  <Image src={secImg} alt={product.name} fill sizes="335px" style={{ objectFit: 'cover' }} />
                ) : (
                  <div style={{ position: 'absolute', inset: 0, background: '#ccc', borderRadius: 14 }} />
                )}
              </div>
            </div>

            {/* sparkle top-left */}
            <div style={{
              position: 'absolute', left: 20, top: 53, zIndex: 3,
              opacity: imgVis ? 1 : 0,
              transform: imgVis ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-30deg)',
              transition: 'opacity 0.55s ease 0.55s, transform 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.55s',
            }}>
              <SparkleIcon size={42} />
            </div>

            {/* arrow bottom-right */}
            <div style={{
              position: 'absolute', left: 240, top: 335, zIndex: 3,
              opacity: imgVis ? 1 : 0,
              transform: imgVis ? 'scale(0.7) translateY(0)' : 'scale(0.7) translateY(10px)',
              transition: 'opacity 0.55s ease 0.7s, transform 0.55s ease 0.7s',
              transformOrigin: 'top left',
            }}>
              <svg width={82} height={70} viewBox="0 0 82 70" fill="none">
                <path d="M5 65 C20 48 40 33 55 18 C65 8 73 2 77 0"
                  stroke={GREEN} strokeWidth={5} fill="none" strokeLinecap="round" />
                <path d="M65 0 L77 0 L77 12"
                  stroke={GREEN} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
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
  const { ref, visible } = useReveal(0.08);
  if (!text) return null;

  const paras = text.includes('\n\n') ? text.split('\n\n').filter(Boolean) : [text];

  return (
    <section style={{ background: '#f7f7f7', padding: 'clamp(40px,8vw,80px) clamp(16px,5vw,60px)' }}>
      <div ref={ref} style={{ maxWidth: 1320, margin: '0 auto' }}>
        <div className={`pdt-rv${visible ? ' pdt-in' : ''}`} style={{ marginBottom: 32 }}>
          <SplitHeading text="Other Details" fontSize="clamp(24px,4vw,48px)" />
        </div>
        {paras.map((para, i) => (
          <p key={i}
            className={`pdt-rv${visible ? ' pdt-in' : ''}`}
            style={{
              fontFamily: FH, fontWeight: 400,
              fontSize: 'clamp(13px,1.3vw,17px)', lineHeight: '169%',
              letterSpacing: '0.01em', color: DARK,
              textAlign: 'justify', maxWidth: 900,
              marginBottom: i < paras.length - 1 ? 20 : 0,
              transitionDelay: `${i * 0.1 + 0.15}s`,
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
  const { ref, visible } = useReveal(0.05);
  if (!products?.length) return null;

  const CARD_COLORS = [DARK, '#D9D9D9'] as const;

  return (
    <section style={{ background: '#fff', padding: 'clamp(40px,8vw,80px) clamp(16px,5vw,60px)' }}>
      <div ref={ref} style={{ maxWidth: 1320, margin: '0 auto' }}>
        <div className={`pdt-rv${visible ? ' pdt-in' : ''}`} style={{ marginBottom: 40 }}>
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
                className={`pdt-rc pdt-rv${visible ? ' pdt-in' : ''}`}
                style={{
                  background: bg, borderRadius: 32,
                  display: 'flex', flexDirection: 'column',
                  padding: 'clamp(16px,2vw,24px)',
                  position: 'relative', overflow: 'hidden',
                  transitionDelay: `${i * 0.15}s`,
                }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 14, overflow: 'hidden', flexShrink: 0 }}>
                  <div className="pdt-rc-img-inner" style={{ position: 'absolute', inset: 0 }}>
                    {img ? (
                      <Image src={img} alt={p.name} fill sizes="(max-width:768px) 100vw, 50vw"
                        style={{ objectFit: 'cover', borderRadius: 14 }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', borderRadius: 14, background: isDark ? 'rgba(150,202,69,0.12)' : 'rgba(0,0,0,0.08)' }} />
                    )}
                  </div>
                </div>
                <h3 style={{
                  fontFamily: FM, fontWeight: 500, fontSize: 'clamp(16px,2vw,24px)', lineHeight: '1.2',
                  color: isDark ? '#fff' : '#000', marginTop: 20,
                }}>
                  {p.name}
                </h3>
                <p style={{
                  fontFamily: FH, fontWeight: 400, fontSize: 'clamp(13px,1.3vw,16px)', lineHeight: '150%',
                  letterSpacing: '0.01em', color: isDark ? '#fff' : '#000', marginTop: 10, marginBottom: 20,
                }}>
                  {[p.fees ? `₹${p.fees}` : null, p.duration].filter(Boolean).join(' · ')}
                </p>
                <div style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>
                  <Link href={`/products/${p.slug}`}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      background: '#fff', borderRadius: 6,
                      padding: '0 20px', height: 46, width: 'fit-content',
                    }}>
                      <span style={{ fontFamily: FM, fontWeight: 600, fontSize: 15, color: '#000' }}>Explore Product</span>
                      <span className="pdt-rc-arrow">
                        <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                          <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#000" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
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

/* ══════════════════════ §5 RELATED SERVICES ══════════════════════ */
function RelativeServicesSection({ services }: { services: RelatedService[] }) {
  const { ref, visible } = useReveal(0.05);
  if (!services?.length) return null;

  const CARD_COLORS = [DARK, '#D9D9D9'] as const;

  return (
    <section style={{ background: '#f8f8f8', padding: 'clamp(40px,8vw,80px) clamp(16px,5vw,60px)' }}>
      <div ref={ref} style={{ maxWidth: 1320, margin: '0 auto' }}>
        <div className={`pdt-rv${visible ? ' pdt-in' : ''}`} style={{ marginBottom: 40 }}>
          <h2 style={{
            fontFamily: FH, fontWeight: 400,
            fontSize: 'clamp(24px,4vw,48px)',
            lineHeight: '1.19', letterSpacing: '-0.03em',
          }}>
            <span style={{ color: DARK }}>Related </span>
            <span style={{ color: GREEN }}>Services</span>
          </h2>
        </div>

        <div className="svc-rc-wrap">
          {services.slice(0, 2).map((svc, i) => {
            const img = resolveImg(svc.image) ?? svc.imageUrl ?? null;
            const desc = svc.shortDescription ?? svc.description ?? '';
            const bg = CARD_COLORS[i % CARD_COLORS.length];
            const isDark = bg === DARK;
            return (
              <div key={svc.id ?? i}
                className={`svc-rc pdt-rv${visible ? ' pdt-in' : ''}`}
                style={{
                  background: bg, borderRadius: 32,
                  display: 'flex', flexDirection: 'column',
                  padding: 'clamp(16px,2vw,24px)',
                  position: 'relative', overflow: 'hidden',
                  transitionDelay: `${i * 0.15}s`,
                }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 14, overflow: 'hidden', flexShrink: 0 }}>
                  <div className="svc-rc-img-inner" style={{ position: 'absolute', inset: 0 }}>
                    {img ? (
                      <Image src={img} alt={svc.name} fill sizes="(max-width:768px) 100vw, 50vw"
                        style={{ objectFit: 'cover', borderRadius: 14 }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', borderRadius: 14, background: isDark ? 'rgba(150,202,69,0.12)' : 'rgba(0,0,0,0.08)' }} />
                    )}
                  </div>
                </div>
                <h3 style={{
                  fontFamily: FM, fontWeight: 500, fontSize: 'clamp(16px,2vw,24px)', lineHeight: '1.2',
                  color: isDark ? '#fff' : '#000', marginTop: 20,
                }}>
                  {svc.name}
                </h3>
                <p style={{
                  fontFamily: FH, fontWeight: 400, fontSize: 'clamp(13px,1.3vw,16px)', lineHeight: '150%',
                  letterSpacing: '0.01em', textAlign: 'justify',
                  color: isDark ? '#fff' : '#000', marginTop: 10, marginBottom: 20,
                }}>
                  {desc}
                </p>
                <div style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>
                  <Link href={`/services/${svc.slug}`}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      background: '#fff', borderRadius: 6,
                      padding: '0 20px', height: 46, width: 'fit-content',
                    }}>
                      <span style={{ fontFamily: FM, fontWeight: 600, fontSize: 15, color: '#000' }}>Explore Service</span>
                      <span className="svc-rc-arrow">
                        <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                          <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#000" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
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
      <NameplateSection name={product.name} />
      <DetailsSection product={product} />

      {!!product.videoUrl && <VideoSection videoUrl={product.videoUrl} />}
      {!!product.otherDetails && <OtherDetailsSection text={product.otherDetails} />}
      {!!product.relatedServices?.length && <RelativeServicesSection services={product.relatedServices} />}
      {!!product.relatedProducts?.length && <RelatedProductsSection products={product.relatedProducts} />}

      <FAQSection />
      <WhatsAppButton pageType="product_detail" itemName={product.name} />
    </main>
  );
}
