'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import FAQSection from '@/components/FAQSection';

const FH = "'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif";
const FM = "'Haffer XH Mono-TRIAL','Courier New',monospace";
const FP = "'Power Grotesk','Helvetica Neue',Arial,sans-serif";
const FS = "'Great Day Personal Use','Brush Script MT',cursive";
const GREEN = '#96CA45';
const DARK  = '#252525';
const BLUE  = '#155BA9';
const RED   = '#AF1515';

const TEAM = [
  { name:'Dr. Sarah Mitchell',  role:'Chief Medical Officer',    initials:'SM', photo:'/about/1.jpg',  grad:['#155BA9','#0a3d7a'], bio:'A distinguished physician with over 18 years of clinical and academic experience across the UK and India. Dr. Mitchell shapes our medical curriculum and ensures every program meets the highest international standards.', social:{ ig:'#', fb:'#', tw:'#' } },
  { name:'Dr. Arjun Patel',     role:'Academic Director',        initials:'AP', photo:'/about/2.jpg',  grad:['#96CA45','#4a7a10'], bio:'With dual specialisations in medical education and health policy, Dr. Patel leads the design of our flagship NCLEX and PLAB preparation tracks, maintaining a 91% first-attempt pass rate among our graduates.', social:{ ig:'#', fb:'#', tw:'#' } },
  { name:'Ms. Priya Nair',      role:'Head of Student Affairs',  initials:'PN', photo:'/about/3.jpg',  grad:['#6938EF','#3d1d9e'], bio:'Priya brings a decade of student mentorship experience from top nursing colleges. She oversees every touchpoint of the learner journey — from onboarding to post-placement support.', social:{ ig:'#', fb:'#', tw:'#' } },
  { name:'Mr. James Wilson',    role:'Chief Technology Officer', initials:'JW', photo:'/about/4.jpg',  grad:['#F79009','#a55c00'], bio:'A serial edtech entrepreneur, James architected our adaptive learning platform that personalises study plans in real-time, reducing average preparation time by 30%.', social:{ ig:'#', fb:'#', tw:'#' } },
  { name:'Dr. Meera Krishnan',  role:'Clinical Training Lead',   initials:'MK', photo:'/about/5.jpg',  grad:['#0BA5EC','#0669a0'], bio:'Dr. Krishnan brings 12 years of ICU and surgical experience to our simulation labs, delivering the case-based learning sessions that consistently receive top learner feedback.', social:{ ig:'#', fb:'#', tw:'#' } },
  { name:'Ms. Ananya Roy',      role:'International Relations',  initials:'AR', photo:'/about/6.jpg',  grad:['#EE46BC','#8a1460'], bio:'Ananya manages our global partnerships with hospitals and licensing bodies across 14 countries, ensuring our graduates have clear pathways to work in the USA, UK, Canada, and Australia.', social:{ ig:'#', fb:'#', tw:'#' } },
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
  { title:'Patient First',   desc:'Every course, resource and programme we build starts from a single question: how does this better equip our graduates to care for patients? Excellence in medicine is meaningless without compassion at its core.', bg:'linear-gradient(180deg,#155BA9 0%,#04356B 100%)' },
  { title:'Rigorous\nStandards',    desc:'We maintain uncompromising clinical and educational standards across all preparation tracks, ensuring our learners achieve top scores and practice with absolute clinical precision.', bg:'linear-gradient(180deg,#96CA45 0%,#477106 100%)' },
  { title:'Global\nMindset',        desc:'We prepare healthcare professionals to excel in diverse environments worldwide, fostering cultural competency, resilience, and global medical knowledge.', bg:'linear-gradient(180deg,#252525 0%,#000 100%)' },
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
.abt-arch { position:relative; height:clamp(200px,32vw,380px); overflow:hidden; cursor:grab; user-select:none; }
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
.abt-bkt-inner {
  animation-name: abt-bktfl;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-duration: var(--bfd, 3.4s);
  animation-delay: var(--bfdel, 1.2s);
}
@keyframes abt-bktfl {
  0%,100% { transform: translateY(0); }
  50%     { transform: translateY(-5px); }
}

/* ── horizontal marquee ── */
@keyframes abt-mq-horizontal {
  0%   { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-50%, 0, 0); }
}
.abt-mq-h-wrap {
  display: flex;
  overflow: hidden;
  position: relative;
  width: 100%;
  padding: 16px 0;
  margin-bottom: 48px;
}
.abt-mq-h-wrap::before, .abt-mq-h-wrap::after {
  content: '';
  position: absolute;
  top: 0; bottom: 0;
  width: 150px;
  z-index: 2;
  pointer-events: none;
}
.abt-mq-h-wrap::before {
  left: 0;
  background: linear-gradient(to right, #fff, transparent);
}
.abt-mq-h-wrap::after {
  right: 0;
  background: linear-gradient(to left, #fff, transparent);
}
.abt-mq-h-track {
  display: flex;
  gap: 120px;
  animation: abt-mq-horizontal 30s linear infinite;
  white-space: nowrap;
  width: max-content;
  align-items: center;
}
.abt-mq-h-track:hover {
  animation-play-state: paused;
}

/* ── centerpiece animations ── */
@keyframes abt-cp-reveal {
  from {
    opacity: 0;
    transform: scale(0.85) translate3d(0, 24px, 0);
  }
  to {
    opacity: 1;
    transform: scale(1) translate3d(0, 0px, 0);
  }
}
@keyframes abt-cp-float {
  0%, 100% {
    transform: translate3d(0, 0px, 0) rotate(0deg);
  }
  50% {
    transform: translate3d(0, -6px, 0) rotate(-1.5deg);
  }
}
.abt-cp-callout {
  opacity: 0;
  transform: scale(0.85) translate3d(0, 24px, 0);
  will-change: transform, opacity;
}
.abt-cp-callout.abt-in {
  opacity: 1;
  transform: scale(1) translate3d(0, 0px, 0);
  animation-name: abt-cp-reveal, abt-cp-float;
  animation-duration: 0.75s, 3s;
  animation-timing-function: cubic-bezier(.34,1.56,0.64,1), ease-in-out;
  animation-delay: 0s, 0.75s;
  animation-iteration-count: 1, infinite;
  animation-fill-mode: both, none;
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

/* core values — GSAP handles all sizing; only the scroll-reveal helper remains */
.abt-cv-s {
  opacity: 0;
  transform: translateY(48px);
  transition: opacity 0.65s ease, transform 0.65s cubic-bezier(.22,.68,0,1.2);
}
.abt-cv-s.abt-in { opacity: 1; transform: translateY(0); }

/* ── team vertical scroll strip (kept for reduced-motion) ── */
@keyframes abt-team-up { from { transform:translateY(0); } to { transform:translateY(-50%); } }
.abt-team-strip { animation: abt-team-up 32s linear infinite; }
.abt-team-strip.abt-paused { animation-play-state: paused; }

/* ── Faces Behind the Brand — responsive orbit carousel ── */
.abt-tc-wrap {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: visible;
  padding: 16px 0 0;
}

/* Orbit row: height = center avatar size + room for active glow */
.abt-tc-orbit {
  position: relative;
  width: 100%;
  height: clamp(140px, 22vw, 210px);
  margin: 0 auto;
}

/* Each avatar slot */
.abt-tc-slot {
  position: absolute;
  top: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateX(-50%) translateY(-50%);
  transition: left 0.72s cubic-bezier(0.25,1,0.22,1),
              opacity 0.55s ease;
  will-change: left, opacity;
  cursor: pointer;
}

/* Avatar circle */
.abt-tc-img {
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  transition: width 0.72s cubic-bezier(0.25,1,0.22,1),
              height 0.72s cubic-bezier(0.25,1,0.22,1),
              box-shadow 0.72s ease,
              border-color 0.55s ease;
  will-change: width, height, box-shadow;
}

.abt-tc-img-active {
  border: 3px solid #96CA45;
  box-shadow: 0 0 0 5px rgba(150,202,69,0.18), 0 12px 38px rgba(0,0,0,0.16);
}
.abt-tc-img-inactive {
  border: 2px solid rgba(150,202,69,0.22);
  box-shadow: 0 3px 14px rgba(0,0,0,0.10);
}

/* Detail panel */
.abt-tc-detail {
  text-align: center;
  margin-top: clamp(20px, 3vw, 32px);
  width: 100%;
  max-width: clamp(300px, 60vw, 560px);
  padding: 0 16px;
}

@keyframes abt-tc-fadein {
  from { opacity:0; transform: translateY(12px); }
  to   { opacity:1; transform: translateY(0);    }
}

/* Dot indicators */
.abt-tc-dots {
  display: flex;
  gap: 6px;
  justify-content: center;
  margin-top: clamp(16px, 2.5vw, 26px);
}
.abt-tc-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #D0D5DD;
  cursor: pointer;
  transition: background 0.3s ease, width 0.35s ease;
}
.abt-tc-dot.abt-tc-dot-active {
  background: #96CA45;
  width: 20px;
  border-radius: 4px;
}

/* ── FAQ premium accordion ── */
.abt-faq-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.52s cubic-bezier(.22,.68,0,1.2), padding 0.35s ease;
}
.abt-faq-body.abt-open { max-height: 210px; }

.abt-faq-icon {
  width: 18px; height: 18px;
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

/* ── MissionVision Responsive Grid & Container ── */
.abt-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 80px;
}
@media (max-width: 1024px) {
  .abt-container {
    padding: 0 40px;
  }
}
@media (max-width: 768px) {
  .abt-container {
    padding: 0 24px;
  }
}

.abt-mv-container {
  display: flex;
  gap: 5%;
  align-items: stretch;
  position: relative;
}
.abt-mv-left {
  flex: 1;
  min-width: 0;
  position: relative;
  z-index: 2;
}
.abt-mv-right {
  flex: 1.1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  z-index: 1;
  padding-left: 20px;
}
.abt-mv-avatars {
  position: absolute;
  left: 50%;
  top: 48%;
  transform: translate(-50%, -50%);
  width: 208px;
  height: 128px;
  z-index: 10;
  pointer-events: none;
}

@media (max-width: 1024px) {
  .abt-mv-container {
    flex-direction: column;
    gap: 72px;
    align-items: center;
  }
  .abt-mv-left {
    width: 100%;
    max-width: 640px;
  }
  .abt-mv-right {
    width: 100%;
    max-width: 540px;
    justify-content: flex-start;
    padding-left: 40px;
  }
  .abt-mv-avatars {
    position: relative;
    left: auto;
    top: auto;
    transform: none;
    margin: 32px auto;
    height: 112px;
    width: 192px;
  }
  .abt-mv-divider-v, .abt-mv-divider-h {
    display: none !important;
  }
}
@media (max-width: 640px) {
  .abt-mv-right {
    padding-left: 16px;
    max-width: 100%;
  }
}

/* ── responsive ── */
@media (max-width: 1199px) {
  .abt-miss-grid { flex-direction: column !important; }
  .abt-bg-grid  { flex-direction: column !important; }
  .abt-team-grid { flex-direction: column !important; }
  .abt-footer-grid { flex-direction: column !important; }
  .abt-footer-r  { display: none !important; }
}
@media (max-width: 767px) {
  .abt-h1-big { font-size: clamp(38px,8vw,80px) !important; }
  .abt-sh     { font-size: clamp(28px,6vw,52px) !important; line-height: 1.2 !important; }
  .abt-pill   { border-radius: 40px !important; }
  .abt-cert-h { font-size: clamp(28px,6vw,44px) !important; }
}
@media (max-width: 479px) {
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
   ARCH CAROUSEL — static arch, cards scroll along the curve
   Cards are fixed at positions on the top arc of a large off-screen circle.
   Only the offset angle animates, sliding items through the visible window.
══════════════════════════════════════════════════════════════════════════ */
function ArchCarousel() {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const offsetRef = useRef(0);   // current scroll offset in degrees
  const velRef    = useRef(0.18); // auto-scroll speed deg/frame
  const isDrag    = useRef(false);
  const lastX     = useRef(0);
  const N = ARCH_ITEMS.length;

  /*
   * Arc geometry:
   *  - imaginary circle has its centre BELOW the container
   *  - only the top arc is visible; cards sit on that arc
   *  - offsetRef is a continuous value that shifts all card angles together
   *  - STEP_DEG = angular gap between cards; visHalf = half the visible arc window
   */
  const STEP_DEG = 11; // degrees between adjacent cards
  const VIS_HALF = 38; // cards within ±38° of top are visible (≈ 7 cards max)

  const getDims = () => {
    const vw    = window.innerWidth;
    const contH = wrapRef.current ? wrapRef.current.offsetHeight : Math.round(vw * 0.25);
    // Radius large enough that the top arc spans the full container width
    const radius = Math.round(Math.max(520, vw * 0.85));
    // Circle centre Y: apex of arc sits at ~22% from top of container
    // cy_apex = ctrY - radius  =>  ctrY = apex_y + radius
    const apexY  = Math.round(contH * 0.22);
    const ctrY   = apexY + radius;
    const cardW  = Math.round(Math.min(Math.max(110, vw * 0.19), 260));
    const cardH  = Math.round(cardW * 0.70);
    return { radius, ctrY, cardW, cardH };
  };

  useEffect(() => {
    let gsapInst: any = null;
    let ticker: any   = null;

    import('gsap').then(({ gsap }) => {
      gsapInst = gsap;

      const render = () => {
        const wrap = wrapRef.current;
        if (!wrap) return;
        const { radius, ctrY, cardW, cardH } = getDims();
        const ctrX = wrap.offsetWidth / 2;

        cardRefs.current.forEach((card, i) => {
          if (!card) return;

          // Each card has a base angle: card i sits at i * STEP_DEG degrees
          // offsetRef shifts all cards together (continuous scroll)
          // fromTop = 0 → card is at the very top of the circle
          // Wrap angle into -180..+180 range
          let fromTop = (i * STEP_DEG + offsetRef.current) % 360;
          if (fromTop >  180) fromTop -= 360;
          if (fromTop < -180) fromTop += 360;

          const radA = (fromTop * Math.PI) / 180;
          // Top of circle = ctrY - radius (straight up, sin=0, cos=1)
          const cx = ctrX + radius * Math.sin(radA);
          const cy = ctrY - radius * Math.cos(radA);

          const absOff = Math.abs(fromTop);
          // Full opacity in inner 60% of window, fade to 0 at edge
          const alpha = Math.max(0, Math.min(1, 1 - (absOff - VIS_HALF * 0.55) / (VIS_HALF * 0.45)));

          // Tilt cards along the tangent of the arc
          const tiltDeg = fromTop * 0.5;

          card.style.width      = cardW + 'px';
          card.style.height     = cardH + 'px';
          card.style.left       = cx + 'px';
          card.style.top        = cy + 'px';
          card.style.transform  = `translate(-50%, -50%) rotate(${tiltDeg}deg)`;
          card.style.opacity    = absOff > VIS_HALF ? '0' : String(Math.round(alpha * 100) / 100);
          card.style.visibility = absOff > VIS_HALF ? 'hidden' : 'visible';
          card.style.zIndex     = String(Math.round((1 - absOff / VIS_HALF) * 10));
        });
      };

      ticker = gsap.ticker.add(() => {
        if (!isDrag.current) {
          offsetRef.current -= velRef.current;
        } else {
          velRef.current *= 0.92; // decelerate drag momentum
        }
        render();
      });

      const onResize = () => render();
      window.addEventListener('resize', onResize, { passive: true });
      render();

      return () => window.removeEventListener('resize', onResize);
    });

    return () => {
      if (ticker && gsapInst) gsapInst.ticker.remove(ticker);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onDown = (e: React.MouseEvent | React.TouchEvent) => {
    isDrag.current = true;
    lastX.current  = 'touches' in e ? e.touches[0].clientX : e.clientX;
    velRef.current = 0;
  };
  const onMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrag.current) return;
    const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const dx = cx - lastX.current;
    const degPerPx = STEP_DEG / 80; // ~1 card per 80px drag
    offsetRef.current += dx * degPerPx;
    velRef.current     = dx * degPerPx * 0.5;
    lastX.current      = cx;
  };
  const onUp = () => { isDrag.current = false; };

  return (
    <div
      ref={wrapRef}
      className="abt-arch"
      onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
      onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
      style={{ touchAction: 'pan-y' }}
    >
      {ARCH_ITEMS.map((item, i) => (
        <div
          key={i}
          ref={el => { cardRefs.current[i] = el; }}
          style={{
            position: 'absolute',
            borderWidth: 'clamp(2px,0.35vw,4px) clamp(2px,0.35vw,4px) clamp(10px,1.5vw,22px) clamp(2px,0.35vw,4px)',
            borderStyle: 'solid', borderColor: item.border,
            borderRadius: 'clamp(6px,0.7vw,9px)', overflow: 'hidden',
            background: ARCH_COLORS[i % ARCH_COLORS.length],
            willChange: 'transform, opacity',
            pointerEvents: 'none',
            opacity: 0, visibility: 'hidden',
          }}
        >
          <Image src={item.src} alt="" fill sizes="(max-width:640px) 35vw, (max-width:1024px) 25vw, 260px"
            style={{ objectFit: 'cover' }}
            onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }} />
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   §1  HERO — GSAP entrance, fully responsive
══════════════════════════════════════════════════════════════════════════ */
function HeroSection() {
  const h1Ref      = useRef<HTMLHeadingElement>(null);
  const subRef     = useRef<HTMLDivElement>(null);
  const bodyRef    = useRef<HTMLParagraphElement>(null);
  const ctaRef     = useRef<HTMLButtonElement>(null);
  const calloutRef = useRef<HTMLDivElement>(null);
  const burstRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    import('gsap').then(({ gsap }) => {
      if (cancelled) return;

      /* entrance stagger */
      gsap.fromTo(
        [h1Ref.current, subRef.current, bodyRef.current, ctaRef.current],
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.72, ease: 'power3.out', stagger: 0.13, delay: 0.1 }
      );

      /* callout reveal + float loop */
      if (calloutRef.current) {
        gsap.fromTo(calloutRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.75, ease: 'back.out(1.3)', delay: 0.76,
            onComplete: () => {
              gsap.to(calloutRef.current, {
                y: -8, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1,
              });
            },
          }
        );
      }

      /* sunburst slow spin */
      if (burstRef.current) {
        gsap.to(burstRef.current, {
          rotation: 360, duration: 80, ease: 'none', repeat: -1, transformOrigin: '50% 50%',
        });
      }
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <section style={{ background: '#000', position: 'relative', overflowX: 'hidden', overflowY: 'visible', paddingTop: 'clamp(80px,10vh,130px)', paddingBottom: 0 }}>

      {/* Wave bg */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100vh', zIndex: 0 }}>
        <Image src="/about-bg-wave.png" alt="" fill style={{ objectFit: 'cover' }} priority />
      </div>
      <div className="abt-grad-bar" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 5 }} />

      {/* Heading block */}
      <div style={{ textAlign: 'center', padding: '0 clamp(16px,4vw,40px) clamp(16px,2.5vw,28px)', position: 'relative', zIndex: 5 }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {/* Sunburst halo — GSAP spins it */}
          <div
            ref={burstRef}
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              width: 'clamp(260px,70vw,750px)',
              height: 'clamp(260px,70vw,750px)',
              marginTop: 'calc(clamp(260px,70vw,750px) / -2)',
              marginLeft: 'calc(clamp(260px,70vw,750px) / -2)',
              opacity: 0.22,
              pointerEvents: 'none',
              zIndex: -1,
              willChange: 'transform',
            }}
          >
            <Image src="/sunburst-lines.png" alt="" fill style={{ objectFit: 'contain' }} priority />
          </div>

          <h1
            ref={h1Ref}
            className="abt-h1-big"
            style={{
              fontFamily: FH, fontWeight: 500,
              fontSize: 'clamp(32px,7vw,96px)',
              letterSpacing: '-0.03em', color: '#fff',
              lineHeight: 1.15, marginBottom: 'clamp(12px,1.8vw,20px)',
              opacity: 0,
            }}
          >
            About GrowMedLink
          </h1>
        </div>

        <div
          ref={subRef}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(10px,1.5vw,18px)', marginBottom: 'clamp(12px,2vw,20px)', flexWrap: 'wrap', opacity: 0 }}
        >
          <Image src="/avatars-group.png" alt="Students" width={221} height={38}
            style={{ height: 'clamp(28px,3.5vw,38px)', width: 'auto' }}
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          <span style={{ fontFamily: FP, fontSize: 'clamp(13px,1.4vw,16px)', color: '#CACACA', lineHeight: '1.4' }}>1600 + Trusted Students</span>
        </div>
      </div>

      {/* Arch carousel */}
      <ArchCarousel />

      {/* Body text + CTA */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 'clamp(16px,3vw,36px) clamp(16px,4vw,32px) 0', textAlign: 'center', position: 'relative', zIndex: 5 }}>
        <p
          ref={bodyRef}
          style={{
            fontFamily: FH, fontSize: 'clamp(14px,1.4vw,20px)', color: '#fff',
            lineHeight: '169%', letterSpacing: '0.01em', textTransform: 'capitalize',
            marginBottom: 'clamp(24px,3.5vw,40px)', opacity: 0,
          }}
        >
          Lorem ipsum dolor sit amet consectetur. Purus in in fames sit ac vitae. Curabitur scelerisque nunc mauris blandit. Donec tristique placerat consectetur molestie est ornare. Suspendisse aliquet semper quam volutpat bibendum est mattis.
        </p>
        <button
          ref={ctaRef}
          style={{
            width: 'clamp(180px,20vw,228px)', height: 'clamp(44px,5vw,54px)',
            background: GREEN, borderRadius: 6, border: 'none', cursor: 'pointer',
            fontFamily: FM, fontSize: 'clamp(14px,1.2vw,18px)', fontWeight: 600, color: '#000',
            opacity: 0,
          }}
        >
          Become a Member
        </button>
      </div>

      {/* Wave dots + script callout */}
      <div style={{
        maxWidth: 1440, margin: '0 auto',
        padding: 'clamp(20px,3vw,40px) clamp(16px,3vw,40px) clamp(28px,4vw,52px)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        position: 'relative', zIndex: 5, flexWrap: 'wrap', gap: 16,
      }}>
        <WaveDots flip />

        <div
          ref={calloutRef}
          style={{ position: 'relative', pointerEvents: 'none', opacity: 0, flexShrink: 0 }}
        >
          {/* Curly arrow */}
          <div style={{ transform: 'rotate(-20.36deg)', transformOrigin: 'top left', display: 'inline-block', position: 'absolute', left: 'clamp(-70px,-7vw,-48px)', top: 'clamp(-40px,-4vw,-28px)' }}>
            <Image src="/curly-arrow.png" alt="" width={82} height={77}
              style={{ width: 'clamp(52px,6vw,82px)', height: 'auto', display: 'block' }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }} />
          </div>
          <span style={{
            fontFamily: FS, fontSize: 'clamp(18px,2.2vw,28px)', lineHeight: 1.35, color: GREEN,
            display: 'block', transform: 'rotate(-4deg)', transformOrigin: 'left top',
            WebkitFontSmoothing: 'antialiased', paddingBottom: 8,
          }}>
            Finally, your kind<br />of group chat
          </span>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   §2  MISSION / VISION — left text + right GSAP collage
   Default:  circle portrait (top-left) + small rounded-rect (top-right overlapping)
             + large main rect image below
   Hover Ph1: morph each image to its next position (translate + border-radius)
   Hover Ph2: green overlay + scale-down + #1 badge on main image
   Hover Ph3: new rotated cards slide up from below with stagger
══════════════════════════════════════════════════════════════════════════ */
function ShelfCollage({ vis }: { vis: boolean }) {
  const wrapRef    = useRef<HTMLDivElement>(null);
  /* phase-1 elements */
  const circleRef  = useRef<HTMLDivElement>(null);
  const rectRef    = useRef<HTMLDivElement>(null);
  /* phase-2 elements */
  const mainRef    = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const badgeRef   = useRef<HTMLDivElement>(null);
  /* phase-3 elements */
  const card3aRef  = useRef<HTMLDivElement>(null);
  const card3bRef  = useRef<HTMLDivElement>(null);

  const hoveredRef = useRef(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tlRef      = useRef<any>(null);

  /* set initial hidden state for phase-3 cards */
  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      if (overlayRef.current) gsap.set(overlayRef.current, { opacity: 0 });
      if (badgeRef.current)   gsap.set(badgeRef.current,   { opacity: 0, y: 18 });
      if (card3aRef.current)  gsap.set(card3aRef.current,  { opacity: 0, y: 120, rotation: -6, scale: 0.9 });
      if (card3bRef.current)  gsap.set(card3bRef.current,  { opacity: 0, y: 140, rotation: 7,  scale: 0.9 });
    });
  }, []);

  const onEnter = async () => {
    if (hoveredRef.current) return;
    hoveredRef.current = true;
    const { gsap } = await import('gsap');

    if (tlRef.current) tlRef.current.kill();

    const tl = gsap.timeline();
    tlRef.current = tl;

    /* ── Phase 1: morph top images to new positions ── */
    tl.to(circleRef.current, {
      x: -10, y: 8, scale: 0.88,
      borderRadius: '22px',
      duration: 0.6, ease: 'power3.inOut',
    }, 0);
    tl.to(rectRef.current, {
      x: 6, y: 12, scale: 0.92,
      borderRadius: '50%',
      duration: 0.6, ease: 'power3.inOut',
    }, 0);

    /* ── Phase 2: green overlay + scale main + badge ── */
    tl.to(overlayRef.current, { opacity: 1, duration: 0.45, ease: 'power2.out' }, 0.15);
    tl.to(mainRef.current,    { scale: 0.96, duration: 0.55, ease: 'power2.out' }, 0.15);
    tl.to(badgeRef.current,   { opacity: 1, y: 0, duration: 0.42, ease: 'back.out(1.4)' }, 0.32);

    /* ── Phase 3: new cards slide up from below ── */
    tl.to(card3aRef.current, {
      opacity: 1, y: 0, rotation: 0, scale: 1,
      boxShadow: '0 16px 48px rgba(0,0,0,0.22)',
      duration: 0.58, ease: 'power3.out',
    }, 0.38);
    tl.to(card3bRef.current, {
      opacity: 1, y: 0, rotation: 0, scale: 1,
      boxShadow: '0 20px 56px rgba(0,0,0,0.18)',
      duration: 0.58, ease: 'power3.out',
    }, 0.52);
  };

  const onLeave = async () => {
    if (!hoveredRef.current) return;
    hoveredRef.current = false;
    const { gsap } = await import('gsap');

    if (tlRef.current) tlRef.current.kill();

    const tl = gsap.timeline();
    tlRef.current = tl;

    /* reverse phase 3 first */
    tl.to([card3aRef.current, card3bRef.current], {
      opacity: 0, y: 120, rotation: (i) => i === 0 ? -6 : 7, scale: 0.9,
      duration: 0.38, ease: 'power2.in', stagger: 0.06,
    }, 0);

    /* reverse phase 2 */
    tl.to(badgeRef.current,   { opacity: 0, y: 18, duration: 0.28, ease: 'power2.in' }, 0.06);
    tl.to(overlayRef.current, { opacity: 0, duration: 0.32, ease: 'power2.in' }, 0.1);
    tl.to(mainRef.current,    { scale: 1,   duration: 0.45, ease: 'power3.out' }, 0.12);

    /* reverse phase 1 */
    tl.to(circleRef.current, {
      x: 0, y: 0, scale: 1,
      borderRadius: '50%',
      duration: 0.52, ease: 'power3.inOut',
    }, 0.1);
    tl.to(rectRef.current, {
      x: 0, y: 0, scale: 1,
      borderRadius: '18px',
      duration: 0.52, ease: 'power3.inOut',
    }, 0.1);
  };

  return (
    <div
      ref={wrapRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        position: 'relative',
        width: 'clamp(300px,46vw,480px)',
        userSelect: 'none',
        cursor: 'default',
      }}
    >
      {/* ── Top row: circle (left) + rounded-rect (right, overlapping) ── */}
      <div
        className={`abt-ms${vis ? ' abt-in' : ''}`}
        style={{
          position: 'relative',
          height: 'clamp(150px,18vw,210px)',
          marginBottom: 12,
          zIndex: 2,
        }}
      >
        {/* Circle portrait */}
        <div
          ref={circleRef}
          style={{
            position: 'absolute',
            left: 0, top: '50%',
            transform: 'translateY(-50%)',
            width: 'clamp(130px,16vw,175px)',
            height: 'clamp(130px,16vw,175px)',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '4px solid #fff',
            boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
            zIndex: 3,
            willChange: 'transform, border-radius',
          }}
        >
          <Image src="/about/1.jpg" alt="" fill style={{ objectFit: 'cover' }}
            onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }} />
        </div>

        {/* Rounded-rect portrait — overlaps right side of circle */}
        <div
          ref={rectRef}
          style={{
            position: 'absolute',
            left: 'clamp(96px,12vw,128px)',
            top: 0,
            width: 'clamp(118px,15vw,160px)',
            height: 'clamp(150px,18vw,205px)',
            borderRadius: 18,
            overflow: 'hidden',
            border: '4px solid #fff',
            boxShadow: '0 8px 28px rgba(0,0,0,0.14)',
            zIndex: 2,
            willChange: 'transform, border-radius',
          }}
        >
          <Image src="/about/3.jpg" alt="" fill style={{ objectFit: 'cover' }}
            onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }} />
        </div>
      </div>

      {/* ── Main large image ── */}
      <div
        className={`abt-ms abt-d1${vis ? ' abt-in' : ''}`}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <div
          ref={mainRef}
          style={{
            width: '100%',
            height: 'clamp(240px,32vw,380px)',
            borderRadius: 20,
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 16px 48px rgba(0,0,0,0.14)',
            willChange: 'transform',
          }}
        >
          <Image src="/about/5.jpg" alt="Mission & Vision" fill style={{ objectFit: 'cover' }}
            onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }} />

          {/* Green overlay — fades in on hover */}
          <div
            ref={overlayRef}
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(150,202,69,0.38)',
              zIndex: 2,
              willChange: 'opacity',
            }}
          />

          {/* #1 badge */}
          <div
            ref={badgeRef}
            style={{
              position: 'absolute',
              left: '50%', top: '50%',
              transform: 'translate(-50%,-50%)',
              zIndex: 3,
              fontFamily: FH,
              fontSize: 'clamp(52px,8vw,88px)',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.04em',
              textShadow: '0 4px 24px rgba(0,0,0,0.32)',
              willChange: 'transform, opacity',
            }}
          >
            #1
          </div>
        </div>
      </div>

      {/* ── Phase-3 cards (hidden until hover, slide up from below) ── */}
      {/* Card A — left, behind */}
      <div
        ref={card3aRef}
        style={{
          position: 'absolute',
          bottom: -10,
          left: -16,
          width: 'clamp(170px,22vw,250px)',
          height: 'clamp(195px,26vw,290px)',
          borderRadius: 18,
          overflow: 'hidden',
          zIndex: 4,
          willChange: 'transform, opacity, box-shadow',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}
      >
        <Image src="/about/7.jpg" alt="" fill style={{ objectFit: 'cover' }}
          onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }} />
        {/* subtle green tint on this card too */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(150,202,69,0.28)', zIndex: 2 }} />
      </div>

      {/* Card B — right, in front, rotated */}
      <div
        ref={card3bRef}
        style={{
          position: 'absolute',
          bottom: -28,
          right: -20,
          width: 'clamp(148px,19vw,220px)',
          height: 'clamp(200px,26vw,300px)',
          borderRadius: 18,
          overflow: 'hidden',
          zIndex: 5,
          willChange: 'transform, opacity, box-shadow',
          boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
        }}
      >
        <Image src="/about/9.jpg" alt="" fill style={{ objectFit: 'cover' }}
          onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }} />
      </div>

      {/* Wave dots decoration */}
      <div style={{ position: 'absolute', bottom: '-44px', right: '-28px', zIndex: 0, pointerEvents: 'none' }}>
        <WaveDots />
      </div>
    </div>
  );
}

function MissionVision() {
  const secRef = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold: 0.08 });
    if (secRef.current) obs.observe(secRef.current);
    return () => obs.disconnect();
  }, []);

  const v = vis;

  return (
    <section
      ref={secRef}
      style={{
        background: '#fff',
        position: 'relative',
        overflow: 'visible',
        padding: 'clamp(60px,8vw,80px) 0 clamp(180px,24vw,220px)',
      }}
    >
      {/* centre dividers */}
      <div className="abt-mv-divider-v" style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: '#E5E7EB', transform: 'translateX(-50%)', pointerEvents: 'none', zIndex: 0 }} />
      <div className="abt-mv-divider-h" style={{ position: 'absolute', left: 0, right: 0, top: '48%', height: 1, background: '#E5E7EB', pointerEvents: 'none', zIndex: 0 }} />

      <div className="abt-container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="abt-mv-container">

          {/* Left Column - Text Content */}
          <div className="abt-mv-left">

            {/* OUR MISSION */}
            <div style={{ marginBottom: '64px' }}>
              <h2
                className={`abt-sh abt-ms${v ? ' abt-in' : ''}`}
                style={{
                  fontFamily: FH,
                  fontWeight: 400,
                  fontSize: 'clamp(28px, 4vw, 54px)',
                  letterSpacing: '-0.03em',
                  color: DARK,
                  lineHeight: '1.2',
                  marginBottom: '24px',
                }}
              >
                OUR <span style={{ color: GREEN, fontWeight: 700 }}>MISSION</span>
              </h2>
              <p
                className={`abt-ms abt-d1${v ? ' abt-in' : ''}`}
                style={{
                  fontFamily: FH,
                  fontSize: 'clamp(14px, 1.5vw, 16px)',
                  lineHeight: '1.7',
                  color: '#252525',
                  maxWidth: '416px',
                }}
              >
                T Purus In In Fames Sit Ac Vitae. Curabitur Scelerisque Nunc Mauris Blandit. Donec Tristique Placerat Consectetur Molestie Est Ornare. Suspendisse Aliquet Semper Quam Volutpat Bibendum Est Mattis. Sed Neque Etiam Morbi A Amet Lacus Phasellus Ipsum Nec.
              </p>
            </div>

            {/* See How Its Work! Callout */}
            <div
              className={`abt-ms abt-d2${v ? ' abt-in' : ''}`}
              style={{
                position: 'relative',
                height: '64px',
                margin: '16px 0 48px 32px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div style={{ position: 'absolute', left: '-36px', top: '5px' }}>
                <Image
                  src="/red-curly-arrow.png"
                  alt=""
                  width={50}
                  height={50}
                  style={{ transform: 'scaleX(-1) rotate(-35deg)', width: '40px', height: 'auto' }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
                />
              </div>
              <span
                style={{
                  fontFamily: FS,
                  fontSize: '26px',
                  color: RED,
                  whiteSpace: 'nowrap',
                  marginLeft: '16px',
                  transform: 'rotate(-3deg)',
                  display: 'inline-block',
                }}
              >
                See How Its Work!
              </span>
            </div>

            {/* OUR VISION */}
            <div>
              <h2
                className={`abt-sh abt-ms abt-d3${v ? ' abt-in' : ''}`}
                style={{
                  fontFamily: FH,
                  fontWeight: 400,
                  fontSize: 'clamp(28px, 4vw, 54px)',
                  letterSpacing: '-0.03em',
                  color: DARK,
                  lineHeight: '1.2',
                  marginBottom: '24px',
                }}
              >
                OUR <span style={{ color: BLUE, fontWeight: 700 }}>VISION</span>
              </h2>
              <p
                className={`abt-ms abt-d4${v ? ' abt-in' : ''}`}
                style={{
                  fontFamily: FH,
                  fontSize: 'clamp(14px, 1.5vw, 16px)',
                  lineHeight: '1.7',
                  color: '#252525',
                  maxWidth: '416px',
                }}
              >
                T Purus In In Fames Sit Ac Vitae. Curabitur Scelerisque Nunc Mauris Blandit. Donec Tristique Placerat Consectetur Molestie Est Ornare. Suspendisse Aliquet Semper Quam Volutpat Bibendum Est Mattis. Sed Neque Etiam Morbi A Amet Lacus Phasellus Ipsum Nec.
              </p>
            </div>

          </div>

          {/* Right Column — Shelf-opener image collage */}
          <div className="abt-mv-right" style={{ overflow: 'visible' }}>
            <ShelfCollage vis={v} />
          </div>

        </div>
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
const BG_WORD = 'BACKGROUND'.split('');

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
    <section style={{ background:'#fff', padding:'60px 30px', overflow:'hidden' }}>
      <div
        ref={cardRef}
        className={`abt-bg-card${v?' abt-bg-in':''}`}
        style={{ background:'#F0F0F0', borderRadius:1000, position:'relative', maxWidth:1080, margin:'0 auto', padding:'80px 0 80px 100px', overflow:'hidden' }}
      >
        {/* ── HEADING: "OUR BACKGROUND" on a single line ── */}
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <span className={`abt-word${v?' abt-in':''}`} style={{ display:'inline-block', fontFamily:FH, fontWeight:500, fontSize:'clamp(27px, 3.5vw, 51px)', color:DARK, lineHeight:'1.2', marginRight:12 }}>
            OUR
          </span>
          <span style={{ display:'inline-block', fontFamily:FH, fontWeight:500, fontSize:'clamp(27px, 3.5vw, 51px)', color:GREEN, lineHeight:'1.2' }}>
            {BG_WORD.map((ch, i) => (
              <span key={i} className={`abt-char${v?' abt-in':''}`} style={{ transitionDelay:`${0.34 + i*0.045}s` }}>{ch}</span>
            ))}
          </span>
          <span className={`abt-uline${v?' abt-in':''}`} style={{ margin:'4px auto 0', maxWidth:'clamp(150px,25vw,255px)' }} />
        </div>

        {/* ── CONTENT GRID ── */}
        <div className="abt-bg-grid" style={{ display:'flex', gap:48, alignItems:'center', position:'relative' }}>

          {/* left text — 2 paragraphs */}
          <div style={{ flex:1, minWidth:0 }}>
            <p className={`abt-bg-body${v?' abt-in':''}`} style={{ fontFamily:FH, fontSize:16, lineHeight:'170%', letterSpacing:'0.01em', textTransform:'capitalize', color:'#252525', marginBottom:36 }}>
              GrowMedLink was founded on the belief that geography should never limit a healthcare professional's ambition. Since 2017 we have helped more than 4 200 nurses and doctors pass international licensing exams and secure placements in top hospitals across the USA, UK, Canada, and Australia.
            </p>
            <p className={`abt-bg-body${v?' abt-in':''}`} style={{ fontFamily:FH, fontSize:16, lineHeight:'170%', letterSpacing:'0.01em', textTransform:'capitalize', color:'#252525', transitionDelay:'0.15s' }}>
              Our faculty are active clinicians and internationally licensed educators who bring real-world experience into every session. We don't just teach syllabi — we teach clinical reasoning, cultural competency, and the resilience needed to thrive in a foreign healthcare system.
            </p>
          </div>

          {/* right — D-shaped image with wipe + Ken Burns + parallax */}
          <div className="abt-bg-par-img" style={{ flexShrink:0, width:'min(563px,45%)', position:'relative' }}>
            <div
              className={`abt-bg-img-wrap${v?' abt-bg-in':''}`}
              style={{ width:'100%', paddingBottom:'84%', borderRadius:'9999px 0 0 9999px', overflow:'hidden', position:'relative', background:'#bbb' }}
            >
              <div className="abt-bg-img-inner">
                <Image src="/about/background-man.png" alt="Our Background" fill style={{ objectFit:'cover' }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.opacity='0'; }} />
              </div>
            </div>

            {/* bracket stack — spring + float (now at bottom-right corner of D-shape image) */}
            <div style={{ position:'absolute', right: 80, bottom: -10, width:180, height:180, pointerEvents:'none' }}>
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
/* ── Horizontal Marquee Brand SVG Fallbacks ── */
function LayersLogo() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, userSelect:'none' }}>
      <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#9e77ed" />
        <path d="M2 17L12 22L22 17M2 12L17 17L22 12" stroke="#9e77ed" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontFamily:FH, fontSize:22, fontWeight:700, color:'#252525', letterSpacing:'-0.02em' }}>Layers</span>
    </div>
  );
}

function SisyphusLogo() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, userSelect:'none' }}>
      <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#12b76a" stroke="#12b76a" strokeWidth={2} strokeLinejoin="round" />
      </svg>
      <span style={{ fontFamily:FH, fontSize:22, fontWeight:700, color:'#252525', letterSpacing:'-0.02em' }}>Sisyphus</span>
    </div>
  );
}

function CircoolesLogo() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, userSelect:'none' }}>
      <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
        <circle cx={9} cy={12} r={6} fill="#1570ef" fillOpacity={0.8} />
        <circle cx={15} cy={12} r={6} fill="#155BA9" fillOpacity={0.8} />
      </svg>
      <span style={{ fontFamily:FH, fontSize:22, fontWeight:700, color:'#252525', letterSpacing:'-0.02em' }}>Circooles</span>
    </div>
  );
}

function CatalogLogo() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, userSelect:'none' }}>
      <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
        <circle cx={12} cy={12} r={10} stroke="#1570ef" strokeWidth={4} />
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22" fill="#1570ef" />
      </svg>
      <span style={{ fontFamily:FH, fontSize:22, fontWeight:700, color:'#252525', letterSpacing:'-0.02em' }}>Catalog</span>
    </div>
  );
}

function QuotientLogo() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, userSelect:'none' }}>
      <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
        <circle cx={11} cy={11} r={8} stroke="#7a5af8" strokeWidth={3} />
        <path d="M16 16L22 22" stroke="#7a5af8" strokeWidth={4} strokeLinecap="round" />
      </svg>
      <span style={{ fontFamily:FH, fontSize:22, fontWeight:700, color:'#252525', letterSpacing:'-0.02em' }}>Quotient</span>
    </div>
  );
}

const BRAND_LOGOS = [
  { name: 'Layers',    src: '/about/logo-layers.png',    width: 110, height: 32 },
  { name: 'Sisyphus',  src: '/about/logo-sisyphus.png',  width: 120, height: 32 },
  { name: 'Circooles', src: '/about/logo-circooles.png', width: 120, height: 32 },
  { name: 'Catalog',   src: '/about/logo-catalog.png',   width: 110, height: 32 },
  { name: 'Quotient',  src: '/about/logo-quotient.png',  width: 125, height: 32 },
];
const MARQUEE_LOGOS = [...BRAND_LOGOS, ...BRAND_LOGOS, ...BRAND_LOGOS, ...BRAND_LOGOS];

function LogoRenderer({ name, src }: { name: string; src: string }) {
  const [useFallback, setUseFallback] = useState(false);

  if (useFallback) {
    if (name === 'Layers') return <LayersLogo />;
    if (name === 'Sisyphus') return <SisyphusLogo />;
    if (name === 'Circooles') return <CircoolesLogo />;
    if (name === 'Catalog') return <CatalogLogo />;
    if (name === 'Quotient') return <QuotientLogo />;
    return <span style={{ fontFamily:FH, fontSize:20, fontWeight:700 }}>{name}</span>;
  }

  return (
    <div style={{ position:'relative', height:32, width: 140, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
      <Image
        src={src}
        alt={name}
        fill
        sizes="140px"
        style={{ objectFit:'contain' }}
        onError={() => setUseFallback(true)}
      />
    </div>
  );
}

/* aspect ratio: 8:5 landscape (width > height) — same on both sizes */
const CARD_SM_W = 'clamp(140px,16vw,200px)';
const CARD_SM_H = 'clamp(87px,10vw,125px)';
const CARD_LG_W = 'clamp(320px,38vw,520px)';
const CARD_LG_H = 'clamp(200px,23.75vw,325px)';
/* circle: roughly 60% of large card width */
const CIRCLE_LG  = 'clamp(180px,22vw,300px)';

function CertHoverCard() {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const cardRef   = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tlRef = useRef<any>(null);

  /* hide circle on mount */
  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      gsap.set(circleRef.current, { scale: 0, opacity: 0 });
    });
  }, []);

  const onEnter = async () => {
    if (hoveredRef.current) return;
    hoveredRef.current = true;
    const { gsap } = await import('gsap');
    if (tlRef.current) tlRef.current.kill();
    const tl = gsap.timeline();
    tlRef.current = tl;

    /* scale card up — same ratio, tilt */
    tl.to(cardRef.current, {
      width: CARD_LG_W,
      height: CARD_LG_H,
      rotation: -8,
      borderRadius: 24,
      boxShadow: '0 28px 72px rgba(0,0,0,0.26)',
      duration: 0.62, ease: 'power3.out',
    }, 0);

    /* green circle blooms from behind bottom-right */
    tl.to(circleRef.current, {
      scale: 1, opacity: 1,
      duration: 0.55, ease: 'back.out(1.3)',
    }, 0.08);
  };

  const onLeave = async () => {
    if (!hoveredRef.current) return;
    hoveredRef.current = false;
    const { gsap } = await import('gsap');
    if (tlRef.current) tlRef.current.kill();
    const tl = gsap.timeline();
    tlRef.current = tl;

    /* circle shrinks first */
    tl.to(circleRef.current, {
      scale: 0, opacity: 0,
      duration: 0.3, ease: 'power2.in',
    }, 0);

    /* card back to small */
    tl.to(cardRef.current, {
      width: CARD_SM_W,
      height: CARD_SM_H,
      rotation: 0,
      borderRadius: 14,
      boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
      duration: 0.48, ease: 'power3.inOut',
    }, 0.06);
  };

  return (
    /* outer wrapper reserves space so surrounding layout never jumps */
    <div
      ref={wrapRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `calc(${CARD_LG_W} + 100px)`,
        height: `calc(${CARD_LG_H} + 120px)`,
        cursor: 'default',
      }}
    >
      {/* green circle — bottom-right of card, hidden by default */}
      <div
        ref={circleRef}
        style={{
          position: 'absolute',
          width: CIRCLE_LG,
          height: CIRCLE_LG,
          borderRadius: '50%',
          background: GREEN,
          bottom: 'clamp(-40px,-4vw,-20px)',
          right: 'clamp(-40px,-4vw,-20px)',
          zIndex: 1,
          willChange: 'transform, opacity',
          pointerEvents: 'none',
          transformOrigin: 'center center',
        }}
      />

      {/* photo card */}
      <div
        ref={cardRef}
        style={{
          position: 'relative',
          zIndex: 2,
          width: CARD_SM_W,
          height: CARD_SM_H,
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
          background: '#ddd',
          willChange: 'transform, width, height, box-shadow, border-radius',
          flexShrink: 0,
          transformOrigin: 'center center',
        }}
      >
        <Image
          src="/about/4.jpg"
          alt="Trusted Partner"
          fill
          sizes="(max-width:640px) 180px, (max-width:1024px) 300px, 400px"
          style={{ objectFit: 'cover', objectPosition: 'top center' }}
          onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
        />
      </div>
    </div>
  );
}

function CertificationSection() {
  const rh = useReveal();
  const sunburstRef = useRef<HTMLDivElement>(null);
  const calloutRef = useRef<HTMLDivElement>(null);
  const [calloutIn, setCalloutIn] = useState(false);

  /* Scroll handler for sunburst rotation */
  useEffect(() => {
    const handleScroll = () => {
      if (sunburstRef.current) {
        const rotation = window.scrollY * 0.15;
        sunburstRef.current.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Trigger reveal for callout */
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setCalloutIn(true);
        obs.disconnect();
      }
    }, { threshold: 0.25 });
    if (calloutRef.current) obs.observe(calloutRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section style={{ background:'#fff', padding:'80px 0 80px', overflow:'hidden' }}>
      <div style={{ maxWidth:1440, margin:'0 auto', padding:'0 40px' }}>

        {/* heading */}
        <div ref={rh} className="abt-rv" style={{ marginBottom:48, textAlign:'center' }}>
          <h2 style={{ fontFamily:FH, fontWeight:400, fontSize:'clamp(28px,4.7vw,68px)', color:DARK, textTransform:'uppercase', letterSpacing:'-0.03em' }}>
            CERTIFICATIONS <span style={{ color: GREEN }}>&amp; AFFILIATIONS</span>
          </h2>
        </div>

        {/* Horizontal Infinite Marquee */}
        <div className="abt-mq-h-wrap">
          <div className="abt-mq-h-track">
            {MARQUEE_LOGOS.map((logo, i) => (
              <LogoRenderer key={i} name={logo.name} src={logo.src} />
            ))}
          </div>
        </div>

        {/* Description Paragraph */}
        <div style={{ maxWidth:920, margin:'0 auto 60px', textAlign:'center' }}>
          <p style={{ fontFamily:FH, fontSize:16, lineHeight:'170%', letterSpacing:'0.01em', textTransform:'capitalize', color:'#252525' }}>
            Lorem Ipsum Dolor Sit Amet Consectetur. Purus In In Fames Sit Ac Vitae. Curabitur Scelerisque Nunc Mauris Blandit. Donec Tristique Placerat Consectetur Molestie Est Ornare. Suspendisse Aliquet Semper Quam Volutpat Bibendum Est Mattis. Sed Neque Etiam Morbi A Amet Lacus Phasellus Ipsum Nec.Lorem Ipsum Dolor Sit Amet Consectetur.
          </p>
        </div>

        {/* CENTERPIECE ROTATING SECTION */}
        <div style={{ position:'relative', width:'100%', minHeight:540, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', overflow:'hidden', padding:'40px 0' }}>
          {/* Crosshair lines */}
          <div style={{ position:'absolute', top:'50%', left:0, right:0, height:1, background:'#E5E7EB', pointerEvents:'none', zIndex:0 }} />
          <div style={{ position:'absolute', left:'50%', top:0, bottom:0, width:1, background:'#E5E7EB', pointerEvents:'none', zIndex:0 }} />

          {/* Rotating sunburst */}
          <div
            ref={sunburstRef}
            style={{
              position:'absolute',
              top:'50%',
              left:'50%',
              width:750,
              height:750,
              pointerEvents:'none',
              zIndex:0,
              opacity:0.35,
              transform: 'translate(-50%, -50%)',
              willChange:'transform',
            }}
          >
            <Image src="/light-sunburst.png" alt="" fill style={{ objectFit:'contain' }} />
          </div>

          {/* Centerpiece Image Card & Callout Container */}
          <div ref={calloutRef} style={{ position:'relative', zIndex:10, width:'100%', maxWidth:700, display:'flex', justifyContent:'center', margin:'20px auto 48px' }}>
            
            {/* Faint watermarks */}
            <div style={{
              position: 'absolute',
              bottom: '50%',
              left: 'clamp(-220px, -15vw, -4px)',
              fontFamily: FP,
              fontWeight: 700,
              fontSize: 'clamp(28px, 4vw, 56px)',
              color: '#E5E7EB',
              letterSpacing: '0.25em',
              pointerEvents: 'none',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              opacity: 0.5,
              zIndex: 0,
              transform: 'translateY(50%)'
            }}>
              EXPLORE
            </div>
            
            <div style={{
              position: 'absolute',
              bottom: '50%',
              right: 'clamp(-200px, -14vw, -4px)',
              fontFamily: FP,
              fontWeight: 700,
              fontSize: 'clamp(28px, 4vw, 56px)',
              color: '#E5E7EB',
              letterSpacing: '0.25em',
              pointerEvents: 'none',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              opacity: 0.5,
              zIndex: 0,
              transform: 'translateY(50%)'
            }}>
              MORE !
            </div>

            {/* Centerpiece Image Card — small default, enlarges+tilts on hover */}
            <CertHoverCard />

            {/* Handwritten callout pointing to the photo */}
            <div
              className={`abt-cp-callout${calloutIn ? ' abt-in' : ''}`}
              style={{
                position:'absolute',
                bottom:-65,
                right:'clamp(2%, 8vw, 15%)',
                width:260,
                pointerEvents:'none',
                zIndex:20,
              }}
            >
              {/* Curly Arrow pointing up to the photo */}
              <div style={{ transform: 'rotate(-10deg)', transformOrigin: 'top center', display: 'inline-block' }}>
                <Image
                  src="/red-curly-arrow.png"
                  alt=""
                  width={64}
                  height={64}
                  style={{ marginLeft: '40px', width: '56px', height: 'auto' }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
                />
              </div>

              <span
                style={{
                  display:'block',
                  fontFamily: FS,
                  fontSize: 'clamp(26px, 3vw, 32px)',
                  color: RED,
                  lineHeight: '34px',
                  transform: 'rotate(-3deg)',
                  transformOrigin: 'left top',
                  whiteSpace: 'nowrap',
                  marginLeft: '52px',
                  marginTop: '2px',
                }}
              >
                Your Trusted Partner
              </span>
            </div>
          </div>
        </div>

        {/* Avatars at bottom */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12, marginTop:48, position:'relative', zIndex:10 }}>
          <Image src="/avatars-group.png" alt="Trusted Students" width={160} height={32} style={{ height:32, width:'auto' }} />
          <span style={{ fontFamily:FP, fontSize:14, color:DARK, fontWeight:500 }}>1600 + Trusted Students</span>
        </div>

      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   §5  OUR CORE VALUES — pure GSAP spotlight expansion
══════════════════════════════════════════════════════════════════════════ */
function CoreValuesSection() {
  const secRef     = useRef<HTMLDivElement>(null);
  const rowRef     = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const descRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

  const activeRef      = useRef(-1); // -1 = not yet activated
  const isHoveredRef   = useRef(false);
  const pausedRef      = useRef(false);
  const timerRef       = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gsapRef        = useRef<any>(null);
  const revealedRef    = useRef(false);

  const N   = CORE_VALUES.length;
  const GAP = 16;

  /* measure natural height of a desc by cloning off-screen */
  const measureDesc = (desc: HTMLElement, cardWidth?: number): number => {
    const w = cardWidth || desc.closest('div[style]')?.clientWidth || desc.offsetWidth || 300;
    const clone = desc.cloneNode(true) as HTMLElement;
    clone.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;height:auto;overflow:visible;opacity:1;width:${w}px;left:-9999px;top:-9999px`;
    document.body.appendChild(clone);
    const h = clone.offsetHeight;
    document.body.removeChild(clone);
    return Math.ceil(h) || 140;
  };

  /* measure full active-card height for stacked layout */
  const measureCardH = (idx: number): number => {
    const card = cardRefs.current[idx];
    const desc = descRefs.current[idx];
    if (!card) return 280;
    const cw    = card.offsetWidth || 300;
    const style = getComputedStyle(card);
    const padV  = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    const padH  = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    const innerW = cw - padH;
    const icon  = iconRefs.current[idx];
    const iconH = icon ? (icon.offsetHeight + parseFloat(getComputedStyle(icon).marginBottom)) : 74;
    const titleEl = card.querySelector('h3') as HTMLElement | null;
    const titleH  = titleEl ? titleEl.offsetHeight : 36;
    const dh      = desc ? measureDesc(desc, innerW) : 0;
    return Math.ceil(padV + iconH + titleH + 20 + dh + 12);
  };

  const getSizes = () => {
    const row    = rowRef.current;
    const vw     = window.innerWidth;
    const totalW = row ? row.offsetWidth : vw;
    const stacked = vw <= 1023;

    if (stacked) {
      const hInact = vw <= 767 ? 104 : 124;
      return { stacked: true, totalW, hInact, desktopActive: 0, desktopInactive: 0, desktopH: 0 };
    }
    const dActive   = Math.round(totalW * 0.52);
    const dInactive = Math.round((totalW - dActive - GAP * (N - 1)) / (N - 1));
    const dH        = Math.round(Math.max(340, vw * 0.26));
    return { stacked: false, totalW, hInact: dH, desktopActive: dActive, desktopInactive: dInactive, desktopH: dH };
  };

  /* instant snap — used on resize and first reveal */
  const applySnap = (idx: number, g: any) => {
    const s   = getSizes();
    const row = rowRef.current;
    if (!row) return;
    row.style.flexDirection = s.stacked ? 'column' : 'row';

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const isAct = i === idx;
      const desc  = descRefs.current[i];

      const cw = s.stacked ? s.totalW : (isAct ? s.desktopActive : s.desktopInactive);
      const cardStyle = card ? getComputedStyle(card) : null;
      const padH = cardStyle ? (parseFloat(cardStyle.paddingLeft) + parseFloat(cardStyle.paddingRight)) : 0;
      const innerW = Math.max(60, cw - padH);

      if (s.stacked) {
        const h = isAct ? measureCardH(i) : s.hInact;
        g.set(card, { width: '100%', height: h, flex: 'none', overflow: 'hidden' });
        if (desc) g.set(desc, { height: isAct ? measureDesc(desc, innerW) : 0, opacity: isAct ? 1 : 0, y: 0, overflow: 'hidden' });
      } else {
        g.set(card, { width: cw, height: s.desktopH, flex: 'none', overflow: 'hidden' });
        if (desc) g.set(desc, { height: isAct ? measureDesc(desc, innerW) : 0, opacity: isAct ? 1 : 0, y: 0, overflow: 'hidden' });
      }
    });
  };

  /* animated transition */
  const goTo = (idx: number, g: any) => {
    if (idx === activeRef.current) return;
    activeRef.current = idx;
    const s   = getSizes();
    const row = rowRef.current;
    if (!row) return;
    row.style.flexDirection = s.stacked ? 'column' : 'row';

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const isAct = i === idx;
      const desc  = descRefs.current[i];
      const cw    = s.stacked ? s.totalW : (isAct ? s.desktopActive : s.desktopInactive);
      const cardStyle = getComputedStyle(card);
      const padH  = parseFloat(cardStyle.paddingLeft) + parseFloat(cardStyle.paddingRight);
      const innerW = Math.max(60, cw - padH);

      if (s.stacked) {
        const h = isAct ? measureCardH(i) : s.hInact;
        g.to(card, { width: '100%', height: h, flex: 'none', overflow: 'hidden', duration: 0.6, ease: 'power3.inOut' });
        if (desc) {
          if (isAct) {
            g.to(desc, { height: measureDesc(desc, innerW), opacity: 1, y: 0, overflow: 'hidden', duration: 0.38, ease: 'power2.out', delay: 0.12 });
          } else {
            g.to(desc, { height: 0, opacity: 0, y: 4, overflow: 'hidden', duration: 0.2, ease: 'power2.in' });
          }
        }
      } else {
        g.to(card, { width: cw, height: s.desktopH, flex: 'none', overflow: 'hidden', duration: 0.7, ease: 'power3.inOut' });
        if (desc) {
          if (isAct) {
            g.to(desc, { height: measureDesc(desc, innerW), opacity: 1, y: 0, overflow: 'hidden', duration: 0.38, ease: 'power2.out', delay: 0.18 });
          } else {
            g.to(desc, { height: 0, opacity: 0, y: 6, overflow: 'hidden', duration: 0.22, ease: 'power2.in' });
          }
        }
      }

      const icon = iconRefs.current[i];
      if (icon && isAct) {
        g.fromTo(icon,
          { rotation: 0, scale: 1 },
          { rotation: 360, scale: 1.15, duration: 0.5, ease: 'back.out(1.6)',
            onComplete: () => g.to(icon, { scale: 1, duration: 0.18, ease: 'power2.out' }) }
        );
      }
    });
  };

  useEffect(() => {
    let cancelled = false;
    import('gsap').then(({ gsap }) => {
      if (cancelled) return;
      gsapRef.current = gsap;

      /* initial state: cards hidden, descs collapsed */
      descRefs.current.forEach(d => { if (d) gsap.set(d, { height: 0, opacity: 0, overflow: 'hidden' }); });
      cardRefs.current.forEach(c => { if (c) gsap.set(c, { opacity: 0, y: 44, scale: 0.95 }); });

      const obs = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting || revealedRef.current) return;
        obs.disconnect();
        revealedRef.current = true;

        gsap.to(cardRefs.current, {
          y: 0, opacity: 1, scale: 1, duration: 0.62, ease: 'power3.out', stagger: 0.1,
          onComplete: () => {
            /* let browser paint before measuring */
            requestAnimationFrame(() => requestAnimationFrame(() => {
              activeRef.current = -1;
              goTo(0, gsap);
            }));
          },
        });
      }, { threshold: 0.1 });
      if (secRef.current) obs.observe(secRef.current);

      /* auto-rotate — starts 4 s after first activation */
      timerRef.current = setInterval(() => {
        if (isHoveredRef.current || pausedRef.current || !revealedRef.current || activeRef.current < 0) return;
        goTo((activeRef.current + 1) % N, gsap);
      }, 4000);

      const onResize = () => {
        if (!revealedRef.current || activeRef.current < 0) return;
        applySnap(activeRef.current, gsap);
      };
      window.addEventListener('resize', onResize, { passive: true });
      return () => window.removeEventListener('resize', onResize);
    });

    return () => {
      cancelled = true;
      if (timerRef.current) clearInterval(timerRef.current);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* reveal vis for heading CSS animation */
  useEffect(() => {
    const sec = secRef.current;
    if (!sec) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(sec);
    return () => obs.disconnect();
  }, []);

  const handleCardClick = (idx: number) => {
    const g = gsapRef.current;
    if (!g || !revealedRef.current) return;
    goTo(idx, g);
    pausedRef.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => { pausedRef.current = false; }, 6000);
  };

  return (
    <section style={{ background: '#fff', padding: 'clamp(48px,6vw,80px) clamp(16px,4vw,48px) clamp(56px,7vw,96px)' }} ref={secRef}>
      <div style={{ maxWidth: 1440, margin: '0 auto' }}>

        <div className={`abt-rv${vis ? ' abt-in' : ''}`} style={{ textAlign: 'center', marginBottom: 'clamp(28px,4vw,52px)' }}>
          <p style={{ fontFamily: FH, fontSize: 'clamp(14px,1.4vw,18px)', lineHeight: '169%', letterSpacing: '0.01em', textTransform: 'capitalize', color: '#000', maxWidth: 900, margin: '0 auto 20px' }}>
            Purus in in fames sit ac vitae. Curabitur scelerisque nunc mauris blandit. Donec tristique placerat consectetur molestie est ornare. Suspendisse aliquet semper quam volutpat bibendum est mattis.
          </p>
          <h2 style={{ fontFamily: FH, fontWeight: 400, fontSize: 'clamp(32px,4.7vw,68px)', color: DARK, textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
            OUR <span style={{ color: GREEN }}>CORE VALUES</span>
          </h2>
        </div>

        {/* Card row — GSAP controls widths/heights; flex is just a scaffold */}
        <div
          ref={rowRef}
          onMouseEnter={() => { isHoveredRef.current = true; }}
          onMouseLeave={() => { isHoveredRef.current = false; }}
          style={{
            display: 'flex',
            gap: GAP,
            alignItems: 'stretch',
            width: '100%',
          }}
        >
          {CORE_VALUES.map((v_, i) => (
            <div
              key={i}
              ref={el => { cardRefs.current[i] = el; }}
              onClick={() => handleCardClick(i)}
              style={{
                background: v_.bg,
                borderRadius: 'clamp(12px,1.2vw,18px)',
                padding: 'clamp(22px,2.8vw,40px) clamp(18px,2.2vw,36px)',
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                /* GSAP takes over width+height after reveal */
                flex: '1 1 0%',
                willChange: 'transform, width, height, opacity',
                boxShadow: '0 4px 28px rgba(0,0,0,0.13)',
              }}
            >
              {/* icon */}
              <div
                ref={el => { iconRefs.current[i] = el; }}
                style={{
                  width: 'clamp(42px,4.5vw,60px)',
                  height: 'clamp(42px,4.5vw,60px)',
                  borderRadius: '50%',
                  border: '4px solid rgba(255,255,255,0.85)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'clamp(16px,2vw,28px)',
                  willChange: 'transform',
                  flexShrink: 0,
                }}
              >
                <svg width={22} height={22} viewBox="0 0 36 36" fill="none">
                  <circle cx={18} cy={18} r={14} stroke="rgba(255,255,255,0.4)" strokeWidth={3} />
                  <path d="M18 4 A14 14 0 0 1 32 18" stroke="#fff" strokeWidth={3} strokeLinecap="round" />
                </svg>
              </div>

              {/* title */}
              <h3 style={{
                fontFamily: FM,
                fontSize: 'clamp(20px,2.2vw,30px)',
                fontWeight: 500,
                color: '#fff',
                lineHeight: 1.2,
                whiteSpace: 'pre-line',
                marginBottom: 0,
                flexShrink: 0,
              }}>
                {v_.title}
              </h3>

              {/* description — GSAP controls height + opacity */}
              <div ref={el => { descRefs.current[i] = el; }} style={{ overflow: 'hidden' }}>
                <p style={{
                  fontFamily: FH,
                  fontSize: 'clamp(13px,1.15vw,17px)',
                  lineHeight: '1.72',
                  color: 'rgba(255,255,255,0.92)',
                  marginTop: 'clamp(12px,1.4vw,20px)',
                  maxWidth: 460,
                }}>
                  {v_.desc}
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
   §6  FACES BEHIND THE BRAND — responsive orbit carousel
══════════════════════════════════════════════════════════════════════════ */

/*
  Responsive slot sizes as fractions of viewport width:
    center:  clamp(120px, 15vw, 176px)
    rank-1:  clamp( 84px, 10vw, 124px)
    rank-2:  clamp( 52px,  7vw,  88px)

  Horizontal offsets as % of orbit width so spacing scales with container:
    rank-1: ±25%   rank-2: ±44%
*/
function TeamSection() {
  const rh = useReveal();
  const n = TEAM.length;
  const [activeIdx, setActiveIdx]   = useState(0);
  const [displayIdx, setDisplayIdx] = useState(0);
  const [textKey, setTextKey]       = useState(0);
  const [isPaused, setIsPaused]     = useState(false);
  const resumeTimer = useRef<NodeJS.Timeout | null>(null);

  /* slot sizes calculated from live vw so they stay fluid */
  const getSlotSize = (rank: number): number => {
    if (typeof window === 'undefined') return [176, 124, 88][rank] ?? 52;
    const vw = window.innerWidth;
    const sizes = [
      Math.round(Math.min(Math.max(vw * 0.15, 110), 176)),
      Math.round(Math.min(Math.max(vw * 0.105, 78), 124)),
      Math.round(Math.min(Math.max(vw * 0.072, 50), 88)),
    ];
    return sizes[rank] ?? sizes[sizes.length - 1];
  };

  /* x-offset as % of "50%" so it scales with any container width */
  const RANK_OFFSET_PCT = [0, 25, 44]; // percent of half-width
  const SLOT_OPACITY    = [1, 0.80, 0.48];

  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(() => setActiveIdx(prev => (prev + 1) % n), 4000);
    return () => clearInterval(t);
  }, [isPaused, n]);

  useEffect(() => {
    const t = setTimeout(() => { setDisplayIdx(activeIdx); setTextKey(k => k + 1); }, 200);
    return () => clearTimeout(t);
  }, [activeIdx]);

  const handleClick = (idx: number) => {
    if (idx === activeIdx) return;
    setActiveIdx(idx);
    setIsPaused(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setIsPaused(false), 5000);
  };

  useEffect(() => () => { if (resumeTimer.current) clearTimeout(resumeTimer.current); }, []);

  const member    = TEAM[displayIdx];
  const nameParts = member.name.replace(/^(Dr\.|Ms\.|Mr\.)\s*/, '').split(' ');
  const nameFirst = nameParts.slice(0, -1).join(' ') || nameParts[0];
  const nameLast  = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

  return (
    <section style={{ background: '#fff', padding: 'clamp(48px,6vw,80px) clamp(16px,4vw,40px) clamp(56px,7vw,88px)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>

        {/* Heading */}
        <div ref={rh} className="abt-rv" style={{ marginBottom: 'clamp(28px,4vw,48px)' }}>
          <h2 style={{ fontFamily: FH, fontWeight: 400, fontSize: 'clamp(26px,3.8vw,54px)', color: DARK, marginBottom: 'clamp(12px,1.5vw,20px)', lineHeight: 1.2 }}>
            The Faces <span style={{ color: GREEN }}>Behind The Brand</span>
          </h2>
          <p style={{ fontFamily: FH, fontSize: 'clamp(13px,1.2vw,16px)', lineHeight: '169%', letterSpacing: '0.01em', textTransform: 'capitalize', color: '#555', maxWidth: 680, margin: '0 auto' }}>
            T Purus In In Fames Sit Ac Vitae. Curabitur Scelerisque Nunc Mauris Blandit. Donec Tristique
            Placerat Consectetur Molestie Est Ornare. Suspendisse Aliquet Semper Quam Volutpat Bibendum
            Est Mattis. Sed Neque Etiam Morbi A Amet Lacus Phasellus Ipsum Nec.
          </p>
        </div>

        {/* Orbit */}
        <div
          className="abt-tc-wrap"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            if (resumeTimer.current) clearTimeout(resumeTimer.current);
            resumeTimer.current = setTimeout(() => setIsPaused(false), 1200);
          }}
        >
          <div className="abt-tc-orbit">
            {TEAM.map((m, i) => {
              let dist = ((i - activeIdx) % n + n) % n;
              if (dist > n / 2) dist -= n;
              const absDist  = Math.abs(dist);
              /* show at most 2 slots each side of center */
              const visible  = absDist <= 2;
              const rank     = Math.min(absDist, 2);
              const size     = getSlotSize(rank);
              const opacity  = visible ? SLOT_OPACITY[rank] : 0;
              const sign     = dist === 0 ? 0 : dist > 0 ? 1 : -1;
              const pct      = RANK_OFFSET_PCT[rank]; // rank is already clamped to 0-2
              const xLeft    = `calc(50% + ${sign * pct}%)`;
              const zIndex   = visible ? 10 - absDist * 2 : -1;
              const isCenter = dist === 0;

              return (
                <div
                  key={i}
                  className="abt-tc-slot"
                  onClick={() => handleClick(i)}
                  style={{
                    left: xLeft,
                    opacity,
                    zIndex,
                    pointerEvents: visible ? 'auto' : 'none',
                  }}
                >
                  <div
                    className={`abt-tc-img ${isCenter ? 'abt-tc-img-active' : 'abt-tc-img-inactive'}`}
                    style={{ width: size, height: size }}
                  >
                    <Image
                      src={m.photo}
                      alt={m.name}
                      fill
                      sizes="(max-width:640px) 30vw, (max-width:1024px) 20vw, 176px"
                      style={{
                        objectFit: 'cover',
                        filter: isCenter ? 'none' : 'grayscale(65%)',
                        transition: 'filter 0.72s ease',
                      }}
                      onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
                    />
                    {/* Initials fallback */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: `linear-gradient(135deg,${m.grad[0]},${m.grad[1]})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      zIndex: -1,
                    }}>
                      <span style={{ fontFamily: FM, fontSize: size * 0.22, fontWeight: 700, color: '#fff' }}>{m.initials}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail panel — key forces remount for fade animation */}
          <div
            key={textKey}
            className="abt-tc-detail"
            style={{ animation: 'abt-tc-fadein 0.42s cubic-bezier(0.25,1,0.22,1) both' }}
          >
            <p style={{ fontFamily: FH, fontWeight: 700, fontSize: 'clamp(20px,2.4vw,34px)', color: DARK, lineHeight: 1.25, marginBottom: 'clamp(4px,0.5vw,8px)' }}>
              {nameFirst}{nameLast ? <> <span style={{ color: GREEN }}>{nameLast}</span></> : null}
            </p>
            <p style={{ fontFamily: FH, fontSize: 'clamp(12px,1.1vw,15px)', color: '#9F9F9F', fontWeight: 400, letterSpacing: '0.06em', marginBottom: 'clamp(12px,1.5vw,20px)', textTransform: 'uppercase' }}>
              {member.role}
            </p>
            <p style={{ fontFamily: FH, fontSize: 'clamp(13px,1.1vw,16px)', lineHeight: '1.72', color: '#444', margin: '0 auto', textAlign: 'center' }}>
              {member.bio}
            </p>
          </div>

          {/* Progress dots */}
          <div className="abt-tc-dots">
            {TEAM.map((_, i) => (
              <div
                key={i}
                className={`abt-tc-dot${activeIdx === i ? ' abt-tc-dot-active' : ''}`}
                onClick={() => handleClick(i)}
              />
            ))}
          </div>
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