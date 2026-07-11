'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  settings: any;
}

const LOGO_VARIANTS = [
  { src: '/Logo/logo_1.png', width: 270, height: 60 }, // full lockup
  { src: '/Logo/logo_2.png', width: 90, height: 84 },  // icon only
  { src: '/Logo/logo_3.png', width: 240, height: 66 }, // wordmark only
];

const LOGO_INTERVAL_MS = 3200;
const LOGO_TRANSITION_MS = 650;

function LogoCarousel() {
  const [index, setIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection((prevDir) => (prevDir === 1 ? -1 : 1));
      setNextIndex((index + 1) % LOGO_VARIANTS.length);
    }, LOGO_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [index]);

  useEffect(() => {
    if (nextIndex === null) return;
    const t = setTimeout(() => {
      setIndex(nextIndex);
      setNextIndex(null);
    }, LOGO_TRANSITION_MS);
    return () => clearTimeout(t);
  }, [nextIndex]);

  const current = LOGO_VARIANTS[index];
  const incoming = nextIndex !== null ? LOGO_VARIANTS[nextIndex] : null;

  return (
    <div
      className="relative overflow-hidden"
      style={{ width: 130, height: 52 }}
    >
      {/* Outgoing logo */}
      <div
        key={`out-${index}`}
        className="absolute inset-0 flex items-center justify-center"
        style={
          incoming
            ? {
                animation: `navbar-logo-out-${direction === 1 ? 'right' : 'left'} ${LOGO_TRANSITION_MS}ms cubic-bezier(.55,0,.1,1) forwards`,
              }
            : undefined
        }
      >
        <Image
          src={current.src}
          alt="GrowMedLink"
          width={current.width}
          height={current.height}
          className="h-12 w-auto object-contain md:h-[52px]"
          priority
        />
      </div>

      {/* Incoming logo */}
      {incoming && (
        <div
          key={`in-${nextIndex}`}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            animation: `navbar-logo-in-${direction === 1 ? 'left' : 'right'} ${LOGO_TRANSITION_MS}ms cubic-bezier(.16,1,.3,1) both`,
          }}
        >
          <Image
            src={incoming.src}
            alt="GrowMedLink"
            width={incoming.width}
            height={incoming.height}
            className="h-12 w-auto object-contain md:h-[52px]"
            priority
          />
        </div>
      )}

      {/* Logo carousel keyframes are in globals.css */}
    </div>
  );
}

const IDLE_MS = 1000;

export default function Navbar({ settings }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isOpenRef = useRef(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hiddenRef = useRef(false);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    // GSAP owns the full transform — set initial state so xPercent centres it
    // (mirrors Tailwind's -translate-x-1/2 which we keep as a CSS fallback before JS runs)
    let gsapInstance: any = null;

    const cleanup = { fns: [] as (() => void)[] };
    let cancelled = false;

    const navEl = el;

    // Auto-hide-on-idle only makes sense with a mouse/trackpad — on touch
    // devices there's no hover to "wake" the nav between taps, so it would
    // stay hidden and unreachable. Skip the whole behaviour there.
    const isCoarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (isCoarsePointer) return;

    import('gsap').then(({ gsap }) => {
      if (cancelled) return;
      gsapInstance = gsap;
      // Initialise transform so GSAP controls both axes
      gsap.set(navEl, { xPercent: -50, yPercent: 0, opacity: 1 });
      // Remove Tailwind's translate so they don't fight
      navEl.style.left = '50%';
      navEl.style.transform = '';

      function hide() {
        if (hiddenRef.current || isOpenRef.current) return;
        hiddenRef.current = true;
        gsap.to(navEl, {
          yPercent: -200,
          opacity: 0,
          duration: 0.5,
          ease: 'power3.in',
          onComplete: () => { navEl.style.pointerEvents = 'none'; },
        });
      }

      function show() {
        if (!hiddenRef.current) return;
        hiddenRef.current = false;
        navEl.style.pointerEvents = 'auto';
        gsap.to(navEl, {
          yPercent: 0,
          opacity: 1,
          duration: 0.45,
          ease: 'power3.out',
        });
      }

      function wake() {
        show();
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(hide, IDLE_MS);
      }

      const events = ['mousemove', 'mousedown', 'touchstart', 'keydown', 'scroll', 'wheel'];
      events.forEach(e => window.addEventListener(e, wake, { passive: true }));
      timerRef.current = setTimeout(hide, IDLE_MS);

      cleanup.fns.push(() => {
        events.forEach(e => window.removeEventListener(e, wake));
        if (timerRef.current) clearTimeout(timerRef.current);
        gsap.killTweensOf(navEl);
      });
    });

    return () => {
      cancelled = true;
      cleanup.fns.forEach(fn => fn());
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Products', href: '/products' },
    { name: 'Services', href: '/services' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header
      ref={headerRef}
      className="fixed top-4 md:top-6 lg:top-8 left-1/2 z-50 w-[95%] md:w-full max-w-[680px] lg:max-w-[1180px]"
      style={{ transform: 'translateX(-50%)' }}
    >
      {/* Floating Pill / Bar Container — pill shape on mobile/tablet, wide bar on desktop */}
      <div className="h-[68px] md:h-[76px] lg:h-[84px] w-full rounded-full lg:rounded-[42px] bg-[rgba(37,37,37,1)] overflow-hidden shadow-2xl flex items-center justify-between py-2 pl-4 md:pl-7 lg:pl-8 pr-2 lg:pr-3 box-border border border-white/10">

        {/* Left: Menu Toggle (mobile/tablet) — hidden on desktop in favor of inline links */}
        <div className="flex flex-col items-start justify-center h-full lg:hidden">
          <button
            onClick={() => { const next = !isOpen; isOpenRef.current = next; setIsOpen(next); }}
            className="flex items-center gap-2 md:gap-3.5 text-white hover:text-[#96ca45] transition-colors"
          >
            {isOpen ? <X className="h-5 w-5 md:h-6 md:w-6" /> : <Menu className="h-5 w-5 md:h-6 md:w-6" />}
            <div className="font-medium font-['Power_Grotesk'] tracking-wide text-sm md:text-base hidden sm:block">Menu</div>
          </button>
        </div>

        {/* Left: Logo (desktop) */}
        <div className="hidden lg:flex items-center h-full">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoCarousel />
          </Link>
        </div>

        {/* Center: Logo (mobile/tablet only) */}
        <div className="flex flex-col items-center justify-center h-full lg:hidden">
          <Link href="/" className="flex items-center justify-center gap-2.5">
            <LogoCarousel />
          </Link>
        </div>

        {/* Center: Inline nav links (desktop only) */}
        <nav className="navlinks hidden lg:flex items-center gap-2 flex-1 justify-center">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`navlink relative px-4 py-2.5 font-['Power_Grotesk'] text-[15px] font-medium tracking-wide transition-colors duration-300 ${
                  isActive ? 'navlink-active text-[#96ca45]' : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
        {/* navlink underline styles are in globals.css */}

        {/* Right: Join Button → WhatsApp */}
        {(() => {
          const phone = settings?.contactPhone ? settings.contactPhone.replace(/[^0-9]/g, '') : '';
          const waHref = phone
            ? `https://wa.me/${phone}?text=${encodeURIComponent('Hello! I would like to join GrowMedLink and learn more about your nursing programs.')}`
            : 'https://wa.me/';
          return (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer border-none py-2 px-4 md:px-6 lg:px-7 bg-[rgba(150,202,69,1)] h-[44px] md:h-[44px] lg:h-[54px] min-w-[70px] md:min-w-[95px] lg:min-w-[120px] rounded-full flex items-center justify-center hover:bg-opacity-90 transition-all transform hover:scale-[1.02] active:scale-[0.98] shrink-0"
              style={{ textDecoration: 'none' }}
            >
              <div className="text-base md:text-lg font-semibold font-['Haffer_XH_Mono-TRIAL'] text-[#000]">
                Join
              </div>
            </a>
          );
        })()}
      </div>

      {/* Mobile / Dropdown Navigation (Hidden when closed, hidden on desktop) */}
      {isOpen && (
        <div className="lg:hidden absolute top-[70px] md:top-[80px] left-0 right-0 bg-[rgba(37,37,37,1)] rounded-md border border-white/10 shadow-2xl overflow-hidden mt-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="py-2 flex flex-col">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => { isOpenRef.current = false; setIsOpen(false); }}
                  className={`px-7 py-4 font-['Power_Grotesk'] text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-white/5 text-[rgba(150,202,69,1)] border-l-4 border-[rgba(150,202,69,1)]'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
