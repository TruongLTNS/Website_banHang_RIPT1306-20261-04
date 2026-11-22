import User from '../models/User';
import asyncHandler from '../utils/asyncHandler';
import { HttpError } from '../utils/HttpError';

// GET /api/users (admin)
export const getUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, users });
});

// GET /api/users/:id (admin)
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new HttpError(404, 'Không tìm thấy người dùng');
  res.json({ success: true, user });
});

// POST /api/users (admin) - thêm
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address, role } = req.body;
  if (!name || !email || !password) {
    throw new HttpError(400, 'Vui lòng nhập đủ họ tên, email, mật khẩu');
  }
  const user = await User.create({ name, email, password, phone, address, role });
  res.status(201).json({ success: true, user });
});

// PUT /api/users/:id (admin) - sửa
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new HttpError(404, 'Không tìm thấy người dùng');

  const { name, email, phone, address, role, password } = req.body;
  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (phone !== undefined) user.phone = phone;
  if (address !== undefined) user.address = address;
  if (role !== undefined) user.role = role;
  if (password) user.password = password; // pre-save tự hash

  await user.save();
  res.json({ success: true, user });
});

// DELETE /api/users/:id (admin) - xóa
export const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user!._id.toString()) {
    throw new HttpError(400, 'Không thể tự xóa tài khoản của chính mình');
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new HttpError(404, 'Không tìm thấy người dùng');
  res.json({ success: true, message: 'Đã xóa người dùng' });
});

// PUT /api/users/profile - người dùng tự sửa hồ sơ
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user!._id).select('+password');
  if (!user) throw new HttpError(404, 'Không tìm thấy người dùng');

  const { name, phone, address, currentPassword, newPassword } = req.body;
  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (address !== undefined) user.address = address;

  if (newPassword) {
    if (!currentPassword || !(await user.matchPassword(currentPassword))) {
      throw new HttpError(400, 'Mật khẩu hiện tại không đúng');
    }
    user.password = newPassword;
  }

  await user.save();
  res.json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
    },
  });
});