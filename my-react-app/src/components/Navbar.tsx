import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">BanHang</Link>
      <div className="nav-links">
        {user ? (
          <>
            {isAdmin && <Link to="/admin/users">Quản lý người dùng</Link>}
            <Link to="/profile">{user.name}</Link>
            <button className="btn-ghost" onClick={handleLogout}>Đăng xuất</button>
          </>
        ) : (
          <>
            <Link to="/login">Đăng nhập</Link>
            <Link to="/register">Đăng ký</Link>
          </>
        )}
      </div>
    </nav>
  );
}