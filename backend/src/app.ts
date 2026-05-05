import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";
import { connectDB } from "./config/database.js";
import "./config/cloudinary.js";

import { globalRateLimiter } from "./middleware/rateLimiter.js";
import { errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/auth.js";
import generationRoutes from "./routes/generations.js";
import userRoutes from "./routes/users.js";

const app = express();


app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());


if (env.NODE_ENV !== "production") app.use(morgan("dev"));


app.use(globalRateLimiter);


app.get("/health", (_req, res) => {
  res.json({ status: "ok", env: env.NODE_ENV, timestamp: new Date().toISOString() });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/generations", generationRoutes);
app.use("/api/v1/users", userRoutes);


app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});


app.use(errorHandler);


connectDB().then(() => {
  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
    console.log(`Environment: ${env.NODE_ENV}`);
  });
});

export default app;