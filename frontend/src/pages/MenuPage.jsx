import { useEffect, useState } from 'react';
import { dishService } from '../services';
import { Modal } from '../components/Modal';

export function MenuPage() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [categories] = useState([
    { ID_DanhMuc: 1, TenDanhMuc: 'Cơm' },
    { ID_DanhMuc: 2, TenDanhMuc: 'Canh' },
    { ID_DanhMuc: 3, TenDanhMuc: 'Nước uống' }
  ]);
  const [formData, setFormData] = useState({
    TenMonAn: '',
    DonGia: '',
    ID_DanhMuc: 1,
    MoTa: '',
    TrangThai: 'available'
  });

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    try {
      const response = await dishService.getAll();
      setDishes(response.data.data);
    } catch (err) {
      setError('Không thể tải menu');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (dish = null) => {
    if (dish) {
      setEditingId(dish.ID_MonAn);
      setFormData({
        TenMonAn: dish.TenMonAn,
        DonGia: dish.DonGia,
        ID_DanhMuc: dish.ID_DanhMuc,
        MoTa: dish.MoTa,
        TrangThai: dish.TrangThai
      });
    } else {
      setEditingId(null);
      setFormData({ TenMonAn: '', DonGia: '', ID_DanhMuc: 1, MoTa: '', TrangThai: 'available' });
    }
    setShowModal(true);
  };

  const handleSaveDish = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await dishService.update(editingId, {
          ...formData,
          DonGia: parseInt(formData.DonGia)
        });
      } else {
        await dishService.create({
          ...formData,
          DonGia: parseInt(formData.DonGia)
        });
      }
      setShowModal(false);
      fetchDishes();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleDeleteDish = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa?')) return;
    try {
      await dishService.delete(id);
      fetchDishes();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>📋 Quản lý Menu</h1>
        <button onClick={() => openModal()} className="btn btn-primary">+ Thêm Món Ăn</button>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2>{editingId ? 'Sửa Món Ăn' : 'Thêm Món Ăn Mới'}</h2>
        <form onSubmit={handleSaveDish} className="form">
          <div className="form-group">
            <label>Tên món ăn *</label>
            <input
              type="text"
              value={formData.TenMonAn}
              onChange={(e) => setFormData({ ...formData, TenMonAn: e.target.value })}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Giá tiền *</label>
              <input
                type="number"
                value={formData.DonGia}
                onChange={(e) => setFormData({ ...formData, DonGia: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Danh mục *</label>
              <select
                value={formData.ID_DanhMuc}
                onChange={(e) => setFormData({ ...formData, ID_DanhMuc: parseInt(e.target.value) })}
              >
                {categories.map(cat => (
                  <option key={cat.ID_DanhMuc} value={cat.ID_DanhMuc}>{cat.TenDanhMuc}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              value={formData.MoTa}
              onChange={(e) => setFormData({ ...formData, MoTa: e.target.value })}
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Trạng thái</label>
            <select
              value={formData.TrangThai}
              onChange={(e) => setFormData({ ...formData, TrangThai: e.target.value })}
            >
              <option value="available">Có sẵn</option>
              <option value="unavailable">Hết</option>
            </select>
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
              <th>Tên Món Ăn</th>
              <th>Danh Mục</th>
              <th>Giá Tiền</th>
              <th>Mô Tả</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {dishes.map((dish) => (
              <tr key={dish.ID_MonAn}>
                <td><strong>{dish.TenMonAn}</strong></td>
                <td>{dish.danhMuc?.TenDanhMuc || 'N/A'}</td>
                <td>{dish.DonGia.toLocaleString('vi-VN')} ₫</td>
                <td>{dish.MoTa}</td>
                <td>
                  <span className={`badge ${dish.TrangThai === 'available' ? 'badge-success' : 'badge-warning'}`}>
                    {dish.TrangThai === 'available' ? '✓ Có sẵn' : '✗ Hết'}
                  </span>
                </td>
                <td>
                  <button onClick={() => openModal(dish)} className="btn btn-sm btn-info">Sửa</button>
                  <button onClick={() => handleDeleteDish(dish.ID_MonAn)} className="btn btn-sm btn-danger">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
