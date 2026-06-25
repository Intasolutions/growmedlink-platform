'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Plus, X, Star, Check, MessageSquare } from 'lucide-react';

interface ReviewItem {
  _id: string;
  studentName: string;
  studentImage?: string;
  rating: number;
  comment: string;
  service?: { _id: string; title: string; category: string } | null;
  createdAt: string;
}

const FALLBACK: ReviewItem[] = [
  { _id:'f1', studentName:'Bruce Wayne',      studentImage:'', rating:5, comment:'GrowMedLink was instrumental in my transition to study nursing abroad. The guidance is top-notch and cleared up all my doubts about the registry requirements!',                  service:{ _id:'1', title:'Immigration Consultation', category:'Immigration' }, createdAt: new Date('2025-12-25T10:10:00Z').toISOString() },
  { _id:'f2', studentName:'Diana Prince',     studentImage:'', rating:5, comment:'The IELTS preparation course here is excellent. The trainers are incredibly supportive, and the mock tests gave me the exact confidence I needed. Highly recommended!',              service:{ _id:'2', title:'IELTS Coaching',            category:'Language'    }, createdAt: new Date('2025-11-18T14:30:00Z').toISOString() },
  { _id:'f3', studentName:'Clark Kent',       studentImage:'', rating:5, comment:'Fantastic experience working with the immigration experts. They handled my documentation process smoothly and kept me updated at every stage.',                                        service:{ _id:'3', title:'Student Visa Pathway',      category:'Immigration' }, createdAt: new Date('2025-10-05T11:45:00Z').toISOString() },
  { _id:'f4', studentName:'Tony Stark',       studentImage:'', rating:4, comment:'Truly the best guidance platform for studying healthcare abroad. They have deep expertise and a very streamlined transition process.',                                                  service:{ _id:'4', title:'OET Exam Prep',             category:'Language'    }, createdAt: new Date('2025-09-22T15:15:00Z').toISOString() },
  { _id:'f5', studentName:'Natasha Romanoff', studentImage:'', rating:5, comment:'Highly professional team that guided me through every step. Their knowledge of international nursing requirements is second to none. Would strongly recommend!',                        service:{ _id:'5', title:'Career Pathway',            category:'Counselling' }, createdAt: new Date('2025-08-10T09:00:00Z').toISOString() },
  { _id:'f6', studentName:'Steve Rogers',     studentImage:'', rating:5, comment:'The entire team at GrowMedLink was incredibly helpful. The process was smooth and stress-free. I am now studying in my dream country thanks to their support!',                         service:{ _id:'6', title:'University Placement',      category:'Education'   }, createdAt: new Date('2025-07-15T16:30:00Z').toISOString() },
  { _id:'f7', studentName:'Wanda Maximoff',   studentImage:'', rating:5, comment:'Outstanding service from start to finish. The counsellors are knowledgeable, patient, and genuinely care about your success. I cannot thank them enough!',                              service:{ _id:'7', title:'Exchange Programme',        category:'Education'   }, createdAt: new Date('2025-06-30T13:00:00Z').toISOString() },
];

const AUTO_MS = 6000;

/* ─── Styles live outside the component so React never re-creates the string ─── */
const STYLES = `
  /* ══════════════════════════════════════════════════════════════════
     KEYFRAMES — all prefixed "rvs-" to avoid any global collision
     @keyframes cannot be scoped to a selector; unique names are the
     only safe solution.
  ══════════════════════════════════════════════════════════════════ */

  /*
    Dot wave: each dot bobs up with a phase offset driven by --rvs-wi.
    We use ONLY translateY here so it composes cleanly with the
    CSS 'scale' property that handles the entrance (no conflict).
  */
  @keyframes rvs-dot-wave {
    0%, 100% { transform: translateY(0px); }
    45%       { transform: translateY(-9px); }
    55%       { transform: translateY(-7px); }
  }

  /* Globe breathing — scale only, no filter (filter causes full repaint) */
  @keyframes rvs-globe-breathe {
    0%, 100% { transform: translateX(-50%) scale(1);    }
    50%       { transform: translateX(-50%) scale(1.04); }
  }

  /* Write-review button glow pulse */
  @keyframes rvs-btn-pulse {
    0%, 100% { box-shadow: 0 0 0 0   rgba(150,202,69,0.5); }
    50%       { box-shadow: 0 0 0 10px rgba(150,202,69,0);   }
  }

  /* Active indicator bar draws from left */
  @keyframes rvs-bar-draw {
    from { transform: scaleX(0.05); opacity: 0.3; }
    to   { transform: scaleX(1);    opacity: 1;   }
  }

  /* Decorative strips slide down */
  @keyframes rvs-strip-slide {
    from { transform: translateY(-110%); }
    to   { transform: translateY(0);     }
  }

  /* ══════════════════════════════════════════════════════════════════
     ALL RULES SCOPED UNDER .rvs-section
     This prevents every selector from leaking into other components.
  ══════════════════════════════════════════════════════════════════ */

  /* ── wrapper ────────────────────────────────────────────────────── */
  .rvs-section { background: #fff; padding: 40px 0 60px; }
  .rvs-section .rvs-outer {
    max-width: 1200px; margin: 0 auto;
    padding: 0 24px; position: relative;
  }

  /* ── green wave dots ─────────────────────────────────────────────
     Entrance: scale 0→1 via the CSS 'scale' property (Level 2 transform).
     Wave:     translateY via @keyframes rvs-dot-wave using 'transform'.
     These two properties compose rather than conflict.
  */
  .rvs-section .rvs-dots { position: relative; height: 38px; margin-bottom: 6px; }
  .rvs-section .rvs-dot {
    position: absolute;
    width: 9px; height: 9px; border-radius: 50%; background: #96CA45;
    opacity: 0;
    scale: 0; /* CSS individual transform — does NOT conflict with animation's transform */
    transition: opacity 0.4s ease, scale 0.45s cubic-bezier(.34,1.56,.64,1);
    /* wave animation: paused until dot appears */
    animation: rvs-dot-wave 2.3s ease-in-out infinite;
    animation-delay: calc(var(--rvs-wi, 0) * 0.14s);
    animation-play-state: paused;
  }
  .rvs-section .rvs-dot.rvs-dot-in {
    opacity: 1; scale: 1;
    animation-play-state: running;
  }

  /* ── grid ────────────────────────────────────────────────────────── */
  .rvs-section .rvs-grid {
    display: grid;
    grid-template-columns: 460fr 740fr;
    gap: 20px; align-items: start;
  }

  /* ── left panel ──────────────────────────────────────────────────── */
  .rvs-section .rvs-left {
    height: 500px; background: #252525; border-radius: 12px;
    position: relative; overflow: hidden;
    opacity: 0; translate: -48px 0;
    transition: opacity 0.85s ease, translate 0.85s cubic-bezier(.22,.68,0,1.05);
  }
  .rvs-section .rvs-left.rvs-in { opacity: 1; translate: 0 0; }

  .rvs-section .rvs-globe-wrap {
    position: absolute; left: 50%; top: 35px;
    transform: translateX(-50%);
    width: 330px; height: 330px;
  }
  /* Breathing starts after entrance — delay 1s */
  .rvs-section .rvs-left.rvs-in .rvs-globe-wrap {
    animation: rvs-globe-breathe 5s ease-in-out infinite 1s;
  }

  .rvs-section .rvs-left-footer {
    position: absolute; bottom: 35px; left: 0; right: 0; text-align: center;
  }
  .rvs-section .rvs-connect,
  .rvs-section .rvs-community {
    opacity: 0; translate: 0 18px;
    transition: opacity 0.6s ease, translate 0.6s cubic-bezier(.22,.68,0,1.1);
  }
  .rvs-section .rvs-left.rvs-in .rvs-connect  { opacity:1; translate:0 0; transition-delay:0.72s; }
  .rvs-section .rvs-left.rvs-in .rvs-community{ opacity:1; translate:0 0; transition-delay:0.9s;  }
  .rvs-section .rvs-connect {
    font-family:'Haffer XH Mono-TRIAL','Courier New',monospace;
    font-size:16px; font-weight:500; line-height:20px;
    color:#fff; letter-spacing:0.04em; margin-bottom:8px;
  }
  .rvs-section .rvs-community {
    font-family:'Great Day Bold Personal Use','Brush Script MT',cursive;
    font-size:19px; font-weight:400; line-height:18px; color:#96CA45;
  }

  /* ── right panel ─────────────────────────────────────────────────── */
  .rvs-section .rvs-right {
    height: 500px; background: #F0F0F0; border-radius: 12px;
    position: relative; overflow: hidden;
    opacity: 0; translate: 48px 0;
    transition: opacity 0.85s ease 0.1s, translate 0.85s cubic-bezier(.22,.68,0,1.05) 0.1s;
  }
  .rvs-section .rvs-right.rvs-in { opacity: 1; translate: 0 0; }

  /* ── heading – word-by-word slide ───────────────────────────────── */
  .rvs-section .rvs-heading {
    position: absolute; top: 22px;
    left: 50%; transform: translateX(calc(-50% - 15px));
    font-family:'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size: 56px; font-weight: 400; line-height: 68px; letter-spacing: -0.03em;
    color: #252525; white-space: nowrap;
  }
  .rvs-section .rvs-heading-green { color: #96CA45; }
  .rvs-section .rvs-hw {
    display: inline-block; opacity: 0; translate: 0 32px;
    transition: opacity 0.65s ease var(--rvs-hwd,0.3s),
                translate 0.65s cubic-bezier(.22,.68,0,1.3) var(--rvs-hwd,0.3s);
  }
  .rvs-section .rvs-hw.rvs-hw-in { opacity: 1; translate: 0 0; }

  /* ── carousel row ────────────────────────────────────────────────── */
  .rvs-section .rvs-carousel-row {
    position: absolute; left: 45px; top: 115px; right: 24px;
    display: flex; align-items: center; gap: 20px;
    opacity: 0; translate: 0 22px;
    transition: opacity 0.7s ease 0.52s, translate 0.7s cubic-bezier(.22,.68,0,1.2) 0.52s;
  }
  .rvs-section .rvs-carousel-row.rvs-in { opacity: 1; translate: 0 0; }

  /* ── blue review card ────────────────────────────────────────────── */
  .rvs-section .rvs-card {
    width: 530px; height: 350px; flex-shrink: 0;
    background: #155BA9; border-radius: 12px;
    position: relative; overflow: hidden;
    opacity: 1; transform: translateY(0) scale(1);
    transition: opacity 0.32s ease, transform 0.32s cubic-bezier(.22,.68,0,1.1);
  }
  .rvs-section .rvs-card.rvs-card-hidden {
    opacity: 0; transform: translateY(12px) scale(0.975);
  }

  /* Decorative strips */
  .rvs-section .rvs-deco { position: absolute; left: 30px; top: 0; display: flex; gap: 9px; }
  .rvs-section .rvs-deco-strip { width: 40px; height: 100px; border-radius: 0 0 6px 6px; transform: translateY(-110%); }
  .rvs-section .rvs-carousel-row.rvs-in .rvs-deco-strip:nth-child(1) { animation: rvs-strip-slide 0.7s cubic-bezier(.22,.68,0,1.2) 0.72s both; }
  .rvs-section .rvs-carousel-row.rvs-in .rvs-deco-strip:nth-child(2) { animation: rvs-strip-slide 0.7s cubic-bezier(.22,.68,0,1.2) 0.88s both; }
  .rvs-section .rvs-deco-white { background: #fff; }
  .rvs-section .rvs-deco-green { background: #96CA45; }

  /* Avatar */
  .rvs-section .rvs-avatar {
    position: absolute; left: 35px; top: 65px;
    width: 80px; height: 80px; border-radius: 50%;
    background: #fff; box-shadow: 0 -6px 8px rgba(0,0,0,0.12);
    overflow: hidden; z-index: 2;
    display: flex; align-items: center; justify-content: center;
  }

  /* Review text */
  .rvs-section .rvs-text {
    position: absolute; right: 25px; top: 65px;
    width: 280px; height: 190px; overflow-y: auto;
    font-family:'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size: 13.5px; font-weight: 400; line-height: 165%;
    letter-spacing: 0.01em; text-transform: capitalize;
    color: #fff; text-align: right; padding-right: 4px;
  }
  .rvs-section .rvs-text::-webkit-scrollbar { width: 3px; }
  .rvs-section .rvs-text::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }

  /* Card meta */
  .rvs-section .rvs-name {
    position: absolute; left: 30px; top: 160px;
    font-family:'Great Day Bold Personal Use','Brush Script MT',cursive;
    font-size: 20px; font-weight: 400; line-height: 20px; color: #96CA45;
  }
  .rvs-section .rvs-role {
    position: absolute; left: 30px; top: 188px;
    font-family:'Haffer VF-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size: 14px; color: #fff;
    max-width: 170px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .rvs-section .rvs-date {
    position: absolute; left: 30px; bottom: 30px;
    font-family:'Haffer VF-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size: 14px; color: rgba(255,255,255,0.6);
  }
  .rvs-section .rvs-time {
    position: absolute; right: 25px; bottom: 30px;
    font-family:'Haffer VF-TRIAL','Helvetica Neue',Arial,sans-serif;
    font-size: 14px; text-align: right; color: rgba(255,255,255,0.6);
  }

  /* ── indicator ───────────────────────────────────────────────────── */
  .rvs-section .rvs-indicator { display:flex; flex-direction:column; align-items:flex-end; gap:12px; flex-shrink:0; }
  .rvs-section .rvs-bar { border-radius:6px; cursor:pointer; transition: width .35s ease, height .35s ease, background .35s ease; }
  .rvs-section .rvs-bar:hover { opacity: 0.7; }
  .rvs-section .rvs-bar-active {
    width: 32px; height: 3.5px; background: #155BA9;
    transform-origin: left center;
    animation: rvs-bar-draw 0.4s cubic-bezier(.22,.68,0,1.2) both;
  }
  .rvs-section .rvs-bar-inactive { width: 22px; height: 1.8px; background: rgba(151,151,151,0.34); }

  /* ── write-review button ─────────────────────────────────────────── */
  .rvs-section .rvs-write-btn {
    position: absolute; right: 24px; top: 40px; z-index: 10;
    opacity: 0; translate: 20px 0;
    transition: opacity 0.5s ease 0.2s, translate 0.5s cubic-bezier(.22,.68,0,1.1) 0.2s;
  }
  .rvs-section .rvs-write-btn.rvs-in { opacity: 1; translate: 0 0; }
  .rvs-section .rvs-write-btn.rvs-in > button { animation: rvs-btn-pulse 2.8s ease-in-out infinite 2s; }
  .rvs-section .rvs-write-btn.rvs-in > button:hover { animation: none; }

  /* ── modal glass panel ───────────────────────────────────────────── */
  .rvs-glass {
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(0,0,0,0.08);
    box-shadow: 0 24px 60px rgba(0,0,0,0.15);
  }

  /* ══════════════════════════════════════════════════════════════════
     RESPONSIVE — desktop-first, 5 breakpoints
  ══════════════════════════════════════════════════════════════════ */

  /* ── Small desktop: 1024–1199px ─────────────────────────────────── */
  @media (max-width: 1199px) {
    .rvs-section .rvs-grid { grid-template-columns: 42fr 58fr; }
    .rvs-section .rvs-left { height: 470px; }
    .rvs-section .rvs-globe-wrap { width: 295px; height: 295px; top: 30px; }
    .rvs-section .rvs-right { height: 470px; }
    .rvs-section .rvs-heading { font-size: 46px; line-height: 56px; top: 20px; }
    .rvs-section .rvs-carousel-row { left: 36px; top: 105px; right: 20px; gap: 16px; }
    .rvs-section .rvs-card { width: 100%; max-width: 440px; height: 330px; }
    .rvs-section .rvs-text { right: 22px; top: 60px; width: 240px; height: 170px; font-size: 13px; }
    .rvs-section .rvs-avatar { left: 30px; top: 60px; width: 74px; height: 74px; }
    .rvs-section .rvs-deco { left: 26px; }
    .rvs-section .rvs-deco-strip { width: 36px; height: 92px; }
    .rvs-section .rvs-name { top: 148px; font-size: 18px; }
    .rvs-section .rvs-role { top: 174px; font-size: 13px; }
    .rvs-section .rvs-date, .rvs-section .rvs-time { bottom: 26px; font-size: 13px; }
  }

  /* ── Tablet: <1024px — stacked layout ───────────────────────────── */
  @media (max-width: 1023px) {
    .rvs-section .rvs-grid { grid-template-columns: 1fr; }

    /* Left */
    .rvs-section .rvs-left { height: 380px; }
    .rvs-section .rvs-globe-wrap { width: 245px; height: 245px; top: 28px; }
    .rvs-section .rvs-left-footer { bottom: 28px; }
    .rvs-section .rvs-connect  { font-size: 15px; }
    .rvs-section .rvs-community { font-size: 17px; }

    /* Right — switch to flow layout */
    .rvs-section .rvs-right { height: auto; padding: 24px 24px 32px; overflow: visible; }
    .rvs-section .rvs-heading {
      position: relative; top: auto; left: auto;
      transform: none; font-size: 40px; line-height: 50px;
      text-align: center; display: block; margin-bottom: 20px;
    }
    .rvs-section .rvs-carousel-row {
      position: relative; top: auto; left: auto; right: auto;
      gap: 16px; justify-content: center;
    }
    .rvs-section .rvs-card { width: 100%; max-width: 520px; height: 320px; }
    .rvs-section .rvs-text { right: 20px; top: 58px; width: 250px; height: 168px; font-size: 13px; }
    .rvs-section .rvs-avatar { left: 28px; top: 58px; width: 72px; height: 72px; }
    .rvs-section .rvs-deco { left: 24px; }
    .rvs-section .rvs-deco-strip { width: 35px; height: 88px; }
    .rvs-section .rvs-name { top: 146px; font-size: 18px; }
    .rvs-section .rvs-role { top: 170px; font-size: 13px; }
    .rvs-section .rvs-date, .rvs-section .rvs-time { bottom: 24px; font-size: 13px; }

    /* Write btn: switch to relative */
    .rvs-section .rvs-write-btn { position: relative; right: auto; top: auto; margin-bottom: 12px; display: inline-flex; }
  }

  /* ── Mobile: <768px ──────────────────────────────────────────────── */
  @media (max-width: 767px) {
    .rvs-section .rvs-outer { padding: 0 16px; }
    .rvs-section .rvs-left { height: 320px; }
    .rvs-section .rvs-globe-wrap { width: 210px; height: 210px; top: 22px; }
    .rvs-section .rvs-left-footer { bottom: 22px; }
    .rvs-section .rvs-connect  { font-size: 14px; }
    .rvs-section .rvs-community { font-size: 16px; }

    .rvs-section .rvs-right { padding: 20px 16px 28px; }
    .rvs-section .rvs-heading { font-size: 34px; line-height: 42px; margin-bottom: 16px; }
    .rvs-section .rvs-carousel-row { gap: 12px; }
    .rvs-section .rvs-card { height: 300px; }
    .rvs-section .rvs-text { right: 16px; top: 52px; width: 210px; height: 155px; font-size: 12.5px; }
    .rvs-section .rvs-avatar { left: 22px; top: 52px; width: 64px; height: 64px; }
    .rvs-section .rvs-deco { left: 18px; }
    .rvs-section .rvs-deco-strip { width: 30px; height: 80px; }
    .rvs-section .rvs-name { top: 132px; font-size: 17px; }
    .rvs-section .rvs-role { top: 155px; font-size: 12px; max-width: 140px; }
    .rvs-section .rvs-date, .rvs-section .rvs-time { bottom: 20px; font-size: 12px; }
    .rvs-section .rvs-date { left: 20px; }
    .rvs-section .rvs-time { right: 16px; }

    /* indicator horizontal on mobile */
    .rvs-section .rvs-indicator { flex-direction: row; align-items: center; gap: 10px; justify-content: center; }
    .rvs-section .rvs-bar-active   { width: 24px; height: 3px; }
    .rvs-section .rvs-bar-inactive { width: 16px; height: 2px; }

    /* dots scale down */
    .rvs-section .rvs-dot { width: 8px; height: 8px; }
  }

  /* ── Small mobile: <480px ────────────────────────────────────────── */
  @media (max-width: 479px) {
    .rvs-section .rvs-left { height: 275px; }
    .rvs-section .rvs-globe-wrap { width: 175px; height: 175px; top: 18px; }
    .rvs-section .rvs-left-footer { bottom: 16px; }
    .rvs-section .rvs-connect  { font-size: 13px; margin-bottom: 5px; }
    .rvs-section .rvs-community { font-size: 14px; }

    .rvs-section .rvs-heading { font-size: 28px; line-height: 36px; margin-bottom: 14px; }
    .rvs-section .rvs-card { height: 270px; }
    .rvs-section .rvs-text { right: 12px; top: 46px; width: 170px; height: 138px; font-size: 12px; line-height: 158%; }
    .rvs-section .rvs-avatar { left: 16px; top: 46px; width: 56px; height: 56px; }
    .rvs-section .rvs-deco { left: 14px; gap: 7px; }
    .rvs-section .rvs-deco-strip { width: 26px; height: 70px; }
    .rvs-section .rvs-name { top: 118px; font-size: 16px; left: 16px; }
    .rvs-section .rvs-role { top: 140px; font-size: 11px; left: 16px; max-width: 120px; }
    .rvs-section .rvs-date { bottom: 16px; left: 16px; font-size: 11px; }
    .rvs-section .rvs-time { bottom: 16px; right: 12px; font-size: 11px; }

    /* dots */
    .rvs-section .rvs-dots { height: 30px; margin-bottom: 4px; }
    .rvs-section .rvs-dot  { width: 7px; height: 7px; }
  }

  /* ── Tiny mobile: <360px ─────────────────────────────────────────── */
  @media (max-width: 359px) {
    .rvs-section .rvs-outer { padding: 0 10px; }
    .rvs-section .rvs-heading { font-size: 24px; line-height: 30px; }
    .rvs-section .rvs-card { height: 250px; }
    .rvs-section .rvs-text { width: 148px; font-size: 11px; right: 10px; top: 42px; height: 124px; }
    .rvs-section .rvs-avatar { width: 50px; height: 50px; left: 12px; top: 42px; }
    .rvs-section .rvs-name { font-size: 15px; top: 106px; left: 12px; }
    .rvs-section .rvs-role { font-size: 10.5px; top: 126px; left: 12px; max-width: 110px; }
  }

  /* ── Reduced motion ──────────────────────────────────────────────── */
  @media (prefers-reduced-motion: reduce) {
    .rvs-section *,
    .rvs-section *::before,
    .rvs-section *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

/* ══════════════════════════════════════════════════════════════════════════
   Main component
══════════════════════════════════════════════════════════════════════════ */
export default function ReviewsSection({ initialReviews = [] }: { initialReviews?: ReviewItem[] }) {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);

  /* carousel */
  const [activeIdx, setActiveIdx]     = useState(0);
  const [cardVisible, setCardVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* entrance */
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  /* modal */
  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [services, setServices]           = useState<any[]>([]);
  const [formData, setFormData]           = useState({ studentName:'', rating:5, comment:'', service:'' });
  const [hoverRating, setHoverRating]     = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError]     = useState<string | null>(null);

  /* ── IntersectionObserver — fires once ── */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } },
      { threshold: 0.07 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

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

  /* ── carousel ── */
  const goTo = useCallback((next: number, len: number) => {
    const t = ((next % len) + len) % len;
    if (t === activeIdx) return;
    setCardVisible(false);
    setTimeout(() => { setActiveIdx(t); setCardVisible(true); }, 320);
  }, [activeIdx]);

  const resetTimer = useCallback((len: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (len <= 1) return;
    timerRef.current = setInterval(() => {
      setCardVisible(false);
      setTimeout(() => { setActiveIdx(p => (p + 1) % len); setCardVisible(true); }, 320);
    }, AUTO_MS);
  }, []);

  useEffect(() => {
    resetTimer(listLen);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer, listLen]);

  const handleDot = (i: number) => { goTo(i, listLen); resetTimer(listLen); };

  /* ── modal ── */
  const openModal = () => {
    setIsModalOpen(true); setSubmitSuccess(false); setSubmitError(null);
    setFormData({ studentName:'', rating:5, comment:'', service:'' });
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${base}/api/services`).then(r=>r.json()).then(d=>setServices(d.data||[])).catch(()=>{});
  };
  const handleInput = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSubmitting(true); setSubmitError(null);
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const res  = await fetch(`${base}/api/reviews`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ studentName:formData.studentName.trim(), rating:formData.rating, comment:formData.comment.trim(), service:formData.service||undefined, studentImage:'' }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Validation failed.');
      setSubmitSuccess(true);
      setTimeout(() => setIsModalOpen(false), 3000);
    } catch (err: any) { setSubmitError(err.message || 'Something went wrong.'); }
    finally { setIsSubmitting(false); }
  };

  /* ── display helpers ── */
  const fmtDate = (s: string) => { try { return new Date(s).toLocaleDateString('en-GB'); } catch { return '24/06/2026'; } };
  const fmtTime = (s: string) => { try { return new Date(s).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:true}); } catch { return '10:00 AM'; } };
  const getBg   = (n: string) => { const h = n.split('').reduce((a,c)=>a+c.charCodeAt(0),0); return `linear-gradient(135deg,hsl(${h%360},65%,65%),hsl(${(h+60)%360},65%,45%))`; };
  const getInit = (n: string) => n ? n.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase() : 'S';

  const rev = list[activeIdx] ?? list[0];
  const cls = (base: string, cond?: string) => cond ? `${base} ${cond}` : base;

  /* ══════════════════════════════════════════════════════════════════════ */
  return (
    <section ref={sectionRef} className="rvs-section relative">
      {/* Styles are a stable constant string — React never re-creates it */}
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="rvs-outer">

        {/* Write review button */}
        <div className={cls('rvs-write-btn', inView ? 'rvs-in' : undefined)}>
          <button
            onClick={openModal}
            className="flex items-center gap-2 px-4 py-2 bg-[rgba(150,202,69,1)] text-[#111] font-bold text-xs rounded-lg hover:bg-[rgba(150,202,69,0.9)] transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            Write a Review
          </button>
        </div>

        {/* Green wave dots */}
        <GreenDots inView={inView} />

        <div className="rvs-grid">

          {/* ═══════ LEFT PANEL ═══════ */}
          <div className={cls('rvs-left', inView ? 'rvs-in' : undefined)}>
            <div className="rvs-globe-wrap">
              <Image src="/reviews-globe.png" alt="World map globe with India highlighted" fill className="object-contain" priority />
            </div>
            <div className="rvs-left-footer">
              <p className="rvs-connect">Connect World Wide</p>
              <p className="rvs-community">GrowMedLink&apos;s Global Community</p>
            </div>
          </div>

          {/* ═══════ RIGHT PANEL ═══════ */}
          <div className={cls('rvs-right', inView ? 'rvs-in' : undefined)}>

            <h2 className="rvs-heading">
              <span className={cls('rvs-hw', inView ? 'rvs-hw-in' : undefined)} style={{'--rvs-hwd':'0.3s'} as React.CSSProperties}>
                Students{' '}
              </span>
              <span className={cls('rvs-hw rvs-heading-green', inView ? 'rvs-hw-in' : undefined)} style={{'--rvs-hwd':'0.48s'} as React.CSSProperties}>
                Reviews
              </span>
            </h2>

            <div className={cls('rvs-carousel-row', inView ? 'rvs-in' : undefined)}>

              {/* Review card */}
              <div className={cls('rvs-card', !cardVisible ? 'rvs-card-hidden' : undefined)}>
                <div className="rvs-deco">
                  <div className="rvs-deco-strip rvs-deco-white" />
                  <div className="rvs-deco-strip rvs-deco-green" />
                </div>

                <div className="rvs-avatar">
                  {rev.studentImage
                    ? <Image src={rev.studentImage} alt={rev.studentName} fill style={{objectFit:'cover'}} onError={e=>{(e.currentTarget as HTMLImageElement).style.visibility='hidden';}} />
                    : <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl" style={{background:getBg(rev.studentName)}}>{getInit(rev.studentName)}</div>
                  }
                </div>

                <p className="rvs-text">&quot;{rev.comment}&quot;</p>
                <div className="rvs-name">{rev.studentName}</div>
                <div className="rvs-role">{rev.service?.title || 'Verified Student'}</div>
                <div className="rvs-date">{fmtDate(rev.createdAt)}</div>
                <div className="rvs-time">{fmtTime(rev.createdAt)}</div>
              </div>

              {/* Indicator */}
              <div className="rvs-indicator">
                {Array.from({length: listLen}, (_, i) => (
                  <div
                    key={i}
                    className={`rvs-bar ${i === activeIdx ? 'rvs-bar-active' : 'rvs-bar-inactive'}`}
                    onClick={() => handleDot(i)}
                    role="button" aria-label={`Review ${i + 1}`}
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
                    <label className="block text-sm font-bold text-gray-700 mb-1">Rating *</label>
                    <div className="flex items-center gap-1.5">
                      {Array.from({length:5},(_,i)=>{
                        const v=i+1, on=hoverRating!==null?v<=hoverRating:v<=formData.rating;
                        return <button type="button" key={i} disabled={isSubmitting} onClick={()=>setFormData(p=>({...p,rating:v}))} onMouseEnter={()=>setHoverRating(v)} onMouseLeave={()=>setHoverRating(null)} className="p-1 focus:outline-none"><Star className={`w-7 h-7 ${on?'fill-[rgba(150,202,69,1)] text-[rgba(150,202,69,1)]':'text-gray-300'}`}/></button>;
                      })}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-sm font-bold text-gray-700 mb-1">Service / Course (Optional)</label>
                    <select name="service" id="service" value={formData.service} onChange={handleInput} disabled={isSubmitting} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[rgba(150,202,69,1)] text-sm bg-white text-black">
                      <option value="">-- Select Service --</option>
                      {services.map(s=><option key={s._id} value={s._id}>[{s.category.toUpperCase()}] {s.title}</option>)}
                    </select>
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

/* ─── Green wave dots ─── */
function GreenDots({ inView }: { inView: boolean }) {
  const dots = [
    {left:0,top:22},{left:28,top:4},{left:63,top:22},{left:90,top:10},
    {left:118,top:22},{left:139,top:16},{left:170,top:22},{left:196,top:19},
    {left:219,top:22},{left:244,top:22},
  ];
  return (
    <div className="rvs-dots">
      {dots.map((d, i) => (
        <div
          key={i}
          className={`rvs-dot${inView ? ' rvs-dot-in' : ''}`}
          style={{
            left: d.left, top: d.top,
            /*
              Entrance stagger: each dot pops in 55ms after the previous.
              Wave phase: --rvs-wi drives animation-delay so the
              wave travels left → right continuously.
            */
            transitionDelay: `${i * 0.055}s`,
            '--rvs-wi': String(i),
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}