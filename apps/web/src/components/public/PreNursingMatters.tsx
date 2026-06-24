'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

export default function PreNursingMatters() {
  const sunburstRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sunburstRef.current) {
        // Rotate 1 degree per 5 pixels scrolled. Adjust this multiplier to change rotation speed.
        const rotation = window.scrollY * 0.2; 
        sunburstRef.current.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger once on mount to set initial rotation
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="bg-white py-24 relative overflow-hidden font-['Power_Grotesk'] text-[#252525]">
      
      <style>{`
        @keyframes float-wiggle {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
        .animate-float-wiggle {
          animation: float-wiggle 4s ease-in-out infinite;
        }
      `}</style>

      {/* Full-width and full-height crosshair lines */}
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gray-200 pointer-events-none z-0" />
      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gray-200 pointer-events-none z-0" />

      {/* Background Sunburst */}
      <div 
        ref={sunburstRef}
        className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] pointer-events-none z-0 opacity-40 transition-transform duration-75 ease-linear will-change-transform"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <Image src="/light-sunburst.png" alt="Sunburst" fill className="object-contain" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
        
        {/* Header */}
        <h2 className="text-4xl md:text-[56px] font-medium mb-6 tracking-tight bg-white px-8">
          Why <span className="text-[rgba(150,202,69,1)] font-bold">Pre-Nursing</span> Matters
        </h2>
        
        {/* Paragraph */}
        <div className="bg-white px-8 py-2 mb-10 z-10">
          <p className="text-base md:text-[22px] leading-relaxed max-w-4xl text-[#252525]">
            T Purus In In Fames Sit Ac Vitae. Curabitur Scelerisque Nunc Mauris Blandit. Donec Tristique Placerat Consectetur Molestie Est Ornare. Suspendisse Aliquet Semper Quam Volutpat Bibendum Est Mattis. Sed Neque Etiam Morbi A Amet Lacus Phasellus Ipsum Nec.
          </p>
        </div>

        {/* Centerpiece Image Container */}
        <div className="relative w-full max-w-[700px] mt-2 mb-12">
          
          {/* Faint Watermarks */}
          <div className="absolute bottom-1/2 mb-2 -left-4 md:-left-[180px] lg:-left-[220px] text-4xl md:text-5xl lg:text-6xl font-bold text-gray-200 tracking-widest pointer-events-none whitespace-nowrap opacity-50 select-none z-0">
            EXPLORE
          </div>
          <div className="absolute bottom-1/2 mb-2 -right-4 md:-right-[160px] lg:-right-[200px] text-4xl md:text-5xl lg:text-6xl font-bold text-gray-200 tracking-widest pointer-events-none whitespace-nowrap opacity-50 select-none z-0">
            MORE !
          </div>

          {/* The Image */}
          <div className="relative z-10 w-full max-w-[350px] md:max-w-[450px] mx-auto h-[150px] md:h-[220px] rounded-[20px] overflow-hidden shadow-xl">
            <Image 
              src="/pre-nursing-photo.png" 
              alt="Pre-Nursing Matters" 
              fill 
              className="object-cover"
            />
          </div>

          {/* Red Curly Arrow & Text */}
          <div className="absolute bottom-[-75px] md:bottom-[-95px] right-[4%] sm:right-[8%] md:right-[15%] pointer-events-none z-20 w-[240px] md:w-[320px]">
            {/* custom-anim-float-wiggle owns ONLY its own transform — no children with transform */}
            <div className="custom-anim-float-wiggle" style={{ willChange: 'transform' }}>
              <div className="flex flex-col items-center md:items-start">
                <Image src="/red-curly-arrow.png" alt="Arrow" width={100} height={100} className="w-12 md:w-16 h-auto md:ml-12" />
                <div
                  className="font-['Great_Day_Personal_Use'] text-[#b31b1b] text-3xl md:text-[38px] whitespace-nowrap mt-1 rotate-[-3deg] md:ml-16"
                >
                  See How Its Work!
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Avatars at bottom */}
        <div className="mt-28 md:mt-32 flex flex-row items-center justify-center gap-3 relative z-10">
          <Image src="/avatars-group.png" alt="Trusted Students" width={160} height={40} className="h-6 md:h-8 w-auto" />
          <span className="text-[#252525] text-xs md:text-sm font-medium tracking-wide">1600 + Trusted Students</span>
        </div>

      </div>
    </section>
  );
}
