import mongoose, { Document, Schema } from "mongoose";

export interface IGeneration extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  styleId: string;
  styleName: string;
  originalImageUrl: string;
  generatedImageUrl: string;
  prompt: string;
  creditsUsed: number;
  status: "pending" | "completed" | "failed";
  errorMessage?: string;
  createdAt: Date;
}

const generationSchema = new Schema<IGeneration>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    styleId: { type: String, required: true },
    styleName: { type: String, required: true },
    originalImageUrl: { type: String, default: "" },
    generatedImageUrl: { type: String, default: "" },
    prompt: { type: String, required: true },
    creditsUsed: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    errorMessage: { type: String },
  },
  { timestamps: true }
);

generationSchema.set("toJSON", {
  transform: (_doc, ret) => {
    const { __v, ...rest } = ret;
    return rest;
  },
});

export const Generation = mongoose.model<IGeneration>("Generation", generationSchema);
