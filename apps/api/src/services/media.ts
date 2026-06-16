import { Readable } from 'stream';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  bytes: number;
}

/**
 * Uploads a file buffer directly to Cloudinary using streams.
 * Falls back to mock values if Cloudinary is not configured.
 */
export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string,
  filename: string
): Promise<CloudinaryUploadResult> => {
  if (!isCloudinaryConfigured) {
    console.log('[media-service] Cloudinary not configured. Simulating upload (MOCK).');
    const mockPublicId = `mock_folder/${folder}/${Date.now()}_${filename.replace(/\.[^/.]+$/, '')}`;
    return Promise.resolve({
      public_id: mockPublicId,
      secure_url: `https://res.cloudinary.com/demo/image/upload/${mockPublicId}.jpg`,
      width: 800,
      height: 600,
      bytes: fileBuffer.length,
    });
  }

  return new Promise((resolve, reject) => {
    const cleanName = filename.replace(/\.[^/.]+$/, '');
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `growmedlink/${folder}`,
        public_id: `${cleanName}_${Date.now()}`,
        overwrite: true,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(new Error('Cloudinary upload stream returned undefined result.'));
        }
        resolve(result as CloudinaryUploadResult);
      }
    );

    Readable.from(fileBuffer).pipe(uploadStream);
  });
};

/**
 * Deletes a media asset from Cloudinary using its public_id.
 * Falls back to mock values if Cloudinary is not configured.
 */
export const deleteFromCloudinary = (publicId: string): Promise<any> => {
  if (!isCloudinaryConfigured || publicId.startsWith('mock_folder/')) {
    console.log(`[media-service] Simulating deletion of public_id (MOCK): ${publicId}`);
    return Promise.resolve({ result: 'ok' });
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
};
