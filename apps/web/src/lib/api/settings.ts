const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function getGlobalSettings() {
  const res = await fetch(`${API_BASE_URL}/api/settings`, {
    next: { revalidate: 3600 }, // Revalidate every hour
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch settings');
  }
  
  const data = await res.json();
  return data.data;
}
