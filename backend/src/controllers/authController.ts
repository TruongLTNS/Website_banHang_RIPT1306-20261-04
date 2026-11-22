import type { Response } from 'express';
import User, { type UserDoc } from '../models/User';
import asyncHandler from '../utils/asyncHandler';
import generateToken from '../utils/generateToken';
import { HttpError } from '../utils/HttpError';

const sendAuth = (res: Response, status: number, user: UserDoc) =>
  res.status(status).json({
    success: true,
    token: generateToken(user._id.toString()),
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
    },
  });

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address } = req.body;
  if (!name || !email || !password) {
    throw new HttpError(400, 'Vui lòng nhập đủ họ tên, email, mật khẩu');
  }
  if (await User.findOne({ email: String(email).toLowerCase() })) {
    throw new HttpError(409, 'Email đã được sử dụng');
  }
  // Không cho client tự đặt role => luôn là 'user'
  const user = await User.create({ name, email, password, phone, address });
  sendAuth(res, 201, user);
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new HttpError(400, 'Vui lòng nhập email và mật khẩu');

  const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    throw new HttpError(401, 'Email hoặc mật khẩu không đúng');
  }
  sendAuth(res, 200, user);
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});