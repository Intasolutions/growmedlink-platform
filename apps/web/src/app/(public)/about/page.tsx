'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const FH = "'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif";
const FM = "'Haffer XH Mono-TRIAL','Courier New',monospace";
const FP = "'Power Grotesk','Helvetica Neue',Arial,sans-serif";
const FS = "'Great Day Personal Use','Brush Script MT',cursive";
const GREEN = '#96CA45';
const DARK  = '#252525';
const BLUE  = '#155BA9';
const RED   = '#AF1515';

const TEAM = [
  { name:'Dr. Sarah Mitchell',  role:'Chief Medical Officer',    initials:'SM', grad:['#155BA9','#0a3d7a'], bio:'A distinguished physician with over 18 years of clinical and academic experience across the UK and India. Dr. Mitchell shapes our medical curriculum and ensures every program meets the highest international standards.' },
  { name:'Dr. Arjun Patel',     role:'Academic Director',        initials:'AP', grad:['#96CA45','#4a7a10'], bio:'With dual specialisations in medical education and health policy, Dr. Patel leads the design of our flagship NCLEX and PLAB preparation tracks, maintaining a 91 % first-attempt pass rate among our graduates.' },
  { name:'Ms. Priya Nair',      role:'Head of Student Affairs',  initials:'PN', grad:['#6938EF','#3d1d9e'], bio:'Priya brings a decade of student mentorship experience from top nursing colleges. She oversees every touchpoint of the learner journey — from onboarding to post-placement support.' },
  { name:'Mr. James Wilson',    role:'Chief Technology Officer', initials:'JW', grad:['#F79009','#a55c00'], bio:'A serial edtech entrepreneur, James architected our adaptive learning platform that personalises study plans in real-time, reducing average preparation time by 30 %.' },
  { name:'Dr. Meera Krishnan',  role:'Clinical Training Lead',   initials:'MK', grad:['#0BA5EC','#0669a0'], bio:'Dr. Krishnan brings 12 years of ICU and surgical experience to our simulation labs, delivering the case-based learning sessions that consistently receive top learner feedback.' },
  { name:'Ms. Ananya Roy',      role:'International Relations',  initials:'AR', grad:['#EE46BC','#8a1460'], bio:'Ananya manages our global partnerships with hospitals and licensing bodies across 14 countries, ensuring our graduates have clear pathways to work in the USA, UK, Canada, and Australia.' },
];

const CERTS = [
  { name:'NMC India',      abbr:'NMC',   color:'#1570EF', desc:'National Medical Commission Approved' },
  { name:'WHO Partner',    abbr:'WHO',   color:'#039855', desc:'World Health Organisation Recognised' },
  { name:'NCLEX Prep',     abbr:'NP',    color:'#F79009', desc:'Official NCLEX Preparation Centre' },
  { name:'USMLE Partner',  abbr:'USM',   color:'#9E77ED', desc:'USMLE Step 1 & 2 CK Programme' },
  { name:'NHS Affiliated', abbr:'NHS',   color:'#0BA5EC', desc:'National Health Service UK Affiliate' },
  { name:'PLAB Academy',   abbr:'PLAB',  color:'#6938EF', desc:'Professional & Linguistic Assessments' },
  { name:'AHPRA Listed',   abbr:'AHR',   color:'#EE46BC', desc:'Australian Health Practitioner Agency' },
  { name:'AIIMS Tie-up',   abbr:'AIIMS', color:'#F04438', desc:'AIIMS Delhi Research Partnership' },
];

const FAQS = [
  { q:'When does the next batch launch?',                 a:'A new batch opens on the 1st of every month. Registration is available 30 days before the start date. Visit our Courses page for batch-specific dates and seat availability for each programme track.' },
  { q:'How long is the NCLEX preparation programme?',    a:'Our comprehensive NCLEX prep runs for 6 months with a flexible self-paced schedule. We also offer an intensive 3-month fast-track for candidates with a strong nursing foundation who are ready to accelerate.' },
  { q:'Are there any prerequisites for enrolment?',      a:'Most programmes require a recognised nursing or medical degree. A few foundational bridge courses accept final-year students. Detailed eligibility criteria are listed on each course detail page.' },
  { q:'What certifications do I receive on completion?', a:'You receive a GrowMedLink Certificate of Completion, co-branded with our institutional partners. Completion also makes you eligible to sit official licensing exams including NCLEX-RN, PLAB, and USMLE Steps.' },
  { q:'Is financial assistance or EMI available?',       a:'Yes — we offer merit-based scholarships, income-linked bursaries, and zero-cost EMI plans across 3, 6, and 12 months. Early-bird enrolees save up to 20 %. Reach our admissions team to explore what suits you best.' },
  { q:'Are classes live or pre-recorded?',               a:'We blend both: live faculty sessions run three times a week, and all sessions are recorded for lifetime access. You also get downloadable notes, mock tests, and 24/7 doubt resolution via our learner forum.' },
  { q:'What is the student success rate?',               a:'89 % of GrowMedLink graduates pass their licensing exams on the first attempt — well above the global average. Our structured study plan, personalised feedback, and mentor-led case clinics make a measurable difference.' },
  { q:'Do you provide placement support?',               a:'Yes. Our dedicated placement cell maintains active partnerships with hospitals and staffing agencies across the USA, UK, Canada, and Australia. Most of our graduates secure placements within 90 days of passing their exam.' },
];

const QUICK_LINKS = ['Home', 'About', 'Products', 'Blog', 'Enroll', 'Talk to An Expert'];
const OTHER_LINKS = ['GrowMedLink', 'Privacy Policy', 'Contact Us'];

const ARCH_ITEMS = [
  { src:'/about/1.jpg',  border:GREEN },
  { src:'/about/2.jpg',  border:DARK  },
  { src:'/about/3.jpg',  border:GREEN },
  { src:'/about/4.jpg',  border:DARK  },
  { src:'/about/5.jpg',  border:GREEN },
  { src:'/about/6.jpg',  border:DARK  },
  { src:'/about/7.jpg',  border:GREEN },
  { src:'/about/8.jpg',  border:DARK  },
  { src:'/about/9.jpg',  border:GREEN },
  { src:'/about/10.jpg', border:DARK  },
  { src:'/about/11.jpg', border:GREEN },
  { src:'/about/12.jpg', border:DARK  },
  { src:'/about/13.jpg', border:GREEN },
  { src:'/about/14.jpg', border:DARK  },
];
const ARCH_COLORS = ['#1a3a1a','#2c1b0e','#0e1f2c','#2a1a0e','#1a2c1a','#0e2c2a','#2c1a2a','#1a1a2c','#2a2c1a','#2c0e1a','#0e2a2c','#2a0e2c','#1a2c2a'];

const CORE_VALUES = [
  { title:'Patient First',   desc:'Every course, resource and programme we build starts from a single question: how does this better equip our graduates to care for patients? Excellence in medicine is meaningless without compassion at its core.', bg:'linear-gradient(180deg,#155BA9 0%,#04356B 100%)', wide:true  },
  { title:'Rigorous\nStandards',    desc:'', bg:'linear-gradient(180deg,#96CA45 0%,#477106 100%)', wide:false },
  { title:'Global\nMindset',        desc:'', bg:'linear-gradient(180deg,#252525 0%,#000 100%)',     wide:false },
];


const STYLES = `
.abt * { box-sizing: border-box; margin: 0; padding: 0; }
.abt a  { text-decoration: none; }
.abt img { display: block; }

/* ── hero reveal, arrow float, and pulsing dots keyframes ── */
@keyframes abt-hero-reveal {
  from { opacity: 0; transform: translate3d(0, 16px, 0); }
  to   { opacity: 1; transform: translate3d(0, 0px, 0);    }
}
@keyframes abt-arrow-float {
  0%, 100% { transform: translate3d(0, 0px, 0);  }
  50%      { transform: translate3d(0, -6px, 0); }
}
@keyframes abt-pulse {
  0%, 100% { opacity: 0.55; transform: scale(1);    }
  50%      { opacity: 1;    transform: scale(1.25); }
}

@keyframes abt-sunburst-spin {
  0%   { transform: translate3d(-50%,-50%,0) rotate(0deg);   }
  100% { transform: translate3d(-50%,-50%,0) rotate(360deg); }
}
@keyframes abt-marquee {
  0%   { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-50%, 0, 0); }
}

/* ── generic scroll reveal ── */
.abt-rv {
  opacity: 0;
  transform: translateY(38px);
  transition: opacity 0.72s cubic-bezier(.22,.68,0,1.2),
              transform 0.72s cubic-bezier(.22,.68,0,1.2);
}
.abt-rv.abt-in { opacity: 1; transform: translateY(0); }
.abt-rv.abt-d1 { transition-delay: 0.12s; }
.abt-rv.abt-d2 { transition-delay: 0.24s; }
.abt-rv.abt-d3 { transition-delay: 0.36s; }

/* ── hero decoration pulse (Ken-Burns on sunburst) ── */
@keyframes abt-burst {
  0%,100% { transform: translateX(-50%) scale(1) rotate(0deg); }
  50%     { transform: translateX(-50%) scale(1.07) rotate(4deg); }
}
.abt-hero-burst { animation: abt-burst 14s ease-in-out infinite; }

/* hero gradient bar */
.abt-grad-bar {
  height: 4px;
  background: linear-gradient(91deg,#155BA9 10%,#96CA45 82%);
  opacity: 0.22;
}

/* ── arch carousel ── */
.abt-arch { position:relative; height:400px; overflow:hidden; cursor:grab; user-select:none; }
.abt-arch:active { cursor:grabbing; }

/* ── mission stagger ── */
.abt-ms {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.65s ease, transform 0.65s cubic-bezier(.22,.68,0,1.2);
}
.abt-ms.abt-in { opacity: 1; transform: translateY(0); }
.abt-ms.abt-d1 { transition-delay: 0.15s; }
.abt-ms.abt-d2 { transition-delay: 0.30s; }
.abt-ms.abt-d3 { transition-delay: 0.45s; }
.abt-ms.abt-d4 { transition-delay: 0.60s; }

/* mission image wipe (reveals right-to-left) */
.abt-ms-img  { position:relative; overflow:hidden; border-radius:7px; }
.abt-ms-img::after {
  content:''; position:absolute; inset:0; z-index:5;
  background:#fff;
  transform-origin: right center;
  transform: scaleX(1);
  transition: transform 1.15s cubic-bezier(0.77,0,0.175,1) 0.05s;
  will-change: transform;
}
.abt-ms-img.abt-in::after  { transform: scaleX(0); }
.abt-ms-img-inner {
  transform: scale(1.08);
  transition: transform 1.8s cubic-bezier(.22,.68,0,1.05) 0.05s;
  will-change: transform;
}
.abt-ms-img.abt-in .abt-ms-img-inner { transform: scale(1); }

/* ══ WhySection-style BACKGROUND CARD ══════════════════════════════════ */
.abt-bg-card {
  opacity: 0;
  transform: scale(0.96);
  transition: opacity 0.8s ease, transform 0.8s cubic-bezier(.22,.68,0,1.1);
}
.abt-bg-card.abt-bg-in { opacity: 1; transform: scale(1); }

/* parallax helpers — set via JS scroll handler */
.abt-bg-par-img {
  transform: translateY(calc(var(--par,0) * -0.045px));
  transition: transform 0.08s linear;
  will-change: transform;
}
.abt-bg-par-bkt {
  transform: translateY(calc(var(--par,0) * 0.022px));
  transition: transform 0.08s linear;
  will-change: transform;
}

/* image wipe overlay (scaleX left→right, collapses to 0 from right edge) */
.abt-bg-img-wrap { position:relative; overflow:hidden; }
.abt-bg-img-wrap::after {
  content:''; position:absolute; inset:0; z-index:3;
  background:#F0F0F0;
  transform-origin: right center;
  transform: scaleX(1);
  transition: transform 1.2s cubic-bezier(0.77,0,0.175,1) 0.1s;
  will-change: transform;
}
.abt-bg-img-wrap.abt-bg-in::after { transform: scaleX(0); }

/* Ken Burns zoom-out */
.abt-bg-img-inner {
  transform: scale(1.1);
  transition: transform 1.8s cubic-bezier(.22,.68,0,1.05) 0.1s;
  will-change: transform;
  position:absolute; inset:0;
}
.abt-bg-img-wrap.abt-bg-in .abt-bg-img-inner { transform: scale(1); }

/* bracket spring entrance (from scale 0 at top-right corner) */
.abt-bkt-outer {
  position: absolute;
  transform: scale(0);
  transform-origin: top right;
  will-change: transform;
}
.abt-bkt-outer.abt-bg-in {
  transform: scale(1);
  transition: transform 0.7s cubic-bezier(0.34,1.56,0.64,1) var(--bd,0s);
}
/* float animation on inner (separate element so it does not fight transition) */
.abt-bkt-inner { animation: abt-bktfl var(--bfd,3.4s) ease-in-out infinite var(--bfdel,1.2s); }
@keyframes abt-bktfl {
  0%,100% { transform: translateY(0); }
  50%     { transform: translateY(-5px); }
}

/* heading char wave (same as why-section brand-wrap chars) */
.abt-char {
  display: inline-block;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.45s ease, transform 0.45s cubic-bezier(.22,.68,0,1.35);
  will-change: opacity, transform;
}
.abt-char.abt-in { opacity: 1; transform: translateY(0); }

/* word slide-up (same as why-word) */
.abt-word {
  display: block;
  opacity: 0;
  transform: translateY(36px);
  transition: opacity 0.65s ease 0.18s, transform 0.65s cubic-bezier(.22,.68,0,1.3) 0.18s;
  will-change: opacity, transform;
}
.abt-word.abt-in { opacity: 1; transform: translateY(0); }

/* underline draw */
.abt-uline {
  display: block; height: 2px;
  background: #96CA45; width: 0;
  transition: width 1s cubic-bezier(0.77,0,0.175,1) 0.82s;
  will-change: width;
}
.abt-uline.abt-in { width: 100%; }

/* body fade (same as why-body) */
.abt-bg-body {
  opacity: 0;
  transform: translateY(14px);
  transition: opacity 0.7s ease 0.74s, transform 0.7s cubic-bezier(.22,.68,0,1.1) 0.74s;
  will-change: opacity, transform;
}
.abt-bg-body.abt-in { opacity: 1; transform: translateY(0); }

/* ── vertical cert marquee ── */
@keyframes abt-vmq-up { from { transform:translateY(0); }    to { transform:translateY(-50%); } }
@keyframes abt-vmq-dn { from { transform:translateY(-50%); } to { transform:translateY(0); }    }
.abt-vmq-up { animation: abt-vmq-up 24s linear infinite; }
.abt-vmq-dn { animation: abt-vmq-dn 24s linear infinite; }
.abt-vmq-up:hover,.abt-vmq-dn:hover { animation-play-state: paused; }

/* ── core value stagger ── */
.abt-cv-s {
  opacity: 0;
  transform: translateY(48px);
  transition: opacity 0.65s ease, transform 0.65s cubic-bezier(.22,.68,0,1.2);
}
.abt-cv-s.abt-in { opacity: 1; transform: translateY(0); }

/* ── team vertical scroll strip ── */
@keyframes abt-team-up { from { transform:translateY(0); } to { transform:translateY(-50%); } }
.abt-team-strip { animation: abt-team-up 32s linear infinite; }
.abt-team-strip.abt-paused { animation-play-state: paused; }

/* ── FAQ premium accordion ── */
.abt-faq-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.52s cubic-bezier(.22,.68,0,1.2), padding 0.35s ease;
}
.abt-faq-body.abt-open { max-height: 320px; }

.abt-faq-icon {
  width: 26px; height: 26px;
  border: 1.5px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: transform 0.4s cubic-bezier(.22,.68,0,1.2),
              border-color 0.3s ease, background 0.3s ease;
}
.abt-faq-icon.abt-open {
  transform: rotate(45deg);
  border-color: #96CA45;
  background: rgba(150,202,69,0.18);
}

/* card lift */
.abt-lift {
  transition: transform 0.32s cubic-bezier(.22,.68,0,1.2), box-shadow 0.32s ease;
}
.abt-lift:hover { transform: translateY(-8px); box-shadow: 0 20px 48px rgba(0,0,0,0.22); }

/* footer nav link */
.abt-fnl {
  font-family: 'Haffer XH Mono-TRIAL','Courier New',monospace;
  font-size: 20px; font-weight: 500; color: #fff;
  display: block; padding: 4px 0;
  transition: color 0.2s ease;
}
.abt-fnl:hover { color: #96CA45; }

/* pill section */
.abt-pill { border-radius: 1000px; overflow: hidden; }

/* ── responsive ── */
@media (max-width: 1199px) {
  .abt-arch { height: 340px; }
  .abt-miss-grid { flex-direction: column !important; }
  .abt-bg-grid  { flex-direction: column !important; }
  .abt-cv-row   { flex-wrap: wrap !important; }
  .abt-team-grid { flex-direction: column !important; }
  .abt-footer-grid { flex-direction: column !important; }
  .abt-footer-r  { display: none !important; }
}
@media (max-width: 1023px) {
  .abt-arch { height: 280px; }
  .abt-cv-wide  { width: 100% !important; flex: unset !important; }
  .abt-cv-narrow{ width: 100% !important; flex: unset !important; }
}
@media (max-width: 767px) {
  .abt-arch   { height: 220px; }
  .abt-h1-big { font-size: clamp(38px,8vw,80px) !important; }
  .abt-sh     { font-size: clamp(28px,6vw,52px) !important; line-height: 1.2 !important; }
  .abt-pill   { border-radius: 40px !important; }
  .abt-cert-h { font-size: clamp(28px,6vw,44px) !important; }
}
@media (max-width: 479px) {
  .abt-arch   { height: 180px; }
  .abt-h1-big { font-size: 32px !important; }
}
@media (prefers-reduced-motion: reduce) {
  .abt-rv, .abt-ms, .abt-cv-s, .abt-char, .abt-word, .abt-bg-body { opacity:1 !important; transform:none !important; transition:none !important; }
  .abt-bg-img-wrap::after, .abt-ms-img::after { transform:scaleX(0) !important; transition:none !important; }
  .abt-uline { width:100% !important; }
  .abt-bkt-outer { transform:scale(1) !important; }
  .abt-bkt-inner, .abt-hero-burst, .abt-team-strip, .abt-vmq-up, .abt-vmq-dn { animation:none !important; }
}
`;

/* ══════════════════════════════════════════════════════════════════════════
   UTILITIES
══════════════════════════════════════════════════════════════════════════ */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('abt-in'); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function WaveDots({ flip = false }: { flip?: boolean }) {
  const dots = [
    {l:0,t:29},{l:31,t:24},{l:60,t:29},{l:93,t:20},
    {l:131,t:29},{l:157,t:13},{l:192,t:29},{l:226,t:6},{l:270,t:29},{l:305,t:0},
  ];
  return (
    <div style={{ position:'relative', width:318, height:42, flexShrink:0, transform:flip?'scaleX(-1)':'none', willChange:'transform' }}>
      {dots.map((d,i) => (
        <div
          key={i}
          style={{
            position:'absolute',
            left:d.l,
            top:d.t,
            width:13,
            height:13,
            borderRadius:'50%',
            background:GREEN,
            animation:`abt-pulse ${1.4 + i * 0.12}s ease-in-out ${i * 0.08}s infinite`,
            willChange:'transform, opacity',
          }}
        />
      ))}
    </div>
  );
}

/* ⌐ bracket SVG — exactly from WhySection BracketIcon */
function BracketIcon({ size = '100%' }: { size?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path d={[
        'M 0,18.5','Q 0,0 18.5,0','L 88,0','Q 100,0 100,12',
        'L 100,81.5','Q 100,100 81.5,100','Q 63,100 63,81.5',
        'L 63,42','Q 63,37 58,37','L 18.5,37','Q 0,37 0,18.5','Z',
      ].join(' ')} fill={GREEN} />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   ARCH CAROUSEL — continuous auto-rotation + drag/swipe along circle line
══════════════════════════════════════════════════════════════════════════ */
function ArchCarousel() {
  const RADIUS = 1080;
  const CONT_H = 400;
  const CTR_DY = 950; // Manual vertical adjustment to push it downwards
  const STEP = 360 / ARCH_ITEMS.length; // Perfect distribution around the circle for seamless loop
  const CARD_W = 297;
  const CARD_H = 214;

  const angleRef = useRef(-75);
  const velRef   = useRef(0.02);
  const isDrag   = useRef(false);
  const lastX    = useRef(0);
  const rafRef   = useRef<number | undefined>(undefined);
  const pivotRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const loop = () => {
      if (!isDrag.current) {
        velRef.current = velRef.current * 0.993 + 0.02 * 0.007;
        angleRef.current += velRef.current;
      } else {
        velRef.current *= 0.96;
      }

      // Clamp angle within [0, 360] range
      angleRef.current = angleRef.current % 360;

      if (pivotRef.current) {
        pivotRef.current.style.transform = `rotate(${angleRef.current}deg)`;
      }

      ARCH_ITEMS.forEach((_, i) => {
        const card = cardRefs.current[i];
        if (card) {
          // Normalize relative angles to [-180, 180] range
          let cardAngle = (angleRef.current + i * STEP) % 360;
          if (cardAngle > 180) cardAngle -= 360;
          if (cardAngle < -180) cardAngle += 360;

          const absAngle = Math.abs(cardAngle);
          // Fade out cards when they move beyond +/- 75 degrees of the top center
          const alpha = Math.max(0, Math.min(1, (75 - absAngle) / 25));
          card.style.opacity = String(alpha);
          card.style.visibility = alpha === 0 ? 'hidden' : 'visible';
        }
      });

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const onDown = (e: React.MouseEvent | React.TouchEvent) => {
    isDrag.current = true;
    lastX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
    velRef.current = 0;
  };
  const onMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrag.current) return;
    const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
    velRef.current = (cx - lastX.current) * 0.055;
    angleRef.current += velRef.current;
    lastX.current = cx;
  };
  const onUp = () => { isDrag.current = false; };

  const centreY = CONT_H + CTR_DY;
  return (
    <div className="abt-arch"
      onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
      onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}>
      <div ref={pivotRef} style={{ position:'absolute', left:'50%', top:centreY, transformOrigin:'center center', willChange:'transform' }}>
        {ARCH_ITEMS.map((item, i) => {
          return (
            <div key={i}
              ref={el => { cardRefs.current[i] = el; }}
              style={{
                position:'absolute',
                left:0, top:0,
                width:CARD_W, height:CARD_H,
                borderWidth:'4.5px 4.5px 28px 4.5px', borderStyle:'solid', borderColor:item.border,
                borderRadius:'10.5px', overflow:'hidden',
                transform:`rotate(${i * STEP}deg) translateY(${-RADIUS}px) translate(-50%, -50%)`,
                transformOrigin:'center center',
                background:ARCH_COLORS[i%ARCH_COLORS.length],
                willChange:'transform, opacity',
                pointerEvents:'none',
                opacity: 0,
              }}>
              <Image src={item.src} alt="" fill sizes="297px" style={{ objectFit:'cover' }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.opacity='0'; }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   §1  HERO — dark #141414, arch carousel, parallax decorations
══════════════════════════════════════════════════════════════════════════ */
function HeroSection() {
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => { setHeroVisible(true); }, []);

  return (
    <section style={{ background:'#000000', position:'relative', overflow:'hidden', paddingTop:'clamp(110px, 15vh, 170px)', paddingBottom:0 }}>
      {/* Wave background image covering only the first screen height */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'100vh', zIndex:0, opacity:1.0 }}>
        <Image src="/about-bg-wave.png" alt="" fill style={{ objectFit:'cover' }} priority />
      </div>

      <div className="abt-grad-bar" style={{ position:'absolute', top:0, left:0, right:0, zIndex:5 }} />

      {/* heading + avatars */}
      <div style={{ textAlign:'center', padding:'0 24px 24px', position:'relative', zIndex:5 }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {/* Rotating sunburst lines (the halo thing) centered behind the heading */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 'clamp(320px, 80vw, 750px)',
            height: 'clamp(320px, 80vw, 750px)',
            opacity: 0.25,
            pointerEvents: 'none',
            zIndex: -1,
            animation: 'abt-sunburst-spin 80s linear infinite',
            willChange: 'transform'
          }}>
            <Image src="/sunburst-lines.png" alt="" fill style={{ objectFit: 'contain' }} priority />
          </div>
          <h1 className="abt-h1-big" style={{ fontFamily:FH, fontWeight:500, fontSize:'clamp(44px,8.5vw,123px)', letterSpacing:'-0.03em', color:'#fff', lineHeight:1.19, marginBottom:28 }}>
            About GroMedLink
          </h1>
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:18, marginBottom:32 }}>
          <Image src="/avatars-group.png" alt="Students" width={221} height={38} style={{ height:38, width:'auto' }} onError={e => { (e.currentTarget as HTMLImageElement).style.display='none'; }} />
          <span style={{ fontFamily:FP, fontSize:16, color:'#CACACA', lineHeight:'22px' }}>1600 + Trusted Students</span>
        </div>
      </div>

      {/* Arch image carousel */}
      <ArchCarousel />

      {/* body text + CTA */}
      <div style={{ maxWidth:807, margin:'0 auto', padding:'48px 24px 0', textAlign:'center', position:'relative', zIndex:5 }}>
        <p style={{ fontFamily:FH, fontSize:20, color:'#fff', lineHeight:'169%', letterSpacing:'0.01em', textTransform:'capitalize', marginBottom:40 }}>
          Lorem ipsum dolor sit amet consectetur. Purus in in fames sit ac vitae. Curabitur scelerisque nunc mauris blandit. Donec tristique placerat consectetur molestie est ornare. Suspendisse aliquet semper quam volutpat bibendum est mattis. Sed neque etiam morbi a amet lacus phasellus ipsum nec.
        </p>
        <button style={{ width:228, height:54, background:GREEN, borderRadius:6, border:'none', cursor:'pointer', fontFamily:FM, fontSize:18, fontWeight:600, color:'#000' }}>
          Become a Member
        </button>
      </div>

      {/* wave dots + script callout */}
      <div style={{ maxWidth:1440, margin:'0 auto', padding:'52px 40px 60px', display:'flex', justifyContent:'space-between', alignItems:'flex-end', position:'relative', zIndex:5 }}>
        <WaveDots flip />
        <div style={{
          position: 'relative',
          width: '300px',
          pointerEvents: 'none',
          opacity: heroVisible ? 1 : 0,
          animation: heroVisible
            ? `abt-hero-reveal 0.75s cubic-bezier(.22,.68,0,1.2) 760ms both,
               abt-arrow-float 2.6s ease-in-out 1.5s infinite`
            : 'none',
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transformStyle: 'preserve-3d',
        }}>
          {/* Static rotation wrapper for the arrow */}
          <div style={{ transform: 'rotate(-20.36deg)', transformOrigin: 'top left', display: 'inline-block', position: 'absolute', left: -96, top: -56 }}>
            <Image
              src="/curly-arrow.png"
              alt="Arrow decoration"
              width={82}
              height={77}
              style={{ width: '82px', height: 'auto', display: 'block' }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
            />
          </div>

          {/* Handwritten text */}
          <span
            style={{
              fontFamily: FS,
              fontSize: '28px',
              lineHeight: '1.3',
              color: GREEN,
              display: 'block',
              transform: 'rotate(-4deg)',
              transformOrigin: 'left top',
              whiteSpace: 'nowrap',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              paddingBottom: '8px',
            }}
          >
            Finally, your kind<br />of group chat
          </span>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   §2  MISSION / VISION — staggered reveals + image wipe
══════════════════════════════════════════════════════════════════════════ */
function MissionVision() {
  const secRef = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.08 });
    if (secRef.current) obs.observe(secRef.current);
    return () => obs.disconnect();
  }, []);
  const v = vis;

  return (
    <section style={{ background:'#fff', position:'relative', overflow:'hidden' }} ref={secRef}>
      {/* centre dividers */}
      <div style={{ position:'absolute', left:'50%', top:0, bottom:0, width:1, background:'#D9D9D9', transform:'translateX(-50%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', left:0, right:0, top:255, height:1, background:'#D9D9D9' }} />

      <div style={{ maxWidth:1440, margin:'0 auto', padding:'72px 40px 80px' }}>
        {/* MISSION ROW */}
        <div className="abt-miss-grid" style={{ display:'flex', gap:40, alignItems:'flex-start', marginBottom:60 }}>

          {/* left */}
          <div style={{ flex:1, maxWidth:560 }}>
            <h2 className={`abt-sh abt-ms${v?' abt-in':''}`} style={{ fontFamily:FH, fontWeight:400, fontSize:'clamp(40px,6vw,86px)', letterSpacing:'-0.03em', color:DARK, lineHeight:'1.19', marginBottom:36 }}>
              OUR MISSION
            </h2>
            <div className={`abt-ms abt-d1${v?' abt-in':''}`} style={{ position:'relative', width:296, height:168, marginBottom:32 }}>
              <div style={{ position:'absolute', left:0, top:0, width:168, height:168, borderRadius:'50%', overflow:'hidden', background:'#c5c5c5', zIndex:2 }}>
                <Image src="/about/1.jpg" alt="" fill style={{ objectFit:'cover' }} onError={e => { (e.currentTarget as HTMLImageElement).style.background='#aaa'; }} />
              </div>
              <div style={{ position:'absolute', left:128, top:0, width:168, height:168, borderRadius:14, overflow:'hidden', background:'#b8b8b8', zIndex:1 }}>
                <Image src="/about/2.jpg" alt="" fill style={{ objectFit:'cover' }} onError={e => { (e.currentTarget as HTMLImageElement).style.background='#999'; }} />
              </div>
            </div>
            <p className={`abt-ms abt-d2${v?' abt-in':''}`} style={{ fontFamily:FH, fontSize:20, lineHeight:'169%', letterSpacing:'0.01em', textTransform:'capitalize', color:'#000' }}>
              Purus in in fames sit ac vitae. Curabitur scelerisque nunc mauris blandit. Donec tristique placerat consectetur molestie est ornare. Suspendisse aliquet semper quam volutpat bibendum est mattis. Sed neque etiam morbi a amet lacus phasellus ipsum nec.
            </p>
          </div>

          {/* right — image wipe */}
          <div className={`abt-ms-img${v?' abt-in':''}`} style={{ width:369, height:516, flexShrink:0, marginLeft:'auto', background:'#888' }}>
            <div className="abt-ms-img-inner">
              <Image src="/about/14.jpg" alt="" fill style={{ objectFit:'cover', borderRadius:7 }} onError={e => { (e.currentTarget as HTMLImageElement).style.opacity='0'; }} />
            </div>
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:1, background:`rgba(150,202,69,0.8)`, zIndex:10 }} />
          </div>
        </div>

        {/* "See How Its Work!" callout */}
        <div style={{ position:'relative', height:72, marginBottom:56 }}>
          <svg width={82} height={77} viewBox="0 0 82 77" fill="none" style={{ position:'absolute', left:420, top:4, transform:'matrix(0.97,0.26,0.26,-0.97,0,0)' }}>
            <path d="M5 72 C20 50 40 35 55 20 C65 10 73 4 77 2" stroke={RED} strokeWidth={2} fill="none" strokeLinecap="round"/>
            <path d="M65 2 L77 2 L77 14" stroke={RED} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ position:'absolute', left:542, top:22, fontFamily:FS, fontSize:28, color:RED, lineHeight:'28px' }}>See How Its Work!</span>
        </div>

        {/* VISION */}
        <div style={{ maxWidth:560, marginBottom:80 }}>
          <h2 className={`abt-sh abt-ms abt-d3${v?' abt-in':''}`} style={{ fontFamily:FH, fontWeight:400, fontSize:'clamp(40px,6vw,86px)', letterSpacing:'-0.03em', color:DARK, lineHeight:'1.19', marginBottom:32 }}>
            OUR VISION
          </h2>
          <p className={`abt-ms abt-d4${v?' abt-in':''}`} style={{ fontFamily:FH, fontSize:20, lineHeight:'169%', letterSpacing:'0.01em', textTransform:'capitalize', color:'#000' }}>
            Purus in in fames sit ac vitae. Curabitur scelerisque nunc mauris blandit. Donec tristique placerat consectetur molestie est ornare. Suspendisse aliquet semper quam volutpat bibendum est mattis. Sed neque etiam morbi a amet lacus phasellus ipsum nec.
          </p>
        </div>

        <div style={{ display:'flex', justifyContent:'flex-end' }}><WaveDots /></div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   §3  OUR BACKGROUND — EXACT WhySection animation pattern
   ┌ card entrance: scale 0.96→1, opacity 0→1
   ├ D-shaped image: wipe overlay (scaleX 1→0) + Ken Burns zoom + parallax
   ├ bracket stack: spring from scale 0 at top-right + float + parallax
   ├ "OUR" slides up; "Background" chars wave in + underline draws
   └ body paragraphs fade up
══════════════════════════════════════════════════════════════════════════ */
const BG_BRACKETS = [
  { l:'37.6%', t:'0%',    w:'62.4%', h:'62.0%', bd:'0.45s', bfd:'3.4s', bfdel:'1.15s' },
  { l:'18.6%', t:'36.3%', w:'45.4%', h:'45.1%', bd:'0.62s', bfd:'2.9s', bfdel:'1.35s' },
  { l:'0%',    t:'63.5%', w:'36.7%', h:'36.5%', bd:'0.79s', bfd:'3.7s', bfdel:'1.55s' },
];
const BG_WORD = 'Background'.split('');

function BackgroundSection() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  /* IntersectionObserver — card entrance */
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (cardRef.current) obs.observe(cardRef.current);
    return () => obs.disconnect();
  }, []);

  /* Scroll parallax — sets --par on card element */
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const update = () => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--par', String(r.top + r.height / 2 - window.innerHeight / 2));
    };
    window.addEventListener('scroll', update, { passive:true });
    window.addEventListener('resize', update, { passive:true });
    update();
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);

  const v = vis;

  return (
    <section style={{ padding:'80px 40px', overflow:'hidden' }}>
      <div
        ref={cardRef}
        className={`abt-bg-card${v?' abt-bg-in':''}`}
        style={{ background:'#F0F0F0', borderRadius:1000, position:'relative', maxWidth:1440, margin:'0 auto', padding:'110px 60px 110px', overflow:'hidden' }}
      >
        {/* ── HEADING: "OUR" slides up, "Background" chars wave, underline draws ── */}
        <div style={{ textAlign:'center', marginBottom:64 }}>
          <span className={`abt-word${v?' abt-in':''}`} style={{ fontFamily:FH, fontWeight:400, fontSize:'clamp(36px,4.7vw,68px)', color:DARK, lineHeight:'1.2' }}>
            OUR
          </span>
          <span style={{ display:'block', fontFamily:FH, fontWeight:400, fontSize:'clamp(36px,4.7vw,68px)', color:DARK, lineHeight:'1.2' }}>
            {BG_WORD.map((ch, i) => (
              <span key={i} className={`abt-char${v?' abt-in':''}`} style={{ transitionDelay:`${0.34 + i*0.045}s` }}>{ch}</span>
            ))}
            <span className={`abt-uline${v?' abt-in':''}`} style={{ margin:'4px auto 0', maxWidth:'clamp(200px,30vw,340px)' }} />
          </span>
        </div>

        {/* ── CONTENT GRID ── */}
        <div className="abt-bg-grid" style={{ display:'flex', gap:64, alignItems:'flex-start', position:'relative' }}>

          {/* left text — 2 paragraphs */}
          <div style={{ flex:1, minWidth:0 }}>
            <p className={`abt-bg-body${v?' abt-in':''}`} style={{ fontFamily:FH, fontSize:20, lineHeight:'170%', letterSpacing:'0.01em', textTransform:'capitalize', color:'#000', marginBottom:48 }}>
              GrowMedLink was founded on the belief that geography should never limit a healthcare professional's ambition. Since 2017 we have helped more than 4 200 nurses and doctors pass international licensing exams and secure placements in top hospitals across the USA, UK, Canada, and Australia.
            </p>
            <p className={`abt-bg-body${v?' abt-in':''}`} style={{ fontFamily:FH, fontSize:20, lineHeight:'170%', letterSpacing:'0.01em', textTransform:'capitalize', color:'#000', transitionDelay:'0.15s' }}>
              Our faculty are active clinicians and internationally licensed educators who bring real-world experience into every session. We don't just teach syllabi — we teach clinical reasoning, cultural competency, and the resilience needed to thrive in a foreign healthcare system.
            </p>
          </div>

          {/* right — D-shaped image with wipe + Ken Burns + parallax */}
          <div className="abt-bg-par-img" style={{ flexShrink:0, width:'min(751px,52%)', position:'relative' }}>
            <div
              className={`abt-bg-img-wrap${v?' abt-bg-in':''}`}
              style={{ width:'100%', paddingBottom:'84%', borderRadius:'400px 0 0 400px', overflow:'hidden', position:'relative', background:'#bbb' }}
            >
              <div className="abt-bg-img-inner">
                <Image src="/about/3.jpg" alt="Our Background" fill style={{ objectFit:'cover' }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.opacity='0'; }} />
              </div>
            </div>

            {/* bracket stack — spring + float + parallax (3 separate elements as in WhySection) */}
            <div className="abt-bg-par-bkt" style={{ position:'absolute', left:-100, bottom:-60, width:240, height:240, pointerEvents:'none' }}>
              {BG_BRACKETS.map((b, i) => (
                <div key={i}
                  className={`abt-bkt-outer${v?' abt-bg-in':''}`}
                  style={{ position:'absolute', left:b.l, top:b.t, width:b.w, height:b.h, ['--bd' as string]:b.bd }}
                >
                  <div className="abt-bkt-inner" style={{ ['--bfd' as string]:b.bfd, ['--bfdel' as string]:b.bfdel, width:'100%', height:'100%' }}>
                    <BracketIcon size="100%" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   §4  CERTIFICATIONS & AFFILIATIONS — vertical marquee (2 columns)
   + larger doctor photo below
══════════════════════════════════════════════════════════════════════════ */
const DISPLAY_CERTS = [...CERTS, ...CERTS]; // doubled for seamless loop

function CertCard({ c }: { c: typeof CERTS[0] }) {
  return (
    <div style={{ background:'#fff', borderRadius:12, padding:'16px 20px', marginBottom:16, boxShadow:'0 2px 12px rgba(0,0,0,0.07)', flexShrink:0, minWidth:220 }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
        <div style={{ width:36, height:36, borderRadius:8, background:c.color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <span style={{ fontFamily:FM, fontSize:10, fontWeight:700, color:'#fff' }}>{c.abbr}</span>
        </div>
        <span style={{ fontFamily:FM, fontSize:15, fontWeight:600, color:DARK }}>{c.name}</span>
      </div>
      <p style={{ fontFamily:FH, fontSize:13, color:'#666', lineHeight:'1.5' }}>{c.desc}</p>
    </div>
  );
}

function CertificationSection() {
  const rh = useReveal();
  return (
    <section style={{ background:'#fff', padding:'80px 0 80px', overflow:'hidden' }}>
      <div style={{ maxWidth:1440, margin:'0 auto', padding:'0 40px' }}>

        {/* heading */}
        <div ref={rh} className="abt-rv" style={{ marginBottom:56 }}>
          <h2 className="abt-cert-h" style={{ fontFamily:FH, fontWeight:400, fontSize:'clamp(28px,4.7vw,68px)', color:DARK, textTransform:'uppercase' }}>
            Certifications &amp; affiliations
          </h2>
        </div>

        {/* VERTICAL marquee — 2 columns */}
        <div style={{ display:'flex', gap:24, height:520, overflow:'hidden', position:'relative', marginBottom:72 }}>
          {/* top/bottom fades */}
          <div style={{ position:'absolute', top:0, left:0, right:0, height:80, background:'linear-gradient(to bottom,#fff,transparent)', zIndex:2, pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:80, background:'linear-gradient(to top,#fff,transparent)', zIndex:2, pointerEvents:'none' }} />

          {/* col 1 — scrolls up */}
          <div style={{ flex:1, overflow:'hidden' }}>
            <div className="abt-vmq-up" style={{ display:'flex', flexDirection:'column' }}>
              {DISPLAY_CERTS.map((c, i) => <CertCard key={i} c={c} />)}
            </div>
          </div>

          {/* col 2 — scrolls down */}
          <div style={{ flex:1, overflow:'hidden' }}>
            <div className="abt-vmq-dn" style={{ display:'flex', flexDirection:'column' }}>
              {DISPLAY_CERTS.map((c, i) => <CertCard key={i} c={c} />)}
            </div>
          </div>
        </div>

        {/* body text */}
        <p style={{ fontFamily:FH, fontSize:20, lineHeight:'169%', letterSpacing:'0.01em', textTransform:'capitalize', color:'#000', textAlign:'center', maxWidth:1106, margin:'0 auto 72px' }}>
          Lorem ipsum dolor sit amet consectetur. Purus in in fames sit ac vitae. Curabitur scelerisque nunc mauris blandit. Donec tristique placerat consectetur molestie est ornare. Suspendisse aliquet semper quam volutpat bibendum est mattis.
        </p>

        {/* SECTION BELOW CERTS: enlarged doctor photo + "Your Trusted Partner" */}
        <div style={{ display:'flex', alignItems:'center', gap:48, flexWrap:'wrap' }}>
          {/* enlarged image — was 134×76, now 280×380 */}
          <div style={{ width:280, height:380, borderRadius:20, overflow:'hidden', background:'linear-gradient(135deg,#155BA9,#0a3d7a)', position:'relative', flexShrink:0, boxShadow:'0 16px 48px rgba(0,0,0,0.18)' }}>
            <div style={{ position:'absolute', top:12, right:12, width:40, height:40, borderRadius:'50%', background:GREEN, zIndex:2 }} />
            <Image src="/about/4.jpg" alt="Doctor" fill style={{ objectFit:'cover' }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.opacity='0'; }} />
          </div>

          {/* body text + script */}
          <div style={{ flex:1, minWidth:260 }}>
            <p style={{ fontFamily:FH, fontSize:20, lineHeight:'169%', letterSpacing:'0.01em', textTransform:'capitalize', color:'#000', marginBottom:24 }}>
              Our certifications and affiliations represent years of relationship-building with the world's most trusted healthcare and medical education bodies. Each partnership strengthens the credibility and employability of every GrowMedLink graduate.
            </p>
            <div style={{ position:'relative', display:'inline-block' }}>
              <svg width={120} height={86} viewBox="0 0 120 86" fill="none" style={{ position:'absolute', left:-130, top:10 }}>
                <path d="M110 10 C88 30 58 45 30 60 C15 68 4 76 2 82" stroke={RED} strokeWidth={2} fill="none" strokeLinecap="round"/>
                <path d="M2 66 L2 82 L18 82" stroke={RED} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontFamily:FS, fontSize:28, color:RED, lineHeight:'28px', display:'block' }}>Your Trusted Partner</span>
            </div>
          </div>
        </div>

        <div style={{ display:'flex', justifyContent:'flex-end', marginTop:48 }}><WaveDots /></div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   §5  OUR CORE VALUES — staggered card reveals
══════════════════════════════════════════════════════════════════════════ */
function CoreValuesSection() {
  const secRef = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (secRef.current) obs.observe(secRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section style={{ background:'#fff', padding:'80px 40px 96px' }} ref={secRef}>
      <div style={{ maxWidth:1440, margin:'0 auto' }}>

        <div className={`abt-rv${vis?' abt-in':''}`} style={{ textAlign:'center', marginBottom:56 }}>
          <p style={{ fontFamily:FH, fontSize:20, lineHeight:'169%', letterSpacing:'0.01em', textTransform:'capitalize', color:'#000', maxWidth:1361, margin:'0 auto 24px' }}>
            Purus in in fames sit ac vitae. Curabitur scelerisque nunc mauris blandit. Donec tristique placerat consectetur molestie est ornare. Suspendisse aliquet semper quam volutpat bibendum est mattis. Sed neque etiam morbi a amet lacus phasellus ipsum nec.
          </p>
          <h2 className="abt-sh" style={{ fontFamily:FH, fontWeight:400, fontSize:'clamp(36px,4.7vw,68px)', color:DARK, textTransform:'uppercase', lineHeight:'81px' }}>
            OUR CORE VALUES
          </h2>
        </div>

        {/* cards with staggered delay */}
        <div className="abt-cv-row" style={{ display:'flex', gap:37, alignItems:'stretch' }}>
          {CORE_VALUES.map((v_, i) => (
            <div
              key={i}
              className={`abt-lift abt-cv-s${v_?.wide ? ' abt-cv-wide' : ' abt-cv-narrow'}${vis?' abt-in':''}`}
              style={{
                flex:v_.wide ? '2.29' : '1', minHeight:469, borderRadius:14,
                background:v_.bg, padding:'50px 50px 44px',
                display:'flex', flexDirection:'column', justifyContent:'space-between',
                cursor:'pointer', transitionDelay:`${i*0.15}s`,
              }}
            >
              <div>
                <div style={{ width:80, height:80, borderRadius:'50%', border:'6.67px solid rgba(255,255,255,0.9)', marginBottom:40, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width={36} height={36} viewBox="0 0 36 36" fill="none">
                    <circle cx={18} cy={18} r={14} stroke="rgba(255,255,255,0.4)" strokeWidth={3}/>
                    <path d="M18 4 A14 14 0 0 1 32 18" stroke="#fff" strokeWidth={3} strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 style={{ fontFamily:FM, fontSize:36, fontWeight:500, color:'#fff', lineHeight:'43px', whiteSpace:'pre-line', marginBottom:v_.wide?20:0 }}>{v_.title}</h3>
                {v_.wide && v_.desc && (
                  <p style={{ fontFamily:FH, fontSize:24, lineHeight:'169%', letterSpacing:'0.01em', textTransform:'capitalize', color:'#fff', maxWidth:564, marginTop:16 }}>{v_.desc}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   §6  FACES BEHIND THE BRAND — vertical scroll strip + detail panel
   Clicking a team member cross-fades the right panel.
══════════════════════════════════════════════════════════════════════════ */
const TEAM_DISPLAY = [...TEAM, ...TEAM]; // doubled for seamless loop

function TeamSection() {
  const rh = useReveal();
  const [selIdx, setSelIdx] = useState(0);
  const [dispIdx, setDispIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const [paused, setPaused] = useState(false);

  const handleSelect = (rawIdx: number) => {
    const idx = rawIdx % TEAM.length;
    setFade(false);
    setPaused(true);
    setTimeout(() => { setDispIdx(idx); setFade(true); }, 280);
    setSelIdx(idx);
  };

  const member = TEAM[dispIdx];

  return (
    <section style={{ background:'#fff', padding:'80px 40px 96px' }}>
      <div style={{ maxWidth:1440, margin:'0 auto', textAlign:'center' }}>

        <div ref={rh} className="abt-rv" style={{ marginBottom:56 }}>
          <h2 className="abt-sh" style={{ fontFamily:FH, fontWeight:400, fontSize:'clamp(32px,4.7vw,68px)', color:DARK, lineHeight:'81px', marginBottom:16 }}>
            The Faces <span style={{ color:GREEN }}>Behind The Brand</span>
          </h2>
          <p style={{ fontFamily:FH, fontSize:20, lineHeight:'169%', letterSpacing:'0.01em', textTransform:'capitalize', color:'#000', maxWidth:1106, margin:'0 auto' }}>
            Purus in in fames sit ac vitae. Curabitur scelerisque nunc mauris blandit. Donec tristique placerat consectetur molestie est ornare. Suspendisse aliquet semper quam volutpat bibendum est mattis.
          </p>
        </div>

        <div className="abt-team-grid" style={{ display:'flex', gap:48, alignItems:'flex-start', textAlign:'left' }}>

          {/* LEFT — vertical scroll strip */}
          <div style={{ width:300, height:580, position:'relative', overflow:'hidden', flexShrink:0 }}>
            {/* top/bottom fades */}
            <div style={{ position:'absolute', top:0, left:0, right:0, height:80, background:'linear-gradient(to bottom,#fff,transparent)', zIndex:2, pointerEvents:'none' }} />
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:80, background:'linear-gradient(to top,#fff,transparent)', zIndex:2, pointerEvents:'none' }} />

            <div
              className={`abt-team-strip${paused?' abt-paused':''}`}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => { if (paused && selIdx === dispIdx) setPaused(false); setPaused(false); }}
            >
              {TEAM_DISPLAY.map((m, i) => {
                const realIdx = i % TEAM.length;
                const isActive = realIdx === selIdx;
                return (
                  <div
                    key={i}
                    onClick={() => handleSelect(i)}
                    style={{
                      display:'flex', alignItems:'center', gap:14, padding:'14px 16px',
                      borderRadius:14, marginBottom:12, cursor:'pointer',
                      background: isActive ? '#f0f8e8' : '#f8f8f8',
                      border:`2px solid ${isActive ? GREEN : 'transparent'}`,
                      transition:'all 0.25s ease',
                    }}
                  >
                    {/* avatar */}
                    <div style={{
                      width:60, height:60, borderRadius:'50%', flexShrink:0,
                      background:`linear-gradient(135deg,${m.grad[0]},${m.grad[1]})`,
                      display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden',
                      border:`2px solid ${isActive ? GREEN : '#e0e0e0'}`,
                    }}>
                      <span style={{ fontFamily:FM, fontSize:16, fontWeight:700, color:'#fff' }}>{m.initials}</span>
                    </div>
                    <div>
                      <p style={{ fontFamily:FM, fontSize:14, fontWeight:600, color:DARK, lineHeight:'1.3' }}>{m.name}</p>
                      <p style={{ fontFamily:FH, fontSize:12, color:'#888', lineHeight:'1.4', marginTop:2 }}>{m.role}</p>
                    </div>
                    {isActive && <div style={{ marginLeft:'auto', width:8, height:8, borderRadius:'50%', background:GREEN, flexShrink:0 }} />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT — detail panel, cross-fades between members */}
          <div style={{ flex:1, opacity:fade?1:0, transform:fade?'translateY(0)':'translateY(14px)', transition:'opacity 0.3s ease, transform 0.3s ease', padding:'32px 40px', background:'#f8f8f8', borderRadius:24, minHeight:580, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center' }}>

            {/* large avatar */}
            <div style={{
              width:200, height:200, borderRadius:'50%', overflow:'hidden',
              background:`linear-gradient(135deg,${member.grad[0]},${member.grad[1]})`,
              border:`6px solid ${GREEN}`,
              display:'flex', alignItems:'center', justifyContent:'center',
              marginBottom:28, boxShadow:'0 12px 40px rgba(0,0,0,0.14)', flexShrink:0,
            }}>
              <span style={{ fontFamily:FM, fontSize:48, fontWeight:700, color:'#fff' }}>{member.initials}</span>
            </div>

            <p style={{ fontFamily:FH, fontSize:34, fontWeight:500, lineHeight:'1.3', color:'#000', marginBottom:8 }}>{member.name}</p>
            <p style={{ fontFamily:FH, fontSize:20, fontWeight:500, color:'#9F9F9F', marginBottom:20 }}>{member.role}</p>
            <p style={{ fontFamily:FH, fontSize:17, lineHeight:'1.65', color:'#333', maxWidth:560, marginBottom:28 }}>{member.bio}</p>

            {/* social icons */}
            <div style={{ display:'flex', gap:8, justifyContent:'center' }}>
              {['i','fb','tw'].map((_, i) => (
                <div key={i} style={{
                  width:44, height:44, background:'rgba(0,0,0,0.07)', borderRadius:i===1?4:'50%',
                  display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'background 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background=`rgba(150,202,69,0.18)`}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background='rgba(0,0,0,0.07)'}
                >
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    {i===0 && <><rect x={2} y={2} width={20} height={20} rx={5}/><circle cx={12} cy={12} r={4}/><circle cx={17.5} cy={6.5} r={0.1} strokeWidth={3}/></>}
                    {i===1 && <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>}
                    {i===2 && <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>}
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   §7  FAQ — premium accordion with 8 real questions
══════════════════════════════════════════════════════════════════════════ */
function FAQSection() {
  const [open, setOpen] = useState<number|null>(null);
  const rh = useReveal();
  return (
    <section style={{ background:DARK, padding:'80px 0 90px', position:'relative', overflow:'hidden' }}>
      <div style={{ maxWidth:1440, margin:'0 auto', padding:'0 40px', position:'relative' }}>

        {/* wave dots left */}
        <div style={{ position:'absolute', left:40, top:72, pointerEvents:'none' }}><WaveDots flip /></div>

        {/* heading */}
        <div ref={rh} className="abt-rv" style={{ textAlign:'center', marginBottom:56 }}>
          <h2 style={{ fontFamily:FH, fontWeight:400, letterSpacing:'-0.03em', fontSize:'clamp(36px,5.5vw,80px)', color:'#fff', lineHeight:'1.19', maxWidth:701, margin:'0 auto' }}>
            Got questions?<br/>We&apos;ve got answers.
          </h2>
        </div>

        {/* "We even answered without ChatGPT ;)" */}
        <div style={{ position:'absolute', right:40, top:0, width:280 }}>
          <span style={{ fontFamily:FS, fontSize:28, color:GREEN, lineHeight:'28px', display:'block' }}>
            We even answered<br/>without ChatGPT ;)
          </span>
          <svg width={82} height={82} viewBox="0 0 82 82" fill="none" style={{ marginTop:12, transform:'rotate(-87.56deg)' }}>
            <path d="M10 10 C28 28 44 48 58 64 C65 72 70 76 78 78" stroke={GREEN} strokeWidth={2} fill="none" strokeLinecap="round"/>
            <path d="M62 78 L78 78 L78 62" stroke={GREEN} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* accordion */}
        <div style={{ maxWidth:1068, margin:'0 auto' }}>
          {FAQS.map((f, i) => (
            <div key={i} style={{ borderTop:'1px solid #3E3E3E', borderBottom:i===FAQS.length-1?'1px solid #3E3E3E':'none', marginTop:-1 }}>
              <button
                style={{ width:'100%', minHeight:97, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 44px', background:'none', border:'none', cursor:'pointer', textAlign:'left', gap:24 }}
                onClick={() => setOpen(open===i?null:i)}
              >
                <span style={{ fontFamily:FH, fontSize:'clamp(16px,1.8vw,24px)', fontWeight:400, letterSpacing:'-0.03em', color:'#fff', flex:1 }}>
                  {f.q}
                </span>
                <div className={`abt-faq-icon${open===i?' abt-open':''}`}>
                  <svg width={14} height={14} viewBox="0 0 14 14">
                    <line x1={7} y1={2} x2={7} y2={12} stroke="#fff" strokeWidth={1.8} strokeLinecap="round"/>
                    <line x1={2} y1={7} x2={12} y2={7} stroke="#fff" strokeWidth={1.8} strokeLinecap="round"/>
                  </svg>
                </div>
              </button>
              <div className={`abt-faq-body${open===i?' abt-open':''}`}>
                <p style={{ fontFamily:FH, fontSize:17, color:'rgba(255,255,255,0.72)', lineHeight:'170%', padding:'0 44px 28px', paddingRight:80 }}>
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

/* ══════════════════════════════════════════════════════════════════════════
   ROOT PAGE EXPORT
══════════════════════════════════════════════════════════════════════════ */
export default function AboutPage() {
  return (
    <main className="abt">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <HeroSection />
      <MissionVision />
      <BackgroundSection />
      <CertificationSection />
      <CoreValuesSection />
      <TeamSection />
      <FAQSection />
    </main>
  );
}