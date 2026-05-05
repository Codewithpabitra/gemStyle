import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.js";

const hasAll = !!(
  env.CLOUDINARY_CLOUD_NAME &&
  env.CLOUDINARY_API_KEY &&
  env.CLOUDINARY_API_SECRET
);

const hasNone = !env.CLOUDINARY_CLOUD_NAME && !env.CLOUDINARY_API_KEY && !env.CLOUDINARY_API_SECRET;

if (hasAll) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME!,
    api_key: env.CLOUDINARY_API_KEY!,
    api_secret: env.CLOUDINARY_API_SECRET!,
  });
  console.log("✅ Cloudinary configured — images will be stored in the cloud");
} else if (hasNone) {
  console.log("ℹ️  Cloudinary not configured — images stored as base64 inline (OK for dev)");
} else {
  // Partial config — most likely cause of 403
  console.warn(
    "⚠️  Cloudinary partially configured — some credentials are missing or wrong.\n" +
    `   CLOUDINARY_CLOUD_NAME : ${env.CLOUDINARY_CLOUD_NAME ? "✅ set" : "❌ missing"}\n` +
    `   CLOUDINARY_API_KEY    : ${env.CLOUDINARY_API_KEY ? "✅ set" : "❌ missing"}\n` +
    `   CLOUDINARY_API_SECRET : ${env.CLOUDINARY_API_SECRET ? "✅ set" : "❌ missing"}\n` +
    "   Cloudinary will be DISABLED. Fix credentials or remove all 3 from .env."
  );
  // Force all to undefined so isCloudinaryConfigured() returns false
  delete process.env.CLOUDINARY_CLOUD_NAME;
  delete process.env.CLOUDINARY_API_KEY;
  delete process.env.CLOUDINARY_API_SECRET;
}

export { cloudinary };
