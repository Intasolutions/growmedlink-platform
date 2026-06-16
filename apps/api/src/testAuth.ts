import dotenv from 'dotenv';
import connectDatabase from './config/database.js';
import app from './index.js';
import http from 'http';

dotenv.config();

const test = async () => {
  console.log('[testAuth] Starting Authentication and RBAC verification tests...');

  let server: http.Server | undefined;
  try {
    await connectDatabase();
    
    // Start server on a random port
    server = app.listen(0);
    const address = server.address() as any;
    const port = address.port;
    const baseUrl = `http://127.0.0.1:${port}`;
    console.log(`[testAuth] Test server listening on ${baseUrl}`);

    // Test credentials (matches the seeded Super Admin user)
    const email = process.env.SUPER_ADMIN_EMAIL || 'superadmin@growmedlink.com';
    const password = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdminPassword123!';

    let cookies: string[] = [];

    // Helper to extract cookies from responses
    const extractCookies = (res: Response) => {
      const setCookie = res.headers.getSetCookie();
      if (setCookie && setCookie.length > 0) {
        cookies = setCookie.map(cookieStr => cookieStr.split(';')[0]);
      }
    };

    // Helper to get cookies combined header format
    const getCookieHeader = () => cookies.join('; ');

    // 1. Test POST /api/auth/login
    console.log('\n--- 1. Testing POST /api/auth/login ---');
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const loginData = await loginRes.json();
    console.log('Status:', loginRes.status);
    console.log('Response:', JSON.stringify(loginData, null, 2));
    
    if (loginRes.status !== 200 || !loginData.success) {
      throw new Error('Login request failed!');
    }
    
    extractCookies(loginRes);
    console.log('Cookies parsed:', cookies);
    if (cookies.length === 0) {
      throw new Error('Cookie tokens were not set in response!');
    }

    // 2. Test GET /api/auth/me (Authenticated)
    console.log('\n--- 2. Testing GET /api/auth/me (Authenticated) ---');
    const meRes = await fetch(`${baseUrl}/api/auth/me`, {
      method: 'GET',
      headers: { Cookie: getCookieHeader() },
    });

    const meData = await meRes.json();
    console.log('Status:', meRes.status);
    console.log('Response:', JSON.stringify(meData, null, 2));

    if (meRes.status !== 200 || !meData.success) {
      throw new Error('Authenticated user lookup /me failed!');
    }

    // 3. Test GET /api/auth/test-protected (RBAC - SUPER_ADMIN)
    console.log('\n--- 3. Testing GET /api/auth/test-protected (RBAC - SUPER_ADMIN / ADMIN) ---');
    const protectedRes = await fetch(`${baseUrl}/api/auth/test-protected`, {
      method: 'GET',
      headers: { Cookie: getCookieHeader() },
    });

    const protectedData = await protectedRes.json();
    console.log('Status:', protectedRes.status);
    console.log('Response:', JSON.stringify(protectedData, null, 2));

    if (protectedRes.status !== 200 || !protectedData.success) {
      throw new Error('RBAC role protection check failed!');
    }

    // 4. Test POST /api/auth/refresh
    console.log('\n--- 4. Testing POST /api/auth/refresh (Token Renewal) ---');
    const refreshRes = await fetch(`${baseUrl}/api/auth/refresh`, {
      method: 'POST',
      headers: { Cookie: getCookieHeader() },
    });

    const refreshData = await refreshRes.json();
    console.log('Status:', refreshRes.status);
    console.log('Response:', JSON.stringify(refreshData, null, 2));

    if (refreshRes.status !== 200 || !refreshData.success) {
      throw new Error('Access token refresh failed!');
    }

    // Refresh cookies list with newly generated access token
    extractCookies(refreshRes);
    console.log('Renewed cookies:', cookies);

    // 5. Test POST /api/auth/logout
    console.log('\n--- 5. Testing POST /api/auth/logout ---');
    const logoutRes = await fetch(`${baseUrl}/api/auth/logout`, {
      method: 'POST',
      headers: { Cookie: getCookieHeader() },
    });

    const logoutData = await logoutRes.json();
    console.log('Status:', logoutRes.status);
    console.log('Response:', JSON.stringify(logoutData, null, 2));

    if (logoutRes.status !== 200 || !logoutData.success) {
      throw new Error('Logout request failed!');
    }

    // Access cookies should have been cleared
    extractCookies(logoutRes);
    console.log('Cookies after logout:', cookies);

    // 6. Test GET /api/auth/me (After Logout - Should Fail)
    console.log('\n--- 6. Testing GET /api/auth/me (Unauthenticated - Should Fail 401) ---');
    const failRes = await fetch(`${baseUrl}/api/auth/me`, {
      method: 'GET',
      headers: { Cookie: getCookieHeader() },
    });

    const failData = await failRes.json();
    console.log('Status:', failRes.status);
    console.log('Response:', JSON.stringify(failData, null, 2));

    if (failRes.status !== 401 || failData.success) {
      throw new Error('Error: Route /me was accessible even after user logged out!');
    }

    console.log('\n==================================================');
    console.log('🎉 ALL AUTHENTICATION & RBAC INTEGRATION TESTS PASSED!');
    console.log('==================================================');

    server.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Verification check encountered errors:', error);
    if (server) {
      server.close();
    }
    process.exit(1);
  }
};

test();
