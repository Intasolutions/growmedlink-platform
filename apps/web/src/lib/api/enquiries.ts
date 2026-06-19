const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function submitEnquiry(payload: any) {
  const res = await fetch(`${API_BASE_URL}/api/enquiries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.message || (data.errors ? Object.values(data.errors)[0] as string : 'Failed to submit enquiry'));
  }
  
  return data;
}
