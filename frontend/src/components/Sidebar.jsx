import { Link } from 'react-router-dom';
import { getUser } from '../utils/auth';
import '../styles/Sidebar.css';

export function Sidebar() {
  const user = getUser();

  const isAdmin = user?.VaiTro === 'admin';
  const isStaff = user?.VaiTro === 'nhanvien';
  const isCustomer = user?.VaiTro === 'khachhang';

  return (
    <aside className="sidebar">
      <nav className="nav-menu">
        <Link to="/dashboard" className="nav-item">
          📊 Dashboard
        </Link>

        {(isAdmin || isStaff) && (
          <>
            <Link to="/tables" className="nav-item">
              🪑 Quản lý Bàn
            </Link>
            <Link to="/menu" className="nav-item">
              📋 Menu
            </Link>
            <Link to="/orders" className="nav-item">
              🛒 Đơn Hàng
            </Link>
            <Link to="/vouchers" className="nav-item">
              🎟️ Vouchers
            </Link>
          </>
        )}

        {(isAdmin || isStaff) && (
          <>
            <Link to="/inventory" className="nav-item">
              📦 Kho Hàng
            </Link>
            <Link to="/imports" className="nav-item">
              📥 Phiếu Nhập
            </Link>
            <Link to="/exports" className="nav-item">
              📤 Phiếu Xuất
            </Link>
          </>
        )}

        {isAdmin && (
          <>
            <Link to="/staff" className="nav-item">
              👥 Nhân Viên
            </Link>
            <Link to="/customers" className="nav-item">
              👤 Khách Hàng
            </Link>
            <Link to="/reports" className="nav-item">
              📈 Báo Cáo
            </Link>
          </>
        )}

        {isCustomer && (
          <Link to="/my-orders" className="nav-item">
            📝 Đơn của Tôi
          </Link>
        )}
      </nav>
    </aside>
  );
}
