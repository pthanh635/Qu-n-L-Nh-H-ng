import { useEffect, useState } from 'react';
import { voucherService } from '../services';
import { Modal } from '../components/Modal';
import '../styles/Pages.css';

export function VouchersPage() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    MaVC: '',
    TenVC: '',
    PhanTramGiam: '',
    NgayTao: '',
    NgayHetHan: '',
    DacDiem: ''
  });

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const response = await voucherService.getAll();
      setVouchers(response.data.data);
    } catch (err) {
      setError('Không thể tải mã giảm giá');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (voucher = null) => {
    if (voucher) {
      setEditingId(voucher.ID_VC);
      setFormData({
        MaVC: voucher.MaVC || '',
        TenVC: voucher.TenVC || '',
        PhanTramGiam: voucher.PhanTramGiam || '',
        NgayTao: voucher.NgayTao ? voucher.NgayTao.split('T')[0] : '',
        NgayHetHan: voucher.NgayHetHan ? voucher.NgayHetHan.split('T')[0] : '',
        DacDiem: voucher.DacDiem || ''
      });
    } else {
      setEditingId(null);
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        MaVC: '',
        TenVC: '',
        PhanTramGiam: '',
        NgayTao: today,
        NgayHetHan: '',
        DacDiem: ''
      });
    }
    setShowModal(true);
  };

  const handleSaveVoucher = async (e) => {
    e.preventDefault();
    try {
      const data = {
        MaVC: formData.MaVC,
        TenVC: formData.TenVC,
        PhanTramGiam: parseInt(formData.PhanTramGiam),
        NgayTao: formData.NgayTao,
        NgayHetHan: formData.NgayHetHan,
        DacDiem: formData.DacDiem
      };

      if (editingId) {
        await voucherService.update(editingId, data);
      } else {
        await voucherService.create(data);
      }
      setShowModal(false);
      fetchVouchers();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleDeleteVoucher = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa?')) return;
    try {
      await voucherService.delete(id);
      fetchVouchers();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  const isExpired = (endDate) => new Date(endDate) < new Date();

  return (
    <div className="page">
      <div className="page-header">
        <h1>🎟️ Quản lý Mã Giảm Giá</h1>
        <button onClick={() => openModal()} className="btn btn-primary">+ Thêm Mã Giảm Giá</button>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2>{editingId ? 'Sửa Mã Giảm Giá' : 'Thêm Mã Giảm Giá'}</h2>
        <form onSubmit={handleSaveVoucher} className="form">
          <div className="form-row">
            <div className="form-group">
              <label>Mã voucher *</label>
              <input
                type="text"
                value={formData.MaVC}
                onChange={(e) => setFormData({ ...formData, MaVC: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Tên voucher *</label>
              <input
                type="text"
                value={formData.TenVC}
                onChange={(e) => setFormData({ ...formData, TenVC: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>% Giảm *</label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.PhanTramGiam}
                onChange={(e) => setFormData({ ...formData, PhanTramGiam: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ngày tạo *</label>
              <input
                type="date"
                value={formData.NgayTao}
                onChange={(e) => setFormData({ ...formData, NgayTao: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Ngày hết hạn *</label>
              <input
                type="date"
                value={formData.NgayHetHan}
                onChange={(e) => setFormData({ ...formData, NgayHetHan: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Đặc điểm</label>
            <textarea
              value={formData.DacDiem}
              onChange={(e) => setFormData({ ...formData, DacDiem: e.target.value })}
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Hủy</button>
            <button type="submit" className="btn btn-primary">{editingId ? 'Cập nhật' : 'Thêm'}</button>
          </div>
        </form>
      </Modal>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên Mã Giảm Giá</th>
              <th>% Giảm</th>
              <th>Ngày Tạo</th>
              <th>Ngày Hết Hạn</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((voucher) => (
              <tr key={voucher.ID_VC}>
                <td><strong>{voucher.MaVC}</strong></td>
                <td>{voucher.TenVC}</td>
                <td><strong>{voucher.PhanTramGiam}%</strong></td>
                <td>{new Date(voucher.NgayTao).toLocaleDateString('vi-VN')}</td>
                <td>{new Date(voucher.NgayHetHan).toLocaleDateString('vi-VN')}</td>
                <td>
                  {isExpired(voucher.NgayHetHan) ? (
                    <span className="badge badge-danger">Hết hạn</span>
                  ) : (
                    <span className="badge badge-success">Có hiệu lực</span>
                  )}
                </td>
                <td>
                  <button onClick={() => openModal(voucher)} className="btn btn-sm btn-info">Sửa</button>
                  <button onClick={() => handleDeleteVoucher(voucher.ID_VC)} className="btn btn-sm btn-danger">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
