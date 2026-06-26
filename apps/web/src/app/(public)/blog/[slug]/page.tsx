import type { Metadata } from 'next';
import { getBlogBySlug } from '@/lib/api/blogs';
import BlogDetailPage from '@/components/BlogDetailPage';

function resolveImg(src: any): string | null {
  if (!src) return null;
  if (typeof src === 'string') return src;
  if (typeof src === 'object') {
    if (src.secureUrl) return src.secureUrl;
    if (src.url) return src.url;
  }
  return null;
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  const img  = resolveImg(blog?.ogImage ?? blog?.image);
  return {
    title:       blog?.metaTitle       ?? blog?.title,
    description: blog?.metaDescription ?? blog?.summary,
    openGraph: {
      title:       blog?.metaTitle       ?? blog?.title,
      description: blog?.metaDescription ?? blog?.summary,
      ...(img && { images: [img] }),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  
  if (!blog) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', fontFamily: 'sans-serif' }}>
        <h1>Blog post not found</h1>
      </div>
    );
  }
  
  return <BlogDetailPage blog={blog} />;
}