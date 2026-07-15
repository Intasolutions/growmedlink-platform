'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Plus, X, Star, Check, MessageSquare } from 'lucide-react';
import gsap from 'gsap';
import CropUploader from '@/components/CropUploader';
import { IMedia } from '@intelligen/types';

interface ReviewItem {
  _id: string;
  studentName: string;
  studentImage?: string;
  rating: number;
  comment: string;
  service?: string | null;
  date?: string;
  createdAt: string;
}

const FALLBACK: ReviewItem[] = [
  { _id:'f1', studentName:'Bruce Wayne',      studentImage:'', rating:5, comment:'GrowMedLink was instrumental in my transition to study nursing abroad. The guidance is top-notch and cleared up all my doubts about the registry requirements!',      service:'Immigration Consultation', createdAt: new Date('2025-12-25T10:10:00Z').toISOString() },
];

const AUTO_MS = 6000;

const STYLES = `
  /* ── Keyframes ── */
  @keyframes rvs-dot-ring {
    0%   { box-shadow: 0 0 0 0px rgba(150,202,69,0.7); }
    70%  { box-shadow: 0 0 0 7px rgba(150,202,69,0);   }
    100% { box-shadow: 0 0 0 0px rgba(150,202,69,0);   }
  }
  @keyframes rvs-glow-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(150,202,69,0.0), inset 0 0 0 1px rgba(150,202,69,0.09); }
    50%       { box-shadow: 0 0 18px 4px rgba(150,202,69,0.12), inset 0 0 0 1px rgba(150,202,69,0.22); }
  }
  @keyframes rvs-map-float {
    0%, 100% { transform: translateY(0px) scale(1); }
    50%       { transform: translateY(-5px) scale(1.06); }
  }
  @keyframes rvs-pct-count {
    from { opacity: 0; transform: translateY(8px) scale(0.85); }
    to   { opacity: 1; transform: translateY(0)   scale(1);    }
  }
  @keyframes rvs-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }

  /* ── Section shell ── */
  .rvs-section { background: #fff; padding: clamp(24px,4vw,40px) 0 clamp(40px,6vw,60px); }
  .rvs-section .rvs-outer {
    max-width: 1200px; margin: 0 auto;
    padding: 0 clamp(12px,3vw,24px); position: relative;
  }

  /* ── Wave dots ── */
  .rvs-section .rvs-dots { position: relative; height: clamp(26px,3.5vw,38px); margin-bottom: 6px; }
  .rvs-section .rvs-dot {
    position: absolute;
    width: clamp(6px,1vw,9px); height: clamp(6px,1vw,9px);
    border-radius: 50%; background: #96CA45;
    animation: rvs-dot-ring 2.2s ease-out infinite;
  }
  .rvs-section .rvs-dot:nth-child(1)  { animation-delay: 0.00s; }
  .rvs-section .rvs-dot:nth-child(2)  { animation-delay: 0.22s; }
  .rvs-section .rvs-dot:nth-child(3)  { animation-delay: 0.44s; }
  .rvs-section .rvs-dot:nth-child(4)  { animation-delay: 0.66s; }
  .rvs-section .rvs-dot:nth-child(5)  { animation-delay: 0.88s; }
  .rvs-section .rvs-dot:nth-child(6)  { animation-delay: 1.10s; }
  .rvs-section .rvs-dot:nth-child(7)  { animation-delay: 1.32s; }
  .rvs-section .rvs-dot:nth-child(8)  { animation-delay: 1.54s; }
  .rvs-section .rvs-dot:nth-child(9)  { animation-delay: 1.76s; }
  .rvs-section .rvs-dot:nth-child(10) { animation-delay: 1.98s; }

  /* ── Two-column grid ── */
  .rvs-section .rvs-grid {
    display: grid;
    grid-template-columns: 38fr 62fr;
    gap: clamp(12px,2vw,20px);
    align-items: start;
  }

  /* ══════════════════════════════════════
     LEFT panel
  ══════════════════════════════════════ */
  .rvs-section .rvs-left {
    height: clamp(320px,45vw,500px);
    background: #1e1e1e;
    border-radius: clamp(10px,1.5vw,16px);
    position: relative; overflow: hidden;
    display: flex; flex-direction: column; justify-content: space-between;
    /* subtle green inner rim that pulses */
    animation: rvs-glow-pulse 4s ease-in-out infinite;
  }
  /* decorative corner sparkle lines */
  .rvs-section .rvs-left::before,
  .rvs-section .rvs-left::after {
    content: '';
    position: absolute;
    width: 80px; height: 80px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(150,202,69,0.12) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .rvs-section .rvs-left::before { top: -20px; left: -20px; }
  .rvs-section .rvs-left::after  { bottom: -20px; right: -20px; }

  /* ── 2×2 card grid ── */
  .rvs-section .rvs-country-grid {
    flex: 1; display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(6px,1vw,12px);
    padding: clamp(14px,2.2vw,24px) clamp(14px,2.2vw,24px) clamp(8px,1.2vw,12px);
    position: relative; z-index: 1;
  }

  /* individual country card */
  .rvs-section .rvs-ccard {
    background: rgba(255,255,255,0.055);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: clamp(8px,1vw,12px);
    padding: clamp(10px,1.5vw,18px) clamp(8px,1.2vw,14px);
    display: flex; flex-direction: column; align-items: center; justify-content: space-between;
    gap: clamp(5px,0.7vw,9px);
    cursor: default;
    position: relative; overflow: hidden;
    /* base transition for hover */
    transition:
      background    0.3s ease,
      border-color  0.3s ease,
      transform     0.3s cubic-bezier(.22,.68,0,1.2),
      box-shadow    0.3s ease;
  }

  /* shimmer sweep on hover */
  .rvs-section .rvs-ccard::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(
      105deg,
      transparent 30%,
      rgba(150,202,69,0.10) 50%,
      transparent 70%
    );
    background-size: 200% 100%;
    background-position: -200% center;
    transition: background-position 0s;
    pointer-events: none;
  }
  .rvs-section .rvs-ccard:hover::before {
    animation: rvs-shimmer 0.65s ease forwards;
  }

  .rvs-section .rvs-ccard:hover {
    background:    rgba(150,202,69,0.10);
    border-color:  rgba(150,202,69,0.35);
    transform:     translateY(-4px) scale(1.02);
    box-shadow:    0 12px 28px rgba(0,0,0,0.25), 0 0 0 1px rgba(150,202,69,0.2);
  }

  /* map image wrapper */
  .rvs-section .rvs-ccard-map {
    width: clamp(38px,5.5vw,60px); height: clamp(38px,5.5vw,60px);
    position: relative; flex-shrink: 0;
    /* idle gentle float */
    animation: rvs-map-float 4s ease-in-out infinite;
    /* stagger each card's float so they don't sync */
    will-change: transform;
  }
  .rvs-section .rvs-ccard:nth-child(2) .rvs-ccard-map { animation-delay: 1s;   }
  .rvs-section .rvs-ccard:nth-child(3) .rvs-ccard-map { animation-delay: 0.5s; }
  .rvs-section .rvs-ccard:nth-child(4) .rvs-ccard-map { animation-delay: 1.5s; }
  /* pause float on hover so the card's lift transform isn't fighting it */
  .rvs-section .rvs-ccard:hover .rvs-ccard-map { animation-play-state: paused; }

  /* country label */
  .rvs-section .rvs-ccard-name {
    font-family:'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size: clamp(10px,0.85vw,12px); font-weight: 600;
    color: rgba(255,255,255,0.65);
    text-align: center; letter-spacing: 0.03em; line-height: 1.2;
    transition: color 0.25s;
  }
  .rvs-section .rvs-ccard:hover .rvs-ccard-name { color: rgba(255,255,255,0.95); }

  /* percentage number */
  .rvs-section .rvs-ccard-pct {
    font-family:'Haffer VF-TRIAL','Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size: clamp(20px,2.8vw,38px); font-weight: 500; color: #96CA45;
    letter-spacing: -0.02em; line-height: 1;
    transition: transform 0.25s cubic-bezier(.22,.68,0,1.2), text-shadow 0.25s;
  }
  .rvs-section .rvs-ccard:hover .rvs-ccard-pct {
    transform: scale(1.08);
    text-shadow: 0 0 18px rgba(150,202,69,0.5);
  }

  /* GSAP entrance: cards start invisible */
  .rvs-section .rvs-ccard.rvs-ccard-hidden {
    opacity: 0; transform: translateY(22px) scale(0.92);
  }

  /* ── Left footer ── */
  .rvs-section .rvs-left-footer {
    padding: clamp(12px,2vw,20px) clamp(16px,3vw,28px);
    border-top: 1px solid rgba(255,255,255,0.07);
    text-align: center; position: relative; z-index: 1;
  }
  .rvs-section .rvs-connect {
    font-family:'Haffer XH Mono-TRIAL','Courier New',monospace;
    font-size: clamp(10px,1vw,13px); font-weight:500;
    color: rgba(255,255,255,0.45); letter-spacing:0.09em; text-transform: uppercase;
    margin-bottom: 3px;
  }
  .rvs-section .rvs-community {
    font-family:'Great Day Personal Use','Brush Script MT',cursive;
    font-size: clamp(15px,1.7vw,21px); font-weight:400; color:#96CA45;
  }

  /* ══════════════════════════════════════
     RIGHT panel
  ══════════════════════════════════════ */
  .rvs-section .rvs-right {
    height: clamp(320px,45vw,500px);
    background: #F0F0F0; border-radius: clamp(10px,1.5vw,16px);
    position: relative; overflow: hidden;
  }
  .rvs-section .rvs-heading {
    position: absolute; top: clamp(14px,2.2vw,22px);
    left: 50%; transform: translateX(calc(-50% - 15px));
    font-family:'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size: clamp(28px,4.2vw,56px); font-weight:400;
    line-height: 1.22; letter-spacing: -0.03em;
    color: #252525; white-space: nowrap;
  }
  .rvs-section .rvs-heading-green { color: #96CA45; }
  .rvs-section .rvs-hw { display: inline-block; }

  .rvs-section .rvs-carousel-row {
    position: absolute;
    left: clamp(16px,3.5vw,45px); top: clamp(80px,10vw,115px); right: clamp(12px,2vw,24px);
    display: flex; align-items: center; gap: clamp(10px,1.5vw,20px);
  }

  /* review card */
  .rvs-section .rvs-card {
    width: 100%; height: clamp(240px,27vw,350px);
    background: #155BA9; border-radius: clamp(8px,1vw,12px);
    position: relative; overflow: hidden;
    will-change: transform;
  }
  .rvs-section .rvs-deco {
    position: absolute; left: clamp(14px,2.5vw,30px); top: 0;
    display: flex; gap: clamp(6px,0.8vw,9px);
  }
  .rvs-section .rvs-deco-strip {
    width: clamp(22px,3vw,40px); height: clamp(70px,8.5vw,100px);
    border-radius: 0 0 6px 6px;
  }
  .rvs-section .rvs-deco-white { background: #fff; }
  .rvs-section .rvs-deco-green { background: #96CA45; }
  .rvs-section .rvs-avatar {
    position: absolute; left: clamp(14px,2.8vw,35px); top: clamp(46px,5.5vw,65px);
    width: clamp(52px,6.5vw,80px); height: clamp(52px,6.5vw,80px);
    border-radius: 50%; background: #fff; box-shadow: 0 -6px 8px rgba(0,0,0,0.12);
    overflow: hidden; z-index: 2;
    display: flex; align-items: center; justify-content: center;
  }
  .rvs-section .rvs-text {
    position: absolute;
    right: clamp(12px,2vw,25px); top: clamp(46px,5.5vw,65px);
    width: clamp(140px,20vw,280px); height: clamp(110px,14vw,190px);
    overflow: hidden;
    font-family:'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size: clamp(11px,1.1vw,13.5px); font-weight:400; line-height:165%;
    letter-spacing:0.01em; text-transform:capitalize;
    color:#fff; text-align:right; padding-right:4px;
  }
  .rvs-section .rvs-name {
    position: absolute; left: clamp(14px,2.5vw,30px); top: clamp(112px,13.5vw,160px);
    font-family:'Great Day Personal Use','Brush Script MT',cursive;
    font-size: clamp(15px,1.6vw,20px); font-weight:400; color:#96CA45;
  }
  .rvs-section .rvs-role {
    position: absolute; left: clamp(14px,2.5vw,30px); top: clamp(133px,15.8vw,188px);
    font-family:'Haffer VF-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size: clamp(11px,1.1vw,14px); color:#fff;
    max-width: clamp(110px,13vw,170px); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
  }
  .rvs-section .rvs-date {
    position: absolute; left: clamp(14px,2.5vw,30px); bottom: clamp(14px,2.2vw,30px);
    font-family:'Haffer VF-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size: clamp(10px,1.1vw,14px); color: rgba(255,255,255,0.6);
  }
  .rvs-section .rvs-time {
    position: absolute; right: clamp(12px,2vw,25px); bottom: clamp(14px,2.2vw,30px);
    font-family:'Haffer VF-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size: clamp(10px,1.1vw,14px); text-align:right; color: rgba(255,255,255,0.6);
  }

  .rvs-section .rvs-indicator { display:flex; flex-direction:column; align-items:flex-end; gap:clamp(8px,1vw,12px); flex-shrink:0; }
  .rvs-section .rvs-bar { border-radius:6px; cursor:pointer; transition: opacity 0.2s; }
  .rvs-section .rvs-bar:hover { opacity: 0.65; }

  .rvs-section .rvs-write-btn { position: absolute; right: clamp(14px,2vw,24px); top: clamp(28px,3.5vw,40px); z-index: 10; }

  .rvs-glass {
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(0,0,0,0.08);
    box-shadow: 0 24px 60px rgba(0,0,0,0.15);
  }

  /* ══════════════════════════════════════
     RESPONSIVE
  ══════════════════════════════════════ */

  /* ── Tablet 768–1023px ── */
  @media (max-width: 1023px) {
    .rvs-section .rvs-grid { grid-template-columns: 1fr; }
    .rvs-section .rvs-left { height: auto; min-height: clamp(280px,48vw,400px); }
    .rvs-section .rvs-right { height: auto; overflow: visible; padding: clamp(20px,3.5vw,36px) clamp(16px,3vw,28px) clamp(28px,5vw,44px); }
    .rvs-section .rvs-heading { position: relative; top: auto; left: auto; transform: none; font-size: clamp(32px,5.5vw,52px); line-height: 1.15; text-align: center; display: block; margin-bottom: clamp(20px,3vw,32px); white-space: normal; }
    .rvs-section .rvs-carousel-row { position: relative; top: auto; left: auto; right: auto; justify-content: center; }
    .rvs-section .rvs-card { height: clamp(260px,36vw,360px); }
    .rvs-section .rvs-write-btn { position: relative; right: auto; top: auto; margin-bottom: 16px; display: inline-flex; }
    .rvs-section .rvs-indicator { flex-direction: row; align-items: center; gap: 10px; }
  }

  /* desktop: show desktop card, hide mobile card */
  @media (min-width: 768px) {
    .rvs-section .rvs-card-desktop { display: block; }
    .rvs-section .rvs-card-mobile  { display: none; }
  }

  /* ── Mobile card (clean flex layout, no absolute children) ── */
  .rvs-section .rvs-card-mobile {
    background: #155BA9; border-radius: 12px; overflow: hidden;
    display: none; flex-direction: column; width: 100%; box-sizing: border-box;
    will-change: transform;
  }
  .rvs-section .rvs-card-mobile .mob-deco { display: flex; gap: 8px; padding-left: 16px; }
  .rvs-section .rvs-card-mobile .mob-strip { width: 28px; height: 68px; border-radius: 0 0 6px 6px; }
  .rvs-section .rvs-card-mobile .mob-top { display: flex; align-items: flex-start; gap: 12px; padding: 12px 16px 0; }
  .rvs-section .rvs-card-mobile .mob-avatar { width: 50px; height: 50px; border-radius: 50%; background: #fff; overflow: hidden; flex-shrink: 0; display: flex; align-items: center; justify-content: center; box-shadow: 0 -4px 8px rgba(0,0,0,0.12); }
  .rvs-section .rvs-card-mobile .mob-comment { font-family:'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif; font-size: 12px; line-height: 1.6; color: #fff; flex: 1; }
  .rvs-section .rvs-card-mobile .mob-name { font-family:'Great Day Personal Use','Brush Script MT',cursive; font-size: 16px; color: #96CA45; padding: 10px 16px 0; display: block; }
  .rvs-section .rvs-card-mobile .mob-role { font-family:'Haffer VF-TRIAL','Helvetica Neue',Arial,sans-serif; font-size: 11px; color: #fff; padding: 2px 16px 0; display: block; }
  .rvs-section .rvs-card-mobile .mob-footer { display: flex; padding: 10px 16px 14px; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 10px; }
  .rvs-section .rvs-card-mobile .mob-date { font-family:'Haffer VF-TRIAL','Helvetica Neue',Arial,sans-serif; font-size: 10px; color: rgba(255,255,255,0.6); }

  /* ── Mobile ≤ 767px ── */
  @media (max-width: 767px) {
    .rvs-section .rvs-outer { padding: 0 12px; }
    .rvs-section .rvs-write-btn { position: relative !important; right: auto !important; top: auto !important; margin-bottom: 12px !important; display: inline-flex !important; }
    .rvs-section .rvs-left { height: auto !important; min-height: 0 !important; }
    .rvs-section .rvs-country-grid { gap: 8px !important; padding: 14px 14px 8px !important; }
    .rvs-section .rvs-ccard { padding: 10px 8px !important; gap: 6px !important; }
    .rvs-section .rvs-ccard-map { width: 40px !important; height: 40px !important; }
    .rvs-section .rvs-ccard-pct { font-size: 22px !important; }
    .rvs-section .rvs-ccard-name { font-size: 10px !important; }
    .rvs-section .rvs-right { height: auto !important; overflow: visible !important; padding: 18px 14px 20px !important; }
    .rvs-section .rvs-heading { position: relative !important; top: auto !important; left: auto !important; transform: none !important; font-size: 26px !important; white-space: normal !important; text-align: center !important; display: block !important; margin-bottom: 14px !important; }
    .rvs-section .rvs-carousel-row { position: relative !important; top: auto !important; left: auto !important; right: auto !important; flex-direction: column !important; gap: 12px !important; width: 100% !important; align-items: stretch !important; }
    .rvs-section .rvs-indicator { flex-direction: row !important; justify-content: center !important; align-items: center !important; gap: 8px !important; }
    /* hide desktop card, show mobile card */
    .rvs-section .rvs-card-desktop { display: none !important; }
    .rvs-section .rvs-card-mobile  { display: flex !important; }
  }

  /* ── Tiny ≤ 359px ── */
  @media (max-width: 359px) {
    .rvs-section .rvs-outer { padding: 0 10px; }
    .rvs-section .rvs-heading { font-size: 22px !important; }
    .rvs-section .rvs-ccard-pct { font-size: 18px !important; }
    .rvs-section .rvs-ccard-map { width: 32px !important; height: 32px !important; }
  }
`;

const HERO_COUNTRIES = [
  { name: 'Australia',  mapSrc: '/australia-map.png',     percentage: 54 },
  { name: 'India',      mapSrc: '/india-map.png',         percentage: 28 },
  { name: 'S. America', mapSrc: '/south-america-map.png', percentage: 25 },
  { name: 'Africa',     mapSrc: '/africa-map.png',        percentage: 12 },
];
const GREEN_TINT = 'brightness(0) saturate(100%) invert(68%) sepia(60%) saturate(500%) hue-rotate(40deg) brightness(110%)';

export default function ReviewsSection({ initialReviews = [] }: { initialReviews?: ReviewItem[] }) {
  const [reviews, setReviews]           = useState<ReviewItem[]>(initialReviews);
  const [activeIdx, setActiveIdx]       = useState(0);
  const timerRef                        = useRef<ReturnType<typeof setInterval> | null>(null);

  /* refs for GSAP */
  const sectionRef   = useRef<HTMLDivElement>(null);
  const leftRef      = useRef<HTMLDivElement>(null);
  const rightRef     = useRef<HTMLDivElement>(null);
  const connectRef   = useRef<HTMLParagraphElement>(null);
  const communityRef = useRef<HTMLParagraphElement>(null);
  const hw1Ref       = useRef<HTMLSpanElement>(null);
  const hw2Ref       = useRef<HTMLSpanElement>(null);
  const carouselRef  = useRef<HTMLDivElement>(null);
  const cardClipRef  = useRef<HTMLDivElement>(null);
  const cardRef      = useRef<HTMLDivElement>(null);
  const strip1Ref    = useRef<HTMLDivElement>(null);
  const strip2Ref    = useRef<HTMLDivElement>(null);
  const writeBtnRef  = useRef<HTMLDivElement>(null);
  const dotRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const barRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const ccardRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const triggeredRef = useRef(false);

  /* modal */
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [formData, setFormData]         = useState({ studentName:'', rating:5, comment:'', service:'' });
  const [photoMedia, setPhotoMedia]     = useState<IMedia | null>(null);
  const [hoverRating, setHoverRating]   = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError]   = useState<string | null>(null);

  /* ── fetch reviews ── */
  useEffect(() => {
    if (initialReviews.length > 0) return;
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${base}/api/reviews`).then(r => r.json())
      .then(d => { if (d?.success && d?.data?.length > 0) setReviews(d.data); })
      .catch(() => {});
  }, [initialReviews]);

  const list    = reviews.length > 0 ? reviews : FALLBACK;
  const listLen = list.length;

  /* ── GSAP scroll-triggered entrance ── */
  useEffect(() => {
    const els = {
      left:      leftRef.current,
      right:     rightRef.current,
      connect:   connectRef.current,
      community: communityRef.current,
      hw1:       hw1Ref.current,
      hw2:       hw2Ref.current,
      carousel:  carouselRef.current,
      card:      cardRef.current,
      strip1:    strip1Ref.current,
      strip2:    strip2Ref.current,
      writeBtn:  writeBtnRef.current,
    };
    if (!els.left || !els.right) return;

    /* On mobile skip entrance animation entirely — just show everything */
    if (window.innerWidth < 768) {
      triggeredRef.current = true;
      return;
    }

    gsap.set(els.left,      { opacity: 0, x: -56 });
    gsap.set(els.right,     { opacity: 0, x:  56 });
    gsap.set(els.connect,   { opacity: 0, y: 18 });
    gsap.set(els.community, { opacity: 0, y: 18 });
    gsap.set(els.hw1,       { opacity: 0, y: 34 });
    gsap.set(els.hw2,       { opacity: 0, y: 34 });
    gsap.set(els.carousel,  { opacity: 0, y: 24 });
    gsap.set(els.strip1,    { y: '-110%' });
    gsap.set(els.strip2,    { y: '-110%' });
    gsap.set(els.writeBtn,  { opacity: 0, x: 22 });
    dotRefs.current.forEach((d) => d && gsap.set(d, { scale: 0, opacity: 0, y: 0 }));
    ccardRefs.current.forEach((c) => c && gsap.set(c, { opacity: 0, y: 22, scale: 0.88 }));

    const trigger = () => {
      if (triggeredRef.current) return;
      triggeredRef.current = true;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      /* 1. Both panels slide in */
      tl.to(els.left,  { opacity: 1, x: 0, duration: 0.85 }, 0);
      tl.to(els.right, { opacity: 1, x: 0, duration: 0.85 }, 0.1);

      /* 2. Country cards stagger in */
      tl.to(ccardRefs.current.filter(Boolean), {
        opacity: 1, y: 0, scale: 1,
        duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)',
      }, 0.45);

      /* 3. Left footer text */
      tl.to(els.connect,   { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, 0.75);
      tl.to(els.community, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, 0.90);

      /* 4. Heading words drop in */
      tl.to(els.hw1, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.3)' }, 0.38);
      tl.to(els.hw2, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.3)' }, 0.54);

      /* 5. Carousel row rises */
      tl.to(els.carousel, { opacity: 1, y: 0, duration: 0.65 }, 0.52);

      /* 6. Deco strips drop */
      tl.to(els.strip1, { y: '0%', duration: 0.65 }, 0.72);
      tl.to(els.strip2, { y: '0%', duration: 0.65 }, 0.86);

      /* 7. Write-review button slides in */
      tl.to(els.writeBtn, { opacity: 1, x: 0, duration: 0.5, ease: 'back.out(1.4)' }, 0.6);
      tl.call(() => {
        gsap.to(els.writeBtn, {
          boxShadow: '0 0 0 8px rgba(150,202,69,0)', duration: 1.4,
          ease: 'power2.out', repeat: -1, repeatDelay: 1.4,
        });
      }, [], 2.2);

      /* 7. Dots pop in with stagger then wave loop */
      tl.to(dotRefs.current.filter(Boolean), {
        scale: 1, opacity: 1, duration: 0.4, stagger: 0.055, ease: 'back.out(1.6)',
      }, 0.2);
      tl.call(() => {
        dotRefs.current.forEach((d, i) => {
          if (!d) return;
          gsap.to(d, { y: -8, duration: 1.15, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.14 });
        });
      }, [], 0.9);
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) trigger();
    }, { threshold: 0.01 });

    if (sectionRef.current) io.observe(sectionRef.current);

    /* Fallback: if IO never fires (e.g. section already in view on load), trigger after 400ms */
    const fallback = setTimeout(trigger, 400);

    return () => { io.disconnect(); clearTimeout(fallback); };
  }, []);

  /* ── GSAP carousel: exit up-back, enter from below ── */
  const animateOut = useCallback((onDone: () => void) => {
    const card = cardRef.current;
    /* On mobile there is no desktop card to animate */
    if (!card || window.innerWidth < 768) { onDone(); return; }
    gsap.to(card, {
      y: '-60%', opacity: 0, scale: 0.88,
      duration: 0.38, ease: 'power2.in',
      onComplete: () => {
        gsap.set(card, { y: '70%', scale: 0.92 });
        onDone();
      },
    });
  }, []);

  const animateIn = useCallback(() => {
    const card = cardRef.current;
    if (!card || window.innerWidth < 768) return;
    gsap.to(card, { y: '0%', opacity: 1, scale: 1, duration: 0.48, ease: 'back.out(1.3)' });
  }, []);

  const goTo = useCallback((next: number) => {
    const t = ((next % listLen) + listLen) % listLen;
    if (t === activeIdx) return;
    animateOut(() => { setActiveIdx(t); animateIn(); });
  }, [activeIdx, listLen, animateOut, animateIn]);

  /* ── GSAP indicator bars ── */
  useEffect(() => {
    barRefs.current.forEach((bar, i) => {
      if (!bar) return;
      if (i === activeIdx) {
        gsap.to(bar, { width: 32, height: 3.5, backgroundColor: '#155BA9', duration: 0.35, ease: 'power2.out' });
      } else {
        gsap.to(bar, { width: 22, height: 1.8, backgroundColor: 'rgba(151,151,151,0.34)', duration: 0.35, ease: 'power2.out' });
      }
    });
  }, [activeIdx]);

  /* ── auto-cycle ── */
  const activeIdxRef = useRef(activeIdx);
  useEffect(() => { activeIdxRef.current = activeIdx; }, [activeIdx]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (listLen <= 1) return;
    timerRef.current = setInterval(() => {
      const next = (activeIdxRef.current + 1) % listLen;
      animateOut(() => { setActiveIdx(next); animateIn(); });
    }, AUTO_MS);
  }, [listLen, animateOut, animateIn]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  const handleDot = (i: number) => { goTo(i); resetTimer(); };

  /* modal */
  const openModal = () => {
    setIsModalOpen(true); setSubmitSuccess(false); setSubmitError(null);
    setFormData({ studentName:'', rating:5, comment:'', service:'' });
    setPhotoMedia(null);
  };
  const handleInput = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  };
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault(); setIsSubmitting(true); setSubmitError(null);
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const res  = await fetch(`${base}/api/reviews`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ studentName:formData.studentName.trim(), rating:formData.rating, comment:formData.comment.trim(), service:formData.service||undefined, studentImage: photoMedia?.secureUrl || '' }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Validation failed.');
      setSubmitSuccess(true);
      setTimeout(() => setIsModalOpen(false), 3000);
    } catch (err: any) { setSubmitError(err.message || 'Something went wrong.'); }
    finally { setIsSubmitting(false); }
  };

  const fmtDate = (s: string) => {
    if (!s) return '';
    /* YYYY-MM-DD from date input — parse as local to avoid UTC off-by-one */
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      const [y, m, d] = s.split('-');
      return `${d}/${m}/${y}`;
    }
    try { return new Date(s).toLocaleDateString('en-GB'); } catch { return ''; }
  };
  const getBg   = (n: string) => { const h = n.split('').reduce((a,c)=>a+c.charCodeAt(0),0); return `linear-gradient(135deg,hsl(${h%360},65%,65%),hsl(${(h+60)%360},65%,45%))`; };
  const getInit = (n: string) => n ? n.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase() : 'S';

  const dots = [
    {left:0,top:22},{left:28,top:4},{left:63,top:22},{left:90,top:10},
    {left:118,top:22},{left:139,top:16},{left:170,top:22},{left:196,top:19},
    {left:219,top:22},{left:244,top:22},
  ];

  const rev = list[activeIdx] ?? list[0];

  return (
    <section ref={sectionRef} className="rvs-section relative">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="rvs-outer">

        {/* Write review button */}
        <div ref={writeBtnRef} className="rvs-write-btn">
          <button
            onClick={openModal}
            className="flex items-center gap-2 px-4 py-2 bg-[rgba(150,202,69,1)] text-[#111] font-bold text-xs rounded-lg hover:bg-[rgba(150,202,69,0.9)] transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            Write a Review
          </button>
        </div>

        {/* Green wave dots */}
        <div className="rvs-dots">
          {dots.map((d, i) => (
            <div
              key={i}
              ref={el => { dotRefs.current[i] = el; }}
              className="rvs-dot"
              style={{ left: d.left, top: d.top }}
            />
          ))}
        </div>

        <div className="rvs-grid">

          {/* ═══════ LEFT PANEL — Country cards ═══════ */}
          <div ref={leftRef} className="rvs-left">
            <div className="rvs-country-grid">
              {HERO_COUNTRIES.map((c, i) => (
                <div
                  key={c.name}
                  ref={el => { ccardRefs.current[i] = el; }}
                  className="rvs-ccard"
                >
                  <div className="rvs-ccard-map">
                    <Image
                      src={c.mapSrc}
                      alt={c.name}
                      fill
                      sizes="64px"
                      style={{ objectFit: 'contain', filter: GREEN_TINT }}
                    />
                  </div>
                  <span className="rvs-ccard-name">{c.name}</span>
                  <span className="rvs-ccard-pct">{c.percentage}%</span>
                </div>
              ))}
            </div>
            <div className="rvs-left-footer">
              <p ref={connectRef}   className="rvs-connect">Placing students across</p>
              <p ref={communityRef} className="rvs-community">24+ Countries Worldwide</p>
            </div>
          </div>

          {/* ═══════ RIGHT PANEL ═══════ */}
          <div ref={rightRef} className="rvs-right">

            <h2 className="rvs-heading">
              <span ref={hw1Ref} className="rvs-hw">Students </span>
              <span ref={hw2Ref} className="rvs-hw rvs-heading-green">Reviews</span>
            </h2>

            <div ref={carouselRef} className="rvs-carousel-row">

              {/* ── DESKTOP card (absolute-positioned children) ── */}
              <div ref={cardClipRef} className="rvs-card-desktop" style={{ flex: '1 1 0', minWidth: 0, overflow: 'hidden', borderRadius: 12 }}>
                <div ref={cardRef} className="rvs-card" style={{ width: '100%' }}>
                  <div className="rvs-deco">
                    <div ref={strip1Ref} className="rvs-deco-strip rvs-deco-white" />
                    <div ref={strip2Ref} className="rvs-deco-strip rvs-deco-green" />
                  </div>
                  <div className="rvs-avatar">
                    {rev.studentImage
                      ? <Image src={rev.studentImage} alt={rev.studentName} fill style={{objectFit:'cover'}} onError={e=>{(e.currentTarget as HTMLImageElement).style.visibility='hidden';}} />
                      : <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl" style={{background:getBg(rev.studentName)}}>{getInit(rev.studentName)}</div>
                    }
                  </div>
                  <p className="rvs-text">&quot;{rev.comment}&quot;</p>
                  <div className="rvs-name">{rev.studentName}</div>
                  <div className="rvs-role">{rev.service || 'Verified Student'}</div>
                  <div className="rvs-date">{fmtDate(rev.date || rev.createdAt)}</div>
                </div>
              </div>

              {/* ── MOBILE card (flex column, no absolute children) ── */}
              <div className="rvs-card-mobile">
                <div className="mob-deco">
                  <div className="mob-strip" style={{ background: '#fff' }} />
                  <div className="mob-strip" style={{ background: '#96CA45' }} />
                </div>
                <div className="mob-top">
                  <div className="mob-avatar">
                    {rev.studentImage
                      /* eslint-disable-next-line @next/next/no-img-element */
                      ? <img src={rev.studentImage} alt={rev.studentName} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}} />
                      : <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:16,background:getBg(rev.studentName),borderRadius:'50%'}}>{getInit(rev.studentName)}</div>
                    }
                  </div>
                  <p className="mob-comment">&quot;{rev.comment}&quot;</p>
                </div>
                <span className="mob-name">{rev.studentName}</span>
                <span className="mob-role">{rev.service || 'Verified Student'}</span>
                <div className="mob-footer">
                  <span className="mob-date">{fmtDate(rev.date || rev.createdAt)}</span>
                </div>
              </div>

              {/* Indicator bars */}
              <div className="rvs-indicator">
                {Array.from({length: listLen}, (_, i) => (
                  <div
                    key={i}
                    ref={el => { barRefs.current[i] = el; }}
                    className="rvs-bar"
                    style={{
                      width: i === activeIdx ? 32 : 22,
                      height: i === activeIdx ? 3.5 : 1.8,
                      backgroundColor: i === activeIdx ? '#155BA9' : 'rgba(151,151,151,0.34)',
                      borderRadius: 6,
                    }}
                    onClick={() => handleDot(i)}
                    role="button"
                    aria-label={`Review ${i + 1}`}
                  />
                ))}
              </div>

            </div>
          </div>

        </div>

        {/* ═══════ MODAL ═══════ */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)} />
            <div className="rvs-glass w-full max-w-lg rounded-2xl overflow-hidden relative z-10 flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-[#252525] flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[rgba(150,202,69,1)]" />
                  SHARE YOUR STORY
                </h3>
                <button onClick={() => setIsModalOpen(false)} disabled={isSubmitting} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {submitSuccess ? (
                <div className="p-8 text-center flex flex-col items-center justify-center flex-1">
                  <div className="w-16 h-16 rounded-full bg-[rgba(150,202,69,0.1)] flex items-center justify-center text-[rgba(150,202,69,1)] mb-4 animate-bounce"><Check className="w-8 h-8" /></div>
                  <h4 className="text-2xl font-black text-[#252525] mb-2 uppercase">REVIEW SUBMITTED</h4>
                  <p className="text-gray-500 text-sm max-w-sm">Thank you! Your review is pending administrative approval.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
                  {submitError && <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm">{submitError}</div>}
                  <div>
                    <label htmlFor="studentName" className="block text-sm font-bold text-gray-700 mb-1">Your Name *</label>
                    <input type="text" name="studentName" id="studentName" required value={formData.studentName} onChange={handleInput} placeholder="e.g. Bruce Wayne" disabled={isSubmitting} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[rgba(150,202,69,1)] focus:ring-1 focus:ring-[rgba(150,202,69,1)] text-sm transition-all text-black" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Your Photo <span className="font-normal text-gray-400">(Optional)</span></label>
                    <CropUploader
                      value={photoMedia}
                      onUpload={setPhotoMedia}
                      onClear={() => setPhotoMedia(null)}
                      label="Upload Your Photo"
                      folder="reviews"
                      aspect={1}
                      outputWidth={400}
                      outputHeight={400}
                      publicUpload
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Rating *</label>
                    <div className="flex items-center gap-1.5">
                      {Array.from({length:5},(_,i)=>{
                        const v=i+1, on=hoverRating!==null?v<=hoverRating:v<=formData.rating;
                        return <button type="button" key={i} disabled={isSubmitting} onClick={()=>setFormData(p=>({...p,rating:v}))} onMouseEnter={()=>setHoverRating(v)} onMouseLeave={()=>setHoverRating(null)} className="p-1 focus:outline-none"><Star className={`w-7 h-7 ${on?'fill-[rgba(150,202,69,1)] text-[rgba(150,202,69,1)]':'text-gray-300'}`}/></button>;
                      })}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-sm font-bold text-gray-700 mb-1">Service / Course <span className="font-normal text-gray-400">(Optional)</span></label>
                    <input type="text" name="service" id="service" value={formData.service} onChange={handleInput} disabled={isSubmitting} placeholder="e.g. IELTS Coaching, Student Visa Pathway..." className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[rgba(150,202,69,1)] text-sm bg-white text-black" />
                  </div>
                  <div>
                    <label htmlFor="comment" className="block text-sm font-bold text-gray-700 mb-1">Review Description *</label>
                    <textarea name="comment" id="comment" required rows={4} value={formData.comment} onChange={handleInput} placeholder="Share your experience..." disabled={isSubmitting} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[rgba(150,202,69,1)] text-sm resize-none text-black" />
                    <span className="text-[11px] text-gray-400 block mt-1">Must be at least 10 characters.</span>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                    <button type="button" onClick={()=>setIsModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-sm rounded-lg transition-colors cursor-pointer">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-[rgba(150,202,69,1)] text-[#111] hover:bg-[rgba(150,202,69,0.9)] font-bold text-sm rounded-lg flex items-center gap-2 cursor-pointer shadow-sm transition-colors">
                      {isSubmitting ? 'Submitting…' : 'Submit Review'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
