'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { TiptapRenderer } from '@/components/TiptapRenderer';

const FH = "'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif";
const GREEN = '#96CA45';

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

/* Responsive legal content typography */
.legal-content p {
  color: #252525;
  font-size: clamp(14px, 1.4vw, 16px);
  line-height: 1.75;
  font-weight: 400;
}
.legal-content h1, .legal-content h2, .legal-content h3 {
  color: #181D27;
  font-family: ${FH};
  font-weight: 600;
}
.legal-content h1 { font-size: clamp(18px, 2.2vw, 24px); margin-top: 1.5rem; }
.legal-content h2 { font-size: clamp(16px, 1.9vw, 21px); margin-top: 1.25rem; }
.legal-content h3 { font-size: clamp(15px, 1.6vw, 18px); margin-top: 1rem; }
.legal-content strong { color: #181D27; }
.legal-content a { color: ${GREEN}; }
.legal-content ul, .legal-content ol { color: #252525; padding-left: clamp(16px, 3vw, 28px); }
.legal-content blockquote {
  border-left-color: ${GREEN};
  color: #535862;
  background: rgba(150,202,69,0.06);
  padding: clamp(10px, 2vw, 18px);
  margin: 1rem 0;
  border-radius: 0 8px 8px 0;
}

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

      {/* ══════ HERO ══════ */}
      <section style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: '#141414',
        minHeight: 'clamp(260px, 40vw, 500px)',
        padding: 'clamp(80px, 12vw, 128px) clamp(16px, 5vw, 40px)',
      }}>
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          style={{ objectFit: 'cover', filter: 'grayscale(0.15)' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(56.72% 50% at 50% 50%, rgba(0,0,0,0) 0%, #000000 100%)',
        }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 760, margin: '0 auto', textAlign: 'center', width: '100%' }}>
          <h1 style={{
            fontFamily: FH,
            fontWeight: 500,
            fontSize: 'clamp(28px, 5vw, 65px)',
            lineHeight: 1.18,
            letterSpacing: '-0.02em',
            color: '#fff',
            ...fadeUp(100),
          }}>
            {title}
          </h1>
          <p style={{
            marginTop: 'clamp(12px, 2vw, 24px)',
            fontSize: 'clamp(13px, 1.4vw, 16px)',
            lineHeight: '1.7',
            color: 'rgba(255,255,255,0.85)',
            maxWidth: 640,
            margin: 'clamp(12px, 2vw, 24px) auto 0',
            ...fadeUp(260),
          }}>
            {subtitle}
          </p>
        </div>
      </section>

      {/* ══════ RICH TEXT CONTENT ══════ */}
      <section
        ref={bodyReveal.ref}
        style={{
          background: '#fff',
          padding: 'clamp(32px, 6vw, 80px) clamp(16px, 5vw, 40px)',
        }}
      >
        <div className={`lgl-rv ${bodyReveal.visible ? 'lgl-in' : ''}`}
          style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="legal-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <TiptapRenderer content={content} />
          </div>
        </div>
      </section>
    </main>
  );
}
