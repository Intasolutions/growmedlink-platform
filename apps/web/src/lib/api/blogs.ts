const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function getBlogs() {
  // Public query: only fetch published blogs
  const res = await fetch(`${API_BASE_URL}/api/blogs?status=published`, {
    next: { revalidate: 60 },
  });
  
  if (!res.ok) throw new Error('Failed to fetch blogs');
  
  const data = await res.json();
  return data.data; // Array of blogs
}

export async function getBlogBySlug(slug: string) {
  const res = await fetch(`${API_BASE_URL}/api/blogs/${slug}`, {
    next: { revalidate: 60 },
  });
  
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch blog');
  }
  
  const data = await res.json();
  
  // Extra safety: only return if published (or if we want to allow drafts via preview tokens later)
  if (data.data.status !== 'published') return null;
  
  return data.data;
}
