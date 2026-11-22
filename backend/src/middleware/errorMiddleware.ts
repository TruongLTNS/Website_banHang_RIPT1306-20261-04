import type { ErrorRequestHandler, RequestHandler } from 'express';
import { HttpError } from '../utils/HttpError';

export const notFound: RequestHandler = (req, _res, next) => {
  next(new HttpError(404, `Không tìm thấy đường dẫn: ${req.originalUrl}`));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let status = err instanceof HttpError ? err.status : 500;
  let message: string = err.message || 'Lỗi máy chủ';

  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e: any) => e.message).join(', ');
  } else if (err.code === 11000) {
    status = 409;
    message = 'Email đã được sử dụng';
  } else if (err.name === 'CastError') {
    status = 400;
    message = 'ID không hợp lệ';
  }

  res.status(status).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};