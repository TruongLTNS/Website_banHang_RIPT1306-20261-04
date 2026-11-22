import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { RequestHandler } from 'express';
import User, { type Role } from '../models/User';
import asyncHandler from '../utils/asyncHandler';
import { HttpError } from '../utils/HttpError';

// Bắt buộc đăng nhập
export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) throw new HttpError(401, 'Chưa đăng nhập');

  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET as string) as JwtPayload;
  } catch {
    throw new HttpError(401, 'Token không hợp lệ hoặc đã hết hạn');
  }

  const user = await User.findById(decoded.id);
  if (!user) throw new HttpError(401, 'Tài khoản không còn tồn tại');

  req.user = user;
  next();
});

// Phân quyền: authorize('admin')
export const authorize =
  (...roles: Role[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new HttpError(403, 'Bạn không có quyền thực hiện thao tác này');
    }
    next();
  };