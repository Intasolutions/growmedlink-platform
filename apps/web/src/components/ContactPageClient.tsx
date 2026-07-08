'use client';

import React, { useState, useRef, FormEvent, useEffect } from 'react';
import Image from 'next/image';
import { Phone, Mail, MessageCircle, MapPin, MessageSquare } from 'lucide-react';
import WhatsAppButton from '@/components/WhatsAppButton';
import { submitEnquiry } from '@/lib/api/enquiries';
import { ENQUIRY_TYPES } from '@intelligen/constants';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════════════════════════
   EASY-TO-EDIT LOCATION DATA
   — To add a state: add a new object to LOCATIONS
   — To add a branch: add to its state's `branches` array
   — Fields: city, address, phone, email, whatsapp (all optional except city)
══════════════════════════════════════════════════════════════════════ */
const LOCATIONS: StateGroup[] = [
  {
    state: 'Kerala',
    flag: '🇮🇳',
    branches: [
      {
        city: 'Thodupuzha',
        address: 'Second Floor, Ozhathil Chambers Building, Kothaikunnu Bypass Rd, near Anns Bakery, Thodupuzha, Kerala 685584',
        phone: '+91 9898989898',
        email: 'growmedlinkinternational@gmail.com',
        whatsapp: '+91 9898989898',
      },
      {
        city: 'Ettumanoor',
        address: 'KSRTC, Mulloor Arcade Building, 32/295, Bus Station Exit, Ettumanoor, Kerala 686631',
        phone: '9249093915',
        email: 'growmedlinkinternational@gmail.com',
        whatsapp: '9249093915',
      },
    ],
  },
  {
    state: 'Karnataka',
    flag: '🇮🇳',
    branches: [
      {
        city: 'Bengaluru',
        address: 'Kudlu Gate, Krishna Reddy Industrial Area, Garebhavipalya, Singasandra, Bengaluru, Karnataka 560068',
        phone: '9249093915',
        email: 'growmedlinkinternational@gmail.com',
        whatsapp: '9249093915',
      },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════════════════ */
interface Branch {
  city: string;
  address?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
}
interface StateGroup {
  state: string;
  flag?: string;
  branches: Branch[];
}

/* ══════════════════════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════════════════════ */
const FS    = "'Great Day Personal Use','Brush Script MT',cursive";
const GREEN = '#96CA45';

const KEYFRAMES = `
  @keyframes contact-sunburst-spin {
    0%   { transform: translate3d(-50%,-50%,0) rotate(0deg);   }
    100% { transform: translate3d(-50%,-50%,0) rotate(360deg); }
  }
  @keyframes contact-pulse {
    0%,100% { opacity: 0.55; transform: scale(1);    }
    50%     { opacity: 1;    transform: scale(1.25); }
  }
  @keyframes contact-arrow-float {
    0%,100% { transform: translate3d(0, 0px, 0);  }
    50%     { transform: translate3d(0, -6px, 0); }
  }
  @keyframes contact-reveal {
    from { opacity: 0; transform: translate3d(0, 16px, 0); }
    to   { opacity: 1; transform: translate3d(0, 0px, 0);  }
  }

  /* contact page global resets */
  .cnt * { box-sizing: border-box; }
  .cnt img { max-width: 100%; }

  /* hero overflow clamp */
  .cnt-hero { overflow: hidden; width: 100%; }

  /* wavedots never overflow */
  .cnt-wavedots { width: min(318px, 80vw); height: 42px; position: relative; overflow: hidden; }

  /* form */
  .cnt-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border-radius: 8px;
    padding: 0 20px;
    height: 52px;
    font-size: 14px;
    color: #fff;
    outline: none;
    border: 1px solid transparent;
    transition: border-color 0.2s;
  }
  .cnt-input:focus { border-color: ${GREEN}; }
  .cnt-input::placeholder { color: rgba(255,255,255,0.4); }
  .cnt-textarea {
    width: 100%; min-height: 120px; resize: vertical;
    background: rgba(255,255,255,0.04); border-radius: 8px;
    padding: 16px 20px; font-size: 14px; color: #fff; outline: none;
    border: 1px solid transparent; transition: border-color 0.2s;
  }
  .cnt-textarea:focus { border-color: ${GREEN}; }
  .cnt-textarea::placeholder { color: rgba(255,255,255,0.4); }

  /* location cards */
  .cnt-card {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #ebebeb;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.05);
    transition: transform 0.28s cubic-bezier(.22,.68,0,1.2), box-shadow 0.28s ease;
    will-change: transform;
  }
  .cnt-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.1);
  }
  .cnt-card-city {
    font-size: clamp(16px,1.6vw,20px);
    font-weight: 700;
    color: #252525;
    letter-spacing: -0.01em;
  }
  .cnt-card-addr {
    font-size: 13px;
    color: #666;
    line-height: 1.65;
  }
  .cnt-contact-row {
    display: flex; align-items: center; gap: 10px;
  }
  .cnt-icon-box {
    flex-shrink: 0;
    width: 34px; height: 34px;
    border-radius: 8px;
    background: ${GREEN};
    display: flex; align-items: center; justify-content: center;
    transition: transform 0.2s cubic-bezier(.34,1.56,.64,1);
  }
  .cnt-card:hover .cnt-icon-box { transform: scale(1.1); }
  .cnt-contact-text {
    font-size: 13px; font-weight: 500; color: #252525;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  /* state label */
  .cnt-state-label {
    font-size: clamp(20px,2.4vw,30px);
    font-weight: 700;
    color: #252525;
    letter-spacing: -0.02em;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .cnt-state-label span.cnt-dot {
    display: inline-block;
    width: 10px; height: 10px;
    border-radius: 50%;
    background: ${GREEN};
    flex-shrink: 0;
  }

  /* grid */
  .cnt-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  @media (max-width: 1023px) {
    .cnt-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 599px) {
    .cnt-grid { grid-template-columns: 1fr; }
  }

  /* ── WhatsApp "Join Now" button ── */
  @keyframes cnt-wa-ping {
    0%   { transform: scale(1);   opacity: 0.6; }
    70%  { transform: scale(2.2); opacity: 0;   }
    100% { transform: scale(2.2); opacity: 0;   }
  }
  @keyframes cnt-wa-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes cnt-wa-bounce {
    0%,100% { transform: translateY(0);   }
    30%     { transform: translateY(-4px);}
    60%     { transform: translateY(2px); }
  }
  .cnt-wa-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    position: relative;
    margin-top: 4px;
    padding: 9px 18px 9px 12px;
    border-radius: 999px;
    background: #25D366;
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.01em;
    text-decoration: none;
    cursor: pointer;
    overflow: hidden;
    transition: transform 0.18s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s ease;
    box-shadow: 0 4px 14px rgba(37,211,102,0.35);
  }
  .cnt-wa-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.38) 50%, transparent 100%);
    background-size: 200% 100%;
    background-position: -200% center;
    transition: none;
    pointer-events: none;
  }
  .cnt-wa-btn:hover::before {
    animation: cnt-wa-shimmer 0.6s ease forwards;
  }
  .cnt-wa-btn:hover {
    transform: translateY(-3px) scale(1.04);
    box-shadow: 0 8px 24px rgba(37,211,102,0.45);
  }
  .cnt-wa-btn:active {
    animation: cnt-wa-bounce 0.35s ease;
    transform: scale(0.96);
  }
  .cnt-wa-icon {
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    width: 28px; height: 28px;
    border-radius: 50%;
    background: rgba(255,255,255,0.2);
    transition: transform 0.25s cubic-bezier(.34,1.56,.64,1);
  }
  .cnt-wa-btn:hover .cnt-wa-icon {
    transform: rotate(-15deg) scale(1.15);
  }
  .cnt-wa-label {
    position: relative; z-index: 1;
  }
  .cnt-wa-ping {
    position: absolute;
    top: 8px; right: 10px;
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #fff;
    animation: cnt-wa-ping 1.8s ease-out infinite;
    pointer-events: none;
  }

  /* ── quick contact cards (from talk-to-expert) ── */
  .cnt-qc-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    max-width: 1024px;
    margin: 0 auto;
  }
  @media (min-width: 560px) {
    .cnt-qc-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (min-width: 900px) {
    .cnt-qc-grid { grid-template-columns: repeat(3, 1fr); }
  }
  .cnt-qc-card {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: clamp(10px, 2vw, 16px);
    border-radius: 16px;
    padding: clamp(16px, 3vw, 24px) clamp(14px, 3vw, 24px);
    text-decoration: none;
    transition: transform 0.28s cubic-bezier(.22,.68,0,1.2), box-shadow 0.28s ease;
  }
  .cnt-qc-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.18);
  }
  @keyframes cnt-card-in {
    from { opacity: 0; transform: translate3d(0, 32px, 0); }
    to   { opacity: 1; transform: translate3d(0, 0px, 0);  }
  }

  /* state group divider */
  .cnt-state-group {
    padding-bottom: 48px;
    margin-bottom: 48px;
    border-bottom: 1px solid #ebebeb;
  }
  .cnt-state-group:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }

  /* responsive hero heading */
  @media (max-width: 640px) {
    .cnt-hero-h1 { font-size: clamp(40px,10vw,64px) !important; }
    .cnt-hero-sub { font-size: clamp(18px,5vw,24px) !important; }
  }
`;

/* ══════════════════════════════════════════════════════════════════════
   WAVE DOTS
══════════════════════════════════════════════════════════════════════ */
function WaveDots() {
  const dots = [
    { left: 0, top: 29 }, { left: 31, top: 24 }, { left: 60, top: 29 },
    { left: 93, top: 20 }, { left: 131, top: 29 }, { left: 157, top: 13 },
    { left: 192, top: 29 }, { left: 226, top: 6 }, { left: 270, top: 29 },
    { left: 305, top: 0 },
  ];
  return (
    <div className="cnt-wavedots">
      {dots.map((d, i) => (
        <div key={i} style={{
          position: 'absolute', left: d.left, top: d.top,
          width: 13, height: 13, borderRadius: '50%', background: GREEN,
          animation: `contact-pulse ${1.4 + i * 0.12}s ease-in-out ${i * 0.08}s infinite`,
        }} />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   BRANCH CARD
══════════════════════════════════════════════════════════════════════ */
function BranchCard({ branch }: { branch: Branch }) {
  return (
    <div className="cnt-card">
      {/* City header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <MapPin size={16} color={GREEN} style={{ flexShrink: 0 }} />
        <span className="cnt-card-city">{branch.city}</span>
      </div>

      {branch.address && (
        <p className="cnt-card-addr">{branch.address}</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
        {branch.phone && (
          <div className="cnt-contact-row">
            <div className="cnt-icon-box">
              <Phone size={15} color="#252525" />
            </div>
            <span className="cnt-contact-text">{branch.phone}</span>
          </div>
        )}
        {branch.email && (
          <div className="cnt-contact-row">
            <div className="cnt-icon-box">
              <Mail size={15} color="#252525" />
            </div>
            <span className="cnt-contact-text">{branch.email}</span>
          </div>
        )}
        {branch.whatsapp && (
          <div className="cnt-contact-row">
            <div className="cnt-icon-box">
              <MessageSquare size={15} color="#252525" />
            </div>
            <a
              href={`https://wa.me/${branch.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cnt-contact-text"
              style={{ color: '#252525', textDecoration: 'none' }}
            >
              {branch.whatsapp}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   STATE GROUP with GSAP scroll animation
══════════════════════════════════════════════════════════════════════ */
function StateGroup({ group }: { group: StateGroup }) {
  const groupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = groupRef.current;
    if (!el) return;

    const label = el.querySelector('.cnt-state-label');
    const cards = el.querySelectorAll('.cnt-card');

    const ctx = gsap.context(() => {
      // State label slides in from left
      gsap.fromTo(label,
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0, duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: label,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Cards stagger up
      gsap.fromTo(cards,
        { opacity: 0, y: 48, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.65,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div className="cnt-state-group" ref={groupRef}>
      <div className="cnt-state-label">
        <span className="cnt-dot" />
        {group.flag && <span>{group.flag}</span>}
        {group.state}
      </div>
      <div className="cnt-grid">
        {group.branches.map((branch, i) => (
          <BranchCard key={i} branch={branch} />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   QUICK CONTACT CARDS
══════════════════════════════════════════════════════════════════════ */
const QUICK_CONTACTS = [
  { icon: Phone,          label: '+91 9898989898',      href: 'tel:+919898989898',          bg: GREEN,    iconBg: '#252525', iconColor: GREEN,    text: '#252525' },
  { icon: Mail,           label: 'info@growmedlink.com', href: 'mailto:info@growmedlink.com', bg: '#252525', iconBg: GREEN,    iconColor: '#252525', text: '#fff'    },
  { icon: MessageCircle,  label: '+91 9898989898',      href: 'https://wa.me/919898989898', bg: GREEN,    iconBg: '#252525', iconColor: GREEN,    text: '#252525' },
];

function QuickContactCards() {
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

  return (
    <section ref={ref} style={{ background: '#fff', padding: 'clamp(28px,5vw,56px) clamp(16px,5vw,40px)' }}>
      <div className="cnt-qc-grid">
        {QUICK_CONTACTS.map((c, i) => {
          const Icon = c.icon;
          return (
            <a
              key={i}
              href={c.href}
              className="cnt-qc-card"
              style={{
                background: c.bg,
                opacity: visible ? 1 : 0,
                animation: visible
                  ? `cnt-card-in 0.6s cubic-bezier(.22,.68,0,1.2) ${i * 0.12}s both`
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
                fontSize: 'clamp(13px,1.4vw,17px)',
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
  );
}

/* ══════════════════════════════════════════════════════════════════════
   FIELD LABEL
══════════════════════════════════════════════════════════════════════ */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ fontSize: 13, fontWeight: 400, color: GREEN, display: 'block' }}>
      {children}
    </label>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   ROOT EXPORT
══════════════════════════════════════════════════════════════════════ */
export default function ContactPageClient() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', subject: '', message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  // GSAP animate the section heading
  const locHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = locHeadingRef.current;
    if (!el) return;
    gsap.fromTo(el,
      { opacity: 0, y: 32 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      }
    );
  }, []);

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: heroVisible ? 1 : 0,
    transform: heroVisible ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.75s cubic-bezier(.22,.68,0,1.2) ${delay}ms,
                 transform 0.75s cubic-bezier(.22,.68,0,1.2) ${delay}ms`,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const name = `${formData.firstName} ${formData.lastName}`.trim();
    try {
      await submitEnquiry({
        name, email: formData.email, phone: formData.phone,
        subject: formData.subject, message: formData.message,
        type: ENQUIRY_TYPES.CONTACT_FORM, source: 'contact',
        pageUrl: typeof window !== 'undefined' ? window.location.href : '',
      });
      setSuccess(true);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="cnt">
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      {/* ══════════ HERO / FORM ══════════ */}
      <section
        className="cnt-hero relative bg-[#141414]"
        style={{ padding: 'clamp(64px,10vw,112px) clamp(16px,5vw,32px)' }}
      >
        {/* Glows */}
        <div className="pointer-events-none absolute -right-32 top-40 h-[380px] w-[450px] rounded-full bg-[#3a5f00]/35 blur-[100px]" />
        <div className="pointer-events-none absolute -left-20 top-24 h-[380px] w-[450px] rotate-180 rounded-full bg-[#74b214]/20 blur-[100px]" />

        {/* Wave dots */}
        <div className="pointer-events-none absolute bottom-6 left-4 hidden sm:block lg:left-8">
          <WaveDots />
        </div>

        <div style={{ position: 'relative', maxWidth: 768, margin: '0 auto', textAlign: 'center' }}>
          {/* Sunburst */}
          <div className="pointer-events-none absolute left-1/2 top-1/2" style={{
            width: 'min(70vw, 620px)', height: 'min(70vw, 620px)',
            opacity: 0.25,
            animation: 'contact-sunburst-spin 80s linear infinite',
            transform: 'translate3d(-50%,-50%,0) rotate(0deg)',
          }}>
            <Image src="/sunburst-lines.png" alt="" fill style={{ objectFit: 'contain' }} priority />
          </div>

          {/* Heading */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <h1
              className="cnt-hero-h1"
              style={{
                position: 'relative', zIndex: 10,
                fontWeight: 500, letterSpacing: '-0.03em', color: '#fff',
                fontSize: 'clamp(48px,7vw,88px)',
                ...fadeUp(100),
              }}
            >
              Contact Us<span style={{ color: GREEN }}>.</span>
            </h1>

            {/* Curly arrow label — desktop only */}
            <div className="pointer-events-none absolute top-10 hidden lg:block" style={{
              right: '-14rem', width: 220,
              opacity: heroVisible ? 1 : 0,
              animation: heroVisible
                ? 'contact-reveal 0.75s cubic-bezier(.22,.68,0,1.2) 700ms both, contact-arrow-float 2.6s ease-in-out 1.4s infinite'
                : 'none',
            }}>
              <div style={{ transform: 'rotate(125deg) scaleX(-1)', transformOrigin: 'top left', display: 'inline-block' }}>
                <Image src="/curly-arrow.png" alt="" width={96} height={60}
                  style={{ width: 78, height: 'auto', display: 'block' }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }} />
              </div>
              <span style={{
                position: 'absolute', top: -30, left: 64,
                fontFamily: FS, fontSize: 'clamp(20px,2vw,26px)',
                color: GREEN, display: 'inline-block',
                transform: 'rotate(-4deg)', whiteSpace: 'nowrap',
              }}>
                Get In Touch<br />With Us
              </span>
            </div>
          </div>

          {/* Sub */}
          <p className="cnt-hero-sub" style={{
            marginTop: 16, fontWeight: 300, color: GREEN,
            fontSize: 'clamp(18px,2.5vw,35px)',
            ...fadeUp(220),
          }}>
            Tell Us What&apos;s on Your Mind?
          </p>

          {/* Form / Success */}
          {success ? (
            <div style={{
              marginTop: 40, borderRadius: 16,
              border: `1px solid ${GREEN}`,
              background: 'rgba(150,202,69,0.1)',
              padding: 'clamp(32px,5vw,48px)',
            }}>
              <h3 style={{ fontSize: 24, fontWeight: 600, color: GREEN, marginBottom: 12 }}>Message Sent!</h3>
              <p style={{ fontSize: 15, color: '#fff' }}>Thank you for reaching out. We will get back to you shortly.</p>
              <button
                onClick={() => setSuccess(false)}
                style={{
                  marginTop: 24, padding: '10px 28px', borderRadius: 8,
                  border: '1px solid #fff', color: '#fff', background: 'transparent',
                  cursor: 'pointer', fontSize: 14, transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 20, textAlign: 'left', ...fadeUp(340) }}>
              {/* Row: First + Last */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <FieldLabel>First Name*</FieldLabel>
                  <input type="text" name="firstName" placeholder="Enter" className="cnt-input"
                    value={formData.firstName} onChange={handleChange} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <FieldLabel>Last Name*</FieldLabel>
                  <input type="text" name="lastName" placeholder="Enter" className="cnt-input"
                    value={formData.lastName} onChange={handleChange} required />
                </div>
              </div>

              {/* Row: Email + Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <FieldLabel>Email*</FieldLabel>
                  <input type="email" name="email" placeholder="Enter" className="cnt-input"
                    value={formData.email} onChange={handleChange} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <FieldLabel>Phone Number*</FieldLabel>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    height: 52, borderRadius: 8,
                    background: 'rgba(255,255,255,0.04)', padding: '0 20px',
                    border: '1px solid transparent',
                  }}>
                    <span style={{ fontSize: 14, color: '#fff', whiteSpace: 'nowrap' }}>+91</span>
                    <span style={{ width: 1, height: 24, background: GREEN, flexShrink: 0 }} />
                    <input type="tel" name="phone" placeholder="Enter"
                      style={{ flex: 1, background: 'transparent', fontSize: 14, color: '#fff', outline: 'none', border: 'none', minWidth: 0 }}
                      value={formData.phone} onChange={handleChange} required />
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <FieldLabel>Subject*</FieldLabel>
                <input type="text" name="subject" placeholder="Enter" className="cnt-input"
                  value={formData.subject} onChange={handleChange} required />
              </div>

              {/* Message */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <FieldLabel>Tell Us More*</FieldLabel>
                <textarea name="message" placeholder="Enter" className="cnt-textarea"
                  value={formData.message} onChange={handleChange} required />
              </div>

              {error && (
                <div style={{
                  borderRadius: 8, border: '1px solid rgba(248,113,113,0.3)',
                  background: 'rgba(248,113,113,0.1)', padding: '12px 16px',
                  fontSize: 14, color: '#f87171',
                }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" disabled={isSubmitting} style={{
                  borderRadius: 8, background: GREEN,
                  padding: '12px 36px', fontSize: 14, fontWeight: 600,
                  color: '#000', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.5 : 1,
                  transition: 'transform 0.2s ease, opacity 0.2s',
                }}
                  onMouseEnter={e => { if (!isSubmitting) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
                >
                  {isSubmitting ? 'Submitting…' : 'Submit'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ══════════ QUICK CONTACT CARDS ══════════ */}
      <QuickContactCards />

      {/* ══════════ LOCATIONS SECTION ══════════ */}
      <section style={{ background: '#f8f9fa', padding: 'clamp(48px,7vw,96px) clamp(16px,5vw,72px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Section heading */}
          <h2 ref={locHeadingRef} style={{
            fontSize: 'clamp(28px,4vw,52px)',
            fontWeight: 700,
            color: '#252525',
            letterSpacing: '-0.025em',
            marginBottom: 'clamp(32px,5vw,56px)',
            opacity: 0,
          }}>
            Our <span style={{ color: GREEN }}>Locations</span>
          </h2>

          {/* State groups */}
          {LOCATIONS.map((group, i) => (
            <StateGroup key={i} group={group} />
          ))}
        </div>
      </section>
      <WhatsAppButton pageType="contact" />
    </main>
  );
}
