'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, GraduationCap, Phone } from 'lucide-react';

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A192F]/80 backdrop-blur-md border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-3">
              {settings?.logo ? (
                <Image
                  src={typeof settings.logo === 'object' ? settings.logo.secureUrl : settings.logo}
                  alt={settings.companyName || 'Intelligen'}
                  width={150}
                  height={40}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <>
                  <GraduationCap className="h-8 w-8 text-secondary" />
                  <span className="font-heading font-black text-xl tracking-tight text-white">
                    {settings?.companyName || 'Intelligen'}
                  </span>
                </>
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-semibold tracking-wide transition-colors ${
                    isActive ? 'text-secondary' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {settings?.contactPhone && (
              <a href={`tel:${settings.contactPhone}`} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
                <Phone className="h-4 w-4 text-secondary" />
                <span className="font-medium">{settings.contactPhone}</span>
              </a>
            )}
            <Link
              href="/talk-to-expert"
              className="bg-secondary text-[#020C1B] px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-secondary-dark transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Talk to Expert
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-[#0A192F] border-b border-white/5 absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-2 shadow-xl">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-semibold ${
                    isActive ? 'bg-secondary/10 text-secondary' : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            <div className="pt-4 mt-2 border-t border-white/5">
              <Link
                href="/talk-to-expert"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-secondary text-[#020C1B] px-5 py-3 rounded-xl font-bold text-base"
              >
                Talk to Expert
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
