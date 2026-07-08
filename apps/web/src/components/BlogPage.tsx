/**
 * BlogPage — blog listing with premium animations  ('use client' content component)
 *
 * SERVER WRAPPER  (app/blog/page.tsx):
 * ─────────────────────────────────────
 * import { getBlogs } from '@/lib/api/blogs';
 * import BlogPage from '@/components/BlogPage';
 *
 * export default async function Page() {
 *   const data  = await getBlogs();
 *   const blogs = Array.isArray(data) ? data : (data?.data ?? []);
 *   return <BlogPage blogs={blogs} />;
 * }
 */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link  from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import FAQSection from '@/components/FAQSection';
import WhatsAppButton from '@/components/WhatsAppButton';

/* ══════════════════════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════════════════════ */
const FH    = "'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif";
const FM    = "'Haffer XH Mono-TRIAL','Courier New',monospace";
const GREEN = '#96CA45';
const DARK  = '#252525';

/* ══════════════════════════════════════════════════════════════════════
   TYPES  (preserved exactly from original)
══════════════════════════════════════════════════════════════════════ */
interface BlogAuthor {
  name?:   string;
  email?:  string;
  avatar?: string | { url: string } | null;
}
interface BlogPost {
  id?:          string;
  title:        string;
  summary?:     string;
  image?:       string | { url: string } | null;
  slug:         string;
  createdAt?:   string;
  readingTime?: string;
  tags?:        string[];
  author?:      BlogAuthor | null;
}
export interface BlogPageProps {
  blogs:         BlogPost[];
  pagination?:   { page: number; limit: number; total: number; pages: number };
  heroImage?:    string | null;
  heroSubtitle?: string;
}

/* ══════════════════════════════════════════════════════════════════════
   HELPERS  (preserved exactly — resolveImg keeps secureUrl support)
══════════════════════════════════════════════════════════════════════ */
function resolveImg(src?: any): string | null {
  if (!src) return null;
  if (typeof src === 'string') return src;
  if (typeof src === 'object') {
    if (src.secureUrl) return src.secureUrl;
    if (src.url) return src.url;
  }
  return null;
}
function formatDate(d?: string): string {
  if (!d) return '';
  try { return new Date(d).toLocaleDateString('en-GB', { day:'2-digit', month:'2-digit', year:'numeric' }); }
  catch { return d; }
}
/** Figma alternating colour: Row 0→[GREEN,DARK], Row 1→[DARK,GREEN], … */
function cardBg(index: number): string {
  const row = Math.floor(index / 2), col = index % 2;
  return (row + col) % 2 === 0 ? GREEN : DARK;
}

/* ══════════════════════════════════════════════════════════════════════
   STYLES — blg- prefix, all card values ×0.65 from Figma
   ┌─ NEW ANIMATIONS ──────────────────────────────────────────────────
   │ blg-kenburns      — hero bg gentle zoom-out on page load
   │ blg-card-rv       — card entrance: slide-up + scale + fade, per-card stagger
   │ blg-card-g/d      — hover ring colour (green / dark card)
   │ blg-img-zoom      — image scale 1→1.1 on card hover
   │ blg-overlay       — blur overlay fades in on card hover
   │ blg-ov-tags       — tag pills slide down from top
   │ blg-ov-btn        — "Read Article" button springs up from centre
   │ blg-ov-rt-pill    — reading time slides up from bottom-right
   │ blg-title-uline   — underline draws left→right under title
   │ blg-footer-*      — date swaps to "Read More →" on hover
   └───────────────────────────────────────────────────────────────────
══════════════════════════════════════════════════════════════════════ */
const STYLES = `
.blg * { box-sizing:border-box; margin:0; padding:0; }
.blg a  { text-decoration:none; }
.blg img { display:block; }

/* ── Keyframes ── */
@keyframes blg-fadein {
  from { opacity:0; transform:translate3d(0,22px,0); }
  to   { opacity:1; transform:translate3d(0,0,0); }
}
@keyframes blg-pulse {
  0%,100% { opacity:0.55; transform:scale(1);    }
  50%     { opacity:1;    transform:scale(1.25); }
}
/* Hero background gentle Ken Burns zoom-out */
@keyframes blg-kenburns {
  from { transform: scale(1.09); }
  to   { transform: scale(1.0); }
}
/* Card entrance: slide up + scale in */
@keyframes blg-card-enter {
  from { opacity:0; transform:translateY(52px) scale(0.95); }
  to   { opacity:1; transform:translateY(0)    scale(1);    }
}

/* ── Hero BG Ken Burns wrapper ── */
.blg-hero-bg-inner {
  position:absolute; inset:0;
  animation: blg-kenburns 14s cubic-bezier(.22,.68,0,1) both;
  will-change: transform;
}

/* ── Generic scroll reveal (non-card elements) ── */
.blg-rv {
  opacity:0; transform:translateY(26px);
  transition:opacity 0.65s cubic-bezier(.22,.68,0,1.2),
             transform 0.65s cubic-bezier(.22,.68,0,1.2);
  will-change:opacity,transform;
}
.blg-rv.blg-in { opacity:1; transform:translateY(0); }

/* ── Card entrance: driven by CSS animation via .blg-in class
   Each card gets animation-delay via inline style for the cascade   */
.blg-card-rv {
  opacity:0;
  animation-name: blg-card-enter;
  animation-duration: 0.72s;
  animation-timing-function: cubic-bezier(.22,.68,0,1.2);
  animation-fill-mode: both;
  animation-play-state: paused;
  will-change: opacity, transform;
}
.blg-card-rv.blg-in {
  animation-play-state: running;
}

/* ── Card base ── */
.blg-card {
  position:relative;
  transition: transform 0.38s cubic-bezier(.22,.68,0,1.2),
              box-shadow 0.38s ease;
  will-change: transform, box-shadow;
}
.blg-card:hover { transform: translateY(-8px) scale(1.012); }

/* Ring colour on hover — green card gets green ring, dark gets subtle white ring */
.blg-card-g:hover {
  box-shadow: 0 28px 64px rgba(0,0,0,0.22),
              0 0 0 2px rgba(150,202,69,0.65);
}
.blg-card-d:hover {
  box-shadow: 0 28px 64px rgba(0,0,0,0.42),
              0 0 0 2px rgba(255,255,255,0.20);
}

/* ── Image zoom ── */
.blg-img-zoom {
  transition: transform 0.85s cubic-bezier(.22,.68,0,1.2);
  will-change: transform;
}
.blg-card:hover .blg-img-zoom { transform: scale(1.11); }

/* ── Overlay (over image area, backdrop-blurred coloured tint) ── */
.blg-overlay {
  position:absolute; inset:0;
  display:flex; flex-direction:column;
  padding:10px;
  opacity:0;
  transition: opacity 0.45s cubic-bezier(.22,.68,0,1.2);
  will-change: opacity;
  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
}
.blg-card:hover .blg-overlay { opacity:1; }

/* Tags row – slides down from above */
.blg-ov-tags {
  display:flex; flex-wrap:wrap; gap:5px;
  min-height:20px;
  transform:translateY(-12px); opacity:0;
  transition: opacity 0.38s ease 0.06s,
              transform 0.38s cubic-bezier(.22,.68,0,1.2) 0.06s;
  will-change:opacity,transform;
}
.blg-card:hover .blg-ov-tags { transform:translateY(0); opacity:1; }
.blg-ov-tag {
  display:inline-flex; align-items:center;
  padding:2px 9px; border-radius:100px;
  background:rgba(255,255,255,0.22);
  border:1px solid rgba(255,255,255,0.28);
  font-family:${FM}; font-size:10px; font-weight:600; color:#fff;
  letter-spacing:0.02em;
}

/* CTA button – springs up from centre */
.blg-ov-center {
  flex:1; display:flex; align-items:center; justify-content:center;
}
.blg-ov-btn {
  background:rgba(255,255,255,0.96); border-radius:100px;
  padding:9px 20px;
  font-family:${FM}; font-size:13px; font-weight:700; color:#000;
  display:flex; gap:7px; align-items:center;
  box-shadow: 0 8px 28px rgba(0,0,0,0.22);
  transform:translateY(16px) scale(0.88); opacity:0;
  transition: opacity 0.40s ease 0.10s,
              transform 0.40s cubic-bezier(.34,1.56,.64,1) 0.10s;
  will-change:opacity,transform;
  cursor:pointer;
}
.blg-card:hover .blg-ov-btn { opacity:1; transform:translateY(0) scale(1); }
.blg-ov-btn-arrow { transition:transform 0.28s ease; }
.blg-card:hover .blg-ov-btn-arrow { transform:translateX(4px); }

/* Reading time badge – slides up from bottom-right */
.blg-ov-rt {
  display:flex; justify-content:flex-end; align-items:center;
  transform:translateY(10px); opacity:0;
  transition: opacity 0.38s ease 0.18s,
              transform 0.38s ease 0.18s;
}
.blg-card:hover .blg-ov-rt { transform:translateY(0); opacity:1; }
.blg-ov-rt-pill {
  display:inline-flex; align-items:center; gap:4px;
  background:rgba(150,202,69,0.92);
  padding:3px 10px; border-radius:100px;
  font-family:${FM}; font-size:10px; font-weight:700; color:#000;
}

/* Title underline – draws left→right below heading */
.blg-title-uline {
  height:2px; width:0; margin-top:3px;
  transition: width 0.44s cubic-bezier(.22,.68,0,1.2) 0.04s;
  will-change:width;
}
.blg-card:hover .blg-title-uline { width:100%; }

/* Footer date↔readmore swap animation */
.blg-footer-right { position:relative; }
.blg-footer-date {
  display:block;
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.blg-card:hover .blg-footer-date { opacity:0; transform:translateY(-7px); }
.blg-footer-readmore {
  position:absolute; top:0; right:0;
  display:flex; align-items:center; gap:4px;
  white-space:nowrap;
  opacity:0; transform:translateY(7px);
  transition: opacity 0.22s ease 0.08s,
              transform 0.22s ease 0.08s;
  will-change:opacity,transform;
}
.blg-card:hover .blg-footer-readmore { opacity:1; transform:translateY(0); }
.blg-rm-arrow { transition:transform 0.26s ease; }
.blg-card:hover .blg-rm-arrow { transform:translateX(4px); }

/* ── Pagination ── */
.blg-pag-btn {
  display:flex; align-items:center; gap:8px;
  padding:10px 22px; border-radius:6px;
  font-family:${FM}; font-size:13px; font-weight:600; color:#111;
  border:1.5px solid #e0e0e0;
  transition: border-color 0.2s ease, background 0.2s ease,
              transform 0.2s cubic-bezier(.22,.68,0,1.2);
}
.blg-pag-btn:hover { border-color:#111; background:#f8f8f8; transform:scale(1.02); }
.blg-pag-btn-disabled {
  display:flex; align-items:center; gap:8px;
  padding:10px 22px; border-radius:6px;
  font-family:${FM}; font-size:13px; font-weight:600;
  color:rgba(0,0,0,0.28); border:1.5px solid rgba(0,0,0,0.08);
  cursor:not-allowed;
}

/* ── Responsive ── */

/* Large tablet */
@media (max-width:1199px) {
  .blg-section { padding:40px 24px 64px !important; }
}
/* Tablet — keep 2 cols, tighten gap */
@media (max-width:1024px) {
  .blg-grid { gap:12px !important; }
  .blg-section { padding:36px 20px 56px !important; }
}
/* Mobile — single column, auto height, hide overlay */
@media (max-width:767px) {
  .blg-grid    { grid-template-columns:1fr !important; gap:16px !important; }
  .blg-card    { height:auto !important; min-height:320px; }
  .blg-overlay { display:none !important; }
  .blg-title-uline      { display:none; }
  .blg-footer-readmore  { display:none; }
  .blg-footer-date      { opacity:1 !important; transform:none !important; }
  .blg-section { padding:28px 16px 48px !important; }
}
/* Small mobile */
@media (max-width:480px) {
  .blg-card h3     { font-size:20px !important; line-height:25px !important; }
  .blg-card p      { font-size:14px !important; }
  .blg-section     { padding:24px 14px 40px !important; }
}
/* Reduced motion */
@media (prefers-reduced-motion:reduce) {
  .blg-card-rv          { animation:none !important; opacity:1 !important; }
  .blg-card             { transition:none !important; }
  .blg-img-zoom         { transition:none !important; }
  .blg-overlay          { display:none !important; }
  .blg-title-uline      { display:none; }
  .blg-footer-readmore  { display:none !important; }
  .blg-footer-date      { opacity:1 !important; transform:none !important; }
  .blg-hero-bg-inner    { animation:none !important; }
}
`;

/* ══════════════════════════════════════════════════════════════════════
   HOOKS
══════════════════════════════════════════════════════════════════════ */
function useReveal(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('blg-in'); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

/* ══════════════════════════════════════════════════════════════════════
   WAVE DOTS  (same pattern as rest of site — kept for reuse)
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
          animation:`blg-pulse ${1.4+i*0.12}s ease-in-out ${i*0.08}s infinite`,
        }} />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   §1  HERO
   New: Ken Burns zoom-out on the background image (blg-hero-bg-inner).
   Text animations already present; unchanged in logic.
══════════════════════════════════════════════════════════════════════ */
function HeroSection({ heroImage, subtitle }: { heroImage?: string | null; subtitle?: string }) {
  return (
    <section style={{
      position:'relative', width:'100%',
      minHeight:'clamp(360px,53.1vw,765px)',
      display:'flex', alignItems:'flex-end', overflow:'hidden',
    }}>
      {/* BG with Ken Burns wrapper */}
      <div style={{ position:'absolute', inset:0, zIndex:0, overflow:'hidden' }}>
        <div className="blg-hero-bg-inner">
          {heroImage
            ? <Image src={heroImage} alt="Recent News" fill sizes="110vw" priority
                style={{ objectFit:'cover' }} />
            : <div style={{ position:'absolute', inset:0, background:'#111' }} />
          }
        </div>
        <div style={{
          position:'absolute', inset:0,
          background:'radial-gradient(56.72% 50% at 50% 50%, rgba(0,0,0,0) 0%, #000 100%)',
        }} />
      </div>

      {/* Content — staggered text animations */}
      <div style={{
        position:'relative', zIndex:2, width:'100%',
        textAlign:'center', padding:'0 24px clamp(36px,5.5vw,80px)',
      }}>
        <h1 style={{
          fontFamily:FH, fontWeight:500, color:'#fff',
          fontSize:'clamp(40px,8.5vw,123.539px)', lineHeight:'1.19',
          letterSpacing:'-0.03em', marginBottom:'clamp(12px,2vw,24px)',
          animation:'blg-fadein 0.9s cubic-bezier(.22,.68,0,1.2) 0.18s both',
        }}>
          Recent News
        </h1>
        {subtitle && (
          <p style={{
            fontFamily:FH, fontWeight:400, fontSize:20, color:'#fff',
            lineHeight:'169%', letterSpacing:'0.01em', textTransform:'capitalize',
            maxWidth:1102, margin:'0 auto',
            animation:'blg-fadein 0.9s ease 0.42s both',
          }}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   BLOG CARD  — ×0.65 Figma scale + comprehensive hover animations
   ┌─ Photo area (199px) ─────────────────────────────────────────────┐
   │  Hover: image zooms + overlay fades (backdrop-blur)              │
   │  Overlay shows: [tags row top] [Read Article btn centre]         │
   │                 [reading time badge bottom-right]                │
   ├─ Title (23px Mono) ── underline draws on hover ──────────────────┤
   ├─ Summary (16px / 141% / 3 lines) ────────────────────────────────┤
   └─ Footer: author | date ↔ "Read More →" swaps on hover ──────────┘
══════════════════════════════════════════════════════════════════════ */
function BlogCard({ blog, index }: { blog: BlogPost; index: number }) {
  const bg       = cardBg(index);
  const isGreen  = bg === GREEN;
  const img      = resolveImg(blog.image);
  const avatarImg= resolveImg(blog.author?.avatar);

  /* Per-theme colours */
  const titleC    = isGreen ? '#000'               : '#fff';
  const excerptC  = isGreen ? DARK                 : 'rgba(255,255,255,0.6)';
  const authorC   = isGreen ? '#000'               : '#fff';
  const emailC    = isGreen ? 'rgba(0,0,0,0.55)'   : 'rgba(255,255,255,0.6)';
  const dateC     = isGreen ? '#fff'               : 'rgba(255,255,255,0.6)';
  const rmC       = isGreen ? '#000'               : '#fff';
  /* Overlay: inverts card colour with blur */
  const overlayBg = isGreen ? 'rgba(37,37,37,0.80)' : 'rgba(150,202,69,0.82)';

  return (
    <Link href={`/blog/${blog.slug}`} style={{ display:'block', textDecoration:'none' }}>
      <div
        className={`blg-card ${isGreen ? 'blg-card-g' : 'blg-card-d'}`}
        style={{
          background:bg, borderRadius:9,
          height:375, overflow:'hidden',
          display:'flex', flexDirection:'column',
        }}
      >
        {/* ── Photo + hover overlay ── */}
        <div style={{
          position:'relative', margin:'6px 6px 0',
          height:199, borderRadius:3, overflow:'hidden', flexShrink:0,
        }}>
          {/* Image — zooms via CSS on card hover */}
          <div className="blg-img-zoom" style={{ position:'absolute', inset:0 }}>
            {img
              ? <Image src={img} alt={blog.title} fill
                  sizes="(max-width:767px) 100vw, 680px"
                  style={{ objectFit:'cover' }} />
              : <div style={{
                  width:'100%', height:'100%',
                  background: isGreen ? 'rgba(0,0,0,0.12)' : 'rgba(150,202,69,0.12)',
                }} />
            }
          </div>

          {/* Hover overlay — backdrop-blur + colour tint */}
          <div className="blg-overlay" style={{ background:overlayBg }}>

            {/* ① Tags row — slides down from top */}
            <div className="blg-ov-tags">
              {blog.tags?.slice(0, 3).map((tag, i) => (
                <span key={i} className="blg-ov-tag">{tag}</span>
              ))}
            </div>

            {/* ② "Read Article" button — springs up from centre */}
            <div className="blg-ov-center">
              <div className="blg-ov-btn">
                Read Article
                <span className="blg-ov-btn-arrow">
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                    <path d="M7 17L17 7M17 7H7M17 7V17"
                      stroke="#000" strokeWidth={2.2}
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            </div>

            {/* ③ Reading time — slides up from bottom-right */}
            {blog.readingTime && (
              <div className="blg-ov-rt">
                <span className="blg-ov-rt-pill">
                  <svg width={10} height={10} viewBox="0 0 24 24" fill="none">
                    <circle cx={12} cy={12} r={9} stroke="currentColor" strokeWidth={2}/>
                    <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth={2} strokeLinecap="round"/>
                  </svg>
                  {blog.readingTime}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Text content ── */}
        <div style={{ padding:'14px 10px 10px', flex:1, display:'flex', flexDirection:'column' }}>

          {/* Title + underline that draws on hover */}
          <div style={{ marginBottom:8 }}>
            <h3 style={{
              fontFamily:FM, fontWeight:500, fontSize:23, lineHeight:'28px',
              color:titleC,
              overflow:'hidden', display:'-webkit-box',
              WebkitLineClamp:1, WebkitBoxOrient:'vertical',
            }}>
              {blog.title}
            </h3>
            {/* Underline: width 0→100% on card:hover via CSS */}
            <div className="blg-title-uline" style={{ background:titleC }} />
          </div>

          {/* Summary — 3 lines */}
          <p style={{
            fontFamily:FH, fontWeight:400, fontSize:16, lineHeight:'141%',
            letterSpacing:'0.01em', textTransform:'capitalize',
            color:excerptC, flex:1,
            overflow:'hidden', display:'-webkit-box',
            WebkitLineClamp:3, WebkitBoxOrient:'vertical',
          }}>
            {blog.summary}
          </p>

          {/* Footer: author (left) / date↔readmore (right) */}
          <div style={{
            display:'flex', justifyContent:'space-between', alignItems:'flex-end',
            marginTop:10,
          }}>
            {/* Author — graceful: hidden if absent */}
            {/* {blog.author?.name ? (
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{
                  width:26, height:26, borderRadius:'50%', flexShrink:0,
                  overflow:'hidden', border:'1px solid rgba(255,255,255,0.4)',
                  background:'rgba(255,255,255,0.18)',
                }}>
                  {avatarImg && (
                    <Image src={avatarImg} alt={blog.author.name ?? ''}
                      width={26} height={26} style={{ objectFit:'cover' }} />
                  )}
                </div>
                <div>
                  <p style={{ fontFamily:FH, fontSize:11, fontWeight:600, color:authorC, lineHeight:'15px' }}>
                    {blog.author.name}
                  </p>
                  {blog.author.email && (
                    <p style={{ fontFamily:FH, fontSize:10, color:emailC, lineHeight:'13px' }}>
                      {blog.author.email}
                    </p>
                  )}
                </div>
              </div>
            ) : <div />} */}

            {/* Date swaps to "Read More →" on card hover */}
            <div className="blg-footer-right">
              <span className="blg-footer-date"
                style={{ fontFamily:FM, fontSize:11, fontWeight:500, color:dateC, display:'block' }}>
                {formatDate(blog.createdAt)}
              </span>
              {/* "Read More →" fades in as date fades out */}
              <span className="blg-footer-readmore"
                style={{ fontFamily:FM, fontSize:11, fontWeight:600, color:rmC }}>
                Read More
                <span className="blg-rm-arrow">
                  <svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                    <path d="M7 17L17 7M17 7H7M17 7V17"
                      stroke="currentColor" strokeWidth={2.2}
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   §2  BLOG GRID
   CASCADE ENTRANCE: Each card plays blg-card-enter with per-card delay
   → delay = min(i × 0.08s, 0.64s) so cards wave in sequentially.
   Grid: 2-per-row desktop, 1-per-row mobile; fully dynamic.
══════════════════════════════════════════════════════════════════════ */
function BlogGridSection({ blogs }: { blogs: BlogPost[] }) {
  const secRef = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold: 0.04 });
    if (secRef.current) obs.observe(secRef.current);
    return () => obs.disconnect();
  }, []);

  if (!blogs?.length) return null;

  return (
    <section
      ref={secRef}
      className="blg-section"
      style={{ background:'#fff', padding:'52px 40px 80px' }}
    >
      <div style={{ maxWidth:1360, margin:'0 auto' }}>
        <div
          className="blg-grid"
          style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}
        >
          {blogs.map((blog, i) => (
            <div
              key={blog.id ?? blog.slug}
              /* CSS animation cascade: each card enters sequentially */
              className={`blg-card-rv${vis ? ' blg-in' : ''}`}
              style={{ animationDelay:`${Math.min(i * 0.08, 0.64)}s` }}
            >
              <BlogCard blog={blog} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   PAGINATION  (preserved exactly from original — logic unchanged)
══════════════════════════════════════════════════════════════════════ */
function PaginationControls({ pagination }: { pagination?: { page: number; pages: number } }) {
  if (!pagination || pagination.pages <= 1) return null;
  const { page, pages } = pagination;

  return (
    <div style={{
      display:'flex', justifyContent:'center', gap:12,
      padding:'0 40px 48px', background:'#fff',
    }}>
      {page > 1 ? (
        <Link href={`/blog?page=${page - 1}`} className="blg-pag-btn">
          <ArrowLeft size={16} /> Previous
        </Link>
      ) : (
        <div className="blg-pag-btn-disabled">
          <ArrowLeft size={16} /> Previous
        </div>
      )}
      <span style={{
        display:'flex', alignItems:'center', padding:'0 16px',
        fontFamily:FM, fontSize:13, color:'#888',
      }}>
        {page} / {pages}
      </span>
      {page < pages ? (
        <Link href={`/blog?page=${page + 1}`} className="blg-pag-btn">
          Next <ArrowRight size={16} />
        </Link>
      ) : (
        <div className="blg-pag-btn-disabled">
          Next <ArrowRight size={16} />
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   ROOT EXPORT  (signature preserved exactly — pagination prop included)
══════════════════════════════════════════════════════════════════════ */
export default function BlogPage({ blogs, pagination, heroImage, heroSubtitle }: BlogPageProps) {
  const bgImg = heroImage ?? resolveImg(blogs?.[0]?.image);

  return (
    <main className="blg">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <HeroSection heroImage={bgImg} subtitle={heroSubtitle} />
      <BlogGridSection blogs={blogs} />
      <PaginationControls pagination={pagination} />
      <FAQSection />
      <WhatsAppButton pageType="blog" />
    </main>
  );
}