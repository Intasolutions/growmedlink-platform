import { Schema, model } from 'mongoose';
import { IEnquiry } from '@intelligen/types';
import { ENQUIRY_STATUSES, ENQUIRY_TYPES } from '@intelligen/constants';

const enquirySchema = new Schema<IEnquiry>(
  {
    name: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Contact phone number is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Enquiry type is required'],
      enum: {
        values: [ENQUIRY_TYPES.CONTACT_FORM, ENQUIRY_TYPES.TALK_TO_EXPERT],
        message: '{VALUE} is not a valid enquiry type',
      },
    },
    subject: {
      type: String,
      trim: true,
      default: '',
    },
    serviceOfInterest: {
      type: String,
      trim: true,
      default: '',
    },
    destinationCountry: {
      type: String,
      trim: true,
      default: '',
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: [ENQUIRY_STATUSES.PENDING, ENQUIRY_STATUSES.IN_PROGRESS, ENQUIRY_STATUSES.RESOLVED],
        message: '{VALUE} is not a valid status',
      },
      default: ENQUIRY_STATUSES.PENDING,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
enquirySchema.index({ status: 1 });
enquirySchema.index({ createdAt: -1 });

export const Enquiry = model<IEnquiry>('Enquiry', enquirySchema);
export default Enquiry;
