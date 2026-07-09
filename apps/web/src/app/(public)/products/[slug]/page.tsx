import { getProductBySlug, getProducts } from '@/lib/api/products';
import { getServices } from '@/lib/api/services';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProductDetailPage from '@/components/ProductDetailPage';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);
  if (!product) return {};

  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription,
    openGraph: {
      images: product.ogImage ? [product.ogImage] : (product.image ? [typeof product.image === 'object' ? product.image.secureUrl : product.image] : []),
    }
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  const relatedProducts = allProducts
    .filter((p: any) => p._id !== product._id)
    .slice(0, 2);

  const catParam = product.category 
    ? (typeof product.category === 'object' ? (product.category as any)._id : product.category) 
    : undefined;
  const relatedServicesAll = catParam ? await getServices(catParam) : [];
  const relatedServices = relatedServicesAll.slice(0, 2);

  const mappedProduct = {
    id: product._id,
    name: product.name,
    slug: product.slug,
    image: product.image?.secureUrl || product.image,
    secondaryImage: product.secondaryImage?.secureUrl || product.secondaryImage || null,
    details: product.details?.text || '',
    fees: product.fees,
    duration: product.duration,
    otherDetails: product.otherDetails?.text || '',
    videoUrl: product.videoUrl || '',
    relatedProducts: relatedProducts.map((rp: any) => ({
      id: rp._id,
      name: rp.name,
      slug: rp.slug,
      fees: rp.fees,
      duration: rp.duration,
      image: rp.image?.secureUrl || rp.image,
    })),
    relatedServices: relatedServices.map((rs: any) => ({
      id: rs._id,
      name: rs.title,
      slug: rs.slug,
      shortDescription: rs.description,
      image: rs.image?.secureUrl || rs.image,
    })),
  };

  return <ProductDetailPage product={mappedProduct as any} />;
}
