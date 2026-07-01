'use client';

import { useEffect } from 'react';
import gsap from 'gsap';

/*
 * CursorTrail
 * -----------
 * Pass a CSS selector that matches the section you want the trail on.
 * The component itself renders nothing — all DOM is imperative and
 * appended directly to document.body so CSS transforms on ancestors
 * NEVER break fixed-position trail nodes.
 *
 * Usage:
 *   Add data-cursor-trail to any section element.
 *   Render <CursorTrail selector="[data-cursor-trail]" /> anywhere in the tree.
 */

interface Props {
  selector?: string;
  imageSrc?: string;
  size?: number;
}

const MAX_TRAIL   = 12;
const TRAIL_EVERY = 55;   /* ms between trail spawns */
const OFFSET_X    = 18;
const OFFSET_Y    = 18;
const MAX_ROT     = 8;

export default function CursorTrail({
  selector = '[data-cursor-trail]',
  imageSrc = '/cursor-trail.png',
  size = 96,
}: Props) {

  useEffect(() => {
    /* Resolve absolute URL once — avoids relative-URL failures on body-appended nodes */
    const src = `${window.location.origin}${imageSrc}`;

    /* ── helper: build a DOM node the way GSAP expects (no inline transform) ── */
    const makeNode = (z: number, nodeSize: number): HTMLDivElement => {
      const el = document.createElement('div');
      el.style.position          = 'fixed';
      el.style.top               = '0';
      el.style.left              = '0';
      el.style.width             = `${nodeSize}px`;
      el.style.height            = `${nodeSize}px`;
      el.style.pointerEvents     = 'none';
      el.style.userSelect        = 'none';
      el.style.willChange        = 'transform, opacity';
      el.style.zIndex            = String(z);
      el.style.backgroundImage   = `url('${src}')`;
      el.style.backgroundSize    = 'contain';
      el.style.backgroundRepeat  = 'no-repeat';
      el.style.backgroundPosition= 'center';
      el.style.opacity           = '0';
      /* CRITICAL: do not set transform here — GSAP must own it from the start */
      return el;
    };

    /* ── Find section ── */
    const section = document.querySelector<HTMLElement>(selector);
    if (!section) return;

    /* ── State ── */
    let inside    = false;
    let trails: HTMLDivElement[]  = [];
    let lastSpawn = 0;
    let mx = 0, my = 0, prevMx = 0;
    let velRot = 0;

    /* ── Main image element ── */
    const el = makeNode(9999, size);
    document.body.appendChild(el);

    /* Start safely off-screen (top-left corner is visible!) */
    gsap.set(el, { x: -size * 2, y: -size * 2, scale: 0.85, rotation: 0, opacity: 0 });

    /* ── quickTo handles — the heart of the smooth lag ── */
    const qX   = gsap.quickTo(el, 'x',        { duration: 0.5,  ease: 'power3.out' });
    const qY   = gsap.quickTo(el, 'y',        { duration: 0.5,  ease: 'power3.out' });
    const qRot = gsap.quickTo(el, 'rotation', { duration: 0.55, ease: 'power3.out' });
    const qSc  = gsap.quickTo(el, 'scale',    { duration: 0.35, ease: 'power3.out' });
    const qOp  = gsap.quickTo(el, 'opacity',  { duration: 0.25, ease: 'power2.out' });

    /* ── Spawn a trail ghost ── */
    const spawnTrail = (x: number, y: number, rot: number) => {
      if (trails.length >= MAX_TRAIL) {
        const dead = trails.shift();
        dead?.parentNode?.removeChild(dead);
      }
      const node = makeNode(9998, Math.round(size * 0.72));
      document.body.appendChild(node);
      trails.push(node);

      gsap.set(node, { x: x + OFFSET_X, y: y + OFFSET_Y, rotation: rot * 0.35, scale: 0.7, opacity: 0.38 });
      gsap.to(node, {
        opacity: 0,
        scale: 0.42,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => {
          node.parentNode?.removeChild(node);
          trails = trails.filter(n => n !== node);
        },
      });
    };

    /* ── GSAP ticker: 60fps position + rotation update ── */
    const tick: gsap.TickerCallback = () => {
      if (!inside) return;
      const vx = mx - prevMx;
      prevMx = mx;
      const targetRot = Math.max(-MAX_ROT, Math.min(MAX_ROT, vx * 2.5));
      velRot = velRot * 0.82 + targetRot * 0.18;
      qX(mx + OFFSET_X);
      qY(my + OFFSET_Y);
      qRot(velRot);
    };
    gsap.ticker.add(tick);

    /* ── Event: mouse move ── */
    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const now = performance.now();
      if (now - lastSpawn < TRAIL_EVERY) return;
      lastSpawn = now;
      /* Read GSAP's own x/y — not the raw cursor, giving trails the laggy feel */
      const cx = gsap.getProperty(el, 'x') as number;
      const cy = gsap.getProperty(el, 'y') as number;
      spawnTrail(cx - OFFSET_X, cy - OFFSET_Y, velRot);
    };

    /* ── Event: cursor enters section ── */
    const onEnter = (e: MouseEvent) => {
      /* Snap to cursor immediately so image doesn't fly in from off-screen */
      mx = e.clientX; my = e.clientY; prevMx = e.clientX;
      gsap.set(el, { x: mx + OFFSET_X, y: my + OFFSET_Y });
      inside = true;
      section.style.cursor = 'none';
      qOp(1);
      qSc(1);
    };

    /* ── Event: cursor leaves section ── */
    const onLeave = () => {
      inside = false;
      section.style.cursor = '';
      qOp(0);
      qSc(0.85);
      velRot = 0;
      qRot(0);
      /* Fade out all trails */
      const copy = [...trails];
      trails = [];
      copy.forEach(n => gsap.to(n, {
        opacity: 0, duration: 0.18, ease: 'power2.in',
        onComplete: () => n.parentNode?.removeChild(n),
      }));
    };

    section.addEventListener('mousemove',  onMove);
    section.addEventListener('mouseenter', onEnter as EventListener);
    section.addEventListener('mouseleave', onLeave);

    /* ── Cleanup ── */
    return () => {
      section.removeEventListener('mousemove',  onMove);
      section.removeEventListener('mouseenter', onEnter as EventListener);
      section.removeEventListener('mouseleave', onLeave);
      section.style.cursor = '';
      gsap.ticker.remove(tick);
      gsap.killTweensOf(el);
      el.parentNode?.removeChild(el);
      /* remove surviving trail nodes */
      trails.forEach(n => n.parentNode?.removeChild(n));
      trails = [];
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
