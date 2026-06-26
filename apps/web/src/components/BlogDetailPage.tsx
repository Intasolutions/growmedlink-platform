'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link  from 'next/link';
import FAQSection from '@/components/FAQSection';
// Adjust this import path to match your project structure:
import TiptapRenderer from '@/components/TiptapRenderer';

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
export interface BlogDetail {
  title:            string;
  summary?:         string;
  content?:         string;
  image?:           string | { url: string; secureUrl?: string } | null;
  slug:             string;
  createdAt?:       string;
  readingTime?:     string;
  tags?:            string[];
  metaTitle?:       string;
  metaDescription?: string;
  ogImage?:         string | { url: string; secureUrl?: string } | null;
  author?:          BlogAuthor | null;
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

/* ══════════════════════════════════════════════════════════════════════
   STYLES  (bld- prefix)
══════════════════════════════════════════════════════════════════════ */
const STYLES = `
.bld * { box-sizing:border-box; margin:0; padding:0; }
.bld a  { text-decoration:none; }
.bld img { display:block; }

/* ── keyframes ── */
@keyframes bld-fadein {
  from { opacity:0; transform:translate3d(0,22px,0); }
  to   { opacity:1; transform:translate3d(0,0,0);  }
}
@keyframes bld-img-scale {
  from { transform:scale(1.06); }
  to   { transform:scale(1);    }
}

/* ── scroll reveal ── */
.bld-rv {
  opacity:0; transform:translateY(26px);
  transition:opacity 0.65s cubic-bezier(.22,.68,0,1.2),
             transform 0.65s cubic-bezier(.22,.68,0,1.2);
  will-change:opacity,transform;
}
.bld-rv.bld-in { opacity:1; transform:translateY(0); }
.bld-rv.bld-d1 { transition-delay:0.14s; }
.bld-rv.bld-d2 { transition-delay:0.28s; }

/* ── tag pills (hero + article footer) ── */
.bld-tag {
  display:inline-flex; align-items:center;
  padding:4px 13px; border-radius:100px;
  background:rgba(150,202,69,0.14);
  border:1px solid rgba(150,202,69,0.28);
  font-family:${FM}; font-size:12px; font-weight:500; color:${GREEN};
  transition:background 0.22s ease, transform 0.22s cubic-bezier(.34,1.56,.64,1);
  cursor:default;
}
.bld-tag:hover { background:rgba(150,202,69,0.26); transform:scale(1.06); }

/* ── back link ── */
.bld-back {
  display:inline-flex; align-items:center; gap:8px;
  font-family:${FM}; font-size:13px; font-weight:500; color:${DARK};
  transition:transform 0.22s ease, color 0.2s ease;
}
.bld-back:hover { transform:translateX(-4px); color:${GREEN}; }

/* ── article prose  ──────────────────────────────────────────────────
   Wraps whatever TiptapRenderer outputs with readable typography.    */
.bld-prose {
  font-family:${FH}; font-size:18px; line-height:1.78; color:#222;
}
.bld-prose h1,.bld-prose h2,.bld-prose h3,.bld-prose h4 {
  font-family:${FM}; letter-spacing:-0.025em; color:${DARK}; margin:2.2em 0 0.75em;
}
.bld-prose h1 { font-size:clamp(26px,3.4vw,40px); }
.bld-prose h2 { font-size:clamp(22px,2.8vw,32px); }
.bld-prose h3 { font-size:clamp(18px,2.2vw,26px); }
.bld-prose h4 { font-size:clamp(16px,1.8vw,22px); }
.bld-prose p  { margin:0 0 1.35em; }
.bld-prose img { width:100%; border-radius:12px; margin:2em 0; }
.bld-prose a { color:${GREEN}; text-decoration:underline; text-underline-offset:3px; }
.bld-prose a:hover { opacity:0.78; }
.bld-prose blockquote {
  border-left:3px solid ${GREEN}; padding-left:1.4em;
  margin:2em 0; color:#555; font-style:italic;
}
.bld-prose ul,.bld-prose ol { padding-left:1.7em; margin:1.25em 0; }
.bld-prose li { margin-bottom:0.55em; }
.bld-prose pre {
  background:#f4f4f4; border-radius:10px; padding:1.25em;
  overflow:auto; margin:2em 0; font-size:0.88em;
}
.bld-prose code {
  background:#f0f0f0; padding:0.18em 0.44em;
  border-radius:4px; font-size:0.88em;
}
.bld-prose hr   { border:none; border-top:1px solid #eaeaea; margin:2.5em 0; }
.bld-prose strong { color:${DARK}; }
.bld-prose em { font-style:italic; }
.bld-prose table { width:100%; border-collapse:collapse; margin:2em 0; }
.bld-prose th,.bld-prose td {
  padding:0.75em 1em; border:1px solid #e5e5e5; text-align:left;
}
.bld-prose th { background:#f7f7f7; font-family:${FM}; font-weight:500; }
.bld-prose figure { margin:2em 0; }
.bld-prose figcaption { font-size:14px; color:#888; margin-top:0.5em; text-align:center; }

/* ── responsive ── */
@media (max-width:767px) {
  .bld-hero-title   { font-size:clamp(28px,7vw,52px) !important; }
  .bld-article-wrap { padding:40px 20px 60px !important; }
  .bld-prose        { font-size:16px !important; }
}
@media (prefers-reduced-motion:reduce) {
  .bld-rv  { opacity:1 !important; transform:none !important; transition:none !important; }
  .bld-tag { transition:none !important; }
}
\`;

/* ══════════════════════════════════════════════════════════════════════
   HOOK
══════════════════════════════════════════════════════════════════════ */
function useReveal(threshold = 0.06) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('bld-in'); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

/* ══════════════════════════════════════════════════════════════════════
   §1  HERO
   Blog image → radial vignette + bottom linear gradient for readability.
   Animates in: tags → title → summary → meta row.
══════════════════════════════════════════════════════════════════════ */
function HeroSection({ blog }: { blog: BlogDetail }) {
  const img       = resolveImg(blog.image);
  const avatarImg = resolveImg(blog.author?.avatar);

  return (
    <section style={{
      position:'relative', width:'100%',
      minHeight:'clamp(420px,52vw,680px)',
      display:'flex', alignItems:'flex-end',
      overflow:'hidden',
    }}>
      {/* ── Background ── */}
      <div style={{ position:'absolute', inset:0, zIndex:0 }}>
        {img
          ? <Image src={img} alt={blog.title} fill sizes="100vw" priority
              style={{ objectFit:'cover', animation:'bld-img-scale 1.4s cubic-bezier(.22,.68,0,1.05) both' }} />
          : <div style={{ position:'absolute', inset:0, background:'#111' }} />
        }
        {/* Radial vignette — exact Figma gradient */}
        <div style={{
          position:'absolute', inset:0,
          background:'radial-gradient(56.72% 50% at 50% 50%, rgba(0,0,0,0) 0%, #000 100%)',
        }} />
        {/* Bottom linear fade for text legibility */}
        <div style={{
          position:'absolute', bottom:0, left:0, right:0, height:'68%',
          background:'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0) 100%)',
        }} />
      </div>

      {/* ── Content ── */}
      <div style={{
        position:'relative', zIndex:2, width:'100%',
        padding:'0 clamp(24px,5vw,80px) clamp(40px,6vw,72px)',
      }}>
        <div style={{ maxWidth:920, margin:'0 auto' }}>

          {/* Tags */}
          {!!blog.tags?.length && (
            <div style={{
              display:'flex', flexWrap:'wrap', gap:8, marginBottom:18,
              animation:'bld-fadein 0.8s ease 0.08s both',
            }}>
              {blog.tags.map((tag, i) => (
                <span key={i} className="bld-tag">{tag}</span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="bld-hero-title" style={{
            fontFamily:FH, fontWeight:500, color:'#fff',
            fontSize:'clamp(32px,5.8vw,84px)', lineHeight:'1.15',
            letterSpacing:'-0.03em',
            marginBottom:'clamp(12px,2vw,22px)',
            animation:'bld-fadein 0.9s cubic-bezier(.22,.68,0,1.2) 0.2s both',
          }}>
            {blog.title}
          </h1>

          {/* Summary */}
          {blog.summary && (
            <p style={{
              fontFamily:FH, fontSize:18, color:'rgba(255,255,255,0.86)',
              lineHeight:'1.65', maxWidth:720, marginBottom:24,
              animation:'bld-fadein 0.9s ease 0.35s both',
            }}>
              {blog.summary}
            </p>
          )}

          {/* Meta row: author · date · reading time */}
          <div style={{
            display:'flex', alignItems:'center', flexWrap:'wrap', gap:14,
            animation:'bld-fadein 0.9s ease 0.5s both',
          }}>
            {/* Author (graceful: show nothing if absent) */}
            {blog.author?.name && (
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{
                  width:36, height:36, borderRadius:'50%', flexShrink:0,
                  overflow:'hidden', border:'2px solid rgba(255,255,255,0.45)',
                  background:'rgba(255,255,255,0.18)',
                }}>
                  {avatarImg && (
                    <Image src={avatarImg} alt={blog.author.name ?? ''}
                      width={36} height={36} style={{ objectFit:'cover' }} />
                  )}
                </div>
                <div>
                  <p style={{ fontFamily:FH, fontSize:13, fontWeight:600, color:'#fff', lineHeight:'17px' }}>
                    {blog.author.name}
                  </p>
                  {blog.author.email && (
                    <p style={{ fontFamily:FH, fontSize:11, color:'rgba(255,255,255,0.6)', lineHeight:'14px' }}>
                      {blog.author.email}
                    </p>
                  )}
                </div>
              </div>
            )}

            {blog.author?.name && <span style={{ color:'rgba(255,255,255,0.28)', fontSize:18 }}>·</span>}

            {blog.createdAt && (
              <span style={{ fontFamily:FM, fontSize:13, fontWeight:500, color:'rgba(255,255,255,0.76)' }}>
                {formatDate(blog.createdAt)}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   §2  ARTICLE CONTENT
   White section wrapping TiptapRenderer with prose typography.
   Scroll-reveal on the content block.
══════════════════════════════════════════════════════════════════════ */
function ArticleContent({ blog }: { blog: BlogDetail }) {
  const backRef    = useReveal(0.04);
  const contentRef = useReveal(0.03);

  return (
    <section style={{ background:'#fff' }}>
      <div
        className="bld-article-wrap"
        style={{ maxWidth:900, margin:'0 auto', padding:'60px 40px 80px' }}
      >
        {/* Back button */}
        <div ref={backRef} className="bld-rv" style={{ marginBottom:40 }}>
          <Link href="/blog" className="bld-back">
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5"
                stroke="currentColor" strokeWidth={2}
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Blog
          </Link>
        </div>

        {/* TiptapRenderer — do not modify the renderer itself */}
        <div ref={contentRef} className="bld-rv bld-d1">
          <div className="bld-prose">
            {blog.content
              ? <TiptapRenderer content={blog.content} />
              : blog.summary && <p>{blog.summary}</p>
            }
          </div>

          {/* Tags repeated at article footer */}
          {!!blog.tags?.length && (
            <div style={{
              marginTop:52, paddingTop:28,
              borderTop:'1px solid #eaeaea',
              display:'flex', flexWrap:'wrap', gap:8, alignItems:'center',
            }}>
              <span style={{
                fontFamily:FM, fontSize:12, color:'#aaa', marginRight:6, flexShrink:0,
              }}>
                Tags:
              </span>
              {blog.tags.map((tag, i) => (
                <span key={i} className="bld-tag">{tag}</span>
              ))}
            </div>
          )}

          {/* Navigation footer */}
          <div style={{ marginTop:56, paddingTop:28, borderTop:'1px solid #eaeaea' }}>
            <Link href="/blog" className="bld-back"
              style={{ display:'inline-flex', alignItems:'center', gap:8,
                fontFamily:FM, fontSize:13, fontWeight:500, color:DARK }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M5 12L12 19M5 12L12 5"
                  stroke="currentColor" strokeWidth={2}
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              All Articles
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   ROOT EXPORT
══════════════════════════════════════════════════════════════════════ */
export default function BlogDetailPage({ blog }: { blog: BlogDetail }) {
  return (
    <main className="bld">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <HeroSection  blog={blog} />
      <ArticleContent blog={blog} />
      <FAQSection />
    </main>
  );
}
