import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { getGlobalSettings } from '@/lib/api/settings';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  // Fetch settings dynamically on server side to populate layout
  let settings = null;
  try {
    settings = await getGlobalSettings();
  } catch (error) {
    console.error("Failed to load global settings", error);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#020C1B] text-white">
      <Navbar settings={settings} />
      <main className="flex-grow pt-20">
        {children}
      </main>
      <Footer settings={settings} />
    </div>
  );
}
