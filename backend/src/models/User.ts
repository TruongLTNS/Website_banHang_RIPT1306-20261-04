import { Schema, model, type HydratedDocument, type Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export type Role = 'user' | 'admin';

export interface IUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role: Role;
}

interface IUserMethods {
  matchPassword(plain: string): Promise<boolean>;
}

export type UserDoc = HydratedDocument<IUser, IUserMethods>;
type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập họ tên'],
      trim: true,
      maxlength: [50, 'Họ tên tối đa 50 ký tự'],
    },
    email: {
      type: String,
      required: [true, 'Vui lòng nhập email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'],
    },
    password: {
      type: String,
      required: [true, 'Vui lòng nhập mật khẩu'],
      minlength: [6, 'Mật khẩu tối thiểu 6 ký tự'],
      select: false,
    },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = function (this: UserDoc, plain: string) {
  return bcrypt.compare(plain, this.password);
};

export default model<IUser, UserModel>('User', userSchema);