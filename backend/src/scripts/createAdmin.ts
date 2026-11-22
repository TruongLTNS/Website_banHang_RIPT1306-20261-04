import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User';

async function main() {
  await mongoose.connect(process.env.MONGO_URI as string);
  const email = process.env.ADMIN_EMAIL as string;

  if (await User.findOne({ email })) {
    console.log('Admin đã tồn tại');
  } else {
    await User.create({
      name: 'Quản trị viên',
      email,
      password: process.env.ADMIN_PASSWORD as string,
      role: 'admin',
    });
    console.log('Đã tạo admin:', email);
  }
  await mongoose.disconnect();
}

main();