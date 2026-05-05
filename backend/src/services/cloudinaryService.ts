import { cloudinary } from "../config/cloudinary.js";
import { AppError } from "../utils/AppError.js";
import { env } from "../config/env.js";

export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
  publicId?: string
): Promise<string> {
  if (!env.CLOUDINARY_CLOUD_NAME) {
    throw new AppError("Cloudinary is not configured", 500);
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `aistudio/${folder}`,
        public_id: publicId,
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error) return reject(new AppError(error.message, 500));
        if (!result) return reject(new AppError("Upload failed", 500));
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

export async function uploadBase64ToCloudinary(
  base64: string,
  mimeType: string,
  folder: string
): Promise<string> {
  const dataUri = `data:${mimeType};base64,${base64}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: `aistudio/${folder}`,
    resource_type: "image",
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });
  return result.secure_url;
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}