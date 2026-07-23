import React from 'react';
import { getServices } from '@/lib/api/services';
import { getProducts } from '@/lib/api/products';
import { getBlogs } from '@/lib/api/blogs';
import { getPublicReviews } from '@/lib/api/reviews';
import HomePage from '@/components/public/HomePage';
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
  /* Sort products: order >= 1 first (ascending), order = 0 last */
  const sortedProducts = [...allProducts].sort((a: any, b: any) => {
    const ao = a.order ?? 0, bo = b.order ?? 0;
    if (ao === 0 && bo === 0) return 0;
    if (ao === 0) return 1;
    if (bo === 0) return -1;
    return ao - bo;
  });

  return (
    <>
      <HomePage 
        sortedProducts={sortedProducts}
        allServices={allServices}
        featuredServices={featuredServices}
        allReviews={allReviews}
        allBlogs={allBlogs}
      />
      {/* WhatsApp floating button */}
      <WhatsAppButton pageType="home" />
    </>
  );
}

