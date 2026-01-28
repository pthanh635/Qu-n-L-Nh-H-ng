import { useEffect, useState } from 'react';
import { importService } from '../services';
import '../styles/Pages.css';

export function ImportsPage() {
  const [imports, setImports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchImports();
  }, []);

  const fetchImports = async () => {
    try {
      const response = await importService.getAll();
      setImports(response.data.data);
    } catch (err) {
      setError('Không thể tải phiếu nhập');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page">
      <h1>Phiếu Nhập Hàng</h1>
      <div className="stats">
        <div className="stat-item">
          <span>Tổng phiếu:</span>
          <strong>{imports.length}</strong>
        </div>
        <div className="stat-item">
          <span>Tổng giá trị:</span>
          <strong>{imports.reduce((sum, i) => sum + i.TongTien, 0)}</strong>
        </div>
      </div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ngày nhập</th>
              <th>Tổng tiền</th>
              <th>Nhân viên</th>
            </tr>
          </thead>
          <tbody>
            {imports.map((item) => (
              <tr key={item.ID_PhieuNhap}>
                <td>{item.ID_PhieuNhap}</td>
                <td>{item.NgayNhap}</td>
                <td>{item.TongTien.toLocaleString()} VNĐ</td>
                <td>{item.nhanvien?.Ten || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
