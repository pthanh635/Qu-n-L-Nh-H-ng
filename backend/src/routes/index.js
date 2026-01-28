/**
 * Routes Index - Tổng hợp tất cả routes
 * Import file này trong app.js để load tất cả routes
 */

const authRoutes = require('./auth.routes');
const nguoidungRoutes = require('./nguoidung.routes');
const nhanvienRoutes = require('./nhanvien.routes');
const khachhangRoutes = require('./khachhang.routes');
const banRoutes = require('./ban.routes');
const monAnRoutes = require('./monan.routes');
const hoadonRoutes = require('./hoadon.routes');
const voucherRoutes = require('./voucher.routes');
const khoRoutes = require('./kho.routes');
const phieuNhapRoutes = require('./phieunhap.routes');
const phieuXuatRoutes = require('./phieuxuat.routes');
const thongkeRoutes = require('./thongke.routes');

/**
 * Khai báo tất cả routes
 */
const routes = [
  { path: '/api/auth', router: authRoutes },
  { path: '/api/usuarios', router: nguoidungRoutes },
  { path: '/api/nhanvien', router: nhanvienRoutes },
  { path: '/api/khachhang', router: khachhangRoutes },
  { path: '/api/ban', router: banRoutes },
  { path: '/api/monan', router: monAnRoutes },
  { path: '/api/hoadon', router: hoadonRoutes },
  { path: '/api/voucher', router: voucherRoutes },
  { path: '/api/kho', router: khoRoutes },
  { path: '/api/phieunhap', router: phieuNhapRoutes },
  { path: '/api/phieuxuat', router: phieuXuatRoutes },
  { path: '/api/thongke', router: thongkeRoutes },
];

/**
 * Hàm setup tất cả routes vào app
 * Cách sử dụng trong app.js:
 * const setupRoutes = require('./routes');
 * setupRoutes(app);
 */
function setupRoutes(app) {
  routes.forEach(({ path, router }) => {
    app.use(path, router);
  });
}

module.exports = setupRoutes;
