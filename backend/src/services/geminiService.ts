import { GoogleGenAI } from "@google/genai";
import type { Part } from "@google/genai";
import { AppError } from "../utils/AppError.js";

export interface GenerationResult {
  imageBase64: string;
  mimeType: string;
}

const IMAGE_MODELS = [
  "gemini-2.5-flash-image",
  "gemini-2.0-flash-preview-image-generation",
];

export async function generateStyledImage(
  apiKey: string,
  imageBuffer: Buffer,
  imageMimeType: string,
  prompt: string
): Promise<GenerationResult> {
  const trimmedKey = apiKey?.trim();
  if (!trimmedKey || !trimmedKey.startsWith("AIza")) {
    throw new AppError(
      "Invalid Gemini API key. Key must start with 'AIza'. Get a free key at https://aistudio.google.com/apikey",
      400
    );
  }

  const ai = new GoogleGenAI({ apiKey: trimmedKey });
  const imageBase64 = imageBuffer.toString("base64");
  let lastError: Error | null = null;

  for (const modelName of IMAGE_MODELS) {
    try {
      console.log("[Gemini] Trying model:", modelName);

      const response = await ai.models.generateContent({
        model: modelName,
        contents: [
          {
            role: "user",
            parts: [
              { inlineData: { mimeType: imageMimeType, data: imageBase64 } },
              { text: prompt },
            ],
          },
        ],
        config: {
          responseModalities: ["TEXT", "IMAGE"],
        },
      });

      const parts: Part[] = response.candidates?.[0]?.content?.parts ?? [];
      console.log("[Gemini] Parts received:", parts.length, "from", modelName);

      for (const part of parts) {
        const blob = part.inlineData;
        if (blob && blob.mimeType?.startsWith("image/") && blob.data) {
          console.log("[Gemini] Image found:", blob.mimeType);
          return { imageBase64: blob.data, mimeType: blob.mimeType };
        }
      }

      const textContent = parts.filter((p) => p.text).map((p) => p.text).join(" ").slice(0, 200);
      console.warn("[Gemini] No image in response. Text:", textContent);
      throw new AppError(
        "Gemini processed the request but returned no image. The content may have been filtered. Try a different photo or style.",
        422
      );

    } catch (err) {
      if (err instanceof AppError) throw err;

      const error = err as Error & { status?: number; statusCode?: number; httpErrorCode?: { status: number } };
      const status = error.status ?? error.statusCode ?? error.httpErrorCode?.status ?? parseStatusFromMessage(error.message ?? "");
      const msg = error.message ?? "Unknown error";

      console.warn("[Gemini]", modelName, "- HTTP", status, ":", msg.slice(0, 200));

      if (status === 400) throw new AppError("Gemini rejected the request (400). Check your API key at https://aistudio.google.com/apikey", 400);
      if (status === 401) throw new AppError("Gemini API key unauthorized (401). Regenerate at https://aistudio.google.com/apikey", 401);
      if (status === 429) throw new AppError("Gemini rate limit (429). Free tier = 15 req/min. Wait and try again.", 429);

      if (msg.includes("API_KEY_INVALID") || msg.includes("invalid API key") || msg.includes("API key not valid")) {
        throw new AppError("Gemini API key is invalid. Get a new one at https://aistudio.google.com/apikey", 400);
      }

      lastError = error;
      console.warn("[Gemini] Skipping", modelName, "- trying next model...");
      continue;
    }
  }

  const errMsg = lastError?.message?.slice(0, 300) ?? "Unknown";
  console.error("[Gemini] All models failed. Last error:", errMsg);

  throw new AppError(
    "Image generation failed. Fix: Create a fresh API key at https://aistudio.google.com/apikey — " +
    "old keys sometimes lose image generation permissions. " +
    "Also ensure the Generative Language API is enabled in your Google Cloud project. " +
    "Last error: " + errMsg,
    503
  );
}

function parseStatusFromMessage(message: string): number {
  const m = message.match(/\b(400|401|403|404|429|500|503)\b/);
  return m ? parseInt(m[1], 10) : 0;
}
