import React from 'react';

export default function Home() {
  return (
    <main className="flex-grow flex flex-col justify-center items-center p-8 bg-gradient-to-b from-[#0A192F] to-[#020C1B] text-white text-center min-h-screen">
      <div className="max-w-3xl px-4">
        <span className="text-secondary font-semibold uppercase tracking-widest text-xs border border-secondary/30 px-3 py-1 rounded-full bg-secondary/10">
          World-Class Education & Migration
        </span>
        <h1 className="text-4xl md:text-6xl font-black mt-6 mb-4 leading-tight tracking-tight">
          Intelligen Immigration <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#F59E0B]">
            & Language Academy
          </span>
        </h1>
        <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-xl mx-auto font-light leading-relaxed">
          Embark on your journey to study, work, or live abroad. Achieve your target IELTS, PTE, or OET scores with our elite training.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="/services"
            className="px-8 py-4 bg-secondary text-secondary-foreground font-semibold rounded-lg shadow-lg hover:bg-secondary-dark hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            Explore Services
          </a>
          <a
            href="/talk-to-expert"
            className="px-8 py-4 border-2 border-secondary/80 text-secondary hover:bg-secondary hover:text-secondary-foreground font-semibold rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            Consult an Expert
          </a>
        </div>
      </div>
      
      {/* Background visual graphics */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full filter blur-[100px] pointer-events-none" />
    </main>
  );
}
