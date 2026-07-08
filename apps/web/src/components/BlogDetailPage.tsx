'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link  from 'next/link';
import FAQSection from '@/components/FAQSection';
import { TiptapRenderer } from '@/components/TiptapRenderer';
import WhatsAppButton from '@/components/WhatsAppButton';

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
  subHeading?:      string;
  summary?:         string;
  content?:         any;
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
.bld img { display:block; max-width:100%; }

/* ── keyframes ── */
@keyframes bld-fadein {
  from { opacity:0; transform:translate3d(0,22px,0); }
  to   { opacity:1; transform:translate3d(0,0,0);  }
}
@keyframes bld-img-scale {
  from { transform:scale(1.06); }
  to   { transform:scale(1);    }
}
@keyframes bld-copy-pop {
  0%   { transform:scale(1); }
  35%  { transform:scale(0.88); }
  70%  { transform:scale(1.12); }
  100% { transform:scale(1); }
}
@keyframes bld-tick-in {
  from { stroke-dashoffset:24; opacity:0; }
  to   { stroke-dashoffset:0;  opacity:1; }
}
@keyframes bld-shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
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

/* ── tag pills ── */
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

/* ── article prose ── */
.bld-prose {
  font-family:${FH};
  font-size:clamp(16px,1.5vw,18px);
  line-height:1.82;
  color:#000;
  word-break:break-word;
}
.bld-prose h1,.bld-prose h2,.bld-prose h3,.bld-prose h4 {
  font-family:${FM}; letter-spacing:-0.025em; color:${DARK}; margin:2.2em 0 0.75em;
  line-height:1.2;
}
.bld-prose h1 { font-size:clamp(24px,3.4vw,40px); }
.bld-prose h2 { font-size:clamp(20px,2.8vw,32px); color:${GREEN}; }

.bld-prose h3 { font-size:clamp(17px,2.2vw,26px); }
.bld-prose h4 { font-size:clamp(15px,1.8vw,22px); }
.bld-prose p  { margin:0 0 1.4em; }
.bld-prose img { width:100%; border-radius:12px; margin:2em 0; }
.bld-prose a { color:${GREEN}; text-decoration:underline; text-underline-offset:3px; }
.bld-prose a:hover { opacity:0.78; }
.bld-prose strong { color:${DARK}; font-weight:700; }
.bld-prose em { font-style:italic; color:#444; }
.bld-prose blockquote {
  border-left:4px solid ${GREEN}; padding:1em 1.4em;
  margin:2em 0; color:#555; font-style:italic;
  background:rgba(150,202,69,0.06); border-radius:0 10px 10px 0;
}
.bld-conclusion-box {
  background:linear-gradient(135deg,rgba(150,202,69,0.08) 0%,rgba(150,202,69,0.03) 100%);
  border:1px solid rgba(150,202,69,0.2);
  border-radius:14px; padding:clamp(20px,3vw,32px); margin:3em 0;
}
.bld-conclusion-box h2,.bld-conclusion-box h3 { margin-top:0 !important; color:${DARK} !important; }
.bld-prose ul,.bld-prose ol { padding-left:1.6em; margin:1.25em 0; }
.bld-prose li { margin-bottom:0.6em; }
.bld-prose li::marker { color:${GREEN}; }
.bld-prose pre {
  background:#f4f4f4; border-radius:10px; padding:1.25em;
  overflow:auto; margin:2em 0; font-size:0.88em;
}
.bld-prose code {
  background:rgba(150,202,69,0.12); color:#2a5a00;
  padding:0.18em 0.44em; border-radius:4px; font-size:0.88em;
}
.bld-prose hr   { border:none; border-top:1px solid #eaeaea; margin:2.5em 0; }
.bld-prose table { width:100%; border-collapse:collapse; margin:2em 0; overflow-x:auto; display:block; }
.bld-prose th,.bld-prose td { padding:0.75em 1em; border:1px solid #e5e5e5; text-align:left; white-space:nowrap; }
.bld-prose th { background:#f7f7f7; font-family:${FM}; font-weight:500; }
.bld-prose figure { margin:2em 0; }
.bld-prose figcaption { font-size:14px; color:#888; margin-top:0.5em; text-align:center; }

/* ── copy link button ── */
.bld-copy-btn {
  display:inline-flex; align-items:center; gap:9px;
  padding:11px 24px; border-radius:100px;
  border:none; cursor:pointer;
  font-family:${FM}; font-size:13px; font-weight:600;
  background: linear-gradient(135deg,${GREEN} 0%,#72a832 100%);
  color:#000;
  box-shadow:0 4px 18px rgba(150,202,69,0.35);
  transition:box-shadow 0.25s ease, transform 0.25s ease;
  position:relative; overflow:hidden;
}
.bld-copy-btn::after {
  content:'';
  position:absolute; inset:0;
  background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.28) 50%,transparent 100%);
  background-size:400px 100%;
  opacity:0; transition:opacity 0.2s;
}
.bld-copy-btn:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(150,202,69,0.5); }
.bld-copy-btn:hover::after { opacity:1; animation:bld-shimmer 0.8s linear; }
.bld-copy-btn.bld-copied { animation:bld-copy-pop 0.45s cubic-bezier(.34,1.56,.64,1); }
.bld-copy-btn.bld-copied { background:linear-gradient(135deg,#5fad1b 0%,#3d8000 100%); color:#fff; }
.bld-tick { stroke-dasharray:24; stroke-dashoffset:24; }
.bld-tick-anim { animation:bld-tick-in 0.4s cubic-bezier(.22,.68,0,1.2) 0.05s forwards; }

/* ── share row ── */
.bld-share-row {
  margin-top:48px; padding-top:28px;
  border-top:1px solid #eaeaea;
  display:flex; align-items:center;
  justify-content:center;
}

/* ── responsive ── */
@media (max-width:767px) {
  .bld-hero-title   { font-size:clamp(26px,7vw,52px) !important; }
  .bld-article-wrap { padding:32px 16px 56px !important; }
  .bld-share-row    { flex-direction:column; align-items:center; }
}
@media (max-width:479px) {
  .bld-hero-summary { font-size:clamp(13px,3.5vw,16px) !important; }
  .bld-copy-btn     { width:100%; justify-content:center; }
}
@media (prefers-reduced-motion:reduce) {
  .bld-rv  { opacity:1 !important; transform:none !important; transition:none !important; }
  .bld-copy-btn { animation:none !important; }
}
`;

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

          {/* Title */}
          <h1 className="bld-hero-title" style={{
            fontFamily:FH, fontWeight:500, color:'#fff', textAlign:'center',
            fontSize:'clamp(32px,5.8vw,84px)', lineHeight:'1.15',
            letterSpacing:'-0.03em',
            marginBottom:'clamp(12px,2vw,22px)',
            animation:'bld-fadein 0.9s cubic-bezier(.22,.68,0,1.2) 0.2s both',
          }}>
            {blog.title}
          </h1>

          {/* Summary */}
          {blog.summary && (
            <p className="bld-hero-summary" style={{
              fontFamily:FH, fontSize:'clamp(14px,1.5vw,18px)', color:'rgba(255,255,255,0.86)', textAlign:'center',
              lineHeight:'1.65', maxWidth:720, margin:'0 auto', marginBottom:24,
              animation:'bld-fadein 0.9s ease 0.35s both',
            }}>
              {blog.summary}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   COPY LINK BUTTON
══════════════════════════════════════════════════════════════════════ */
function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="bld-share-row">
      <button
        onClick={handleCopy}
        className={`bld-copy-btn ${copied ? 'bld-copied' : ''}`}
      >
        {copied ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <polyline
                className="bld-tick bld-tick-anim"
                points="4 12 9 17 20 6"
                stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
            Copy Link
          </>
        )}
      </button>
    </div>
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
            {blog.subHeading && (
              <h2 className="bld-subheading" style={{ fontFamily: FM, color: GREEN, marginTop: 0, marginBottom: '1.25em', fontSize: 'clamp(22px, 2.8vw, 32px)', lineHeight: '1.3' }}>
                {blog.subHeading}
              </h2>
            )}
            {blog.content
              ? <TiptapRenderer content={blog.content} />
              : blog.summary && <p>{blog.summary}</p>
            }
          </div>

          {/* Share Footer — copy link only */}
          <CopyLinkButton />
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
      <WhatsAppButton pageType="blog_detail" itemName={blog.title} />
    </main>
  );
}
