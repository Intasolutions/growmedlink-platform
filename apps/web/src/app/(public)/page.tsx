import React from 'react';
import { getServices } from '@/lib/api/services';
import { getProducts } from '@/lib/api/products';
import { getBlogs } from '@/lib/api/blogs';
import { getPublicReviews } from '@/lib/api/reviews';
import Hero from '@/components/public/Hero';
import StatsBanner from '@/components/public/StatsBanner';
import PreNursingMatters from '@/components/public/PreNursingMatters';
import FeaturedServices from '@/components/public/FeaturedServices';
import ServicesCarouselSection from '@/components/public/ServicesCarouselSection';
import WhySection from '@/components/public/WhySection';
import ReviewsSection from '@/components/public/ReviewsSection';
import LatestNewsSection from '@/components/public/LatestNewsSection';
import CtaBannerSection from '@/components/public/CtaBannerSection';
import WhatsAppButton from '@/components/WhatsAppButton';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [allServices, allProducts, allBlogs, allReviews] = await Promise.all([
    getServices().catch(() => []),
    getProducts().catch(() => []),
    getBlogs().catch(() => []),
    getPublicReviews().catch(() => [])
  ]);

  const featuredServices = allServices.slice(0, 3);
  /* Sort products: order ≥ 1 first (ascending), order = 0 last */
  const sortedProducts = [...allProducts].sort((a: any, b: any) => {
    const ao = a.order ?? 0, bo = b.order ?? 0;
    if (ao === 0 && bo === 0) return 0;
    if (ao === 0) return 1;
    if (bo === 0) return -1;
    return ao - bo;
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Interactive Stats Banner */}
      <StatsBanner />

      {/* Why Pre-Nursing Matters Section */}
      <PreNursingMatters products={sortedProducts} />

      {/* Our Services Carousel */}
      <ServicesCarouselSection services={allServices} />

      {/* Featured Services Interactive Section (products carousel) */}
      <FeaturedServices services={featuredServices} />

      {/* Why Section */}
      <WhySection />

      {/* Student Reviews Section */}
      <ReviewsSection initialReviews={allReviews} />

      {/* Latest News Section */}
      <LatestNewsSection initialNews={allBlogs} />

      {/* CTA Banner Section */}
      <CtaBannerSection />

      {/* WhatsApp floating button */}
      <WhatsAppButton pageType="home" />
    </div>
  );
}

