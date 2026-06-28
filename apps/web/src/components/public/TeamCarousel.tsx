'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const FH = "'Haffer XH-TRIAL','Helvetica Neue',Arial,sans-serif";
const FM = "'Haffer XH Mono-TRIAL','Courier New',monospace";
const GREEN = '#96CA45';
const DARK = '#252525';

export interface TeamMember {
  name: string;
  role: string;
  initials: string;
  photo: string;
  grad: [string, string];
  bio: string;
  social: { ig: string; fb: string; tw: string };
}

/* Same roster shown on the About page's "Faces Behind the Brand" section */
export const DEFAULT_TEAM: TeamMember[] = [
  { name: 'Dr. Sarah Mitchell', role: 'Chief Medical Officer', initials: 'SM', photo: '/about/1.jpg', grad: ['#155BA9', '#0a3d7a'], bio: 'A distinguished physician with over 18 years of clinical and academic experience across the UK and India. Dr. Mitchell shapes our medical curriculum and ensures every program meets the highest international standards.', social: { ig: '#', fb: '#', tw: '#' } },
  { name: 'Dr. Arjun Patel', role: 'Academic Director', initials: 'AP', photo: '/about/2.jpg', grad: ['#96CA45', '#4a7a10'], bio: 'With dual specialisations in medical education and health policy, Dr. Patel leads the design of our flagship NCLEX and PLAB preparation tracks, maintaining a 91% first-attempt pass rate among our graduates.', social: { ig: '#', fb: '#', tw: '#' } },
  { name: 'Ms. Priya Nair', role: 'Head of Student Affairs', initials: 'PN', photo: '/about/3.jpg', grad: ['#6938EF', '#3d1d9e'], bio: 'Priya brings a decade of student mentorship experience from top nursing colleges. She oversees every touchpoint of the learner journey — from onboarding to post-placement support.', social: { ig: '#', fb: '#', tw: '#' } },
  { name: 'Mr. James Wilson', role: 'Chief Technology Officer', initials: 'JW', photo: '/about/4.jpg', grad: ['#F79009', '#a55c00'], bio: 'A serial edtech entrepreneur, James architected our adaptive learning platform that personalises study plans in real-time, reducing average preparation time by 30%.', social: { ig: '#', fb: '#', tw: '#' } },
  { name: 'Dr. Meera Krishnan', role: 'Clinical Training Lead', initials: 'MK', photo: '/about/5.jpg', grad: ['#0BA5EC', '#0669a0'], bio: 'Dr. Krishnan brings 12 years of ICU and surgical experience to our simulation labs, delivering the case-based learning sessions that consistently receive top learner feedback.', social: { ig: '#', fb: '#', tw: '#' } },
  { name: 'Ms. Ananya Roy', role: 'International Relations', initials: 'AR', photo: '/about/6.jpg', grad: ['#EE46BC', '#8a1460'], bio: 'Ananya manages our global partnerships with hospitals and licensing bodies across 14 countries, ensuring our graduates have clear pathways to work in the USA, UK, Canada, and Australia.', social: { ig: '#', fb: '#', tw: '#' } },
];

const STYLES = `
.tc-rv {
  opacity: 0;
  transform: translateY(38px);
  transition: opacity 0.72s cubic-bezier(.22,.68,0,1.2), transform 0.72s cubic-bezier(.22,.68,0,1.2);
}
.tc-rv.tc-in { opacity: 1; transform: translateY(0); }

.tc-wrap { position: relative; width: 100%; display: flex; flex-direction: column; align-items: center; overflow: visible; padding: 16px 0 0; }
.tc-orbit { display: flex; align-items: center; justify-content: center; gap: 0; position: relative; height: 208px; width: 100%; max-width: 736px; margin: 0 auto; }
.tc-slot {
  position: absolute; display: flex; align-items: center; justify-content: center;
  transition: left 0.72s cubic-bezier(0.25,1,0.22,1), transform 0.72s cubic-bezier(0.25,1,0.22,1), opacity 0.55s ease, z-index 0.72s step-end;
  will-change: left, transform, opacity;
  cursor: pointer;
}
.tc-img {
  border-radius: 50%; overflow: hidden; position: relative; flex-shrink: 0;
  transition: width 0.72s cubic-bezier(0.25,1,0.22,1), height 0.72s cubic-bezier(0.25,1,0.22,1), box-shadow 0.72s ease, border-color 0.55s ease;
  will-change: width, height, box-shadow;
}
.tc-img-active { border: 3px solid #96CA45; box-shadow: 0 0 0 5px rgba(150,202,69,0.18), 0 12px 38px rgba(0,0,0,0.16); }
.tc-img-inactive { border: 2px solid rgba(150,202,69,0.25); box-shadow: 0 3px 14px rgba(0,0,0,0.10); }

.tc-detail { text-align: center; margin-top: 29px; width: 100%; max-width: 496px; }

@keyframes tc-fadein { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }

.tc-dots { display: flex; gap: 6px; justify-content: center; margin-top: 22px; }
.tc-dot { width: 7px; height: 7px; border-radius: 50%; background: #D0D5DD; cursor: pointer; transition: background 0.3s ease, transform 0.3s ease, width 0.35s ease; }
.tc-dot.tc-dot-active { background: #96CA45; width: 19px; border-radius: 4px; }

.tc-social { display: flex; gap: 10px; justify-content: center; margin-top: 16px; }
.tc-soc-btn {
  width: 32px; height: 32px; border-radius: 50%; border: 1.5px solid #D0D5DD;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  transition: border-color 0.25s ease, background 0.25s ease, transform 0.25s ease;
  background: transparent; text-decoration: none;
}
.tc-soc-btn:hover { border-color: #96CA45; background: rgba(150,202,69,0.10); transform: translateY(-2px); }

@media (max-width: 900px) { .tc-orbit { height: 168px; max-width: 560px; } }
@media (max-width: 640px) { .tc-orbit { height: 144px; max-width: 100%; } .tc-detail { padding: 0 16px; } }

@media (prefers-reduced-motion: reduce) {
  .tc-rv { opacity: 1 !important; transform: none !important; transition: none !important; }
}
`;

const SLOT_SIZES = [176, 124, 80];
const SLOT_OPACITY = [1, 0.82, 0.55];
const SLOT_X = [0, 184, 328];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('tc-in'); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

export interface TeamCarouselProps {
  team?: TeamMember[];
  heading?: React.ReactNode;
  description?: string;
}

export default function TeamCarousel({
  team = DEFAULT_TEAM,
  heading,
  description = 'T Purus In In Fames Sit Ac Vitae. Curabitur Scelerisque Nunc Mauris Blandit. Donec Tristique Placerat Consectetur Molestie Est Ornare. Suspendisse Aliquet Semper Quam Volutpat Bibendum Est Mattis. Sed Neque Etiam Morbi A Amet Lacus Phasellus Ipsum Nec.',
}: TeamCarouselProps) {
  const rh = useReveal();
  const n = team.length;
  const [activeIdx, setActiveIdx] = useState(0);
  const [displayIdx, setDisplayIdx] = useState(0);
  const [textKey, setTextKey] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(() => setActiveIdx((prev) => (prev + 1) % n), 4000);
    return () => clearInterval(t);
  }, [isPaused, n]);

  useEffect(() => {
    const t = setTimeout(() => {
      setDisplayIdx(activeIdx);
      setTextKey((k) => k + 1);
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

  const member = team[displayIdx];
  const nameParts = member.name.replace(/^(Dr\.|Ms\.|Mr\.)\s*/, '').split(' ');
  const nameFirst = nameParts.slice(0, -1).join(' ') || nameParts[0];
  const nameLast = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

  return (
    <section style={{ background: '#fff', padding: '64px 32px 77px' }}>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div style={{ maxWidth: 896, margin: '0 auto', textAlign: 'center' }}>

        <div ref={rh} className="tc-rv" style={{ marginBottom: 38 }}>
          <h2 style={{ fontFamily: FH, fontWeight: 400, fontSize: 'clamp(26px,3.8vw,54px)', color: DARK, marginBottom: 16 }}>
            {heading ?? <>Meet <span style={{ color: GREEN }}>Our Experts</span></>}
          </h2>
          <p style={{ fontFamily: FH, fontSize: 'clamp(11px,1.0vw,14px)', lineHeight: '169%', letterSpacing: '0.01em', textTransform: 'capitalize', color: '#444', maxWidth: 688, margin: '0 auto' }}>
            {description}
          </p>
        </div>

        <div
          className="tc-wrap"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            if (resumeTimer.current) clearTimeout(resumeTimer.current);
            resumeTimer.current = setTimeout(() => setIsPaused(false), 1200);
          }}
        >
          <div className="tc-orbit" ref={orbitRef}>
            {team.map((m, i) => {
              let dist = ((i - activeIdx) % n + n) % n;
              if (dist > n / 2) dist -= n;
              const absDist = Math.abs(dist);
              const rank = Math.min(absDist, SLOT_SIZES.length - 1);
              const size = SLOT_SIZES[rank];
              const opacity = absDist >= SLOT_SIZES.length ? 0 : SLOT_OPACITY[rank];
              const xOffset = dist === 0 ? 0 : (dist > 0 ? 1 : -1) * SLOT_X[Math.min(absDist, SLOT_X.length - 1)];
              const zIndex = 10 - absDist * 2;
              const isCenter = dist === 0;

              return (
                <div
                  key={i}
                  className="tc-slot"
                  onClick={() => handleClick(i)}
                  style={{
                    left: `calc(50% + ${xOffset}px)`,
                    transform: 'translateX(-50%)',
                    opacity,
                    zIndex: absDist >= SLOT_SIZES.length ? -1 : zIndex,
                    pointerEvents: opacity === 0 ? 'none' : 'auto',
                  }}
                >
                  <div className={`tc-img ${isCenter ? 'tc-img-active' : 'tc-img-inactive'}`} style={{ width: size, height: size }}>
                    <Image
                      src={m.photo}
                      alt={m.name}
                      fill
                      sizes={`${SLOT_SIZES[0]}px`}
                      style={{ objectFit: 'cover', filter: isCenter ? 'none' : 'grayscale(60%)', transition: 'filter 0.72s ease' }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg,${m.grad[0]},${m.grad[1]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: -1 }}>
                      <span style={{ fontFamily: FM, fontSize: size * 0.22, fontWeight: 700, color: '#fff' }}>{m.initials}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="tc-detail" style={{ animation: 'tc-fadein 0.45s cubic-bezier(0.25,1,0.22,1) both' }} data-key={textKey}>
            <p style={{ fontFamily: FH, fontWeight: 700, fontSize: 'clamp(22px,2.5vw,36px)', color: DARK, lineHeight: '1.25', marginBottom: 6 }}>
              {nameFirst}{nameLast ? <span> <span style={{ color: GREEN }}>{nameLast}</span></span> : null}
            </p>
            <p style={{ fontFamily: FH, fontSize: 'clamp(13px,1.1vw,16px)', color: '#9F9F9F', fontWeight: 400, letterSpacing: '0.03em', marginBottom: 18, textTransform: 'uppercase' }}>
              {member.role}
            </p>
            <p style={{ fontFamily: FH, fontSize: 'clamp(13px,1.1vw,16px)', lineHeight: '1.7', color: '#444', maxWidth: 580, margin: '0 auto 0', textAlign: 'center' }}>
              {member.bio}
            </p>

            <div className="tc-social">
              <a href={member.social.ig} className="tc-soc-btn" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <rect x={2} y={2} width={20} height={20} rx={5} /><circle cx={12} cy={12} r={4} /><circle cx={17.5} cy={6.5} r={0.1} strokeWidth={3} />
                </svg>
              </a>
              <a href={member.social.fb} className="tc-soc-btn" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href={member.social.tw} className="tc-soc-btn" aria-label="X" target="_blank" rel="noopener noreferrer">
                <svg width={18} height={18} viewBox="0 0 24 24" fill={DARK}>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="tc-dots">
            {team.map((_, i) => (
              <div key={i} className={`tc-dot${activeIdx === i ? ' tc-dot-active' : ''}`} onClick={() => handleClick(i)} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
