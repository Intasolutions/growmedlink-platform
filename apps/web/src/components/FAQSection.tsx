'use client';

import React, { useState, useEffect, useRef } from 'react';

/* ─── Design tokens (kept local so this component is fully portable) ─── */
const FH  = "'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif";
const FS  = "'Great Day Personal Use','Brush Script MT',cursive";
const GREEN = '#96CA45';
const DARK  = '#252525';

/* ─── Scoped CSS ─────────────────────────────────────────────────────── */
const FAQ_STYLES = `
@keyframes faq-pulse {
  0%, 100% { opacity: 0.55; transform: scale(1);    }
  50%       { opacity: 1;    transform: scale(1.25); }
}
.faq-rv {
  opacity: 0;
  transform: translateY(38px);
  transition: opacity 0.72s cubic-bezier(.22,.68,0,1.2),
              transform 0.72s cubic-bezier(.22,.68,0,1.2);
}
.faq-rv.faq-in { opacity: 1; transform: translateY(0); }

.faq-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.52s cubic-bezier(.22,.68,0,1.2), padding 0.35s ease;
}
.faq-body.faq-open { max-height: 210px; }

.faq-icon {
  width: 18px; height: 18px;
  border: 1.5px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: transform 0.4s cubic-bezier(.22,.68,0,1.2),
              border-color 0.3s ease, background 0.3s ease;
}
.faq-icon.faq-open {
  transform: rotate(45deg);
  border-color: #96CA45;
  background: rgba(150,202,69,0.18);
}
@media (prefers-reduced-motion: reduce) {
  .faq-rv { opacity: 1 !important; transform: none !important; transition: none !important; }
}
`;

/* ─── Types ──────────────────────────────────────────────────────────── */
export interface FAQItem {
  q: string;
  a: string;
}

/* ─── Default FAQ data (exported — callers can spread/extend it) ─────── */
export const DEFAULT_FAQS: FAQItem[] = [
  { q: 'When does the next batch launch?',                 a: 'A new batch opens on the 1st of every month. Registration is available 30 days before the start date. Visit our Courses page for batch-specific dates and seat availability for each programme track.' },
  { q: 'How long is the NCLEX preparation programme?',    a: 'Our comprehensive NCLEX prep runs for 6 months with a flexible self-paced schedule. We also offer an intensive 3-month fast-track for candidates with a strong nursing foundation who are ready to accelerate.' },
  { q: 'Are there any prerequisites for enrolment?',      a: 'Most programmes require a recognised nursing or medical degree. A few foundational bridge courses accept final-year students. Detailed eligibility criteria are listed on each course detail page.' },
  { q: 'What certifications do I receive on completion?', a: 'You receive a GrowMedLink Certificate of Completion, co-branded with our institutional partners. Completion also makes you eligible to sit official licensing exams including NCLEX-RN, PLAB, and USMLE Steps.' },
  { q: 'Is financial assistance or EMI available?',       a: 'Yes — we offer merit-based scholarships, income-linked bursaries, and zero-cost EMI plans across 3, 6, and 12 months. Early-bird enrolees save up to 20 %. Reach our admissions team to explore what suits you best.' },
  { q: 'Are classes live or pre-recorded?',               a: 'We blend both: live faculty sessions run three times a week, and all sessions are recorded for lifetime access. You also get downloadable notes, mock tests, and 24/7 doubt resolution via our learner forum.' },
  { q: 'What is the student success rate?',               a: '89 % of GrowMedLink graduates pass their licensing exams on the first attempt — well above the global average. Our structured study plan, personalised feedback, and mentor-led case clinics make a measurable difference.' },
  { q: 'Do you provide placement support?',               a: 'Yes. Our dedicated placement cell maintains active partnerships with hospitals and staffing agencies across the USA, UK, Canada, and Australia. Most of our graduates secure placements within 90 days of passing their exam.' },
];

/* ─── Props ──────────────────────────────────────────────────────────── */
export interface FAQSectionProps {
  /** Custom FAQ list — defaults to DEFAULT_FAQS */
  faqs?: FAQItem[];
  /** Override the heading node */
  heading?: React.ReactNode;
  /** Override the sidebar annotation (newlines supported) */
  sideNote?: string;
  /** Section background colour — defaults to #252525 */
  background?: string;
}

/* ─── Scroll-reveal hook ─────────────────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('faq-in'); obs.disconnect(); } },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ─── Wave-dot decoration ────────────────────────────────────────────── */
function WaveDots({ flip = false }: { flip?: boolean }) {
  const dots = [
    { l: 0, t: 29 }, { l: 31, t: 24 }, { l: 60, t: 29 }, { l: 93, t: 20 },
    { l: 131, t: 29 }, { l: 157, t: 13 }, { l: 192, t: 29 },
    { l: 226, t: 6 }, { l: 270, t: 29 }, { l: 305, t: 0 },
  ];
  return (
    <div style={{ position: 'relative', width: 318, height: 42, flexShrink: 0, transform: flip ? 'scaleX(-1)' : 'none' }}>
      {dots.map((d, i) => (
        <div
          key={i}
          style={{
            position: 'absolute', left: d.l, top: d.t,
            width: 13, height: 13, borderRadius: '50%', background: GREEN,
            animation: `faq-pulse ${1.4 + i * 0.12}s ease-in-out ${i * 0.08}s infinite`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────── */
export default function FAQSection({
  faqs = DEFAULT_FAQS,
  heading,
  sideNote = 'We even answered\nwithout ChatGPT ;)',
  background = DARK,
}: FAQSectionProps) {
  const [open, setOpen] = useState<number | null>(null);
  const rh = useReveal();

  const headingNode = heading ?? (
    <>Got questions?<br />We&apos;ve got answers.</>
  );

  return (
    <section style={{ background, padding: '52px 0 58px', position: 'relative', overflow: 'hidden' }}>
      {/* Scoped styles injected once per mount */}
      <style dangerouslySetInnerHTML={{ __html: FAQ_STYLES }} />

      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 26px', position: 'relative' }}>

        {/* Wave dots – left */}
        <div style={{ position: 'absolute', left: 26, top: 48, pointerEvents: 'none' }}>
          <WaveDots flip />
        </div>

        {/* Heading */}
        <div ref={rh} className="faq-rv" style={{ textAlign: 'center', marginBottom: 36 }}>
          <h2 style={{
            fontFamily: FH, fontWeight: 400, letterSpacing: '-0.03em',
            fontSize: 'clamp(23px,3.6vw,52px)', color: '#fff',
            lineHeight: '1.19', maxWidth: 455, margin: '0 auto',
          }}>
            {headingNode}
          </h2>
        </div>

        {/* Side annotation */}
        <div style={{ position: 'absolute', right: 26, top: 0, width: 180 }}>
          <span style={{ fontFamily: FS, fontSize: 18, color: GREEN, lineHeight: '22px', display: 'block', whiteSpace: 'pre-line' }}>
            {sideNote}
          </span>
          <svg width={53} height={53} viewBox="0 0 82 82" fill="none" style={{ marginTop: 8, transform: 'rotate(-87.56deg)' }}>
            <path d="M10 10 C28 28 44 48 58 64 C65 72 70 76 78 78" stroke={GREEN} strokeWidth={2} fill="none" strokeLinecap="round" />
            <path d="M62 78 L78 78 L78 62" stroke={GREEN} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Accordion list */}
        <div style={{ maxWidth: 694, margin: '0 auto' }}>
          {faqs.map((f, i) => (
            <div
              key={i}
              style={{
                borderTop: '1px solid #3E3E3E',
                borderBottom: i === faqs.length - 1 ? '1px solid #3E3E3E' : 'none',
                marginTop: -1,
              }}
            >
              <button
                style={{
                  width: '100%', minHeight: 62, display: 'flex',
                  alignItems: 'center', justifyContent: 'space-between',
                  padding: '0 28px', background: 'none', border: 'none',
                  cursor: 'pointer', textAlign: 'left', gap: 16,
                }}
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span style={{ fontFamily: FH, fontSize: 'clamp(10px,1.2vw,15px)', fontWeight: 400, letterSpacing: '-0.03em', color: '#fff', flex: 1 }}>
                  {f.q}
                </span>
                <div className={`faq-icon${open === i ? ' faq-open' : ''}`} aria-hidden="true">
                  <svg width={9} height={9} viewBox="0 0 14 14">
                    <line x1={7} y1={2} x2={7} y2={12} stroke="#fff" strokeWidth={1.8} strokeLinecap="round" />
                    <line x1={2} y1={7} x2={12} y2={7} stroke="#fff" strokeWidth={1.8} strokeLinecap="round" />
                  </svg>
                </div>
              </button>

              <div className={`faq-body${open === i ? ' faq-open' : ''}`} role="region">
                <p style={{ fontFamily: FH, fontSize: 11, color: 'rgba(255,255,255,0.72)', lineHeight: '170%', padding: '0 28px 18px', paddingRight: 52 }}>
                  {f.a}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
