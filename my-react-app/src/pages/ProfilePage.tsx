import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import api, { getErrorMessage } from '../services/api';
import type { User } from '../types/user';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name ?? '',
    phone: user?.phone ?? '',
    address: user?.address ?? '',
    currentPassword: '',
    newPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const { data } = await api.put<{ user: User }>('/users/profile', form);
      setUser(data.user);
      setForm({ ...form, currentPassword: '', newPassword: '' });
      setMessage('Cập nhật thành công');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="auth-card">
      <h2>Hồ sơ cá nhân</h2>
      <p>Email: <b>{user?.email}</b></p>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Họ tên</label>
        <input name="name" value={form.name} onChange={handleChange} required />
        <label>Số điện thoại</label>
        <input name="phone" value={form.phone} onChange={handleChange} />
        <label>Địa chỉ</label>
        <input name="address" value={form.address} onChange={handleChange} />
        <label>Mật khẩu hiện tại (chỉ khi đổi mật khẩu)</label>
        <input name="currentPassword" type="password" value={form.currentPassword} onChange={handleChange} />
        <label>Mật khẩu mới</label>
        <input name="newPassword" type="password" minLength={6} value={form.newPassword} onChange={handleChange} />
        <button type="submit">Lưu thay đổi</button>
      </form>
    </div>
  );
}