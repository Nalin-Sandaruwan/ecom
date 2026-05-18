import { v2 as cloudinary } from "cloudinary";

/**
 * Extracts the public_id from a Cloudinary URL.
 * Example URL: https://res.cloudinary.com/dm9dsm2ri/image/upload/v1713032123/chillebazzar_products/p1_vj2k.jpg
 * Returns: chillebazzar_products/p1_vj2k
 */
export const extractPublicId = (url: string): string | null => {
  const parts = url.split("/");
  const uploadIndex = parts.indexOf("upload");
  if (uploadIndex === -1) return null;

  // The public ID is everything after the version (v1234567) or the upload folder
  // and before the file extension.
  const publicIdWithExtension = parts.slice(uploadIndex + 2).join("/");
  const publicId = publicIdWithExtension.split(".")[0];

  return publicId ?? null;
};

/**
 * Deletes an image from Cloudinary using its URL.
 */
export const deleteImageFromCloudinary = async (url: string): Promise<any> => {
  const publicId = extractPublicId(url);
  if (!publicId) return null;

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error(`Failed to delete image ${publicId} from Cloudinary:`, error);
    return null;
  }
};
