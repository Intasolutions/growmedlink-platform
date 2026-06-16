import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

let isCloudinaryConfigured = false;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
  isCloudinaryConfigured = true;
  console.log('[cloudinary] Cloudinary initialized and configured successfully.');
} else {
  console.warn('[cloudinary] WARNING: Cloudinary credentials are not defined in the environment. Offline/Mock media mode will be active.');
}

export { cloudinary, isCloudinaryConfigured };
export default cloudinary;
