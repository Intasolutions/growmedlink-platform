import React from 'react';
import { getServices } from '@/lib/api/services';
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
import HomeIntro from '@/components/public/HomeIntro';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [allServices, allBlogs, allReviews] = await Promise.all([
    getServices().catch(() => []),
    getBlogs().catch(() => []),
    getPublicReviews().catch(() => [])
  ]);

  const featuredServices = allServices.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <HomeIntro />
      {/* Hero Section */}
      <Hero />

      {/* Interactive Stats Banner */}
      <StatsBanner />

      {/* Why Pre-Nursing Matters Section */}
      <PreNursingMatters services={featuredServices} />

      {/* Featured Services Interactive Section */}
      <FeaturedServices services={featuredServices} />

      {/* Services Carousel Section */}
      <ServicesCarouselSection services={allServices} />

      {/* Why Section */}
      <WhySection />

      {/* Student Reviews Section */}
      <ReviewsSection initialReviews={allReviews} />

      {/* Latest News Section */}
      <LatestNewsSection initialNews={allBlogs} />

      {/* CTA Banner Section */}
      <CtaBannerSection />
    </div>
  );
}

