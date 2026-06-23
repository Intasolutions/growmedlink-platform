'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, GraduationCap } from 'lucide-react';

interface NavbarProps {
  settings: any;
}

export default function Navbar({ settings }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="fixed top-4 md:top-8 left-1/2 -translate-x-1/2 z-50 w-[95%] md:w-full max-w-[680px] transition-all">
      {/* Floating Pill Container */}
      <div className="h-[60px] md:h-[60px] w-full rounded-full bg-[rgba(37,37,37,1)] overflow-hidden shadow-2xl flex items-center justify-between py-2 pl-4 md:pl-7 pr-2 box-border border border-white/10">
        
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
            {settings?.logo ? (
              <Image
                src={typeof settings.logo === 'object' ? settings.logo.secureUrl : settings.logo}
                alt={settings.companyName || 'Intelligen'}
                width={150}
                height={35}
                className="h-8 w-auto object-contain"
              />
            ) : (
              <Image
                src="/logo.png"
                alt="GrowMedLink"
                width={180}
                height={40}
                className="h-8 w-auto object-contain"
              />
            )}
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
