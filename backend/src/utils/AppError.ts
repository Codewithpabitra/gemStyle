export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    statusCode = 400,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }

  static unauthorized(message = "Unauthorized"): AppError {
    return new AppError(message, 401);
  }

  static forbidden(message = "Forbidden"): AppError {
    return new AppError(message, 403);
  }

  static notFound(message = "Resource not found"): AppError {
    return new AppError(message, 404);
  }

  static conflict(message = "Conflict"): AppError {
    return new AppError(message, 409);
  }

  static tooManyRequests(message = "Too many requests"): AppError {
    return new AppError(message, 429);
  }
}