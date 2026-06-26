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

export async function getFeaturedBlog() {
  const res = await fetch(`${API_BASE_URL}/api/blogs?status=published&featured=true&limit=1`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (data.data && data.data.length > 0) {
    return data.data[0];
  }
  return null;
}

export async function getBlogsPaginated(params: { page?: number; limit?: number; search?: string; tag?: string }) {
  const query = new URLSearchParams();
  query.append('status', 'published');
  if (params.page) query.append('page', String(params.page));
  if (params.limit) query.append('limit', String(params.limit));
  if (params.search) query.append('search', params.search);
  if (params.tag) query.append('tag', params.tag);

  const res = await fetch(`${API_BASE_URL}/api/blogs?${query.toString()}`, {
    cache: 'no-store', // ensures searches/pages are fresh
  });

  if (!res.ok) throw new Error('Failed to fetch blogs');

  const data = await res.json();
  return {
    blogs: data.data || [],
    pagination: data.pagination || { total: 0, page: 1, limit: 9, pages: 1 },
  };
}
