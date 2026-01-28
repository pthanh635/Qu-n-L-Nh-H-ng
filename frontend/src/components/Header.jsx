import { Link, useNavigate } from 'react-router-dom';
import { getUser, removeToken, removeUser } from '../utils/auth';
import '../styles/Header.css';

export function Header() {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    removeUser();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="logo">🍽️ Nhà Hàng</h1>
      </div>
      <div className="header-right">
        <span className="user-info">
          {user?.Ten} ({user?.VaiTro})
        </span>
        <button onClick={handleLogout} className="logout-btn">
          Đăng xuất
        </button>
      </div>
    </header>
  );
}
