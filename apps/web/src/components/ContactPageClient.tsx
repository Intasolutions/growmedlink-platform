'use client';

import React, { useState, useRef, FormEvent, useEffect } from 'react';
import Image from 'next/image';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { submitEnquiry } from '@/lib/api/enquiries';
import { ENQUIRY_TYPES } from '@intelligen/constants';

const FS = "'Great Day Personal Use','Brush Script MT',cursive";

/* Same rotating halo / pulsing dots / floating arrow used on the Home hero */
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
    to   { opacity: 1; transform: translate3d(0, 0px, 0);    }
  }
`;

/* ══════════════════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════════════ */
const LOCATIONS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1587474260580-57521c7d23d9?auto=format&fit=crop&q=80&w=800',
    country: 'INDIA',
    address: "Peter's Nine Building, Event Global 247 Spaces, 27/217B, Thodupuzha, Kerala, India, 685584",
    phone: '+91 9898989898',
    email: 'info@gromedlink.com',
    whatsapp: '+91 9898989898',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1587474260580-57521c7d23d9?auto=format&fit=crop&q=80&w=800',
    country: 'INDIA',
    address: "Peter's Nine Building, Event Global 247 Spaces, 27/217B, Thodupuzha, Kerala, India, 685584",
    phone: '+91 9898989898',
    email: 'info@gromedlink.com',
    whatsapp: '+91 9898989898',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1587474260580-57521c7d23d9?auto=format&fit=crop&q=80&w=800',
    country: 'INDIA',
    address: "Peter's Nine Building, Event Global 247 Spaces, 27/217B, Thodupuzha, Kerala, India, 685584",
    phone: '+91 9898989898',
    email: 'info@gromedlink.com',
    whatsapp: '+91 9898989898',
  },
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-light text-[#96CA45]">{children}</label>;
}

const inputClass =
  'w-full bg-white/[0.04] rounded-lg px-5 h-[52px] text-sm text-white placeholder:text-white/40 outline-none focus:ring-1 focus:ring-[#96CA45] transition';

/* ─── Wave dots — identical decoration to the Home hero, just reused ─── */
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
            background: '#96CA45',
            animation: `contact-pulse ${1.4 + i * 0.12}s ease-in-out ${i * 0.08}s infinite`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   ROOT EXPORT
══════════════════════════════════════════════════════════════════════ */
export default function ContactPageClient() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Hero entrance animation
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Locations scroll-reveal
  const locationsRef = useRef<HTMLDivElement>(null);
  const [locationsVisible, setLocationsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLocationsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (locationsRef.current) observer.observe(locationsRef.current);
    return () => observer.disconnect();
  }, []);

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: heroVisible ? 1 : 0,
    transform: heroVisible ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.75s cubic-bezier(.22,.68,0,1.2) ${delay}ms,
                 transform 0.75s cubic-bezier(.22,.68,0,1.2) ${delay}ms`,
  });

  const cardFadeUp = (delay: number): React.CSSProperties => ({
    opacity: locationsVisible ? 1 : 0,
    transform: locationsVisible ? 'translateY(0)' : 'translateY(36px)',
    transition: `opacity 0.7s cubic-bezier(.22,.68,0,1.2) ${delay}ms,
                 transform 0.7s cubic-bezier(.22,.68,0,1.2) ${delay}ms`,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError(null);

    const name = `${formData.firstName} ${formData.lastName}`.trim();

    try {
      await submitEnquiry({
        name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        type: ENQUIRY_TYPES.CONTACT_FORM,
        source: 'contact',
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
    <main>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      {/* ══════════════════════ HERO / FORM SECTION ══════════════════════ */}
      <section className="relative overflow-hidden bg-[#141414] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        {/* Decorative glows */}
        <div className="pointer-events-none absolute -right-32 top-40 h-[380px] w-[450px] rounded-full bg-[#3a5f00]/35 blur-[100px]" />
        <div className="pointer-events-none absolute -left-20 top-24 h-[380px] w-[450px] rotate-180 rounded-full bg-[#74b214]/20 blur-[100px]" />

        {/* Green wave dots — reused from the Home hero, bottom-left, never overlaps content */}
        <div className="pointer-events-none absolute bottom-6 left-4 hidden sm:block lg:left-8">
          <WaveDots />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="relative inline-block">
            {/* Rotating sunburst halo — same asset/animation as the Home/About/Services hero */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2"
              style={{
                width: 'clamp(280px, 70vw, 620px)',
                height: 'clamp(280px, 70vw, 620px)',
                opacity: 0.25,
                animation: 'contact-sunburst-spin 80s linear infinite',
                willChange: 'transform',
              }}
            >
              <Image src="/sunburst-lines.png" alt="" fill style={{ objectFit: 'contain' }} priority />
            </div>

            <h1
              className="relative z-10 text-5xl font-medium tracking-tight text-white sm:text-6xl lg:text-7xl"
              style={fadeUp(100)}
            >
              Contact Us<span className="text-[#96CA45]">.</span>
            </h1>

            {/* Curly arrow + handwritten label — same asset & float/reveal animation as the Home hero,
                pointing down toward the form */}
            <div
              className="pointer-events-none absolute top-10 hidden lg:block"
              style={{
                right: '-14rem',
                width: '220px',
                opacity: heroVisible ? 1 : 0,
                animation: heroVisible
                  ? 'contact-reveal 0.75s cubic-bezier(.22,.68,0,1.2) 700ms both, contact-arrow-float 2.6s ease-in-out 1.4s infinite'
                  : 'none',
                willChange: 'transform, opacity',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transformStyle: 'preserve-3d',
              }}
            >
              <div style={{ transform: 'rotate(125deg) scaleX(-1)', transformOrigin: 'top left', display: 'inline-block' }}>
                <Image
                  src="/curly-arrow.png"
                  alt=""
                  width={96}
                  height={60}
                  style={{ width: '78px', height: 'auto', display: 'block' }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
                />
              </div>
              <span
                style={{
                  position: 'absolute',
                  top: '-30px',
                  left: '64px',
                  fontFamily: FS,
                  fontSize: 'clamp(20px,2vw,26px)',
                  lineHeight: '1.3',
                  paddingBottom: '8px',
                  color: '#96CA45',
                  display: 'inline-block',
                  transform: 'rotate(-4deg)',
                  transformOrigin: 'left top',
                  whiteSpace: 'nowrap',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                }}
              >
                Get In Touch
                <br />
                With Us
              </span>
            </div>
          </div>

          <p
            className="mt-4 text-xl font-light text-[#96CA45] sm:text-2xl lg:text-[35px]"
            style={fadeUp(220)}
          >
            Tell Us What&apos;s on Your Mind?
          </p>

          {success ? (
            <div className="mt-10 rounded-xl border border-[#96CA45] bg-[#96CA45]/10 p-10 text-center">
              <h3 className="mb-3 text-2xl font-semibold text-[#96CA45]">Message Sent!</h3>
              <p className="text-base text-white">Thank you for reaching out. We will get back to you shortly.</p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-6 rounded border border-white px-6 py-2.5 text-white transition hover:bg-white/10"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5 text-left" style={fadeUp(340)}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2.5">
                  <FieldLabel>First Name*</FieldLabel>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter"
                    className={inputClass}
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2.5">
                  <FieldLabel>Last Name*</FieldLabel>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter"
                    className={inputClass}
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2.5">
                  <FieldLabel>Email*</FieldLabel>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter"
                    className={inputClass}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2.5">
                  <FieldLabel>Phone Number*</FieldLabel>
                  <div className="flex h-[52px] items-center gap-3 rounded-lg bg-white/[0.04] px-5">
                    <span className="text-sm text-white">+91</span>
                    <span className="h-6 w-px bg-[#96CA45]" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter"
                      className="h-full flex-1 bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <FieldLabel>Subject*</FieldLabel>
                <input
                  type="text"
                  name="subject"
                  placeholder="Enter"
                  className={inputClass}
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col gap-2.5">
                <FieldLabel>Tell Us More*</FieldLabel>
                <textarea
                  name="message"
                  placeholder="Enter"
                  className="min-h-[120px] w-full resize-y rounded-lg bg-white/[0.04] px-5 py-4 text-sm text-white placeholder:text-white/40 outline-none focus:ring-1 focus:ring-[#96CA45]"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && (
                <div className="-mt-2 whitespace-pre-line rounded-md border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-md bg-[#96CA45] px-8 py-3 text-sm font-semibold text-black transition hover:opacity-90 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ══════════════════════ LOCATIONS SECTION ══════════════════════ */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl" ref={locationsRef}>
          <h2
            className="mb-14 text-4xl font-bold tracking-tight text-[#252525] sm:text-5xl lg:text-[56px]"
            style={cardFadeUp(0)}
          >
            Our <span className="text-[#96CA45]">Locations</span>
          </h2>

          <div className="flex flex-col gap-14">
            {LOCATIONS.map((loc, i) => (
              <div
                key={loc.id}
                className="flex flex-col gap-10 border-b border-[#B6B6B6] pb-10 last:border-0 lg:flex-row"
                style={cardFadeUp(120 + i * 130)}
              >
                <div className="relative h-[220px] overflow-hidden rounded-2xl lg:h-[270px] lg:w-[45%]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={loc.image} alt={loc.country} className="h-full w-full object-cover" />
                </div>

                <div className="flex flex-1 flex-col justify-center gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl leading-none">🇮🇳</span>
                    <span className="text-xl font-medium tracking-wide text-[#96CA45]">{loc.country}</span>
                  </div>

                  <p className="max-w-md text-base leading-relaxed text-[#252525]">{loc.address}</p>

                  <div className="mt-2 flex flex-col gap-3">
                    {loc.phone && (
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#96CA45] transition-transform hover:scale-110">
                          <Phone className="h-5 w-5 text-[#252525]" />
                        </div>
                        <span className="text-base font-medium text-black">{loc.phone}</span>
                      </div>
                    )}
                    {loc.email && (
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#96CA45] transition-transform hover:scale-110">
                          <Mail className="h-5 w-5 text-[#252525]" />
                        </div>
                        <span className="text-base font-medium text-black">{loc.email}</span>
                      </div>
                    )}
                    {loc.whatsapp && (
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#96CA45] transition-transform hover:scale-110">
                          <MessageCircle className="h-5 w-5 text-[#252525]" />
                        </div>
                        <span className="text-base font-medium text-black">{loc.whatsapp}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
