import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', phone: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Mật khẩu nhập lại không khớp');
      return;
    }
    setSubmitting(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password, phone: form.phone });
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <h2>Đăng ký</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Họ tên</label>
        <input name="name" value={form.name} onChange={handleChange} required />
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required />
        <label>Số điện thoại</label>
        <input name="phone" value={form.phone} onChange={handleChange} />
        <label>Mật khẩu</label>
        <input name="password" type="password" minLength={6} value={form.password} onChange={handleChange} required />
        <label>Nhập lại mật khẩu</label>
        <input name="confirm" type="password" value={form.confirm} onChange={handleChange} required />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Đang xử lý...' : 'Tạo tài khoản'}
        </button>
      </form>
      <p>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
    </div>
  );
}