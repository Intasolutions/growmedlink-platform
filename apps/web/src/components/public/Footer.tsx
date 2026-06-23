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
    <footer className="bg-white font-['Power_Grotesk'] border-t-2 border-[rgba(150,202,69,1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">

          {/* LEFT: Logo + Description + Contact */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
            {settings?.logo ? (
              <Image
                src={typeof settings.logo === 'object' ? settings.logo.secureUrl : settings.logo}
                alt={settings.companyName || 'Intelligen'}
                width={160}
                height={40}
                className="h-10 w-auto object-contain"
              />
            ) : (
              <Image
                src="/logo.png"
                alt="GrowMedLink"
                width={180}
                height={48}
                className="h-10 w-auto object-contain"
              />
            )}
            </Link>

            <p className="text-gray-700 text-sm leading-relaxed">
              {settings?.seoDefaultDescription || "Empowering your global journey with expert immigration services and professional language training."}
            </p>

            <ul className="space-y-4 pt-2">
              {settings?.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[rgba(150,202,69,1)] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#1a5f97] font-semibold text-sm block mb-1">Bangalore</span>
                    <span className="text-gray-700 text-sm leading-relaxed block">{settings.address}</span>
                  </div>
                </li>
              )}
              {settings?.contactEmail && (
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-[rgba(150,202,69,1)] shrink-0" />
                  <a href={`mailto:${settings.contactEmail}`} className="text-gray-700 hover:text-[rgba(150,202,69,1)] text-sm transition-colors">
                    {settings.contactEmail}
                  </a>
                </li>
              )}
              {settings?.contactPhone && (
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-[rgba(150,202,69,1)] shrink-0" />
                  <a href={`tel:${settings.contactPhone}`} className="text-gray-700 hover:text-[rgba(150,202,69,1)] text-sm transition-colors">
                    {settings.contactPhone}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* COMBINED: Dark card containing links and the inner Green card */}
          <div className="lg:col-span-2 rounded-[24px] bg-[rgba(37,37,37,1)] flex border border-white/10 p-2 md:p-3">

            {/* Left panel: Dark with links */}
            <div className="flex-1 p-6 relative overflow-hidden flex flex-col">
              {/* Background Image Container */}
              <div className="absolute inset-0 pointer-events-none opacity-50 bg-[url('/footer-bg-dark.png')] bg-cover bg-center bg-no-repeat" />

              {/* Quick Links */}
              <div className="mb-4">
                <h3 className="text-[rgba(150,202,69,1)] font-['Power_Grotesk'] font-bold tracking-wide text-lg mb-2 relative z-10">Quick Links</h3>
                <ul className="flex flex-col relative z-10">
                  <li className="border-b border-white/5 py-1.5"><Link href="/" className="text-white hover:text-[rgba(150,202,69,1)] text-sm transition-colors">Home</Link></li>
                  <li className="border-b border-white/5 py-1.5"><Link href="/about" className="text-white hover:text-[rgba(150,202,69,1)] text-sm transition-colors">About Us</Link></li>
                  <li className="border-b border-white/5 py-1.5"><Link href="/services" className="text-white hover:text-[rgba(150,202,69,1)] text-sm transition-colors">Products</Link></li>
                  <li className="border-b border-white/5 py-1.5"><Link href="/services" className="text-white hover:text-[rgba(150,202,69,1)] text-sm transition-colors">Services</Link></li>
                  <li className="border-b border-white/5 py-1.5"><Link href="/blog" className="text-white hover:text-[rgba(150,202,69,1)] text-sm transition-colors">Blogs</Link></li>
                  <li className="border-b border-white/5 py-1.5"><Link href="/talk-to-expert" className="text-white hover:text-[rgba(150,202,69,1)] text-sm transition-colors">Talk to an Expert</Link></li>
                </ul>
              </div>

              {/* Other */}
              <div>
                <h3 className="text-[rgba(150,202,69,1)] font-['Power_Grotesk'] font-bold tracking-wide text-lg mb-2 mt-4 relative z-10">Other</h3>
                <ul className="flex flex-col relative z-10">
                  <li className="border-b border-white/5 py-1.5"><Link href="/terms" className="text-white hover:text-[rgba(150,202,69,1)] text-sm transition-colors">Terms &amp; Conditions</Link></li>
                  <li className="border-b border-white/5 py-1.5"><Link href="/privacy" className="text-white hover:text-[rgba(150,202,69,1)] text-sm transition-colors">Privacy Policy</Link></li>
                  <li className="border-b border-white/5 py-1.5"><Link href="/contact" className="text-white hover:text-[rgba(150,202,69,1)] text-sm transition-colors">Contact us</Link></li>
                </ul>
              </div>
            </div>

            {/* Right panel: Green inner card */}
            <div className="bg-[rgba(150,202,69,1)] rounded-[16px] w-[45%] p-6 flex flex-col justify-end relative overflow-hidden">
              {/* Background Image Container */}
              <div className="absolute inset-0 pointer-events-none opacity-50 bg-[url('/footer-bg-green.png')] bg-cover bg-center bg-no-repeat" />

              {/* Social Icons */}
              <div className="relative z-10 flex items-center gap-3">
                {settings?.socialLinks?.instagram && (
                  <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer"
                    className="w-8 h-8 rounded-md bg-black/10 flex items-center justify-center text-[#252525] hover:bg-black/20 transition-colors">
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
                {settings?.socialLinks?.facebook && (
                  <a href={settings.socialLinks.facebook} target="_blank" rel="noreferrer"
                    className="w-8 h-8 rounded-md bg-black/10 flex items-center justify-center text-[#252525] hover:bg-black/20 transition-colors">
                    <Facebook className="h-4 w-4" />
                  </a>
                )}
                {settings?.socialLinks?.twitter && (
                  <a href={settings.socialLinks.twitter} target="_blank" rel="noreferrer"
                    className="w-8 h-8 rounded-md bg-black/10 flex items-center justify-center text-[#252525] hover:bg-black/20 transition-colors">
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
                {settings?.socialLinks?.linkedin && (
                  <a href={settings.socialLinks.linkedin} target="_blank" rel="noreferrer"
                    className="w-8 h-8 rounded-md bg-black/10 flex items-center justify-center text-[#252525] hover:bg-black/20 transition-colors">
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[rgba(37,37,37,1)] border-t border-white/10 py-5">
        <p className="text-gray-300 text-sm text-center">
          © {currentYear} {settings?.companyName || 'Bias Radar'}. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}