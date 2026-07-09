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
    <div className="min-h-screen flex flex-col bg-[#020C1B] text-white overflow-x-hidden w-full">
      <Navbar settings={settings} />
      <main className="flex-grow w-full overflow-x-hidden">
        {children}
      </main>
      <Footer settings={settings} />
    </div>
  );
}
