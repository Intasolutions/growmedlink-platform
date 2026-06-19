import dotenv from 'dotenv';
import connectDatabase from './config/database.js';
import app from './index.js';
import http from 'http';
import { Blog } from './models/Blog.js';
import { Media } from './models/Media.js';

dotenv.config();

const test = async () => {
  console.log('[testBlogs] Starting Blogs API integration tests...');

  let server: http.Server | undefined;
  let mockMediaId: string = '';
  try {
    await connectDatabase();
    
    // Clean up any existing test blogs with the target slug
    await Blog.deleteMany({ slug: 'canada-express-entry-2026-guide' });
    
    // Create a mock media record to use as the featured image
    const media = new Media({
      filename: 'test_blog_featured.png',
      folder: 'blogs',
      publicId: 'blogs/test_blog_featured',
      secureUrl: 'https://res.cloudinary.com/demo/image/upload/blogs/test_blog_featured.jpg',
      width: 800,
      height: 600,
      size: 1024,
      uploadedBy: '6a31250097b51cc09e28f0f5', // fake user id
    });
    await media.save();
    mockMediaId = media._id.toString();
    console.log(`[testBlogs] Created mock Media ref ID: ${mockMediaId}`);

    // Start server on random port
    server = app.listen(0);
    const address = server.address() as any;
    const port = address.port;
    const baseUrl = `http://127.0.0.1:${port}`;
    console.log(`[testBlogs] Test server listening on ${baseUrl}`);

    // Login to obtain authentication cookie
    const email = process.env.SUPER_ADMIN_EMAIL || 'superadmin@growmedlink.com';
    const password = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdminPassword123!';

    console.log('[testBlogs] Logging in to get cookies...');
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (loginRes.status !== 200) {
      throw new Error('Pre-test login failed! Cannot run blogs tests without auth.');
    }

    const setCookie = loginRes.headers.getSetCookie();
    const cookies = setCookie.map(cookieStr => cookieStr.split(';')[0]);
    const cookieHeader = cookies.join('; ');

    // 1. Create a draft blog post with 750 words
    console.log('\n--- 1. Testing POST /api/blogs (Create Draft Blog with 750 words) ---');
    
    // Construct exactly 750 words to test 4-minute reading time (750 / 200 = 3.75, Math.ceil = 4)
    const sevenHundredFiftyWords = Array(750).fill('word').join(' ');
    
    const blogPayload = {
      title: 'Canada Immigration: The 2026 Comprehensive Express Entry Guide',
      slug: 'canada-express-entry-2026-guide',
      summary: 'A detailed walkthrough detailing the current point thresholds and categories in Express Entry.',
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: sevenHundredFiftyWords,
              }
            ]
          }
        ]
      },
      image: mockMediaId,
      tags: ['Canada', 'Immigration', 'Visa'],
      status: 'draft',
      isFeatured: true,
      metaTitle: 'Canada Express Entry Guide 2026',
      metaDescription: 'Read the latest Express Entry draw patterns and point thresholds guide.',
      keywords: ['canada', 'express entry', 'immigration', 'visa'],
      canonicalUrl: 'https://growmedlink.com/blog/canada-express-entry-2026-guide',
      ogImage: 'https://growmedlink.com/og/canada-express-entry.jpg',
    };

    const createRes = await fetch(`${baseUrl}/api/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      body: JSON.stringify(blogPayload),
    });

    const createData = await createRes.json();
    console.log('Status:', createRes.status);
    console.log('Response:', JSON.stringify(createData, null, 2));

    if (createRes.status !== 201 || !createData.success) {
      throw new Error('Create blog request failed!');
    }

    const blogId = createData.data._id;
    console.log(`Created Blog ID: ${blogId}`);
    
    // Assert reading time calculation (750 words => 4 minutes)
    const readingTime = createData.data.readingTime;
    if (readingTime !== 4) {
      throw new Error(`Expected readingTime to be 4, but got ${readingTime}`);
    }
    console.log('Reading Time generation verified: 4 minutes (OK)');

    // 2. Query validation checks (Zod errors)
    console.log('\n--- 2. Testing Zod Validations (Create blog with invalid parameters) ---');
    const invalidPayload = {
      ...blogPayload,
      title: 'Short', // Too short
      summary: 'Too short summary', // Too short
      slug: 'Invalid Slug!', // Invalid slug characters
      tags: Array(11).fill('tag'), // > 10 tags
    };

    const invalidRes = await fetch(`${baseUrl}/api/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      body: JSON.stringify(invalidPayload),
    });

    const invalidData = await invalidRes.json();
    console.log('Status:', invalidRes.status);
    console.log('Validation errors returned:', JSON.stringify(invalidData.errors, null, 2));

    if (invalidRes.status !== 400 || invalidData.success) {
      throw new Error('Zod validator did not block invalid input parameter payloads!');
    }
    console.log('Zod validation successfully caught bad input attributes (OK)');

    // 3. Update blog to published status (PUT /api/blogs/:id)
    console.log('\n--- 3. Testing PUT /api/blogs/:id (Update status to published) ---');
    const updatePayload = {
      ...blogPayload,
      status: 'published',
      isFeatured: false,
    };

    const updateRes = await fetch(`${baseUrl}/api/blogs/${blogId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      body: JSON.stringify(updatePayload),
    });

    const updateData = await updateRes.json();
    console.log('Status:', updateRes.status);
    console.log('Response status:', updateData.data.status);
    console.log('Published date:', updateData.data.publishedAt);

    if (updateRes.status !== 200 || !updateData.success || updateData.data.status !== 'published' || !updateData.data.publishedAt) {
      throw new Error('Update status to published failed!');
    }
    console.log('Status transitioned to published and publishedAt set (OK)');

    // 4. Fetch list of blogs (GET /api/blogs)
    console.log('\n--- 4. Testing GET /api/blogs (Search, tag, and featured queries) ---');
    
    // search filter
    const searchRes = await fetch(`${baseUrl}/api/blogs?search=comprehensive`);
    const searchData = await searchRes.json();
    console.log('Search response count:', searchData.data.length);
    if (searchRes.status !== 200 || searchData.data.length !== 1) {
      throw new Error('Search filter failed to return comprehensive blog!');
    }

    // tag filter
    const tagRes = await fetch(`${baseUrl}/api/blogs?tag=Immigration`);
    const tagData = await tagRes.json();
    console.log('Tag response count:', tagData.data.length);
    if (tagRes.status !== 200 || tagData.data.length !== 1) {
      throw new Error('Tag filter failed!');
    }

    // pagination query
    const pageRes = await fetch(`${baseUrl}/api/blogs?page=1&limit=2`);
    const pageData = await pageRes.json();
    console.log('Pagination details:', JSON.stringify(pageData.pagination, null, 2));
    if (pageRes.status !== 200 || !pageData.pagination) {
      throw new Error('Pagination filter mapping failed!');
    }

    // 5. Delete blog (DELETE /api/blogs/:id)
    console.log(`\n--- 5. Testing DELETE /api/blogs/:id (Soft Delete) ---`);
    const deleteRes = await fetch(`${baseUrl}/api/blogs/${blogId}`, {
      method: 'DELETE',
      headers: { Cookie: cookieHeader },
    });

    const deleteData = await deleteRes.json();
    console.log('Status:', deleteRes.status);
    console.log('Response:', JSON.stringify(deleteData, null, 2));

    if (deleteRes.status !== 200 || !deleteData.success) {
      throw new Error('Soft delete request failed!');
    }

    // 6. Verify Soft Delete
    console.log('\n--- 6. Verifying Soft Delete (Listing after Deletion) ---');
    const verifyRes = await fetch(`${baseUrl}/api/blogs`);
    const verifyData = await verifyRes.json();
    const stillExists = verifyData.data.some((b: any) => b._id === blogId);
    if (stillExists) {
      throw new Error('Deleted blog was returned in active listing query!');
    }
    console.log('Soft-deleted blog is NOT returned in active listings: OK');

    // Cleanup mock media
    await Media.findByIdAndDelete(mockMediaId);
    console.log('[testBlogs] Cleaned up mock Media document.');

    console.log('\n==================================================');
    console.log('🎉 ALL BLOGS API INTEGRATION TESTS PASSED!');
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
