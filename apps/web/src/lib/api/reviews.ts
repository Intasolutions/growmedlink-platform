const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function getPublicReviews() {
  const res = await fetch(`${API_BASE_URL}/api/reviews`, {
    next: { revalidate: 60 },
  });
  
  if (!res.ok) throw new Error('Failed to fetch reviews');
  
  const data = await res.json();
  return data.data;
}
