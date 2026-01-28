import { useEffect, useState } from 'react';
import { invoiceService } from '../services';
import { Modal } from '../components/Modal';
import '../styles/Pages.css';

export function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    TrangThai: 'dang_mo',
    TongTienMon: 0,
    GhiChu: ''
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await invoiceService.getAll();
      setOrders(response.data.data);
    } catch (err) {
      setError('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (order = null) => {
    if (order) {
      setEditingId(order.ID_HoaDon);
      setFormData({
        TrangThai: order.TrangThai || 'dang_mo',
        TongTienMon: order.TongTienMon || 0,
        GhiChu: order.GhiChu || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        TrangThai: 'dang_mo',
        TongTienMon: 0,
        GhiChu: ''
      });
    }
    setShowModal(true);
  };

  const handleSaveOrder = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await invoiceService.update(editingId, {
          TrangThai: formData.TrangThai,
          TongTienMon: parseInt(formData.TongTienMon),
          GhiChu: formData.GhiChu
        });
      }
      setShowModal(false);
      fetchOrders();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa?')) return;
    try {
      await invoiceService.delete(id);
      fetchOrders();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  const totalRevenue = orders
    .filter(o => o.TrangThai === 'da_thanh_toan')
    .reduce((sum, o) => sum + (o.TongThanhToan || 0), 0);

  return (
    <div className="page">
      <div className="page-header">
        <h1>📋 Quản lý Đơn Hàng</h1>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2>Cập nhật Đơn Hàng</h2>
        <form onSubmit={handleSaveOrder} className="form">
          <div className="form-group">
            <label>Trạng thái *</label>
            <select
              value={formData.TrangThai}
              onChange={(e) => setFormData({ ...formData, TrangThai: e.target.value })}
            >
              <option value="dang_mo">Đang mở</option>
              <option value="da_thanh_toan">Đã thanh toán</option>
              <option value="da_huy">Đã hủy</option>
            </select>
          </div>

          <div className="form-group">
            <label>Tổng tiền món</label>
            <input
              type="number"
              value={formData.TongTienMon}
              onChange={(e) => setFormData({ ...formData, TongTienMon: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Ghi chú</label>
            <textarea
              value={formData.GhiChu}
              onChange={(e) => setFormData({ ...formData, GhiChu: e.target.value })}
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Hủy</button>
            <button type="submit" className="btn btn-primary">Cập nhật</button>
          </div>
        </form>
      </Modal>

      <div className="stats">
        <div className="stat-item">
          <span>Tổng đơn:</span>
          <strong>{orders.length}</strong>
        </div>
        <div className="stat-item">
          <span>Đang mở:</span>
          <strong>{orders.filter((o) => o.TrangThai === 'dang_mo').length}</strong>
        </div>
        <div className="stat-item">
          <span>Đã thanh toán:</span>
          <strong>{orders.filter((o) => o.TrangThai === 'da_thanh_toan').length}</strong>
        </div>
        <div className="stat-item">
          <span>Doanh thu:</span>
          <strong>{totalRevenue.toLocaleString('vi-VN')} ₫</strong>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Đơn #</th>
              <th>Ngày</th>
              <th>Bàn</th>
              <th>Tổng Tiền</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.ID_HoaDon}>
                <td><strong>#{o.ID_HoaDon}</strong></td>
                <td>{new Date(o.NgayHD).toLocaleDateString('vi-VN')}</td>
                <td>{o.ban?.SoBan || 'N/A'}</td>
                <td>{(o.TongThanhToan || 0).toLocaleString('vi-VN')} ₫</td>
                <td>
                  {o.TrangThai === 'dang_mo' && <span className="badge badge-info">Đang mở</span>}
                  {o.TrangThai === 'da_thanh_toan' && <span className="badge badge-success">Đã thanh toán</span>}
                  {o.TrangThai === 'da_huy' && <span className="badge badge-danger">Đã hủy</span>}
                </td>
                <td>
                  <button onClick={() => openModal(o)} className="btn btn-sm btn-info">Sửa</button>
                  <button onClick={() => handleDeleteOrder(o.ID_HoaDon)} className="btn btn-sm btn-danger">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
