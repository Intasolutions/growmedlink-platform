import { z } from 'zod';
import { ROLES, ENQUIRY_STATUSES, ENQUIRY_TYPES, SERVICE_CATEGORIES, REVIEW_STATUSES } from '@intelligen/constants';

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
  role: z.enum([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EDITOR]),
});

export const UserUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
  email: z.string().email('Please enter a valid email address').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters long').optional(),
  role: z.enum([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EDITOR]).optional(),
});

export const ServiceFeatureSchema = z.object({
  title: z.string().min(1, 'Feature title is required').max(100),
  description: z.string().min(1, 'Feature description is required').max(500),
});

export const CategorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters long'),
  slug: z.string().regex(slugRegex, 'Slug must be URL-safe (e.g. immigration-prep)').optional().or(z.literal('')),
});

export const ServiceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  slug: z.string().regex(slugRegex, 'Slug must be URL-safe (e.g. canada-student-visa)'),
  category: z.string().min(1, 'Please select a category'), // Category MongoID
  description: z.string().min(10, 'Short description must be at least 10 characters long'),
  content: z.record(z.any(), { message: 'Content must be a valid Tiptap JSON object' }),
  features: z.array(ServiceFeatureSchema).max(6, 'Maximum 6 features allowed').optional(),
  image: z.string().min(1, 'Please select an image from media library'), // ObjectId of Media
  secondaryImage: z.string().min(1, 'Please select a secondary image'),
  secondaryHeading: z.string().min(3, 'Secondary heading must be at least 3 characters'),
  metaTitle: z.string().min(5, 'Meta title must be at least 5 characters long').max(70),
  metaDescription: z.string().min(10, 'Meta description must be at least 10 characters').max(160),
  keywords: z.array(z.string()),
  canonicalUrl: z.string().url('Please enter a valid canonical URL').optional().or(z.literal('')),
  ogImage: z.string().url('Please enter a valid Open Graph image URL').optional().or(z.literal('')),
  isFeatured: z.boolean().default(false),
});

export const ProductSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters long'),
  slug: z.string().regex(slugRegex, 'Slug must be URL-safe (e.g. ielts-coaching-package)'),
  category: z.string().min(1, 'Please select a category'), // Category MongoID
  image: z.string().min(1, 'Please select an image from media library'), // ObjectId of Media
  details: z.record(z.any(), { message: 'Details must be a valid Tiptap JSON object' }),
  fees: z.string().min(1, 'Fees is required'),
  duration: z.string().min(1, 'Duration is required'),
  otherDetails: z.record(z.any()).optional(),
  metaTitle: z.string().min(5, 'Meta title must be at least 5 characters long').max(70),
  metaDescription: z.string().min(10, 'Meta description must be at least 10 characters').max(160),
  keywords: z.array(z.string()),
  canonicalUrl: z.string().url('Please enter a valid canonical URL').optional().or(z.literal('')),
  ogImage: z.string().url('Please enter a valid Open Graph image URL').optional().or(z.literal('')),
  order: z.number().int().min(0).default(0).optional(),
  isFeatured: z.boolean().default(false),
  videoUrl: z.string().optional().or(z.literal('')),
});

export const CreateBlogSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long').max(200, 'Title cannot exceed 200 characters'),
  subHeading: z.string().max(300, 'Subheading cannot exceed 300 characters').optional().or(z.literal('')),
  slug: z.string().regex(slugRegex, 'Slug must be URL-safe and lowercase (e.g. study-abroad-guide)'),
  summary: z.string().min(20, 'Summary must be at least 20 characters long').max(500, 'Summary cannot exceed 500 characters'),
  content: z.record(z.any(), { message: 'Content must be a valid Tiptap JSON object' }),
  image: z.string().min(1, 'Please select a featured image from media library'), // ObjectId of Media
  tags: z.array(z.string()).max(10, 'You can add a maximum of 10 tags'),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  isFeatured: z.boolean().default(false),
  metaTitle: z.string().max(60, 'Meta title cannot exceed 60 characters').optional().or(z.literal('')),
  metaDescription: z.string().max(160, 'Meta description cannot exceed 160 characters').optional().or(z.literal('')),
  keywords: z.array(z.string()).default([]),
  canonicalUrl: z.string().url('Please enter a valid canonical URL').optional().or(z.literal('')),
  ogImage: z.string().url('Please enter a valid Open Graph image URL').optional().or(z.literal('')),
});

export const UpdateBlogSchema = CreateBlogSchema.partial();

export const EnquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(phoneRegex, 'Please enter a valid phone number (e.g., +1234567890)'),
  type: z.enum([ENQUIRY_TYPES.CONTACT_FORM]),
  subject: z.string().min(3, 'Subject must be at least 3 characters long').optional().or(z.literal('')),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
  source: z.string().optional(),
  pageUrl: z.string().optional(),
});

export const EnquiryUpdateSchema = z.object({
  status: z.enum([ENQUIRY_STATUSES.PENDING, ENQUIRY_STATUSES.IN_PROGRESS, ENQUIRY_STATUSES.RESOLVED]),
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
    youtube: z.string().url('Invalid URL').optional().or(z.literal('')),
  }),
  seoDefaultTitle: z.string().min(5, 'Default SEO title is required'),
  seoDefaultDescription: z.string().min(10, 'Default SEO description is required'),
});

export const MediaSchema = z.object({
  filename: z.string().min(1, 'Filename is required'),
  folder: z.string().min(1, 'Folder is required'),
  publicId: z.string().min(1, 'Public ID is required'),
  secureUrl: z.string().url('Invalid secure URL'),
  width: z.number().int().positive('Width must be a positive integer'),
  height: z.number().int().positive('Height must be a positive integer'),
  size: z.number().int().positive('Size must be a positive integer'),
  uploadedBy: z.string().min(1, 'Uploaded by user ID is required'),
});

export const AuditLogCreateSchema = z.object({
  userId: z.string(),
  action: z.string(),
  details: z.string(),
  ipAddress: z.string().optional(),
});

export const ReviewSchema = z.object({
  studentName: z.string().min(2, 'Student name must be at least 2 characters long'),
  studentImage: z.string().optional().or(z.literal('')),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  comment: z.string().min(10, 'Review comment must be at least 10 characters long'),
  service: z.string().optional().or(z.literal('')),
  status: z.enum([REVIEW_STATUSES.PENDING, REVIEW_STATUSES.APPROVED, REVIEW_STATUSES.REJECTED]).default(REVIEW_STATUSES.PENDING),
  isFeatured: z.boolean().default(false),
});

export const ReviewUpdateSchema = ReviewSchema.partial();


