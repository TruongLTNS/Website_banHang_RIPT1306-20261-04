import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import { errorHandler, notFound } from './middleware/errorMiddleware';

if (!process.env.JWT_SECRET) {
  console.error('Thiếu JWT_SECRET trong file .env');
  process.exit(1);
}

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'API Website Bán Hàng đang chạy' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// Thành viên khác thêm route của mình ở đây, ví dụ:
// app.use('/api/products', productRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server chạy tại cổng ${PORT}`));
});