/**
 * BlogPage — blog listing  ('use client' content component)
 *
 * SERVER WRAPPER  (app/blog/page.tsx):
 * ─────────────────────────────────────
 * import { getBlogs } from '@/lib/api/blogs';   // adjust import to match your API
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

/* ══════════════════════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════════════════════ */
const FH    = "'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif";
const FM    = "'Haffer XH Mono-TRIAL','Courier New',monospace";
const GREEN = '#96CA45';
const DARK  = '#252525';

/* ══════════════════════════════════════════════════════════════════════
   TYPES
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
  heroImage?:    string | null;   // optional override for hero bg
  heroSubtitle?: string;
}

/* ══════════════════════════════════════════════════════════════════════
   HELPERS
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
/**
 * Alternating colour pattern from Figma:
 *   Row 0 → [GREEN, DARK]
 *   Row 1 → [DARK,  GREEN]
 *   Row 2 → [GREEN, DARK]  …
 */
function cardBg(index: number): string {
  const row = Math.floor(index / 2), col = index % 2;
  return (row + col) % 2 === 0 ? GREEN : DARK;
}

/* ══════════════════════════════════════════════════════════════════════
   STYLES  (blg- prefix, all card values × 0.65 vs original Figma)
   Original → × 0.65
   card h    577  → 375      photo h    306  → 199
   br card   14   → 9        br photo   4    → 3
   gap       24   → 16       margin     10   → 6
   title     36px → 23px     excerpt    24px → 16px
   meta font 18px → 12px     avatar     40px → 26px
══════════════════════════════════════════════════════════════════════ */
const STYLES = `
.blg * { box-sizing:border-box; margin:0; padding:0; }
.blg a  { text-decoration:none; }
.blg img { display:block; }

@keyframes blg-fadein {
  from { opacity:0; transform:translate3d(0,22px,0); }
  to   { opacity:1; transform:translate3d(0,0,0); }
}
@keyframes blg-pulse {
  0%,100% { opacity:0.55; transform:scale(1);    }
  50%     { opacity:1;    transform:scale(1.25); }
}

/* ── scroll reveal ── */
.blg-rv {
  opacity:0; transform:translateY(26px);
  transition:opacity 0.65s cubic-bezier(.22,.68,0,1.2),
             transform 0.65s cubic-bezier(.22,.68,0,1.2);
  will-change:opacity,transform;
}
.blg-rv.blg-in { opacity:1; transform:translateY(0); }
.blg-rv.blg-d1 { transition-delay:0.10s; }
.blg-rv.blg-d2 { transition-delay:0.20s; }
.blg-rv.blg-d3 { transition-delay:0.30s; }
.blg-rv.blg-d4 { transition-delay:0.40s; }

/* ── card lift on hover ── */
.blg-card {
  transition:transform 0.32s cubic-bezier(.22,.68,0,1.2),
             box-shadow 0.32s ease;
  will-change:transform,box-shadow;
}
.blg-card:hover {
  transform:translateY(-6px);
  box-shadow:0 20px 48px rgba(0,0,0,0.22);
}

/* ── image gentle zoom on hover ── */
.blg-img-zoom {
  transition:transform 0.55s cubic-bezier(.22,.68,0,1.2);
  will-change:transform;
}
.blg-card:hover .blg-img-zoom { transform:scale(1.05); }

/* ── overlay slides up from bottom of photo area ──
   Figma: Rectangle 36 at height:0, expands on hover      */
.blg-overlay {
  position:absolute; bottom:0; left:0; right:0;
  height:0; overflow:hidden;
  transition:height 0.40s cubic-bezier(.22,.68,0,1.2);
  will-change:height;
  display:flex; align-items:center; justify-content:center;
}
.blg-card:hover .blg-overlay { height:100%; }

/* ── "Read Blog" button fades + scales inside overlay ── */
.blg-read-btn {
  background:#fff; border-radius:5px; padding:8px 20px;
  font-family:${FM}; font-size:13px; font-weight:600; color:#000;
  display:flex; gap:8px; align-items:center;
  opacity:0; transform:scale(0.86);
  transition:opacity 0.22s ease 0.16s, transform 0.22s ease 0.16s;
  will-change:opacity,transform;
}
.blg-card:hover .blg-read-btn { opacity:1; transform:scale(1); }

/* ── responsive ── */
@media (max-width:767px) {
  .blg-grid     { grid-template-columns:1fr !important; }
  .blg-card     { height:auto !important; }
  .blg-overlay  { display:none !important; }   /* disable overlay on touch */
}
@media (prefers-reduced-motion:reduce) {
  .blg-rv               { opacity:1 !important; transform:none !important; transition:none !important; }
  .blg-card,.blg-img-zoom { transition:none !important; }
  .blg-overlay          { display:none !important; }
}
`;

/* ══════════════════════════════════════════════════════════════════════
   HOOK
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
   WAVE DOTS  (same pattern as About / Services pages)
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
   §1  HERO  — "Recent News" + optional description
   Identical radial-gradient pattern to About / Services / Blog Detail
══════════════════════════════════════════════════════════════════════ */
function HeroSection({ heroImage, subtitle }: { heroImage?: string | null; subtitle?: string }) {
  return (
    <section style={{
      position:'relative', width:'100%',
      minHeight:'clamp(360px,53.1vw,765px)',
      display:'flex', alignItems:'flex-end', overflow:'hidden',
    }}>
      {/* BG */}
      <div style={{ position:'absolute', inset:0, zIndex:0 }}>
        {heroImage
          ? <Image src={heroImage} alt="Recent News" fill sizes="100vw" priority style={{ objectFit:'cover' }} />
          : <div style={{ position:'absolute', inset:0, background:'#111' }} />
        }
        <div style={{
          position:'absolute', inset:0,
          background:'radial-gradient(56.72% 50% at 50% 50%, rgba(0,0,0,0) 0%, #000 100%)',
        }} />
      </div>

      {/* Content */}
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
   BLOG CARD  ×0.65 scale
   ┌─ Photo 199px ─────────────────────────────────┐  ← hover overlay
   ├─ Title  23px Haffer Mono ─────────────────────┤
   ├─ Summary 16px / 141% / 3 lines ───────────────┤
   └─ Footer: Avatar 26px + Name | Date + Time ────┘
══════════════════════════════════════════════════════════════════════ */
function BlogCard({ blog, index }: { blog: BlogPost; index: number }) {
  const bg        = cardBg(index);
  const isGreen   = bg === GREEN;
  const img       = resolveImg(blog.image);
  const avatarImg = resolveImg(blog.author?.avatar);

  /* colours per card theme */
  const titleC    = isGreen ? '#000'                    : '#fff';
  const excerptC  = isGreen ? DARK                      : 'rgba(255,255,255,0.6)';
  const authorC   = isGreen ? '#000'                    : '#fff';
  const emailC    = isGreen ? 'rgba(0,0,0,0.55)'        : 'rgba(255,255,255,0.6)';
  const dateC     = isGreen ? '#fff'                    : 'rgba(255,255,255,0.6)';
  const timeC     = isGreen ? '#000'                    : '#fff';
  /* overlay colour inverts the card bg, as per Figma */
  const overlayBg = isGreen ? 'rgba(37,37,37,0.82)'    : 'rgba(150,202,69,0.82)';

  return (
    <Link href={`/blog/${blog.slug}`} style={{ display:'block', textDecoration:'none' }}>
      <div
        className="blg-card"
        style={{
          background:bg, borderRadius:9,
          height:375, overflow:'hidden',
          display:'flex', flexDirection:'column',
        }}
      >

        {/* ── Photo section + hover overlay ── */}
        <div style={{
          position:'relative',
          margin:'6px 6px 0',
          height:199, borderRadius:3, overflow:'hidden',
          flexShrink:0,
        }}>
          {/* Image (Ken Burns on hover via CSS class) */}
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

          {/* Slide-up overlay (starts at height:0, expands to 100% on card:hover via CSS) */}
          <div className="blg-overlay" style={{ background:overlayBg }}>
            <div className="blg-read-btn">
              View Details
              <svg width={15} height={15} viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M17 7H7M17 7V17"
                  stroke="#000" strokeWidth={2.2}
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* ── Text content ── */}
        <div style={{ padding:'14px 10px 10px', flex:1, display:'flex', flexDirection:'column' }}>

          {/* Title — 1 line, Haffer Mono 23px */}
          <h3 style={{
            fontFamily:FM, fontWeight:500, fontSize:23, lineHeight:'28px',
            color:titleC, marginBottom:8,
            overflow:'hidden', display:'-webkit-box',
            WebkitLineClamp:1, WebkitBoxOrient:'vertical',
          }}>
            {blog.title}
          </h3>

          {/* Summary — 3 lines, Haffer 16px / 141% */}
          <p style={{
            fontFamily:FH, fontWeight:400, fontSize:16, lineHeight:'141%',
            letterSpacing:'0.01em', textTransform:'capitalize',
            color:excerptC, flex:1,
            overflow:'hidden', display:'-webkit-box',
            WebkitLineClamp:3, WebkitBoxOrient:'vertical',
          }}>
            {blog.summary}
          </p>

          {/* Footer row — author left / date+time right */}
          <div style={{
            display:'flex', justifyContent:'space-between', alignItems:'flex-end',
            marginTop:10,
          }}>
            {/* Author (graceful: show nothing if absent) */}
            {blog.author?.name ? (
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
            ) : <div />}

            {/* Date */}
            <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0, marginLeft:8 }}>
              {blog.createdAt && (
                <span style={{ fontFamily:FM, fontSize:11, fontWeight:500, color:dateC }}>
                  {formatDate(blog.createdAt)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   §2  BLOG GRID  — fully dynamic, 2-per-row desktop, 1-per-row mobile
   Container: max-width 1360px, padding 0 40px, gap 16px (=24×0.65)
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
    <section ref={secRef} style={{ background:'#fff', padding:'52px 40px 80px' }}>
      <div style={{ maxWidth:1360, margin:'0 auto' }}>
        <div
          className="blg-grid"
          style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}
        >
          {blogs.map((blog, i) => (
            <div
              key={blog.id ?? blog.slug}
              className={`blg-rv${vis?' blg-in':''}`}
              /* stagger: col 0 = immediate, col 1 = +0.12s */
              style={{ transitionDelay:`${(i % 2) * 0.12}s` }}
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
   PAGINATION
══════════════════════════════════════════════════════════════════════ */
function PaginationControls({ pagination }: { pagination?: { page: number; pages: number } }) {
  if (!pagination || pagination.pages <= 1) return null;

  const { page, pages } = pagination;
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 40 }}>
      {page > 1 ? (
        <Link 
          href={`/blog?page=${page - 1}`}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', color: '#111', borderRadius: 5, fontSize: 13, fontWeight: 600, fontFamily: FM, border: '1px solid #eaeaea', transition: 'border-color 0.2s' }}
          className="hover:border-black"
        >
          <ArrowLeft size={16} /> Previous
        </Link>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', color: 'rgba(0,0,0,0.3)', borderRadius: 5, fontSize: 13, fontWeight: 600, fontFamily: FM, border: '1px solid rgba(0,0,0,0.05)', cursor: 'not-allowed' }}>
          <ArrowLeft size={16} /> Previous
        </div>
      )}

      {page < pages ? (
        <Link 
          href={`/blog?page=${page + 1}`}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', color: '#111', borderRadius: 5, fontSize: 13, fontWeight: 600, fontFamily: FM, border: '1px solid #eaeaea', transition: 'border-color 0.2s' }}
          className="hover:border-black"
        >
          Next <ArrowRight size={16} />
        </Link>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', color: 'rgba(0,0,0,0.3)', borderRadius: 5, fontSize: 13, fontWeight: 600, fontFamily: FM, border: '1px solid rgba(0,0,0,0.05)', cursor: 'not-allowed' }}>
          Next <ArrowRight size={16} />
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   ROOT EXPORT
══════════════════════════════════════════════════════════════════════ */
export default function BlogPage({ blogs, pagination, heroImage, heroSubtitle }: BlogPageProps) {
  /* Use first blog's image as hero bg if no explicit hero image supplied */
  const bgImg = heroImage ?? resolveImg(blogs?.[0]?.image);

  return (
    <main className="blg">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <HeroSection heroImage={bgImg} subtitle={heroSubtitle} />
      <BlogGridSection blogs={blogs} />
      <PaginationControls pagination={pagination} />
      <FAQSection />
    </main>
  );
}