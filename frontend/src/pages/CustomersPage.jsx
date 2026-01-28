import { useEffect, useState } from 'react';
import { userService } from '../services';
import { Modal } from '../components/Modal';
import '../styles/Pages.css';

export function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    Ten: '',
    Email: '',
    MatKhau: '',
    DiemTichLuy: 0,
    ChiTieu: 0
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await userService.getCustomerList();
      setCustomers(response.data.data);
    } catch (err) {
      setError('Không thể tải danh sách khách hàng');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (customer = null) => {
    if (customer) {
      setEditingId(customer.ID_ND);
      setFormData({
        Ten: customer.Ten || '',
        Email: customer.Email || '',
        MatKhau: '',
        DiemTichLuy: customer.khachHang?.DiemTichLuy || 0,
        ChiTieu: customer.khachHang?.ChiTieu || 0
      });
    } else {
      setEditingId(null);
      setFormData({
        Ten: '',
        Email: '',
        MatKhau: '',
        DiemTichLuy: 0,
        ChiTieu: 0
      });
    }
    setShowModal(true);
  };

  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    try {
      const data = {
        Ten: formData.Ten,
        Email: formData.Email,
        khachhang: {
          DiemTichLuy: parseInt(formData.DiemTichLuy),
          ChiTieu: parseInt(formData.ChiTieu)
        }
      };

      if (formData.MatKhau) {
        data.MatKhau = formData.MatKhau;
      }

      if (editingId) {
        await userService.update(editingId, data);
      } else {
        await userService.createCustomer({ ...data, MatKhau: formData.MatKhau });
      }
      setShowModal(false);
      fetchCustomers();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa?')) return;
    try {
      await userService.delete(id);
      fetchCustomers();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  const totalSpending = customers.reduce((sum, c) => sum + (c.khachHang?.ChiTieu || 0), 0);

  return (
    <div className="page">
      <div className="page-header">
        <h1>🛍️ Quản lý Khách Hàng</h1>
        <button onClick={() => openModal()} className="btn btn-primary">+ Thêm Khách Hàng</button>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2>{editingId ? 'Sửa Khách Hàng' : 'Thêm Khách Hàng'}</h2>
        <form onSubmit={handleSaveCustomer} className="form">
          <div className="form-row">
            <div className="form-group">
              <label>Tên khách hàng *</label>
              <input
                type="text"
                value={formData.Ten}
                onChange={(e) => setFormData({ ...formData, Ten: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={formData.Email}
                onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Điểm tích lũy</label>
              <input
                type="number"
                value={formData.DiemTichLuy}
                onChange={(e) => setFormData({ ...formData, DiemTichLuy: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Chi tiêu</label>
              <input
                type="number"
                value={formData.ChiTieu}
                onChange={(e) => setFormData({ ...formData, ChiTieu: e.target.value })}
              />
            </div>
          </div>

          {!editingId && (
            <div className="form-group">
              <label>Mật khẩu *</label>
              <input
                type="password"
                value={formData.MatKhau}
                onChange={(e) => setFormData({ ...formData, MatKhau: e.target.value })}
                required
              />
            </div>
          )}

          {editingId && (
            <div className="form-group">
              <label>Mật khẩu mới (để trống nếu không đổi)</label>
              <input
                type="password"
                value={formData.MatKhau}
                onChange={(e) => setFormData({ ...formData, MatKhau: e.target.value })}
              />
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Hủy</button>
            <button type="submit" className="btn btn-primary">{editingId ? 'Cập nhật' : 'Thêm'}</button>
          </div>
        </form>
      </Modal>

      <div className="stats">
        <div className="stat-item">
          <span>Tổng khách hàng:</span>
          <strong>{customers.length}</strong>
        </div>
        <div className="stat-item">
          <span>Tổng chi tiêu:</span>
          <strong>{totalSpending.toLocaleString('vi-VN')} ₫</strong>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>Điểm Tích Lũy</th>
              <th>Chi Tiêu</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.ID_ND}>
                <td><strong>{c.Ten}</strong></td>
                <td>{c.Email}</td>
                <td>{c.khachHang?.DiemTichLuy || 0}</td>
                <td>{(c.khachHang?.ChiTieu || 0).toLocaleString('vi-VN')} ₫</td>
                <td>
                  <button onClick={() => openModal(c)} className="btn btn-sm btn-info">Sửa</button>
                  <button onClick={() => handleDeleteCustomer(c.ID_ND)} className="btn btn-sm btn-danger">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
