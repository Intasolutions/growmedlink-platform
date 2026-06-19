const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function getServices(category?: string) {
  const query = category ? `?category=${category}` : '';
  const res = await fetch(`${API_BASE_URL}/api/services${query}`, {
    next: { revalidate: 60 },
  });
  
  if (!res.ok) throw new Error('Failed to fetch services');
  
  const data = await res.json();
  return data.data; // Array of services
}

export async function getServiceBySlug(slug: string) {
  const res = await fetch(`${API_BASE_URL}/api/services/${slug}`, {
    next: { revalidate: 60 },
  });
  
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch service');
  }
  
  const data = await res.json();
  return data.data;
}
