'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // On touch devices (iPhone, Android) native scroll is already smooth.
    // Lenis with smoothTouch intercepts touches and causes scroll to need
    // 2-3 swipes before starting. Do NOT run Lenis on touch devices.
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isTouch) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 0,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const update = (time: number) => { lenis.raf(time * 1000); };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
