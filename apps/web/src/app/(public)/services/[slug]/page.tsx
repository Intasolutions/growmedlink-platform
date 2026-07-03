import React from 'react';
import { getServiceBySlug, getServices } from '@/lib/api/services';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ServiceDetailPage from '@/components/ServiceDetailPage';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const service = await getServiceBySlug(resolvedParams.slug);
  if (!service) return {};
  
  return {
    title: service.metaTitle || service.title,
    description: service.metaDescription || service.description,
    openGraph: {
      images: service.ogImage ? [service.ogImage] : (service.image ? [typeof service.image === 'object' ? service.image.secureUrl : service.image] : []),
    }
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const service = await getServiceBySlug(resolvedParams.slug);

  if (!service) {
    notFound();
  }

  const catParam = service.category 
    ? (typeof service.category === 'object' ? (service.category as any)._id : service.category) 
    : undefined;
  const relatedServicesAll = catParam ? await getServices(catParam) : [];
  const relatedServices = relatedServicesAll
    .filter((s: any) => s._id !== service._id)
    .slice(0, 2);

  // Map the IService DB model to the ServiceDetail format expected by the client component
  const mappedService = {
    id: service._id,
    name: service.title,
    slug: service.slug,
    image: service.image?.secureUrl || service.image,
    description: service.description,
    secondaryImage: service.secondaryImage?.secureUrl || service.secondaryImage,
    excellenceHeading: service.secondaryHeading,
    // Provide either the plain text from Tiptap or the raw description
    excellenceDescription: service.content?.text || service.description,
    features: service.features?.map((f: any) => ({
      title: f.title,
      description: f.description,
    })),
    relatedServices: relatedServices.map((rs: any) => ({
      id: rs._id,
      name: rs.title,
      slug: rs.slug,
      shortDescription: rs.description,
      image: rs.image?.secureUrl || rs.image,
    })),
    category: service.category,
  };

  return <ServiceDetailPage service={mappedService as any} />;
}