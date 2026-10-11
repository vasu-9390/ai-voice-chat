import { Response } from 'express';

export interface ApiResponseOptions<T = any> {
  res: Response;
  statusCode?: number;
  data?: T;
  message?: string;
  meta?: Record<string, any>;
}

export class ApiResponse {
  static success<T>({ res, statusCode = 200, data, message, meta }: ApiResponseOptions<T>): Response {
    return res.status(statusCode).json({
      success: true,
      ...(message && { message }),
      ...(data !== undefined && { data }),
      ...(meta && { meta }),
    });
  }

  static created<T>({ res, data, message = 'Resource created successfully', meta }: ApiResponseOptions<T>): Response {
    return ApiResponse.success({ res, statusCode: 201, data, message, meta });
  }

  static error({
    res,
    statusCode = 500,
    code = 'INTERNAL_ERROR',
    message = 'An unexpected error occurred',
    details,
  }: {
    res: Response;
    statusCode?: number;
    code?: string;
    message?: string;
    details?: any;
  }): Response {
    return res.status(statusCode).json({
      success: false,
      error: {
        code,
        message,
        ...(details && { details }),
      },
    });
  }
}
