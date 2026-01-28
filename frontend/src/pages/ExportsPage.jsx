import { useEffect, useState } from 'react';
import { exportService } from '../services';
import '../styles/Pages.css';

export function ExportsPage() {
  const [exports, setExports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExports();
  }, []);

  const fetchExports = async () => {
    try {
      const response = await exportService.getAll();
      setExports(response.data.data);
    } catch (err) {
      setError('Không thể tải phiếu xuất');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page">
      <h1>Phiếu Xuất Hàng</h1>
      <div className="stats">
        <div className="stat-item">
          <span>Tổng phiếu:</span>
          <strong>{exports.length}</strong>
        </div>
      </div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ngày xuất</th>
              <th>Nhân viên</th>
            </tr>
          </thead>
          <tbody>
            {exports.map((item) => (
              <tr key={item.ID_PhieuXuat}>
                <td>{item.ID_PhieuXuat}</td>
                <td>{item.NgayXuat}</td>
                <td>{item.nhanvien?.Ten || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
