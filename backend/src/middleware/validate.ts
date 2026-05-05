import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { sendError } from "../utils/apiResponse.js";

type Target = "body" | "query" | "params";

export const validate =
  (schema: ZodSchema, target: Target = "body") =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      const errors = formatZodErrors(result.error);
      sendError(res, "Validation failed", 422, errors);
      return;
    }
    req[target] = result.data;
    next();
  };

function formatZodErrors(error: ZodError): Record<string, string[]> {
  return error.issues.reduce<Record<string, string[]>>((acc, issue) => {
    const key = issue.path.join(".") || "general";
    if (!acc[key]) acc[key] = [];
    acc[key].push(issue.message);
    return acc;
  }, {});
}