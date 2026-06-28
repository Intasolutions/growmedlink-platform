export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
} as const;

export type RoleValue = typeof ROLES[keyof typeof ROLES];

export const ENQUIRY_STATUSES = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
} as const;

export type EnquiryStatusValue = typeof ENQUIRY_STATUSES[keyof typeof ENQUIRY_STATUSES];

export const ENQUIRY_TYPES = {
  CONTACT_FORM: 'Contact Form',
} as const;

export type EnquiryTypeValue = typeof ENQUIRY_TYPES[keyof typeof ENQUIRY_TYPES];

export const SERVICE_CATEGORIES = {
  IMMIGRATION: 'Immigration',
  LANGUAGE: 'Language',
} as const;

export type ServiceCategoryValue = typeof SERVICE_CATEGORIES[keyof typeof SERVICE_CATEGORIES];

export const PAGE_KEYS = {
  ABOUT: 'about',
  PRIVACY: 'privacy',
  TERMS: 'terms',
} as const;

export type PageKeyValue = typeof PAGE_KEYS[keyof typeof PAGE_KEYS];

export const REVIEW_STATUSES = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
} as const;

export type ReviewStatusValue = typeof REVIEW_STATUSES[keyof typeof REVIEW_STATUSES];

