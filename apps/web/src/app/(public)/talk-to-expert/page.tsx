'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import FAQSection from '@/components/FAQSection';
import TeamCarousel, { TeamMember } from '@/components/public/TeamCarousel';

/* A focused roster of people you can actually book a call with — deliberately
   a different, smaller set from About's full leadership carousel. */
const EXPERTS: TeamMember[] = [
  { name: 'Bruce Wayne', role: 'General Manager', initials: 'BW', photo: '/about/7.jpg', grad: ['#155BA9', '#0a3d7a'], bio: 'Bruce leads our consultation team, helping students map out the right licensing and immigration pathway before they commit to a programme.', social: { ig: '#', fb: '#', tw: '#' } },
  { name: 'Clara Singh', role: 'Senior Immigration Advisor', initials: 'CS', photo: '/about/8.jpg', grad: ['#96CA45', '#4a7a10'], bio: 'Clara has guided over 600 nurses through visa and registration processes across the UK, Canada, and Australia.', social: { ig: '#', fb: '#', tw: '#' } },
  { name: 'Daniel Fernandez', role: 'NCLEX Strategy Lead', initials: 'DF', photo: '/about/9.jpg', grad: ['#6938EF', '#3d1d9e'], bio: 'Daniel works one-on-one with candidates to build a personalised study and exam-attempt strategy ahead of their NCLEX-RN.', social: { ig: '#', fb: '#', tw: '#' } },
];

const GREEN = '#96CA45';
const DARK = '#252525';
const FH = "'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif";
const FM = "'Haffer XH Mono-TRIAL','Courier New',monospace";

const KEYFRAMES = `
  @keyframes tte-sunburst-spin {
    0%   { transform: translate3d(-50%,-50%,0) rotate(0deg);   }
    100% { transform: translate3d(-50%,-50%,0) rotate(360deg); }
  }
  @keyframes tte-pulse {
    0%,100% { opacity: 0.55; transform: scale(1);    }
    50%     { opacity: 1;    transform: scale(1.25); }
  }
  @keyframes tte-reveal {
    from { opacity: 0; transform: translate3d(0, 24px, 0); }
    to   { opacity: 1; transform: translate3d(0, 0px, 0);  }
  }
  @keyframes tte-card-in {
    from { opacity: 0; transform: translate3d(0, 32px, 0); }
    to   { opacity: 1; transform: translate3d(0, 0px, 0);  }
  }
`;

function WaveDots() {
  const dots = [
    { left: 0, top: 29 }, { left: 31, top: 24 }, { left: 60, top: 29 },
    { left: 93, top: 20 }, { left: 131, top: 29 }, { left: 157, top: 13 },
    { left: 192, top: 29 }, { left: 226, top: 6 }, { left: 270, top: 29 },
    { left: 305, top: 0 },
  ];
  return (
    <div style={{ position: 'relative', width: '318px', height: '42px', willChange: 'transform' }}>
      {dots.map((d, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: d.left,
            top: d.top,
            width: '13px',
            height: '13px',
            borderRadius: '50%',
            background: GREEN,
            animation: `tte-pulse ${1.4 + i * 0.12}s ease-in-out ${i * 0.08}s infinite`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  );
}

const CONTACTS = [
  { icon: Phone, label: '+91 9898989898', href: 'tel:+919898989898', bg: GREEN, iconBg: DARK, iconColor: GREEN, text: DARK },
  { icon: Mail, label: 'info@gromedlink.com', href: 'mailto:info@gromedlink.com', bg: DARK, iconBg: GREEN, iconColor: DARK, text: '#fff' },
  { icon: MessageCircle, label: '+91 9898989898', href: 'https://wa.me/919898989898', bg: GREEN, iconBg: DARK, iconColor: GREEN, text: DARK },
];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
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
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section className="relative overflow-hidden bg-[#141414] px-4 pb-16 pt-20 sm:px-6 lg:px-8 lg:pb-20 lg:pt-24">
        {/* Decorative glows */}
        <div className="pointer-events-none absolute -left-32 bottom-0 h-[380px] w-[450px] rounded-full bg-[#3a5f00]/35 blur-[100px]" />
        <div className="pointer-events-none absolute -left-10 bottom-20 h-[260px] w-[330px] rounded-full bg-[#96CA45]/30 blur-[70px]" />

        {/* Green wave dots */}
        <div className="pointer-events-none absolute bottom-6 left-4 hidden sm:block lg:left-8">
          <WaveDots />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          {/* Rotating sunburst halo — same asset/animation as the Home/About/Services hero */}
          <div className="relative mx-auto" style={{ width: 'clamp(260px, 42vw, 420px)', height: 'clamp(260px, 42vw, 420px)' }}>
            <div
              className="pointer-events-none absolute left-1/2 top-1/2"
              style={{
                width: '100%',
                height: '100%',
                opacity: 0.6,
                animation: 'tte-sunburst-spin 80s linear infinite',
                willChange: 'transform',
              }}
            >
              <Image src="/sunburst-lines.png" alt="" fill style={{ objectFit: 'contain' }} priority />
            </div>

            {/* Photo cutout — transparent background, sits on top of the halo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: '78%', height: '78%' }}>
              <Image
                src="/talk-to-expert.png"
                alt="Talk to an expert"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </div>

          <h1
            className="mt-8 text-5xl font-medium tracking-tight text-white sm:text-6xl lg:text-7xl"
            style={fadeUp(120)}
          >
            Talk To an Expert
          </h1>

          <p
            className="mt-4 text-xl font-light text-[#96CA45] sm:text-2xl lg:text-[35px]"
            style={fadeUp(260)}
          >
            Tell Us What&apos;s on Your Mind?
          </p>

          <p
            className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base"
            style={fadeUp(380)}
          >
            Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi eleifend
            faucibus eget vestibulum felis. Dictum quis montes, sit sit. Tellus aliquam enim urna,
            etiam. Mauris posuere vulputate arcu amet, vitae nisi, tellus tincidunt. At feugiat
            sapien varius id.
          </p>
        </div>
      </section>

      {/* ══════════════════════ QUICK CONTACT CARDS ══════════════════════ */}
      <section ref={cardsReveal.ref} className="bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-3">
          {CONTACTS.map((c, i) => {
            const Icon = c.icon;
            return (
              <a
                key={i}
                href={c.href}
                className="flex items-center justify-center gap-4 rounded-2xl px-6 py-6 transition-transform hover:-translate-y-1"
                style={{
                  background: c.bg,
                  opacity: cardsReveal.visible ? 1 : 0,
                  animation: cardsReveal.visible ? `tte-card-in 0.6s cubic-bezier(.22,.68,0,1.2) ${i * 0.12}s both` : 'none',
                }}
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: c.iconBg }}
                >
                  <Icon className="h-6 w-6" style={{ color: c.iconColor }} />
                </span>
                <span className="text-lg font-medium" style={{ color: c.text, fontFamily: FH }}>
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
        description="T Purus In In Fames Sit Ac Vitae. Curabitur Scelerisque Nunc Mauris Blandit. Donec Tristique Placerat Consectetur Molestie Est Ornare. Suspendisse Aliquet Semper Quam Volutpat Bibendum Est Mattis. Sed Neque Etiam Morbi A Amet Lacus Phasellus Ipsum Nec."
      />

      {/* ══════════════════════ FAQ ══════════════════════ */}
      <FAQSection />
    </main>
  );
}
