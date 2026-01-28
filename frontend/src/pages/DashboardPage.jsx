import { useEffect, useState } from 'react';
import { dashboardService } from '../services';

export function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await dashboardService.getDashboard();
      setStats(response.data.data);
    } catch (err) {
      setError('Không thể tải dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Doanh Thu Hôm Nay</h3>
            <p className="stat-value">{(stats.totalRevenue || 0).toLocaleString('vi-VN')} đ</p>
          </div>
          <div className="stat-card">
            <h3>Đơn Hôm Nay</h3>
            <p className="stat-value">{stats.totalOrders || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Tổng Khách Hàng</h3>
            <p className="stat-value">{stats.totalCustomers || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Tổng Nhân Viên</h3>
            <p className="stat-value">{stats.totalStaff || 0}</p>
          </div>
        </div>
      )}
    </div>
  );
}
