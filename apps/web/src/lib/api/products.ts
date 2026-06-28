const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function getProducts() {
  const res = await fetch(`${API_BASE_URL}/api/products`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error('Failed to fetch products');

  const data = await res.json();
  return data.data; // Array of products
}

export async function getProductBySlug(slug: string) {
  const res = await fetch(`${API_BASE_URL}/api/products/${slug}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch product');
  }

  const data = await res.json();
  return data.data;
}
