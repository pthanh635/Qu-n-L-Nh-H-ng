import { useEffect, useState } from 'react';
import { tableService } from '../services';
import { Table } from '../components/Table';
import { Modal } from '../components/Modal';
import '../styles/Pages.css';

export function TablesPage() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    TenBan: '',
    SoChoNgoi: '',
    ViTri: '',
    TrangThai: 'trong'
  });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await tableService.getAll();
      setTables(response.data.data);
    } catch (err) {
      setError('Không thể tải danh sách bàn');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (table = null) => {
    if (table) {
      setEditingId(table.ID_Ban);
      setFormData({
        TenBan: table.TenBan,
        SoChoNgoi: table.SoChoNgoi,
        ViTri: table.ViTri,
        TrangThai: table.TrangThai
      });
    } else {
      setEditingId(null);
      setFormData({ TenBan: '', SoChoNgoi: '', ViTri: '', TrangThai: 'trong' });
    }
    setShowModal(true);
  };

  const handleSaveTable = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await tableService.update(editingId, {
          ...formData,
          SoChoNgoi: parseInt(formData.SoChoNgoi)
        });
      } else {
        await tableService.create({
          ...formData,
          SoChoNgoi: parseInt(formData.SoChoNgoi)
        });
      }
      setShowModal(false);
      fetchTables();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleDeleteTable = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa?')) return;
    try {
      await tableService.delete(id);
      fetchTables();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>🪑 Quản lý Bàn Ăn</h1>
        <button onClick={() => openModal()} className="btn btn-primary">+ Thêm Bàn</button>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2>{editingId ? 'Sửa Bàn' : 'Thêm Bàn Mới'}</h2>
        <form onSubmit={handleSaveTable} className="form">
          <div className="form-group">
            <label>Tên bàn *</label>
            <input
              type="text"
              value={formData.TenBan}
              onChange={(e) => setFormData({ ...formData, TenBan: e.target.value })}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Số chỗ ngồi *</label>
              <input
                type="number"
                value={formData.SoChoNgoi}
                onChange={(e) => setFormData({ ...formData, SoChoNgoi: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Vị trí *</label>
              <input
                type="text"
                value={formData.ViTri}
                onChange={(e) => setFormData({ ...formData, ViTri: e.target.value })}
                required
              />
            </div>
          </div>
          {editingId && (
            <div className="form-group">
              <label>Trạng thái</label>
              <select
                value={formData.TrangThai}
                onChange={(e) => setFormData({ ...formData, TrangThai: e.target.value })}
              >
                <option value="trong">Trống</option>
                <option value="dang_su_dung">Đang sử dụng</option>
                <option value="da_dat">Đã đặt</option>
              </select>
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
          <span>Tổng bàn:</span>
          <strong>{tables.length}</strong>
        </div>
        <div className="stat-item">
          <span>Bàn trống:</span>
          <strong>{tables.filter((t) => t.TrangThai === 'trong').length}</strong>
        </div>
        <div className="stat-item">
          <span>Bàn đang dùng:</span>
          <strong>{tables.filter((t) => t.TrangThai === 'dang_su_dung').length}</strong>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Tên Bàn</th>
              <th>Số Chỗ Ngồi</th>
              <th>Vị Trí</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table) => (
              <tr key={table.ID_Ban}>
                <td><strong>{table.TenBan}</strong></td>
                <td>{table.SoChoNgoi}</td>
                <td>{table.ViTri}</td>
                <td>
                  <span className={`badge badge-${table.TrangThai === 'trong' ? 'success' : table.TrangThai === 'dang_su_dung' ? 'danger' : 'warning'}`}>
                    {table.TrangThai === 'trong' ? '✓ Trống' : table.TrangThai === 'dang_su_dung' ? '✗ Đang sử dụng' : '? Đã đặt'}
                  </span>
                </td>
                <td>
                  <button onClick={() => openModal(table)} className="btn btn-sm btn-info">Sửa</button>
                  <button onClick={() => handleDeleteTable(table.ID_Ban)} className="btn btn-sm btn-danger">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
