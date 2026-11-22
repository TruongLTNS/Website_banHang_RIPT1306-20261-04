import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import api, { getErrorMessage } from '../services/api';
import type { Role, User } from '../types/user';

interface FormState {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
}

const emptyForm: FormState = { name: '', email: '', password: '', phone: '', role: 'user' };

export default function AdminUsersPage() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const loadUsers = useCallback(async () => {
    try {
      const { data } = await api.get<{ users: User[] }>('/users');
      setUsers(data.users);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        const { password, ...rest } = form;
        await api.put(`/users/${editingId}`, password ? form : rest);
      } else {
        await api.post('/users', form);
      }
      resetForm();
      loadUsers();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleEdit = (u: User) => {
    setEditingId(u._id);
    setForm({ name: u.name, email: u.email, password: '', phone: u.phone ?? '', role: u.role });
  };

  const handleDelete = async (u: User) => {
    if (!window.confirm(`Xóa người dùng ${u.name}?`)) return;
    try {
      await api.delete(`/users/${u._id}`);
      loadUsers();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="page">
      <h2>Quản lý người dùng</h2>
      {error && <p className="error">{error}</p>}

      <form className="inline-form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Họ tên" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input
          name="password"
          type="password"
          placeholder={editingId ? 'Mật khẩu mới (bỏ trống nếu giữ nguyên)' : 'Mật khẩu'}
          value={form.password}
          onChange={handleChange}
          required={!editingId}
        />
        <input name="phone" placeholder="Số điện thoại" value={form.phone} onChange={handleChange} />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
        <button type="submit">{editingId ? 'Cập nhật' : 'Thêm mới'}</button>
        {editingId && <button type="button" onClick={resetForm}>Hủy</button>}
      </form>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Họ tên</th><th>Email</th><th>SĐT</th><th>Vai trò</th><th>Thao tác</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>{u.role}</td>
                <td>
                  <button onClick={() => handleEdit(u)}>Sửa</button>
                  {u._id !== me?._id && <button onClick={() => handleDelete(u)}>Xóa</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}