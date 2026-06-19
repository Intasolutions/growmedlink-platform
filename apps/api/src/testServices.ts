import dotenv from 'dotenv';
import connectDatabase from './config/database.js';
import app from './index.js';
import http from 'http';
import { Service } from './models/Service.js';
import { Media } from './models/Media.js';

dotenv.config();

const test = async () => {
  console.log('[testServices] Starting Services API integration tests...');

  let server: http.Server | undefined;
  let mockMediaId: string = '';
  try {
    await connectDatabase();
    
    // Create a mock media record to use as the featured image
    const media = new Media({
      filename: 'test_service_featured.png',
      folder: 'services',
      publicId: 'services/test_service_featured',
      secureUrl: 'https://res.cloudinary.com/demo/image/upload/services/test_service_featured.jpg',
      width: 800,
      height: 600,
      size: 1024,
      uploadedBy: '6a31250097b51cc09e28f0f5', // fake user id
    });
    await media.save();
    mockMediaId = media._id.toString();
    console.log(`[testServices] Created mock Media ref ID: ${mockMediaId}`);

    // Start server on random port
    server = app.listen(0);
    const address = server.address() as any;
    const port = address.port;
    const baseUrl = `http://127.0.0.1:${port}`;
    console.log(`[testServices] Test server listening on ${baseUrl}`);

    // Login to obtain authentication cookie
    const email = process.env.SUPER_ADMIN_EMAIL || 'superadmin@growmedlink.com';
    const password = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdminPassword123!';

    console.log('[testServices] Logging in to get cookies...');
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (loginRes.status !== 200) {
      throw new Error('Pre-test login failed! Cannot run services tests without auth.');
    }

    const setCookie = loginRes.headers.getSetCookie();
    const cookies = setCookie.map(cookieStr => cookieStr.split(';')[0]);
    const cookieHeader = cookies.join('; ');

    // 1. Create a service (POST /api/services)
    console.log('\n--- 1. Testing POST /api/services (Create Service) ---');
    const testServicePayload = {
      title: 'Canada Study Visa Assistance',
      slug: 'canada-study-visa',
      category: 'Immigration',
      description: 'Comprehensive service to assist students with applying for Canadian visas.',
      content: { text: 'Detailed step-by-step guidance including document checklist, SOP review, and mock interview preparations.' },
      image: mockMediaId,
      metaTitle: 'Canada Student Visa Services | GrowMedLink',
      metaDescription: 'Get your study permit for Canada with professional assistance from our certified immigration consultants.',
      keywords: ['canada', 'visa', 'study', 'immigration'],
      canonicalUrl: 'https://growmedlink.com/services/canada-study-visa',
      ogImage: 'https://growmedlink.com/og/canada-study-visa.jpg',
      isFeatured: true,
    };

    const createRes = await fetch(`${baseUrl}/api/services`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Cookie: cookieHeader 
      },
      body: JSON.stringify(testServicePayload),
    });

    const createData = await createRes.json();
    console.log('Status:', createRes.status);
    console.log('Response:', JSON.stringify(createData, null, 2));

    if (createRes.status !== 201 || !createData.success) {
      throw new Error('Create service request failed!');
    }

    const serviceId = createData.data._id;
    console.log(`Created Service ID: ${serviceId}`);

    // 2. Fetch all services (GET /api/services)
    console.log('\n--- 2. Testing GET /api/services (Listing Services) ---');
    const listRes = await fetch(`${baseUrl}/api/services`, {
      method: 'GET',
    });

    const listData = await listRes.json();
    console.log('Status:', listRes.status);
    console.log('Number of services returned:', listData.data.length);

    if (listRes.status !== 200 || !listData.success) {
      throw new Error('List services request failed!');
    }

    // 3. Fetch single service by slug (GET /api/services/:slug)
    console.log('\n--- 3. Testing GET /api/services/:slug (Get Service by Slug) ---');
    const slugRes = await fetch(`${baseUrl}/api/services/canada-study-visa`, {
      method: 'GET',
    });

    const slugData = await slugRes.json();
    console.log('Status:', slugRes.status);
    console.log('Response:', JSON.stringify(slugData, null, 2));

    if (slugRes.status !== 200 || !slugData.success) {
      throw new Error('Get service by slug request failed!');
    }

    // 4. Fetch single service by ID (GET /api/services/id/:id)
    console.log('\n--- 4. Testing GET /api/services/id/:id (Get Service by ID) ---');
    const idRes = await fetch(`${baseUrl}/api/services/id/${serviceId}`, {
      method: 'GET',
      headers: { Cookie: cookieHeader },
    });

    const idData = await idRes.json();
    console.log('Status:', idRes.status);
    console.log('Response:', JSON.stringify(idData, null, 2));

    if (idRes.status !== 200 || !idData.success) {
      throw new Error('Get service by ID request failed!');
    }

    // 5. Update service details (PUT /api/services/:id)
    console.log('\n--- 5. Testing PUT /api/services/:id (Update Service) ---');
    const updatePayload = {
      ...testServicePayload,
      title: 'Canada Study Visa & Study Permit Assistance',
      isFeatured: false,
    };

    const updateRes = await fetch(`${baseUrl}/api/services/${serviceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      body: JSON.stringify(updatePayload),
    });

    const updateData = await updateRes.json();
    console.log('Status:', updateRes.status);
    console.log('Response:', JSON.stringify(updateData, null, 2));

    if (updateRes.status !== 200 || !updateData.success) {
      throw new Error('Update service request failed!');
    }

    // 6. Delete service (DELETE /api/services/:id)
    console.log(`\n--- 6. Testing DELETE /api/services/:id (Soft Deleting Service ID: ${serviceId}) ---`);
    const deleteRes = await fetch(`${baseUrl}/api/services/${serviceId}`, {
      method: 'DELETE',
      headers: { Cookie: cookieHeader },
    });

    const deleteData = await deleteRes.json();
    console.log('Status:', deleteRes.status);
    console.log('Response:', JSON.stringify(deleteData, null, 2));

    if (deleteRes.status !== 200 || !deleteData.success) {
      throw new Error('Delete service request failed!');
    }

    // 7. Verify Soft Delete
    console.log('\n--- 7. Verifying Soft Delete (Listing after Deletion) ---');
    const verifyRes = await fetch(`${baseUrl}/api/services`, {
      method: 'GET',
    });

    const verifyData = await verifyRes.json();
    const stillExists = verifyData.data.some((s: any) => s._id === serviceId);
    if (stillExists) {
      throw new Error('Soft-deleted service is still returned in active listings!');
    }
    console.log('Soft-deleted service is NOT returned in active listings: OK');

    const dbRecord = await Service.findById(serviceId);
    if (dbRecord) {
      throw new Error('Mongoose query returned soft-deleted record without explicit overrides!');
    }
    console.log('Mongoose standard query returned null for soft-deleted ID: OK');

    // Cleanup mock media
    await Media.findByIdAndDelete(mockMediaId);
    console.log('[testServices] Cleaned up mock Media document.');

    console.log('\n==================================================');
    console.log('🎉 ALL SERVICES API INTEGRATION TESTS PASSED!');
    console.log('==================================================');

    server.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Integration testing failed:', error);
    if (server) {
      server.close();
    }
    if (mockMediaId) {
      await Media.findByIdAndDelete(mockMediaId).catch(() => {});
    }
    process.exit(1);
  }
};

test();
