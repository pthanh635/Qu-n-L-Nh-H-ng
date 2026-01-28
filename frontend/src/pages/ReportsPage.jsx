import { useEffect, useState } from 'react';
import { dashboardService } from '../services';
import '../styles/Pages.css';

export function ReportsPage() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [daily, weekly, monthly, topDishes, topCustomers, profit, inventory, staff] =
        await Promise.all([
          dashboardService.getDailyRevenue(new Date().toISOString().split('T')[0]),
          dashboardService.getWeeklyRevenue(),
          dashboardService.getMonthlyRevenue(),
          dashboardService.getTopDishes(),
          dashboardService.getTopCustomers(),
          dashboardService.getProfitReport(),
          dashboardService.getInventoryReport(),
          dashboardService.getStaffPerformance(),
        ]);

      setReports({
        daily: daily.data.data,
        weekly: weekly.data.data,
        monthly: monthly.data.data,
        topDishes: topDishes.data.data,
        topCustomers: topCustomers.data.data,
        profit: profit.data.data,
        inventory: inventory.data.data,
        staff: staff.data.data,
      });
    } catch (err) {
      setError('Không thể tải báo cáo');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page">
      <h1>Báo Cáo</h1>
      <div className="reports-grid">
        <div className="report-card">
          <h3>Doanh Thu Hôm Nay</h3>
          <p className="value">{reports?.daily?.total || 0} VNĐ</p>
        </div>
        <div className="report-card">
          <h3>Doanh Thu Tuần</h3>
          <p className="value">{reports?.weekly?.total || 0} VNĐ</p>
        </div>
        <div className="report-card">
          <h3>Doanh Thu Tháng</h3>
          <p className="value">{reports?.monthly?.total || 0} VNĐ</p>
        </div>
        <div className="report-card">
          <h3>Lợi Nhuận</h3>
          <p className="value">{reports?.profit?.totalProfit || 0} VNĐ</p>
        </div>
      </div>

      <div className="reports-section">
        <h2>Top Món Ăn</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Món ăn</th>
              <th>Số lượng bán</th>
              <th>Doanh thu</th>
            </tr>
          </thead>
          <tbody>
            {reports?.topDishes?.map((dish, idx) => (
              <tr key={idx}>
                <td>{dish.TenMonAn}</td>
                <td>{dish.quantity}</td>
                <td>{dish.revenue} VNĐ</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="reports-section">
        <h2>Top Khách Hàng</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Khách hàng</th>
              <th>Tổng chi tiêu</th>
              <th>Số lần</th>
            </tr>
          </thead>
          <tbody>
            {reports?.topCustomers?.map((customer, idx) => (
              <tr key={idx}>
                <td>{customer.Ten}</td>
                <td>{customer.ChiTieu} VNĐ</td>
                <td>{customer.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
