import React from 'react';
import { getPage } from '@/lib/api/pages';
import LegalPageClient from '@/components/public/LegalPageClient';
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
    <LegalPageClient
      title={page.title}
      subtitle="Lorem ipsum dolor sit amet consectetur. Purus in in fames sit ac vitae. Curabitur scelerisque nunc mauris blandit. Donec tristique placerat consectetur molestie est ornare. Suspendisse aliquet semper quam volutpat bibendum est mattis. Sed neque etiam morbi a amet lacus phasellus ipsum nec."
      heroImage="/terms-conditions.jpg"
      content={page.content}
    />
  );
}
