import { Schema, model } from 'mongoose';
import { ISettings } from '@intelligen/types';

const settingsSchema = new Schema<ISettings>(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    logo: {
      type: Schema.Types.ObjectId,
      ref: 'Media',
    },
    contactEmail: {
      type: String,
      required: [true, 'Support contact email is required'],
      lowercase: true,
      trim: true,
    },
    contactPhone: {
      type: String,
      required: [true, 'Contact phone is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Academy address is required'],
      trim: true,
    },
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
    },
    seoDefaultTitle: {
      type: String,
      required: [true, 'SEO default page title is required'],
      trim: true,
    },
    seoDefaultDescription: {
      type: String,
      required: [true, 'SEO default page description is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Singleton collection safeguard: restrict creation to 1 document
settingsSchema.pre('save', async function (next) {
  if (this.isNew) {
    const SettingsModel = model('Settings');
    const count = await SettingsModel.countDocuments();
    if (count > 0) {
      return next(new Error('Constraint Error: Only a single configuration settings document can exist in this collection.'));
    }
  }
  next();
});

export const Settings = model<ISettings>('Settings', settingsSchema);
export default Settings;
