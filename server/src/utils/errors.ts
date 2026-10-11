export class AppError extends Error {
  public statusCode: number;
  public errorCode: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, errorCode: string = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request', errorCode: string = 'BAD_REQUEST') {
    super(message, 400, errorCode);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Authentication required', errorCode: string = 'UNAUTHORIZED') {
    super(message, 401, errorCode);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access denied', errorCode: string = 'FORBIDDEN') {
    super(message, 403, errorCode);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', errorCode: string = 'NOT_FOUND') {
    super(message, 404, errorCode);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict', errorCode: string = 'CONFLICT') {
    super(message, 409, errorCode);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests. Please try again later.', errorCode: string = 'RATE_LIMIT_EXCEEDED') {
    super(message, 429, errorCode);
  }
}
