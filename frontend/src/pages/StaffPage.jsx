import { useEffect, useState } from 'react';
import { userService } from '../services';
import { Modal } from '../components/Modal';
import '../styles/Pages.css';

export function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    Ten: '',
    Email: '',
    MatKhau: '',
    ChucVu: '',
    TinhTrang: 'dang_lam'
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await userService.getStaffList();
      setStaff(response.data.data);
    } catch (err) {
      setError('Không thể tải danh sách nhân viên');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (staffMember = null) => {
    if (staffMember) {
      setEditingId(staffMember.ID_ND);
      setFormData({
        Ten: staffMember.Ten || '',
        Email: staffMember.Email || '',
        MatKhau: '',
        ChucVu: staffMember.nhanVien?.ChucVu || '',
        TinhTrang: staffMember.nhanVien?.TinhTrang || 'dang_lam'
      });
    } else {
      setEditingId(null);
      setFormData({
        Ten: '',
        Email: '',
        MatKhau: '',
        ChucVu: '',
        TinhTrang: 'dang_lam'
      });
    }
    setShowModal(true);
  };

  const handleSaveStaff = async (e) => {
    e.preventDefault();
    try {
      const data = {
        Ten: formData.Ten,
        Email: formData.Email,
        nhanvien: {
          ChucVu: formData.ChucVu,
          TinhTrang: formData.TinhTrang
        }
      };

      if (formData.MatKhau) {
        data.MatKhau = formData.MatKhau;
      }

      if (editingId) {
        await userService.update(editingId, data);
      } else {
        await userService.createStaff({ ...data, MatKhau: formData.MatKhau });
      }
      setShowModal(false);
      fetchStaff();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleDeleteStaff = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa?')) return;
    try {
      await userService.delete(id);
      fetchStaff();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>👤 Quản lý Nhân Viên</h1>
        <button onClick={() => openModal()} className="btn btn-primary">+ Thêm Nhân Viên</button>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2>{editingId ? 'Sửa Nhân Viên' : 'Thêm Nhân Viên'}</h2>
        <form onSubmit={handleSaveStaff} className="form">
          <div className="form-row">
            <div className="form-group">
              <label>Tên nhân viên *</label>
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
              <label>Chức vụ *</label>
              <input
                type="text"
                value={formData.ChucVu}
                onChange={(e) => setFormData({ ...formData, ChucVu: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Trạng thái *</label>
              <select
                value={formData.TinhTrang}
                onChange={(e) => setFormData({ ...formData, TinhTrang: e.target.value })}
              >
                <option value="dang_lam">Đang làm việc</option>
                <option value="nghi">Đang nghỉ</option>
                <option value="da_nghi">Đã nghỉ</option>
              </select>
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
          <span>Tổng nhân viên:</span>
          <strong>{staff.length}</strong>
        </div>
        <div className="stat-item">
          <span>Đang làm:</span>
          <strong>{staff.filter((s) => s.nhanVien?.TinhTrang === 'dang_lam').length}</strong>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>Chức Vụ</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.ID_ND}>
                <td><strong>{s.Ten}</strong></td>
                <td>{s.Email}</td>
                <td>{s.nhanVien?.ChucVu || 'N/A'}</td>
                <td>
                  {s.nhanVien?.TinhTrang === 'dang_lam' && <span className="badge badge-success">Đang làm</span>}
                  {s.nhanVien?.TinhTrang === 'nghi' && <span className="badge badge-warning">Đang nghỉ</span>}
                  {s.nhanVien?.TinhTrang === 'da_nghi' && <span className="badge badge-danger">Đã nghỉ</span>}
                </td>
                <td>
                  <button onClick={() => openModal(s)} className="btn btn-sm btn-info">Sửa</button>
                  <button onClick={() => handleDeleteStaff(s.ID_ND)} className="btn btn-sm btn-danger">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
