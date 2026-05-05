import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";

/**
 * True only if all 3 Cloudinary credentials are present in env.
 * (The cloudinary.ts config deletes them from process.env if partial/bad,
 * so this check is always accurate.)
 */
export function isCloudinaryConfigured(): boolean {
  return !!(
    env.CLOUDINARY_CLOUD_NAME &&
    env.CLOUDINARY_API_KEY &&
    env.CLOUDINARY_API_SECRET
  );
}

/**
 * Upload a raw buffer. Returns URL string on success, null on any failure.
 * NEVER throws — always falls back gracefully.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
  publicId?: string
): Promise<string | null> {
  if (!isCloudinaryConfigured()) return null;

  return new Promise((resolve) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `aistudio/${folder}`,
        public_id: publicId,
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error) {
          console.error("[Cloudinary] uploadToCloudinary error:", error.message);
          resolve(null);
          return;
        }
        resolve(result?.secure_url ?? null);
      }
    );
    stream.end(buffer);
  });
}

/**
 * Upload a base64 data string. Returns URL on success, null on failure.
 * NEVER throws.
 */
export async function uploadBase64ToCloudinary(
  base64: string,
  mimeType: string,
  folder: string
): Promise<string | null> {
  if (!isCloudinaryConfigured()) return null;

  try {
    const result = await cloudinary.uploader.upload(
      `data:${mimeType};base64,${base64}`,
      {
        folder: `aistudio/${folder}`,
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      }
    );
    return result.secure_url ?? null;
  } catch (err) {
    console.error(
      "[Cloudinary] uploadBase64ToCloudinary error:",
      err instanceof Error ? err.message : err
    );
    return null;
  }
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  if (!isCloudinaryConfigured()) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error(
      "[Cloudinary] deleteFromCloudinary error:",
      err instanceof Error ? err.message : err
    );
  }
}
