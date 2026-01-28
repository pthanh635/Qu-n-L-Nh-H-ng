import api from '../utils/api';

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
};

export const userService = {
  getProfile: (id) => api.get(`/usuarios/${id}`),
  getStaffList: () => api.get('/usuarios/staff/list'),
  getCustomerList: () => api.get('/usuarios/customers/list'),
  updateProfile: (id, data) => api.put(`/usuarios/${id}`, data),
  createStaff: (data) => api.post('/usuarios', { ...data, vaiTro: 'nhanvien' }),
  createCustomer: (data) => api.post('/usuarios', { ...data, vaiTro: 'khachhang' }),
  update: (id, data) => api.put(`/usuarios/${id}`, data),
  delete: (id) => api.delete(`/usuarios/${id}`),
};

export const dishService = {
  getAll: () => api.get('/monan'),
  getById: (id) => api.get(`/monan/${id}`),
  searchByName: (name) => api.get(`/monan/search/by-name?name=${name}`),
  getByCategory: (categoryId) => api.get(`/monan/category/${categoryId}`),
  create: (data) => api.post('/monan', data),
  update: (id, data) => api.put(`/monan/${id}`, data),
  delete: (id) => api.delete(`/monan/${id}`),
  updateStatus: (id, status) => api.put(`/monan/${id}/status`, { TrangThai: status }),
  updatePrice: (id, price) => api.put(`/monan/${id}/price`, { DonGia: price }),
};

export const invoiceService = {
  getAll: () => api.get('/hoadon'),
  getById: (id) => api.get(`/hoadon/${id}`),
  create: (data) => api.post('/hoadon', data),
  update: (id, data) => api.put(`/hoadon/${id}`, data),
  delete: (id) => api.delete(`/hoadon/${id}`),
  addItem: (invoiceId, data) => api.post(`/hoadon/${invoiceId}/items`, data),
  removeItem: (invoiceId, itemId) => api.delete(`/hoadon/${invoiceId}/items/${itemId}`),
  checkout: (id, data) => api.post(`/hoadon/${id}/checkout`, data),
  applyVoucher: (id, code) => api.post(`/hoadon/${id}/voucher`, { code }),
  cancel: (id) => api.put(`/hoadon/${id}/cancel`),
};

export const tableService = {
  getAll: () => api.get('/ban'),
  getById: (id) => api.get(`/ban/${id}`),
  getAvailable: () => api.get('/ban/status/available'),
  getOccupied: () => api.get('/ban/status/in-use'),
  create: (data) => api.post('/ban', data),
  update: (id, data) => api.put(`/ban/${id}`, data),
  delete: (id) => api.delete(`/ban/${id}`),
};

export const voucherService = {
  getAll: () => api.get('/voucher'),
  getById: (id) => api.get(`/voucher/${id}`),
  getByCode: (code) => api.get(`/voucher/validate/${code}`),
  getAvailable: () => api.get('/voucher/status/available'),
  create: (data) => api.post('/voucher', data),
  update: (id, data) => api.put(`/voucher/${id}`, data),
  delete: (id) => api.delete(`/voucher/${id}`),
};

export const inventoryService = {
  getAll: () => api.get('/kho'),
  getById: (id) => api.get(`/kho/${id}`),
  getLowStock: () => api.get('/kho/status/low-stock'),
  getOverstock: () => api.get('/kho/status/overstock'),
  create: (data) => api.post('/kho', data),
  update: (id, data) => api.put(`/kho/${id}`, data),
  delete: (id) => api.delete(`/kho/${id}`),
  createIngredient: (data) => api.post('/nguyenlieu', data),
};

export const importService = {
  getAll: () => api.get('/phieunhap'),
  getById: (id) => api.get(`/phieunhap/${id}`),
  create: (data) => api.post('/phieunhap', data),
  addItem: (importId, data) => api.post(`/phieunhap/${importId}/items`, data),
  removeItem: (importId, itemId) => api.delete(`/phieunhap/${importId}/items/${itemId}`),
  confirm: (id) => api.put(`/phieunhap/${id}/confirm`),
  getByDateRange: (startDate, endDate) =>
    api.get(`/phieunhap/date-range?start=${startDate}&end=${endDate}`),
};

export const exportService = {
  getAll: () => api.get('/phieuxuat'),
  getById: (id) => api.get(`/phieuxuat/${id}`),
  create: (data) => api.post('/phieuxuat', data),
  addItem: (exportId, data) => api.post(`/phieuxuat/${exportId}/items`, data),
  removeItem: (exportId, itemId) => api.delete(`/phieuxuat/${exportId}/items/${itemId}`),
  confirm: (id) => api.put(`/phieuxuat/${id}/confirm`),
  getByDateRange: (startDate, endDate) =>
    api.get(`/phieuxuat/date-range?start=${startDate}&end=${endDate}`),
};

export const dashboardService = {
  getDashboard: () => api.get('/thongke/dashboard'),
  getDailyRevenue: (date) => api.get(`/thongke/revenue/daily?date=${date}`),
  getWeeklyRevenue: () => api.get('/thongke/revenue/weekly'),
  getMonthlyRevenue: () => api.get('/thongke/revenue/monthly'),
  getTopDishes: () => api.get('/thongke/dishes/top'),
  getTopCustomers: () => api.get('/thongke/customers/top'),
  getProfitReport: () => api.get('/thongke/profit'),
  getInventoryReport: () => api.get('/thongke/inventory'),
  getStaffPerformance: () => api.get('/thongke/staff-performance'),
};
