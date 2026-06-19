const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function getPage(key: string) {
  const res = await fetch(`${API_BASE_URL}/api/pages/${key}`, {
    next: { revalidate: 3600 },
  });
  
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Failed to fetch page: ${key}`);
  }
  
  const data = await res.json();
  return data.data;
}
