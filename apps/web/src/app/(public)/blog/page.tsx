import { getBlogsPaginated, getFeaturedBlog } from '@/lib/api/blogs';
import BlogPage from '@/components/BlogPage';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Insights & Blog',
  description: 'Stay updated with the latest news on immigration policies, study abroad tips, and language test strategies.',
};

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10) || 1;
  const limit = 20;

  const [data, featuredBlog] = await Promise.all([
    getBlogsPaginated({ page, limit }),
    getFeaturedBlog()
  ]);

  const blogs = data.blogs || [];
  const pagination = data.pagination || { page: 1, limit: 20, total: 0, pages: 1 };
  
  // Use the featured blog's image for the hero, or null if no featured blog
  const heroImage = featuredBlog?.image 
    ? (typeof featuredBlog.image === 'object' ? featuredBlog.image.secureUrl : featuredBlog.image)
    : null;
    
  const heroSubtitle = featuredBlog ? featuredBlog.title : undefined;

  return (
    <BlogPage 
      blogs={blogs} 
      pagination={pagination}
      heroImage={heroImage} 
      heroSubtitle={heroSubtitle} 
    />
  );
}