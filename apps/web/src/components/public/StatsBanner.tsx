'use client';

import React, { useState } from 'react';
import { GraduationCap, Award, Briefcase } from 'lucide-react';

const stats = [
  {
    value: '200+',
    label: 'Students placed',
    icon: GraduationCap,
  },
  {
    value: '88%',
    label: 'Exam success rate',
    icon: Award,
  },
  {
    value: '4+',
    label: 'Years of experience',
    icon: Briefcase,
  },
];

export default function StatsBanner() {
  // Default to the first item being active (index 0)
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="bg-white py-20 md:py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* The green bar container */}
        <div 
          className="bg-[rgba(150,202,69,1)] rounded-[20px] h-32 md:h-40 flex items-stretch relative shadow-lg w-full"
          onMouseLeave={() => setActiveIndex(0)} // Reset to first item when mouse leaves the whole banner
        >
          
          {stats.map((stat, i) => {
            const isActive = activeIndex === i;
            const Icon = stat.icon;

            return (
              <div 
                key={i} 
                className="flex-1 relative flex justify-center items-center cursor-pointer group"
                onMouseEnter={() => setActiveIndex(i)}
              >
                
                {/* Active Dark Box */}
                <div 
                  className={`absolute inset-x-[-10px] sm:inset-x-0 -inset-y-4 md:-inset-y-6 rounded-[20px] shadow-2xl bg-[#252525] flex flex-col justify-center items-center overflow-hidden transition-all duration-500 ease-out
                  ${isActive ? 'opacity-100 scale-100 z-20' : 'opacity-0 scale-95 z-0 pointer-events-none'}`}
                >
                  {/* Background Icon Silhouette */}
                  <Icon 
                    className="absolute -left-6 -bottom-6 w-40 h-40 md:w-56 md:h-56 text-white opacity-[0.04] transition-all duration-700 ease-out" 
                    style={{ transform: isActive ? 'rotate(-15deg) scale(1)' : 'rotate(-45deg) scale(0.5)' }} 
                  />
                  
                  <div 
                    className="text-[rgba(150,202,69,1)] text-5xl md:text-7xl font-black mb-1 md:mb-2 relative z-10 transition-all duration-500 delay-75" 
                    style={{ transform: isActive ? 'translateY(0)' : 'translateY(15px)', opacity: isActive ? 1 : 0 }}
                  >
                    {stat.value}
                  </div>
                  <div 
                    className="text-[rgba(150,202,69,1)] text-xs md:text-base font-medium relative z-10 transition-all duration-500 delay-150" 
                    style={{ transform: isActive ? 'translateY(0)' : 'translateY(15px)', opacity: isActive ? 1 : 0 }}
                  >
                    {stat.label}
                  </div>
                </div>

                {/* Default State (Visible when not active) */}
                <div 
                  className={`flex flex-col justify-center items-center transition-all duration-500 relative z-10
                  ${isActive ? 'opacity-0 scale-90 translate-y-[-10px]' : 'opacity-100 scale-100 translate-y-0'}`}
                >
                  <div className="text-white text-4xl md:text-6xl font-black mb-1 md:mb-2">{stat.value}</div>
                  <div className="text-white text-xs md:text-base font-medium">{stat.label}</div>
                </div>

              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}
