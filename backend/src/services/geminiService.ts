import { GoogleGenerativeAI } from "@google/generative-ai";
import { AppError } from "../utils/AppError.js";

export interface GenerationResult {
  imageBase64: string;
  mimeType: string;
}

export async function generateStyledImage(
  apiKey: string,
  imageBuffer: Buffer,
  imageMimeType: string,
  prompt: string
): Promise<GenerationResult> {
  if (!apiKey?.startsWith("AIza")) {
    throw new AppError("Invalid Gemini API key format", 400);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp-image-generation",
  });

  const imageBase64 = imageBuffer.toString("base64");

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: imageMimeType,
              data: imageBase64,
            },
          },
          { text: prompt },
        ],
      },
    ],
    generationConfig: {
      // @ts-expect-error — responseModalities is valid but not yet in types
      responseModalities: ["Text", "Image"],
    },
  });

  const response = result.response;
  const parts = response.candidates?.[0]?.content?.parts ?? [];

  for (const part of parts) {
    const data = (part as unknown as { inlineData?: { mimeType: string; data: string } }).inlineData;
    if (data?.mimeType?.startsWith("image/")) {
      return {
        imageBase64: data.data,
        mimeType: data.mimeType,
      };
    }
  }

  throw new AppError(
    "Gemini did not return an image. Check your API key permissions and ensure you have access to the image generation model.",
    422
  );
}