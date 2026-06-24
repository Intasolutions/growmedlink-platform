import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getServices } from '@/lib/api/services';
import { getBlogs } from '@/lib/api/blogs';
import { ArrowRight, Globe, BookOpen } from 'lucide-react';
import StatsBanner from '@/components/public/StatsBanner';
import PreNursingMatters from '@/components/public/PreNursingMatters';
import FeaturedServices from '@/components/public/FeaturedServices';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch featured services and blogs
  const [allServices, allBlogs] = await Promise.all([
    getServices().catch(() => []),
    getBlogs().catch(() => [])
  ]);

  // Optionally filter for featured, or just take first 3
  const featuredServices = allServices.slice(0, 3);
  const recentBlogs = allBlogs.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
<section className="relative w-full min-h-screen bg-[#141414] overflow-hidden flex flex-col items-center pt-20 pb-20 font-['Power_Grotesk'] text-white">
  
  {/* Background Map — centered, large */}
  <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-center opacity-95">
    <Image
      src="/world-map-bg.png"
      alt="World Map"
      width={1400}
      height={800}
      className="w-[90vw] md:w-[1200px] max-w-none object-contain mt-32"
      priority
    />
  </div>

  {/* Top Centered Content */}
  <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center mt-10 md:mt-16">
    
    {/* Sunburst behind title */}
    <div className="relative inline-block">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] pointer-events-none z-[-1]">
        <Image src="/sunburst-lines.png" alt="Sunburst" fill className="object-contain" priority />
      </div>
      <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[96px] font-black tracking-tight leading-none mb-6">
        Start Your Journey.<span className="text-[rgba(150,202,69,1)]">!</span>
      </h1>
    </div>

    {/* Avatars + student count */}
    <div className="flex flex-row items-center justify-center gap-3 mt-4">
      <Image src="/avatars-group.png" alt="Trusted Students" width={160} height={40} className="h-8 md:h-10 w-auto" />
      <span className="text-gray-400 text-xs md:text-sm font-medium tracking-wide">1000 + Trusted Students</span>
    </div>
  </div>

  {/* Bottom Content Split */}
  <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-auto pt-48 md:pt-64 lg:pt-80 flex flex-col lg:flex-row items-end justify-between gap-12">

    {/* Bottom Left */}
    <div className="max-w-xs w-full relative z-20">
      <p className="text-white text-base md:text-lg font-bold leading-snug mb-4">
        Connect with the people who love building great websites as much as you do.
      </p>
      <p className="text-gray-400 text-xs leading-relaxed mb-6">
        Our Slack is full of creative devs and designers exchanging feedback, ideas, and inspiration. Everyone's here to make the internet a little better.
      </p>

      <div className="relative inline-block">
        <button className="px-5 py-2.5 bg-transparent border border-[rgba(150,202,69,1)] text-[rgba(150,202,69,1)] rounded-md font-bold text-sm hover:bg-[rgba(150,202,69,0.1)] transition-colors">
          Explore Courses
        </button>

        {/* Curly arrow + handwritten text */}
        <div className="absolute top-[90%] left-[60%] w-[240px] pointer-events-none">
          <Image src="/curly-arrow.png" alt="Arrow" width={100} height={50} className="w-28 h-auto" />
          <span className="font-['Great_Day_Personal_Use'] text-[rgba(150,202,69,1)] text-2xl md:text-3xl absolute top-4 left-14 whitespace-nowrap rotate-[-5deg]">
            Finally, your kind<br />of group chat
          </span>
        </div>
      </div>
    </div>

    {/* Bottom Right — Cards */}
    <div className="flex flex-col items-end gap-4 w-full lg:w-auto pb-8 lg:pb-0">
      <div className="flex items-stretch gap-3">

        {/* Active Card: Australia */}
        <div className="bg-white rounded-xl p-4 w-[220px] shadow-2xl flex flex-col text-[#252525] flex-shrink-0">
          <div className="flex justify-between items-start mb-2">
            <span className="font-semibold text-sm">Australia</span>
            <Image src="/australia-map.png" alt="Australia" width={80} height={80} className="w-14 h-auto" />
          </div>
          <div className="flex justify-between items-end mt-auto pt-4">
            <div className="w-[72px] overflow-hidden">
              <Image src="/avatars-group.png" alt="Users" width={120} height={40} className="h-7 w-auto max-w-none object-left" />
            </div>
            <span className="text-[rgba(150,202,69,1)] text-3xl font-black tracking-tighter leading-none">54%</span>
          </div>
        </div>

        {/* Inactive Card: India */}
        <div className="bg-[#1a1a1a] rounded-xl p-3 w-[68px] flex items-center justify-center flex-shrink-0 border border-white/10">
          <Image src="/india-map.png" alt="India" width={40} height={40} className="w-9 h-auto" style={{ filter: 'brightness(0) saturate(100%) invert(68%) sepia(60%) saturate(500%) hue-rotate(40deg) brightness(110%)' }} />
        </div>

        {/* Inactive Card: Africa */}
        <div className="bg-[#1a1a1a] rounded-xl p-3 w-[68px] flex items-center justify-center flex-shrink-0 border border-white/10">
          <Image src="/africa-map.png" alt="Africa" width={40} height={40} className="w-8 h-auto" style={{ filter: 'brightness(0) saturate(100%) invert(68%) sepia(60%) saturate(500%) hue-rotate(40deg) brightness(110%)' }} />
        </div>

        {/* Inactive Card: South America */}
        <div className="bg-[#1a1a1a] rounded-xl p-3 w-[68px] flex items-center justify-center flex-shrink-0 border border-white/10">
          <Image src="/south-america-map.png" alt="South America" width={40} height={40} className="w-8 h-auto" style={{ filter: 'brightness(0) saturate(100%) invert(68%) sepia(60%) saturate(500%) hue-rotate(40deg) brightness(110%)' }} />
        </div>

      </div>

      {/* Wave dots */}
      <div className="flex items-center gap-2 mr-2">
        {[40, 60, 80, 100, 80, 60, 40].map((opacity, i) => (
          <div
            key={i}
            className="rounded-full bg-[rgba(150,202,69,1)]"
            style={{
              width: '6px',
              height: '6px',
              opacity: opacity / 100,
              marginTop: i < 3 ? `${(3 - i) * 3}px` : i > 3 ? `${(i - 3) * 3}px` : '0px',
            }}
          />
        ))}
      </div>
    </div>

  </div>
</section>

      {/* Interactive Stats Banner */}
      <StatsBanner />

      {/* Why Pre-Nursing Matters Section */}
      <PreNursingMatters />

      {/* Featured Services Interactive Section */}
      <FeaturedServices services={featuredServices} />

    </div>
  );
}

