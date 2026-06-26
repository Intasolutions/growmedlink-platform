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

/* ── core value stagger & spotlight experience ── */
.abt-cv-s {
  opacity: 0;
  transform: translateY(48px);
  transition: opacity 0.65s ease, transform 0.65s cubic-bezier(.22,.68,0,1.2);
}
.abt-cv-s.abt-in { opacity: 1; transform: translateY(0); }

/* Icon spin+pulse animation on card activation */
@keyframes abt-cv-icon-activate {
  0%   { transform: rotate(0deg)   scale(1);    }
  30%  { transform: rotate(180deg) scale(1.18); }
  60%  { transform: rotate(320deg) scale(0.92); }
  80%  { transform: rotate(355deg) scale(1.06); }
  100% { transform: rotate(360deg) scale(1);    }
}
@keyframes abt-cv-icon-idle {
  0%,100% { transform: rotate(0deg)   scale(1);    }
  50%     { transform: rotate(8deg)   scale(1.04); }
}

/* Spotlight row container */
.abt-cv-row {
  display: flex;
  gap: 28px;
  align-items: stretch;
  width: 100%;
  flex-flow: row nowrap;
  transition: all 0.8s cubic-bezier(0.25, 1, 0.22, 1);
}

.abt-cv-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 11px;
  padding: 38px 38px 33px;
  cursor: pointer;
  overflow: hidden;
  transition: flex-grow 0.8s cubic-bezier(0.25, 1, 0.22, 1),
              flex-shrink 0.8s cubic-bezier(0.25, 1, 0.22, 1),
              transform 0.32s cubic-bezier(.22,.68,0,1.2),
              box-shadow 0.32s ease,
              height 0.8s cubic-bezier(0.25, 1, 0.22, 1);
  will-change: flex-grow, flex-shrink, height, transform, box-shadow;
  min-height: 352px;
}

.abt-cv-card.abt-cv-inactive {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0%;
}

.abt-cv-card.abt-cv-active {
  flex-grow: 2.29;
  flex-shrink: 1;
  flex-basis: 0%;
  box-shadow: 0 15px 36px rgba(0,0,0,0.18);
}

.abt-cv-icon-wrap {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 5px solid rgba(255,255,255,0.9);
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: margin-bottom 0.8s cubic-bezier(0.25, 1, 0.22, 1),
              width 0.8s cubic-bezier(0.25, 1, 0.22, 1),
              height 0.8s cubic-bezier(0.25, 1, 0.22, 1);
  overflow: hidden;
}
.abt-cv-icon-wrap svg {
  animation: abt-cv-icon-idle 4s ease-in-out infinite;
  will-change: transform;
}
.abt-cv-card.abt-cv-active .abt-cv-icon-wrap {
  margin-bottom: 30px;
}
.abt-cv-card.abt-cv-active .abt-cv-icon-wrap svg {
  animation: abt-cv-icon-activate 0.75s cubic-bezier(0.34, 1.4, 0.64, 1) both,
             abt-cv-icon-idle 4s ease-in-out 0.75s infinite;
}

.abt-cv-title {
  font-family: 'Haffer XH Mono-TRIAL', 'Courier New', monospace;
  font-size: 27px;
  font-weight: 500;
  color: #fff;
  line-height: 32px;
  white-space: pre-line;
  margin-bottom: 0;
  transition: margin-bottom 0.8s cubic-bezier(0.25, 1, 0.22, 1),
              font-size 0.8s cubic-bezier(0.25, 1, 0.22, 1),
              line-height 0.8s cubic-bezier(0.25, 1, 0.22, 1);
}
.abt-cv-card.abt-cv-active .abt-cv-title {
  margin-top: 0;
  margin-bottom: 15px;
}

.abt-cv-desc-wrap {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transform: translateY(12px);
  transition: opacity 0.5s cubic-bezier(0.25, 1, 0.22, 1),
              max-height 0.6s cubic-bezier(0.25, 1, 0.22, 1),
              transform 0.5s cubic-bezier(0.25, 1, 0.22, 1),
              margin-top 0.5s cubic-bezier(0.25, 1, 0.22, 1);
  will-change: opacity, max-height, transform;
}
.abt-cv-card.abt-cv-active .abt-cv-desc-wrap {
  opacity: 1;
  max-height: 220px;
  transform: translateY(0);
  margin-top: 12px;
  transition: opacity 0.6s cubic-bezier(0.25, 1, 0.22, 1) 0.15s,
              max-height 0.7s cubic-bezier(0.25, 1, 0.22, 1),
              transform 0.6s cubic-bezier(0.25, 1, 0.22, 1) 0.15s,
              margin-top 0.6s cubic-bezier(0.25, 1, 0.22, 1);
}

.abt-cv-desc {
  font-family: 'Haffer XH-TRIAL', 'Helvetica Neue', Arial, sans-serif;
  font-size: 18px;
  line-height: 169%;
  letter-spacing: 0.01em;
  text-transform: capitalize;
  color: #fff;
  max-width: 423px;
  margin-top: 0;
  transition: font-size 0.8s cubic-bezier(0.25, 1, 0.22, 1);
}

@media (max-width: 1023px) {
  .abt-cv-row {
    flex-direction: column !important;
    flex-wrap: nowrap !important;
    gap: 18px !important;
  }
  .abt-cv-card {
    width: 100% !important;
    min-height: unset !important;
    flex-grow: 1 !important;
    flex-shrink: 0 !important;
    flex-basis: auto !important;
    padding: 27px 27px 24px !important;
  }
  .abt-cv-card.abt-cv-inactive {
    height: 135px !important;
  }
  .abt-cv-card.abt-cv-active {
    height: 285px !important;
  }
  .abt-cv-icon-wrap {
    width: 45px;
    height: 45px;
    border-width: 4px;
    margin-bottom: 12px;
  }
  .abt-cv-card.abt-cv-active .abt-cv-icon-wrap {
    margin-bottom: 18px;
  }
  .abt-cv-title {
    font-size: 21px;
    line-height: 25px;
  }
  .abt-cv-desc {
    font-size: 13px;
  }
}
@media (max-width: 767px) {
  .abt-cv-card.abt-cv-inactive {
    height: 120px !important;
  }
  .abt-cv-card.abt-cv-active {
    height: 315px !important;
  }
}

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
  gap: 8%;
  align-items: stretch;
  position: relative;
}
.abt-mv-left {
  flex: 1.1;
  min-width: 0;
  position: relative;
  z-index: 2;
}
.abt-mv-right {
  flex: 0.9;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  z-index: 1;
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
    gap: 60px;
    align-items: center;
  }
  .abt-mv-left {
    width: 100%;
    max-width: 600px;
  }
  .abt-mv-right {
    width: 100%;
    max-width: 460px;
    justify-content: center;
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

/* ── responsive ── */
@media (max-width: 1199px) {
  .abt-arch { height: 340px; }
  .abt-miss-grid { flex-direction: column !important; }
  .abt-bg-grid  { flex-direction: column !important; }
  .abt-team-grid { flex-direction: column !important; }
  .abt-footer-grid { flex-direction: column !important; }
  .abt-footer-r  { display: none !important; }
}
@media (max-width: 1023px) {
  .abt-arch { height: 280px; }
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
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVis(true);
        obs.disconnect();
      }
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
        overflow: 'hidden',
        padding: '80px 0 96px'
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
                  marginBottom: '24px'
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
                  maxWidth: '416px'
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
                alignItems: 'center'
              }}
            >
              {/* Curly arrow pointing down-left from text to OUR VISION */}
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
                  display: 'inline-block'
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
                  marginBottom: '24px'
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
                  maxWidth: '416px'
                }}
              >
                T Purus In In Fames Sit Ac Vitae. Curabitur Scelerisque Nunc Mauris Blandit. Donec Tristique Placerat Consectetur Molestie Est Ornare. Suspendisse Aliquet Semper Quam Volutpat Bibendum Est Mattis. Sed Neque Etiam Morbi A Amet Lacus Phasellus Ipsum Nec.
              </p>
            </div>

          </div>

          {/* Right Column - Large Simulation Image */}
          <div className="abt-mv-right">
            
            {/* Simulation image container with reveal and Ken Burns animations */}
            <div
              className={`abt-ms-img${v ? ' abt-in' : ''}`}
              style={{
                width: '100%',
                maxWidth: '368px',
                height: 'clamp(320px, 36vw, 464px)',
                position: 'relative',
                boxShadow: '0 20px 48px rgba(0,0,0,0.12)',
                borderRadius: 24,
                overflow: 'hidden'
              }}
            >
              <div className="abt-ms-img-inner" style={{ width: '100%', height: '100%', position: 'relative' }}>
                <Image
                  src="/about/14.jpg"
                  alt="Our Mission & Vision"
                  fill
                  style={{ objectFit: 'cover' }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
                />
              </div>
            </div>

            {/* Green Dots Wave at bottom-right corner */}
            <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', zIndex: 0 }}>
              <WaveDots />
            </div>

          </div>

          {/* Central Overlapping Avatars (circle + rounded rect) */}
          <div
            className={`abt-mv-avatars abt-ms abt-d2${v ? ' abt-in' : ''}`}
          >
            {/* Circle Avatar (Left) */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '5px solid #fff',
                boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
                background: '#e0e0e0'
              }}
            >
              <Image
                src="/about/1.jpg"
                alt=""
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>

            {/* Rounded Rect Avatar (Right, overlaps circle) */}
            <div
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                width: '96px',
                height: '96px',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '5px solid #fff',
                boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
                background: '#dcdcdc'
              }}
            >
              <Image
                src="/about/2.jpg"
                alt=""
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
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

            {/* Centerpiece Image Card */}
            <div style={{
              position:'relative',
              zIndex:10,
              width:280,
              height:180,
              borderRadius:20,
              overflow:'hidden',
              background:'linear-gradient(135deg,#155BA9,#0a3d7a)',
              boxShadow:'0 20px 48px rgba(0,0,0,0.18)',
            }}>
              <Image
                src="/about/4.jpg"
                alt="Trusted Partner"
                fill
                sizes="280px"
                style={{ objectFit:'cover' }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
              />
            </div>

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
   §5  OUR CORE VALUES — staggered card reveals
══════════════════════════════════════════════════════════════════════════ */
function CoreValuesSection() {
  const secRef = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [clickPaused, setClickPaused] = useState(false);
  const [allowTransitionDelay, setAllowTransitionDelay] = useState(true);
  const clickResumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (secRef.current) obs.observe(secRef.current);
    return () => obs.disconnect();
  }, []);

  // Clear transition delay after initial stagger completes
  useEffect(() => {
    if (vis) {
      const t = setTimeout(() => {
        setAllowTransitionDelay(false);
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [vis]);

  // Spotlight rotation effect
  useEffect(() => {
    if (isHovered || clickPaused) return;

    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % CORE_VALUES.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isHovered, clickPaused]);

  // Click card handler
  const handleCardClick = (idx: number) => {
    setActiveIdx(idx);
    setClickPaused(true);
    if (clickResumeTimerRef.current) clearTimeout(clickResumeTimerRef.current);
    clickResumeTimerRef.current = setTimeout(() => {
      setClickPaused(false);
    }, 4000);
  };

  // Clean up click resume timer on unmount
  useEffect(() => {
    return () => {
      if (clickResumeTimerRef.current) clearTimeout(clickResumeTimerRef.current);
    };
  }, []);

  return (
    <section style={{ background:'#fff', padding:'60px 30px 72px' }} ref={secRef}>
      <div style={{ maxWidth:1440, margin:'0 auto' }}>

        <div className={`abt-rv${vis?' abt-in':''}`} style={{ textAlign:'center', marginBottom:42 }}>
          <p style={{ fontFamily:FH, fontSize:20, lineHeight:'169%', letterSpacing:'0.01em', textTransform:'capitalize', color:'#000', maxWidth:1361, margin:'0 auto 24px' }}>
            Purus in in fames sit ac vitae. Curabitur scelerisque nunc mauris blandit. Donec tristique placerat consectetur molestie est ornare. Suspendisse aliquet semper quam volutpat bibendum est mattis. Sed neque etiam morbi a amet lacus phasellus ipsum nec.
          </p>
          <h2 className="abt-sh" style={{ fontFamily:FH, fontWeight:400, fontSize:'clamp(36px,4.7vw,68px)', color:DARK, textTransform:'uppercase', lineHeight:'81px' }}>
            OUR <span style={{ color:GREEN }}>CORE VALUES</span>
          </h2>
        </div>

        <div 
          className="abt-cv-row"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {CORE_VALUES.map((v_, i) => {
            const isActive = activeIdx === i;
            return (
              <div
                key={i}
                onClick={() => handleCardClick(i)}
                className={`abt-cv-card abt-cv-s ${isActive ? 'abt-cv-active' : 'abt-cv-inactive'}${vis?' abt-in':''}`}
                style={{
                  background: v_.bg,
                  transitionDelay: (allowTransitionDelay && vis) ? `${i * 0.15}s` : '0s',
                }}
              >
                <div>
                  <div className="abt-cv-icon-wrap">
                    <svg width={27} height={27} viewBox="0 0 36 36" fill="none">
                      <circle cx={18} cy={18} r={14} stroke="rgba(255,255,255,0.4)" strokeWidth={3}/>
                      <path d="M18 4 A14 14 0 0 1 32 18" stroke="#fff" strokeWidth={3} strokeLinecap="round"/>
                    </svg>
                  </div>
                  <h3 className="abt-cv-title">{v_.title}</h3>
                  <div className="abt-cv-desc-wrap">
                    <p className="abt-cv-desc">{v_.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
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