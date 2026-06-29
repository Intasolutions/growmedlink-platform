'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, GraduationCap } from 'lucide-react';

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
  const sign = direction === 1 ? 1 : -1;

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

      <style jsx>{`
        @keyframes navbar-logo-in-left {
          from { opacity: 0; transform: translateX(-130%) scale(0.85); filter: blur(2px); }
          to   { opacity: 1; transform: translateX(0) scale(1);       filter: blur(0); }
        }
        @keyframes navbar-logo-in-right {
          from { opacity: 0; transform: translateX(130%) scale(0.85); filter: blur(2px); }
          to   { opacity: 1; transform: translateX(0) scale(1);       filter: blur(0); }
        }
        @keyframes navbar-logo-out-right {
          from { opacity: 1; transform: translateX(0) scale(1);       filter: blur(0); }
          to   { opacity: 0; transform: translateX(130%) scale(0.85); filter: blur(2px); }
        }
        @keyframes navbar-logo-out-left {
          from { opacity: 1; transform: translateX(0) scale(1);       filter: blur(0); }
          to   { opacity: 0; transform: translateX(-130%) scale(0.85); filter: blur(2px); }
        }
      `}</style>
    </div>
  );
}

export default function Navbar({ settings }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Products', href: '/products' },
    { name: 'Services', href: '/services' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="fixed top-4 md:top-8 left-1/2 -translate-x-1/2 z-50 w-[95%] md:w-full max-w-[680px] transition-all">
      {/* Floating Pill Container */}
      <div className="h-[68px] md:h-[76px] w-full rounded-full bg-[rgba(37,37,37,1)] overflow-hidden shadow-2xl flex items-center justify-between py-2 pl-4 md:pl-7 pr-2 box-border border border-white/10">
        
        {/* Left: Menu Toggle */}
        <div className="flex flex-col items-start justify-center h-full">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 md:gap-3.5 text-white hover:text-[#96ca45] transition-colors"
          >
            {isOpen ? <X className="h-5 w-5 md:h-6 md:w-6" /> : <Menu className="h-5 w-5 md:h-6 md:w-6" />}
            <div className="font-medium font-['Power_Grotesk'] tracking-wide text-sm md:text-base hidden sm:block">Menu</div>
          </button>
        </div>

        {/* Center: Logo */}
        <div className="flex flex-col items-center justify-center h-full">
          <Link href="/" className="flex items-center justify-center gap-2.5">
            <LogoCarousel />
          </Link>
        </div>

        {/* Right: Join Button */}
        <Link 
          href="/talk-to-expert"
          className="cursor-pointer border-none py-2 px-4 md:px-6 bg-[rgba(150,202,69,1)] h-[44px] md:h-[4z4px] min-w-[70px] md:min-w-[95px] rounded-full flex items-center justify-center hover:bg-opacity-90 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
          <div className="text-base md:text-lg font-semibold font-['Haffer_XH_Mono-TRIAL'] text-[#000]">
            Join
          </div>
        </Link>
      </div>

      {/* Mobile / Dropdown Navigation (Hidden when closed) */}
      {isOpen && (
        <div className="absolute top-[70px] md:top-[80px] left-0 right-0 bg-[rgba(37,37,37,1)] rounded-md border border-white/10 shadow-2xl overflow-hidden mt-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="py-2 flex flex-col">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
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
