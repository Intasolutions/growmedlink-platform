export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface IMedia {
  _id: string;
  filename: string;
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  size: number;
  uploadedBy: string; // Ref to User ID
  createdAt: string;
}

export interface IService {
  _id: string;
  title: string;
  slug: string;
  category: 'Immigration' | 'Language';
  description: string;
  content: Record<string, any>; // Tiptap JSON content object
  icon: string; // Lucide icon identifier
  image: string | IMedia; // Media ID or full object
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: Record<string, any>; // Tiptap JSON content object
  author: string | IUser; // User ID or full object
  image: string | IMedia; // Media ID or full object
  tags: string[];
  isPublished: boolean;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IEnquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  type: 'Contact Form' | 'Talk to Expert';
  subject?: string;
  serviceOfInterest?: string;
  destinationCountry?: string;
  message: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPage {
  _id: string;
  key: string; // 'about' | 'privacy' | 'terms'
  title: string;
  content: Record<string, any>; // Tiptap JSON content object
  updatedAt: string;
}

export interface ISettings {
  _id: string;
  companyName: string;
  logo?: string | IMedia; // Media ID or full object
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  seoDefaultTitle: string;
  seoDefaultDescription: string;
  updatedAt: string;
}

export interface IAuditLog {
  _id: string;
  userId: string | IUser;
  action: string; // e.g. 'Create Blog', 'Login', etc.
  details: string;
  ipAddress?: string;
  createdAt: string;
}

// API Response Wrappers
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string>;
}
