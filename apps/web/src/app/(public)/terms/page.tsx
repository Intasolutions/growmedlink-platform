import React from 'react';
import { getPage } from '@/lib/api/pages';
import { TiptapRenderer } from '@/components/TiptapRenderer';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('terms');
  if (!page) return {};
  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription,
    openGraph: {
      images: page.ogImage ? [page.ogImage] : [],
    }
  };
}

export default async function TermsPage() {
  const page = await getPage('terms');

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#020C1B]">
      <section className="bg-[#0A192F] py-20 border-b border-[#1E2D3D]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black font-heading text-white">{page.title}</h1>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0A192F] border border-[#1E2D3D] rounded-3xl p-8 md:p-12 shadow-2xl">
            <TiptapRenderer content={page.content} />
          </div>
        </div>
      </section>
    </div>
  );
}
