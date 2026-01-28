import { useEffect, useState } from 'react';
import { inventoryService } from '../services';
import { Modal } from '../components/Modal';
import '../styles/Pages.css';

export function InventoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    TenNL: '',
    DonGia: '',
    DonViTinh: 'kg',
    SLTon: ''
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await inventoryService.getAll();
      setItems(response.data.data);
    } catch (err) {
      setError('Không thể tải kho hàng');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingId(item.ID_NL);
      setFormData({
        TenNL: item.TenNL || '',
        DonGia: item.nguyenLieu?.DonGia || item.DonGia || '',
        DonViTinh: item.nguyenLieu?.DonViTinh || item.DonViTinh || 'kg',
        SLTon: item.SLTon || ''
      });
    } else {
      setEditingId(null);
      setFormData({ TenNL: '', DonGia: '', DonViTinh: 'kg', SLTon: '' });
    }
    setShowModal(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await inventoryService.update(editingId, {
          SLTon: parseInt(formData.SLTon)
        });
      } else {
        const ingredientRes = await inventoryService.createIngredient({
          TenNL: formData.TenNL,
          DonGia: parseInt(formData.DonGia),
          DonViTinh: formData.DonViTinh
        });

        await inventoryService.create({
          ID_NL: ingredientRes.data.data.ID_NL,
          SLTon: parseInt(formData.SLTon)
        });
      }
      setShowModal(false);
      fetchInventory();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa?')) return;
    try {
      await inventoryService.delete(id);
      fetchInventory();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  const totalValue = items.reduce((sum, item) => {
    const price = item.nguyenLieu?.DonGia || 0;
    return sum + (item.SLTon * price);
  }, 0);

  return (
    <div className="page">
      <div className="page-header">
        <h1>📦 Quản lý Kho Hàng</h1>
        <button onClick={() => openModal()} className="btn btn-primary">+ Thêm Nguyên Liệu</button>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2>{editingId ? 'Sửa Nguyên Liệu' : 'Thêm Nguyên Liệu'}</h2>
        <form onSubmit={handleSaveItem} className="form">
          {!editingId && (
            <>
              <div className="form-group">
                <label>Tên nguyên liệu *</label>
                <input
                  type="text"
                  value={formData.TenNL}
                  onChange={(e) => setFormData({ ...formData, TenNL: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Giá mua *</label>
                  <input
                    type="number"
                    value={formData.DonGia}
                    onChange={(e) => setFormData({ ...formData, DonGia: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Đơn vị tính *</label>
                  <input
                    type="text"
                    value={formData.DonViTinh}
                    onChange={(e) => setFormData({ ...formData, DonViTinh: e.target.value })}
                    required
                  />
                </div>
              </div>
            </>
          )}
          <div className="form-group">
            <label>Số lượng tồn *</label>
            <input
              type="number"
              value={formData.SLTon}
              onChange={(e) => setFormData({ ...formData, SLTon: e.target.value })}
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Hủy</button>
            <button type="submit" className="btn btn-primary">{editingId ? 'Cập nhật' : 'Thêm'}</button>
          </div>
        </form>
      </Modal>

      <div className="stats">
        <div className="stat-item">
          <span>Tổng mặt hàng:</span>
          <strong>{items.length}</strong>
        </div>
        <div className="stat-item">
          <span>Tồn kho:</span>
          <strong>{items.reduce((sum, item) => sum + item.SLTon, 0)}</strong>
        </div>
        <div className="stat-item">
          <span>Giá trị kho:</span>
          <strong>{totalValue.toLocaleString('vi-VN')} ₫</strong>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Tên Nguyên Liệu</th>
              <th>Đơn Vị Tính</th>
              <th>Giá Mua</th>
              <th>Số Lượng Tồn</th>
              <th>Giá Trị Kho</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const price = item.nguyenLieu?.DonGia || 0;
              const value = item.SLTon * price;
              return (
                <tr key={item.ID_NL}>
                  <td><strong>{item.nguyenLieu?.TenNL || item.TenNL || 'N/A'}</strong></td>
                  <td>{item.nguyenLieu?.DonViTinh || item.DonViTinh || 'N/A'}</td>
                  <td>{price.toLocaleString('vi-VN')} ₫</td>
                  <td className={item.SLTon < 5 ? 'text-warning' : ''}>{item.SLTon}</td>
                  <td>{value.toLocaleString('vi-VN')} ₫</td>
                  <td>
                    <button onClick={() => openModal(item)} className="btn btn-sm btn-info">Sửa</button>
                    <button onClick={() => handleDeleteItem(item.ID_NL)} className="btn btn-sm btn-danger">Xóa</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}