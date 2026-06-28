export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR';
export type EnquiryStatus = 'Pending' | 'In Progress' | 'Resolved';
export type EnquiryType = 'Contact Form';
export type ServiceCategory = 'Immigration' | 'Language';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface IMedia {
  _id: string;
  filename: string;
  folder: string;
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  size: number;
  uploadedBy: string | IUser; // Ref to User
  isDeleted?: boolean;
  deletedAt?: string;
  createdAt: string;
}

export interface IServiceFeature {
  title: string;
  description: string;
}

export interface IService {
  _id: string;
  title: string;
  slug: string;
  category: ServiceCategory;
  description: string;
  content: Record<string, any>; // Tiptap JSON content object
  features?: IServiceFeature[]; // Up to 6 features
  image: string | IMedia; // Media ID or full object reference
  secondaryImage: string | IMedia; // Secondary optional image
  secondaryHeading: string; // Optional secondary heading
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage: string;
  isFeatured: boolean;
  isDeleted?: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  image: string | IMedia; // Media ID or full object reference
  details: Record<string, any>; // Tiptap JSON content object
  fees: string;
  duration: string;
  otherDetails?: Record<string, any>; // Tiptap JSON content object
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage: string;
  isFeatured: boolean;
  isDeleted?: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: Record<string, any>; // Tiptap JSON content object
  author: string | IUser; // User ID or full object reference
  image: string | IMedia; // Media ID or full object reference
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  readingTime: number;
  isFeatured: boolean;
  publishedAt?: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage: string;
  isDeleted?: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IEnquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  type: EnquiryType;
  subject?: string;
  message: string;
  status: EnquiryStatus;
  notes?: string;
  source: string;
  pageUrl: string;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IPage {
  _id: string;
  key: string; // 'about' | 'privacy' | 'terms'
  title: string;
  content: Record<string, any>; // Tiptap JSON content object
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISettings {
  _id: string;
  companyName: string;
  logo?: string | IMedia; // Media ID or full object reference
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
  createdAt: string;
  updatedAt: string;
}

export interface IAuditLog {
  _id: string;
  userId: string | IUser; // Ref to User
  action: string;
  entityType: string; // e.g. 'Blog', 'Service', 'User', 'Settings'
  entityId: string; // ObjectId of modified document
  metadata?: Record<string, any>; // Event contextual parameters
  createdAt: string;
}

// API Response Wrappers
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string>;
}

export type ReviewStatus = 'Pending' | 'Approved' | 'Rejected';

export interface IReview {
  _id: string;
  studentName: string;
  studentImage?: string;
  rating: number;
  comment: string;
  service?: string | IService;
  status: ReviewStatus;
  isFeatured: boolean;
  isDeleted?: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

