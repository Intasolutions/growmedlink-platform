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

/* ── team vertical scroll strip (kept for reduced-motion) ── */
@keyframes abt-team-up { from { transform:translateY(0); } to { transform:translateY(-50%); } }
.abt-team-strip { animation: abt-team-up 32s linear infinite; }
.abt-team-strip.abt-paused { animation-play-state: paused; }

/* ── Faces Behind the Brand — premium carousel ── */

/* sizes: center=176, +/-1=124, +/-2=80 */
.abt-tc-wrap {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: visible;
  padding: 16px 0 0;
}

/* The orbit row */
.abt-tc-orbit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  position: relative;
  height: 208px;
  width: 100%;
  max-width: 736px;
  margin: 0 auto;
}

/* Each slot in the carousel */
.abt-tc-slot {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: left 0.72s cubic-bezier(0.25,1,0.22,1),
              transform 0.72s cubic-bezier(0.25,1,0.22,1),
              opacity 0.55s ease,
              z-index 0.72s step-end;
  will-change: left, transform, opacity;
  cursor: pointer;
}

/* Avatar circle shell */
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

/* Active ring */
.abt-tc-img-active {
  border: 3px solid #96CA45;
  box-shadow: 0 0 0 5px rgba(150,202,69,0.18), 0 12px 38px rgba(0,0,0,0.16);
}
.abt-tc-img-inactive {
  border: 2px solid rgba(150,202,69,0.25);
  box-shadow: 0 3px 14px rgba(0,0,0,0.10);
}

/* Detail panel below orbit */
.abt-tc-detail {
  text-align: center;
  margin-top: 29px;
  width: 100%;
  max-width: 496px;
}

/* Name fade/slide transition container */
.abt-tc-fade-enter {
  animation: abt-tc-fadein 0.45s cubic-bezier(0.25,1,0.22,1) both;
}
@keyframes abt-tc-fadein {
  from { opacity:0; transform: translateY(14px); }
  to   { opacity:1; transform: translateY(0);    }
}

/* Dot progress indicators */
.abt-tc-dots {
  display: flex;
  gap: 6px;
  justify-content: center;
  margin-top: 22px;
}
.abt-tc-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #D0D5DD;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease, width 0.35s ease;
}
.abt-tc-dot.abt-tc-dot-active {
  background: #96CA45;
  width: 19px;
  border-radius: 4px;
}

/* Social icon buttons */
.abt-tc-social {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 16px;
}
.abt-tc-soc-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid #D0D5DD;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.25s ease, background 0.25s ease, transform 0.25s ease;
  background: transparent;
  text-decoration: none;
}
.abt-tc-soc-btn:hover {
  border-color: #96CA45;
  background: rgba(150,202,69,0.10);
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 900px) {
  .abt-tc-orbit { height: 168px; max-width: 560px; }
}
@media (max-width: 640px) {
  .abt-tc-orbit { height: 144px; max-width: 100%; }
  .abt-tc-detail { padding: 0 16px; }
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

function CertHoverCard() {
  const cardRef   = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tlRef = useRef<any>(null);

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      /* default state — small, straight */
      gsap.set(cardRef.current,   { width: 160, height: 104, rotation: 0, scale: 1, transformOrigin: 'center center' });
      gsap.set(circleRef.current, { scale: 0.55, opacity: 0.7, x: 30, y: 20 });
    });
  }, []);

  const onEnter = async () => {
    if (hoveredRef.current) return;
    hoveredRef.current = true;
    const { gsap } = await import('gsap');
    if (tlRef.current) tlRef.current.kill();
    const tl = gsap.timeline();
    tlRef.current = tl;
    /* enlarge card with tilt */
    tl.to(cardRef.current, {
      width: 'clamp(260px,32vw,380px)',
      height: 'clamp(340px,42vw,500px)',
      rotation: -8,
      scale: 1,
      boxShadow: '0 32px 80px rgba(0,0,0,0.28)',
      duration: 0.65, ease: 'power3.out',
    }, 0);
    /* green circle blooms behind card */
    tl.to(circleRef.current, {
      scale: 1, opacity: 1, x: 60, y: -20,
      duration: 0.65, ease: 'power3.out',
    }, 0);
  };

  const onLeave = async () => {
    if (!hoveredRef.current) return;
    hoveredRef.current = false;
    const { gsap } = await import('gsap');
    if (tlRef.current) tlRef.current.kill();
    const tl = gsap.timeline();
    tlRef.current = tl;
    tl.to(cardRef.current, {
      width: 160, height: 104, rotation: 0,
      boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
      duration: 0.5, ease: 'power3.inOut',
    }, 0);
    tl.to(circleRef.current, {
      scale: 0.55, opacity: 0.7, x: 30, y: 20,
      duration: 0.5, ease: 'power3.inOut',
    }, 0);
  };

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        /* reserve enough room so the enlarged card doesn't shift layout */
        width: 'clamp(300px,38vw,440px)',
        height: 'clamp(380px,48vw,560px)',
        cursor: 'default',
      }}
    >
      {/* green blob circle — sits behind card */}
      <div
        ref={circleRef}
        style={{
          position: 'absolute',
          width: 'clamp(200px,26vw,320px)',
          height: 'clamp(200px,26vw,320px)',
          borderRadius: '50%',
          background: GREEN,
          zIndex: 1,
          willChange: 'transform, opacity',
          pointerEvents: 'none',
        }}
      />

      {/* photo card */}
      <div
        ref={cardRef}
        style={{
          position: 'relative',
          zIndex: 2,
          width: 160,
          height: 104,
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
          background: '#ddd',
          willChange: 'transform, width, height, box-shadow',
          flexShrink: 0,
        }}
      >
        <Image
          src="/about/4.jpg"
          alt="Trusted Partner"
          fill
          sizes="(max-width:768px) 260px, 380px"
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
   §6  FACES BEHIND THE BRAND — premium circular carousel
══════════════════════════════════════════════════════════════════════════ */

/* Slot sizes (px) per distance from center */
const SLOT_SIZES   = [176, 124, 80];   // index 0 = center, 1 = ±1, 2 = ±2  (–20%)
const SLOT_OPACITY = [1, 0.82, 0.55];
// Horizontal centres relative to orbit midpoint (px)
const SLOT_X = [0, 184, 328]; // ±distance for rank 1, rank 2  (–20%)

function TeamSection() {
  const rh = useReveal();
  const n = TEAM.length;
  const [activeIdx, setActiveIdx] = useState(0);
  const [displayIdx, setDisplayIdx] = useState(0);
  const [textKey, setTextKey] = useState(0);   // forces re-mount for fade animation
  const [isPaused, setIsPaused] = useState(false);
  const resumeTimer = useRef<NodeJS.Timeout | null>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  /* Auto-rotate */
  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % n);
    }, 4000);
    return () => clearInterval(t);
  }, [isPaused, n]);

  /* When activeIdx changes, update displayIdx after brief delay for text */
  useEffect(() => {
    const t = setTimeout(() => {
      setDisplayIdx(activeIdx);
      setTextKey(k => k + 1);
    }, 200);
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

  const member = TEAM[displayIdx];
  // Split name into first + rest for two-color treatment
  const nameParts = member.name.replace(/^(Dr\.|Ms\.|Mr\.)\s*/, '').split(' ');
  const nameFirst = nameParts.slice(0, -1).join(' ') || nameParts[0];
  const nameLast  = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

  return (
    <section style={{ background:'#fff', padding:'64px 32px 77px' }}>
      <div style={{ maxWidth:896, margin:'0 auto', textAlign:'center' }}>

        {/* Heading */}
        <div ref={rh} className="abt-rv" style={{ marginBottom:38 }}>
          <h2 className="abt-sh" style={{ fontFamily:FH, fontWeight:400, fontSize:'clamp(26px,3.8vw,54px)', color:DARK, marginBottom:16 }}>
            The Faces <span style={{ color:GREEN }}>Behind The Brand</span>
          </h2>
          <p style={{ fontFamily:FH, fontSize:'clamp(11px,1.0vw,14px)', lineHeight:'169%', letterSpacing:'0.01em', textTransform:'capitalize', color:'#444', maxWidth:688, margin:'0 auto' }}>
            T Purus In In Fames Sit Ac Vitae. Curabitur Scelerisque Nunc Mauris Blandit. Donec Tristique
            Placerat Consectetur Molestie Est Ornare. Suspendisse Aliquet Semper Quam Volutpat Bibendum
            Est Mattis. Sed Neque Etiam Morbi A Amet Lacus Phasellus Ipsum Nec.
          </p>
        </div>

        {/* Carousel orbit */}
        <div
          className="abt-tc-wrap"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            if (resumeTimer.current) clearTimeout(resumeTimer.current);
            resumeTimer.current = setTimeout(() => setIsPaused(false), 1200);
          }}
        >
          <div className="abt-tc-orbit" ref={orbitRef}>
            {TEAM.map((m, i) => {
              // Compute signed distance from active (wraps around)
              let dist = ((i - activeIdx) % n + n) % n;
              if (dist > n / 2) dist -= n; // range: -n/2 .. n/2
              const absDist = Math.abs(dist);
              const rank = Math.min(absDist, SLOT_SIZES.length - 1);
              const size = SLOT_SIZES[rank];
              const opacity = absDist >= SLOT_SIZES.length ? 0 : SLOT_OPACITY[rank];
              const xOffset = dist === 0 ? 0 : (dist > 0 ? 1 : -1) * (SLOT_X[Math.min(absDist, SLOT_X.length - 1)]);
              const zIndex = 10 - absDist * 2;
              const isCenter = dist === 0;

              return (
                <div
                  key={i}
                  className="abt-tc-slot"
                  onClick={() => handleClick(i)}
                  style={{
                    left: `calc(50% + ${xOffset}px)`,
                    transform: `translateX(-50%)`,
                    opacity,
                    zIndex: absDist >= SLOT_SIZES.length ? -1 : zIndex,
                    pointerEvents: opacity === 0 ? 'none' : 'auto',
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
                      sizes={`${SLOT_SIZES[0]}px`}
                      style={{
                        objectFit: 'cover',
                        filter: isCenter ? 'none' : 'grayscale(60%)',
                        transition: 'filter 0.72s ease',
                      }}
                      onError={e => {
                        // fallback gradient with initials
                        const el = e.currentTarget as HTMLImageElement;
                        el.style.opacity = '0';
                      }}
                    />
                    {/* Initials fallback overlay */}
                    <div style={{
                      position:'absolute', inset:0,
                      background:`linear-gradient(135deg,${m.grad[0]},${m.grad[1]})`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      zIndex:-1,
                    }}>
                      <span style={{ fontFamily:FM, fontSize: size * 0.22, fontWeight:700, color:'#fff' }}>{m.initials}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail panel — re-keyed on textKey so React remounts it for fade-in animation */}
          <div className="abt-tc-detail" style={{ animation:'abt-tc-fadein 0.45s cubic-bezier(0.25,1,0.22,1) both', animationDelay:'0s' }} data-key={textKey}>
            {/* Name */}
            <p style={{ fontFamily:FH, fontWeight:700, fontSize:'clamp(22px,2.5vw,36px)', color:DARK, lineHeight:'1.25', marginBottom:6 }}>
              {nameFirst}{nameLast ? <span> <span style={{ color:GREEN }}>{nameLast}</span></span> : null}
            </p>
            {/* Role */}
            <p style={{ fontFamily:FH, fontSize:'clamp(13px,1.1vw,16px)', color:'#9F9F9F', fontWeight:400, letterSpacing:'0.03em', marginBottom:18, textTransform:'uppercase' }}>
              {member.role}
            </p>
            {/* Bio */}
            <p style={{ fontFamily:FH, fontSize:'clamp(13px,1.1vw,16px)', lineHeight:'1.7', color:'#444', maxWidth:580, margin:'0 auto 0', textAlign:'center' }}>
              {member.bio}
            </p>

            {/* Social icons */}
            <div className="abt-tc-social">
              {/* Instagram */}
              <a href={member.social.ig} className="abt-tc-soc-btn" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <rect x={2} y={2} width={20} height={20} rx={5}/><circle cx={12} cy={12} r={4}/><circle cx={17.5} cy={6.5} r={0.1} strokeWidth={3}/>
                </svg>
              </a>
              {/* Facebook */}
              <a href={member.social.fb} className="abt-tc-soc-btn" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              {/* X / Twitter */}
              <a href={member.social.tw} className="abt-tc-soc-btn" aria-label="X" target="_blank" rel="noopener noreferrer">
                <svg width={18} height={18} viewBox="0 0 24 24" fill={DARK}>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
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