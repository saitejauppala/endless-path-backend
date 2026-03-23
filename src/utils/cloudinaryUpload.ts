import { v2 as cloudinary } from 'cloudinary';
import { AppError } from './AppError';

// Make sure cloudinary is configured before importing this
import '../config/cloudinary';

/**
 * Upload a file buffer to Cloudinary
 * @param fileBuffer - the file buffer from multer memoryStorage
 * @param folder - cloudinary folder name
 * @returns the secure URL of the uploaded image
 */
export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string = 'endless-path'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error || !result) {
          reject(new AppError('Image upload failed', 500));
        } else {
          resolve(result.secure_url);
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
};
