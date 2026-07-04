'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import FAQSection from '@/components/FAQSection';
import TeamCarousel, { TeamMember } from '@/components/public/TeamCarousel';

const EXPERTS: TeamMember[] = [
  { name: 'Bruce Wayne', role: 'General Manager', initials: 'BW', photo: '/about/7.jpg', grad: ['#155BA9', '#0a3d7a'], bio: 'Bruce leads our consultation team, helping students map out the right licensing and immigration pathway before they commit to a programme.', social: { ig: '#', fb: '#', tw: '#' } },
  { name: 'Clara Singh', role: 'Senior Immigration Advisor', initials: 'CS', photo: '/about/8.jpg', grad: ['#96CA45', '#4a7a10'], bio: 'Clara has guided over 600 nurses through visa and registration processes across the UK, Canada, and Australia.', social: { ig: '#', fb: '#', tw: '#' } },
  { name: 'Daniel Fernandez', role: 'NCLEX Strategy Lead', initials: 'DF', photo: '/about/9.jpg', grad: ['#6938EF', '#3d1d9e'], bio: 'Daniel works one-on-one with candidates to build a personalised study and exam-attempt strategy ahead of their NCLEX-RN.', social: { ig: '#', fb: '#', tw: '#' } },
];

const GREEN = '#96CA45';
const DARK = '#252525';
const FH = "'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif";

const STYLES = `
@keyframes tte-sunburst-spin {
  0%   { transform: translate3d(-50%,-50%,0) rotate(0deg);   }
  100% { transform: translate3d(-50%,-50%,0) rotate(360deg); }
}
@keyframes tte-pulse {
  0%,100% { opacity: 0.55; transform: scale(1);    }
  50%     { opacity: 1;    transform: scale(1.25); }
}
@keyframes tte-card-in {
  from { opacity: 0; transform: translate3d(0, 32px, 0); }
  to   { opacity: 1; transform: translate3d(0, 0px, 0);  }
}

/* Contact cards grid */
.tte-cards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  max-width: 1024px;
  margin: 0 auto;
}
@media (min-width: 560px) {
  .tte-cards-grid { grid-template-columns: 1fr 1fr; }
}
@media (min-width: 900px) {
  .tte-cards-grid { grid-template-columns: repeat(3, 1fr); }
}

.tte-contact-card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(10px, 2vw, 16px);
  border-radius: 16px;
  padding: clamp(16px, 3vw, 24px) clamp(14px, 3vw, 24px);
  text-decoration: none;
  transition: transform 0.28s cubic-bezier(.22,.68,0,1.2), box-shadow 0.28s ease;
}
.tte-contact-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.18);
}

/* WaveDots — hide on tiny screens */
.tte-wavedots { overflow: hidden; max-width: min(318px, 80vw); }
@media (max-width: 479px) { .tte-wavedots { display: none; } }
`;

function WaveDots() {
  const dots = [
    { left: 0, top: 29 }, { left: 31, top: 24 }, { left: 60, top: 29 },
    { left: 93, top: 20 }, { left: 131, top: 29 }, { left: 157, top: 13 },
    { left: 192, top: 29 }, { left: 226, top: 6 }, { left: 270, top: 29 },
    { left: 305, top: 0 },
  ];
  return (
    <div style={{ position: 'relative', width: 318, height: 42, willChange: 'transform' }}>
      {dots.map((d, i) => (
        <div key={i} style={{
          position: 'absolute', left: d.left, top: d.top,
          width: 13, height: 13, borderRadius: '50%', background: GREEN,
          animation: `tte-pulse ${1.4 + i * 0.12}s ease-in-out ${i * 0.08}s infinite`,
          willChange: 'transform, opacity',
        }} />
      ))}
    </div>
  );
}

const CONTACTS = [
  { icon: Phone,         label: '+91 9898989898',        href: 'tel:+919898989898',            bg: GREEN, iconBg: DARK,  iconColor: GREEN, text: DARK  },
  { icon: Mail,          label: 'info@gromedlink.com',   href: 'mailto:info@gromedlink.com',   bg: DARK,  iconBg: GREEN, iconColor: DARK,  text: '#fff' },
  { icon: MessageCircle, label: '+91 9898989898',        href: 'https://wa.me/919898989898',   bg: GREEN, iconBg: DARK,  iconColor: GREEN, text: DARK  },
];

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

export default function TalkToExpertPage() {
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const cardsReveal = useReveal();

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: heroVisible ? 1 : 0,
    transform: heroVisible ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.8s cubic-bezier(.22,.68,0,1.2) ${delay}ms, transform 0.8s cubic-bezier(.22,.68,0,1.2) ${delay}ms`,
  });

  return (
    <main>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#141414',
        padding: 'clamp(80px,12vw,120px) clamp(16px,5vw,40px) clamp(48px,8vw,80px)',
      }}>
        {/* Decorative glows */}
        <div style={{
          pointerEvents: 'none', position: 'absolute',
          left: -128, bottom: 0, width: 'clamp(200px,45vw,450px)', height: 'clamp(200px,40vw,380px)',
          borderRadius: '50%', background: 'rgba(58,95,0,0.35)', filter: 'blur(100px)',
        }} />
        <div style={{
          pointerEvents: 'none', position: 'absolute',
          left: -40, bottom: 80, width: 'clamp(160px,33vw,330px)', height: 'clamp(140px,27vw,260px)',
          borderRadius: '50%', background: 'rgba(150,202,69,0.30)', filter: 'blur(70px)',
        }} />

        {/* Wave dots */}
        <div className="tte-wavedots" style={{ position: 'absolute', bottom: 24, left: 'clamp(8px,3vw,32px)', pointerEvents: 'none' }}>
          <WaveDots />
        </div>

        <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          {/* Sunburst + photo */}
          <div style={{
            position: 'relative', margin: '0 auto',
            width: 'clamp(200px, 42vw, 420px)',
            height: 'clamp(200px, 42vw, 420px)',
          }}>
            <div style={{
              pointerEvents: 'none', position: 'absolute',
              left: '50%', top: '50%',
              width: '100%', height: '100%',
              opacity: 0.6,
              animation: 'tte-sunburst-spin 80s linear infinite',
              willChange: 'transform',
            }}>
              <Image src="/sunburst-lines.png" alt="" fill style={{ objectFit: 'contain' }} priority />
            </div>
            <div style={{
              position: 'absolute', left: '50%', top: '50%',
              transform: 'translate(-50%,-50%)',
              width: '78%', height: '78%',
            }}>
              <Image src="/talk-to-expert.png" alt="Talk to an expert" fill style={{ objectFit: 'contain' }} priority />
            </div>
          </div>

          <h1 style={{
            marginTop: 'clamp(20px,4vw,32px)',
            fontFamily: FH,
            fontWeight: 500,
            fontSize: 'clamp(32px, 6vw, 72px)',
            letterSpacing: '-0.03em',
            color: '#fff',
            lineHeight: 1.15,
            ...fadeUp(120),
          }}>
            Talk To an Expert
          </h1>

          <p style={{
            marginTop: 'clamp(10px,2vw,16px)',
            fontSize: 'clamp(16px, 2.5vw, 28px)',
            fontWeight: 300,
            color: GREEN,
            lineHeight: 1.3,
            ...fadeUp(260),
          }}>
            Tell Us What&apos;s on Your Mind?
          </p>

          <p style={{
            maxWidth: 620,
            margin: 'clamp(12px,2vw,24px) auto 0',
            fontSize: 'clamp(13px, 1.4vw, 16px)',
            lineHeight: '1.7',
            color: 'rgba(255,255,255,0.80)',
            ...fadeUp(380),
          }}>
            Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi eleifend
            faucibus eget vestibulum felis. Dictum quis montes, sit sit. Tellus aliquam enim urna,
            etiam. Mauris posuere vulputate arcu amet, vitae nisi, tellus tincidunt. At feugiat
            sapien varius id.
          </p>
        </div>
      </section>

      {/* ══════════════════════ QUICK CONTACT CARDS ══════════════════════ */}
      <section ref={cardsReveal.ref} style={{
        background: '#fff',
        padding: 'clamp(28px,5vw,56px) clamp(16px,5vw,40px)',
      }}>
        <div className="tte-cards-grid">
          {CONTACTS.map((c, i) => {
            const Icon = c.icon;
            return (
              <a
                key={i}
                href={c.href}
                className="tte-contact-card"
                style={{
                  background: c.bg,
                  opacity: cardsReveal.visible ? 1 : 0,
                  animation: cardsReveal.visible
                    ? `tte-card-in 0.6s cubic-bezier(.22,.68,0,1.2) ${i * 0.12}s both`
                    : 'none',
                }}
              >
                <span style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 'clamp(40px,5vw,48px)', height: 'clamp(40px,5vw,48px)',
                  borderRadius: 10, background: c.iconBg, flexShrink: 0,
                }}>
                  <Icon style={{ width: 22, height: 22, color: c.iconColor }} />
                </span>
                <span style={{
                  fontFamily: FH,
                  fontSize: 'clamp(13px, 1.4vw, 17px)',
                  fontWeight: 500,
                  color: c.text,
                  wordBreak: 'break-all',
                }}>
                  {c.label}
                </span>
              </a>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════ MEET OUR EXPERTS ══════════════════════ */}
      <TeamCarousel
        team={EXPERTS}
        heading={<>Meet <span style={{ color: GREEN }}>Our Experts</span></>}
        description="Purus in in fames sit ac vitae. Curabitur scelerisque nunc mauris blandit. Donec tristique placerat consectetur molestie est ornare. Suspendisse aliquet semper quam volutpat bibendum est mattis. Sed neque etiam morbi a amet lacus phasellus ipsum nec."
      />

      {/* ══════════════════════ FAQ ══════════════════════ */}
      <FAQSection />
    </main>
  );
}
