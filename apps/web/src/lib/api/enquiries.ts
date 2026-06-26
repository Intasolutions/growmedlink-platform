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
    if (data.errors) {
      const messages = Object.values(data.errors as Record<string, string[]>).flat();
      throw new Error(messages.join('\n') || 'Please check the form and try again.');
    }
    throw new Error(data.message || 'Failed to submit enquiry');
  }

  return data;
}
