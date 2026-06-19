export const verifyTurnstileToken = async (token: string): Promise<boolean> => {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    console.warn('[Turnstile] TURNSTILE_SECRET_KEY not set, skipping token verification in dev mode.');
    return true; // Bypass if not configured (e.g. local dev)
  }

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`,
    });

    const data = await res.json();
    return data.success;
  } catch (error) {
    console.error('[Turnstile] Token verification failed:', error);
    return false;
  }
};
