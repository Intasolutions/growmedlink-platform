'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { TiptapRenderer } from '@/components/TiptapRenderer';

const FH = "'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif";
const GREEN = '#96CA45';
const DARK = '#252525';

const STYLES = `
@keyframes lgl-reveal {
  from { opacity: 0; transform: translate3d(0, 24px, 0); }
  to   { opacity: 1; transform: translate3d(0, 0px, 0);  }
}
.lgl-rv {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.8s cubic-bezier(.22,.68,0,1.2), transform 0.8s cubic-bezier(.22,.68,0,1.2);
}
.lgl-rv.lgl-in { opacity: 1; transform: translateY(0); }
@media (prefers-reduced-motion: reduce) {
  .lgl-rv { opacity: 1 !important; transform: none !important; transition: none !important; }
}
`;

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

interface LegalPageClientProps {
  title: string;
  subtitle: string;
  heroImage: string;
  content: Record<string, any>;
}

export default function LegalPageClient({ title, subtitle, heroImage, content }: LegalPageClientProps) {
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: heroVisible ? 1 : 0,
    transform: heroVisible ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.8s cubic-bezier(.22,.68,0,1.2) ${delay}ms, transform 0.8s cubic-bezier(.22,.68,0,1.2) ${delay}ms`,
  });

  const bodyReveal = useReveal();

  return (
    <main>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section className="relative flex min-h-[330px] items-center overflow-hidden bg-[#141414] px-4 py-24 sm:px-6 sm:py-28 lg:min-h-[500px] lg:py-32">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          className="object-cover"
          style={{ filter: 'grayscale(0.15)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(56.72% 50% at 50% 50%, rgba(0,0,0,0) 0%, #000000 100%)' }}
        />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h1
            className="text-4xl font-medium tracking-tight text-white sm:text-5xl lg:text-[65px] lg:leading-[1.18]"
            style={{ fontFamily: FH, ...fadeUp(100) }}
          >
            {title}
          </h1>
          <p
            className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base"
            style={fadeUp(260)}
          >
            {subtitle}
          </p>
        </div>
      </section>

      {/* ══════════════════════ RICH TEXT CONTENT ══════════════════════ */}
      <section ref={bodyReveal.ref} className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className={`lgl-rv mx-auto max-w-4xl ${bodyReveal.visible ? 'lgl-in' : ''}`}>
          <div className="legal-content space-y-6 text-[#252525]">
            <TiptapRenderer content={content} />
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{
        __html: `
          .legal-content p { color: #252525; font-size: 15px; line-height: 1.7; font-weight: 400; }
          .legal-content h1, .legal-content h2, .legal-content h3 {
            color: #181D27; font-family: ${FH}; font-weight: 600;
          }
          .legal-content h1 { font-size: 22px; margin-top: 1.5rem; border-bottom: none; padding-bottom: 0; }
          .legal-content h2 { font-size: 20px; margin-top: 1.25rem; }
          .legal-content h3 { font-size: 18px; margin-top: 1rem; }
          .legal-content strong { color: #181D27; }
          .legal-content a { color: ${GREEN}; }
          .legal-content ul, .legal-content ol { color: #252525; }
          .legal-content blockquote { border-left-color: ${GREEN}; color: #535862; background: rgba(150,202,69,0.06); }
        `,
      }} />
    </main>
  );
}
