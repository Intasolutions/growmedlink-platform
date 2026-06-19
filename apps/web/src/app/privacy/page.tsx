import React from 'react';
import { Metadata } from 'next';
import { TiptapRenderer } from '../../components/TiptapRenderer';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function getPageData(key: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/pages/${key}`, {
      cache: 'no-store',
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return data.data;
    }
  } catch (error) {
    console.error(`Failed to fetch ${key} page:`, error);
  }
  return null;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageData('privacy');
  if (!page) return { title: 'Privacy Policy | GrowMedLink' };

  return {
    title: page.metaTitle || `${page.title} | GrowMedLink`,
    description: page.metaDescription || 'Read our privacy policy.',
    keywords: page.keywords || [],
    alternates: {
      canonical: page.canonicalUrl || undefined,
    },
    openGraph: {
      title: page.metaTitle || page.title,
      description: page.metaDescription || 'Read our privacy policy.',
      images: page.ogImage ? [{ url: page.ogImage }] : [],
    },
  };
}

export default async function PrivacyPage() {
  const page = await getPageData('privacy');

  return (
    <main className="min-h-screen bg-[#020C1B] text-white py-24 px-6 relative">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#0A192F]/40 to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight text-center mb-16">
          {page?.title || 'Privacy Policy'}
        </h1>
        
        <div className="bg-[#0A192F]/20 border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl">
          {page?.content ? (
            <TiptapRenderer content={page.content} />
          ) : (
            <p className="text-center text-gray-500">Content currently unavailable.</p>
          )}
        </div>
      </div>
    </main>
  );
}
