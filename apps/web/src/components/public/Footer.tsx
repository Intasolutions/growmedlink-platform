import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GraduationCap, MapPin, Phone, Mail, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

interface FooterProps {
  settings: any;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#020C1B] border-t border-[#1E2D3D] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & About */}
          <div className="space-y-6">
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
            <p className="text-gray-400 text-sm leading-relaxed">
              {settings?.seoDefaultDescription || "Empowering your global journey with expert immigration services and professional language training."}
            </p>
            {/* Socials */}
            <div className="flex items-center gap-4">
              {settings?.socialLinks?.facebook && (
                <a href={settings.socialLinks.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#0A192F] flex items-center justify-center text-gray-400 hover:text-white hover:bg-secondary transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {settings?.socialLinks?.instagram && (
                <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#0A192F] flex items-center justify-center text-gray-400 hover:text-white hover:bg-secondary transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {settings?.socialLinks?.linkedin && (
                <a href={settings.socialLinks.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#0A192F] flex items-center justify-center text-gray-400 hover:text-white hover:bg-secondary transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {settings?.socialLinks?.twitter && (
                <a href={settings.socialLinks.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#0A192F] flex items-center justify-center text-gray-400 hover:text-white hover:bg-secondary transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold tracking-wide uppercase text-sm mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-gray-400 hover:text-secondary text-sm transition-colors">About Us</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-secondary text-sm transition-colors">Our Services</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-secondary text-sm transition-colors">Insights & Blog</Link></li>
              <li><Link href="/talk-to-expert" className="text-gray-400 hover:text-secondary text-sm transition-colors">Talk To Expert</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-secondary text-sm transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold tracking-wide uppercase text-sm mb-6">Services</h3>
            <ul className="space-y-4">
              <li><Link href="/services?category=immigration" className="text-gray-400 hover:text-secondary text-sm transition-colors">Student Visas</Link></li>
              <li><Link href="/services?category=immigration" className="text-gray-400 hover:text-secondary text-sm transition-colors">Skilled Migration</Link></li>
              <li><Link href="/services?category=language" className="text-gray-400 hover:text-secondary text-sm transition-colors">IELTS Coaching</Link></li>
              <li><Link href="/services?category=language" className="text-gray-400 hover:text-secondary text-sm transition-colors">PTE Training</Link></li>
              <li><Link href="/services?category=language" className="text-gray-400 hover:text-secondary text-sm transition-colors">OET Preparation</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold tracking-wide uppercase text-sm mb-6">Contact Us</h3>
            <ul className="space-y-5">
              {settings?.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                  <span className="text-gray-400 text-sm leading-relaxed">{settings.address}</span>
                </li>
              )}
              {settings?.contactPhone && (
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-secondary shrink-0" />
                  <a href={`tel:${settings.contactPhone}`} className="text-gray-400 hover:text-secondary text-sm transition-colors">{settings.contactPhone}</a>
                </li>
              )}
              {settings?.contactEmail && (
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-secondary shrink-0" />
                  <a href={`mailto:${settings.contactEmail}`} className="text-gray-400 hover:text-secondary text-sm transition-colors">{settings.contactEmail}</a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#1E2D3D] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            © {currentYear} {settings?.companyName || 'Intelligen'}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-gray-500 hover:text-white text-sm transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-500 hover:text-white text-sm transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
