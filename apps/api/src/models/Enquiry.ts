import { Schema, model } from 'mongoose';
import { IEnquiry } from '@intelligen/types';
import { ENQUIRY_STATUSES, ENQUIRY_TYPES } from '@intelligen/constants';

const enquirySchema = new Schema<IEnquiry>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(ENQUIRY_TYPES),
      required: [true, 'Enquiry type is required'],
    },
    subject: {
      type: String,
      trim: true,
    },
    serviceOfInterest: {
      type: String,
      trim: true,
    },
    destinationCountry: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    status: {
      type: String,
      enum: Object.values(ENQUIRY_STATUSES),
      default: ENQUIRY_STATUSES.PENDING,
    },
    notes: {
      type: String,
    },
    source: {
      type: String,
      trim: true,
    },
    pageUrl: {
      type: String,
      trim: true,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for searching and filtering
enquirySchema.index({ status: 1 });
enquirySchema.index({ type: 1 });
enquirySchema.index({ name: 'text', email: 'text', phone: 'text' });
enquirySchema.index({ createdAt: -1 });

export const Enquiry = model<IEnquiry>('Enquiry', enquirySchema);
export default Enquiry;
