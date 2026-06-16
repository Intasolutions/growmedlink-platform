import { z } from 'zod';

// Helper custom validators
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 phone format or basic digits

export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const UserCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'EDITOR']),
});

export const UserUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
  email: z.string().email('Please enter a valid email address').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters long').optional(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'EDITOR']).optional(),
});

export const ServiceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  slug: z.string().regex(slugRegex, 'Slug must be URL-safe (e.g. canada-student-visa)'),
  category: z.enum(['Immigration', 'Language']),
  description: z.string().min(10, 'Short description must be at least 10 characters long'),
  content: z.record(z.any(), { message: 'Content must be a valid Tiptap JSON object' }),
  icon: z.string().min(1, 'Please select a valid icon name'),
  image: z.string().min(1, 'Please select an image from media library'), // ObjectId of Media
  metaTitle: z.string().min(5, 'Meta title must be at least 5 characters long').max(70),
  metaDescription: z.string().min(10, 'Meta description must be at least 10 characters').max(160),
  keywords: z.array(z.string()),
  canonicalUrl: z.string().url('Please enter a valid canonical URL').optional().or(z.literal('')),
  ogImage: z.string().url('Please enter a valid Open Graph image URL').optional().or(z.literal('')),
  isFeatured: z.boolean().default(false),
});

export const BlogSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long'),
  slug: z.string().regex(slugRegex, 'Slug must be URL-safe (e.g. study-abroad-ielts-tips)'),
  summary: z.string().min(10, 'Summary must be at least 10 characters long'),
  content: z.record(z.any(), { message: 'Content must be a valid Tiptap JSON object' }),
  image: z.string().min(1, 'Please select a featured image from media library'), // ObjectId of Media
  tags: z.array(z.string()),
  isPublished: z.boolean().default(false),
  metaTitle: z.string().min(5, 'Meta title must be at least 5 characters').max(70),
  metaDescription: z.string().min(10, 'Meta description must be at least 10 characters').max(160),
  keywords: z.array(z.string()),
  canonicalUrl: z.string().url('Please enter a valid canonical URL').optional().or(z.literal('')),
  ogImage: z.string().url('Please enter a valid Open Graph image URL').optional().or(z.literal('')),
});

export const EnquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(phoneRegex, 'Please enter a valid phone number (e.g., +1234567890)'),
  type: z.enum(['Contact Form', 'Talk to Expert']),
  subject: z.string().min(3, 'Subject must be at least 3 characters long').optional().or(z.literal('')),
  serviceOfInterest: z.string().optional().or(z.literal('')),
  destinationCountry: z.string().optional().or(z.literal('')),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
});

export const EnquiryUpdateSchema = z.object({
  status: z.enum(['Pending', 'In Progress', 'Resolved']),
  notes: z.string().optional(),
});

export const PageSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  content: z.record(z.any(), { message: 'Page content must be a valid Tiptap JSON object' }),
});

export const SettingsSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  logo: z.string().optional(), // ObjectId of Media
  contactEmail: z.string().email('Please enter a valid support email address'),
  contactPhone: z.string().min(5, 'Please enter a contact number'),
  address: z.string().min(5, 'Please enter the academy physical address'),
  socialLinks: z.object({
    facebook: z.string().url('Invalid URL').optional().or(z.literal('')),
    instagram: z.string().url('Invalid URL').optional().or(z.literal('')),
    linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
    twitter: z.string().url('Invalid URL').optional().or(z.literal('')),
  }),
  seoDefaultTitle: z.string().min(5, 'Default SEO title is required'),
  seoDefaultDescription: z.string().min(10, 'Default SEO description is required'),
});

export const AuditLogCreateSchema = z.object({
  userId: z.string(),
  action: z.string(),
  details: z.string(),
  ipAddress: z.string().optional(),
});
