# AI Copilot Instructions - Restaurant Management Backend

## Architecture Overview

This is a **Node.js + Express + Sequelize + MySQL** restaurant management system with a layered MVC architecture:

- **Models** (`src/models/`): Sequelize ORM definitions for all entities (HoaDon, MonAn, NguoiDung, Ban, Kho, etc.)
- **Controllers** (`src/controllers/`): HTTP request handlers (mostly empty, awaiting implementation)
- **Services** (`src/services/`): Business logic layer (auth.service.js, hoadon.service.js, kho.service.js, thongke.service.js)
- **Routes** (`src/routes/`): Express route definitions (currently not loaded in app.js)
- **Middlewares** (`src/middlewares/`): Auth and role-based access control (currently stubbed out)

**Critical Detail**: Routes are NOW wired in `app.js` and fully functional. All 12 route modules are loaded via `src/routes/index.js`.

## Data Model & Associations

Key entities and their relationships:
- **NguoiDung** (User): Base user with VaiTro enum (admin, nhanvien, khachhang)
- **NhanVien** (Employee): Works with Ban (Tables), creates HoaDon & PhieuNhap/PhieuXuat
- **KhachHang** (Customer): Places HoaDon, has DiemTichLuy (loyalty points)
- **HoaDon** (Invoice): Contains CTHD (Invoice Details), linked to MonAn via CTHD
- **MonAn** (Dishes): Belongs to DanhMuc (Category), has DonGia (price)
- **Kho** (Inventory): Tracks NguyenLieu stock via PhieuNhap/PhieuXuat (Import/Export Orders)
- **Voucher**: Applied to HoaDon for discounts (PhanTramGiam %)

**CRITICAL**: Models are fully implemented with:
- Foreign key constraints and field comments
- Validations (min/max, enum values, unique constraints)
- All associations defined in `src/associations/index.js`
- Export via `src/models/index.js` for easy importing

## Model Implementation Guide

### Importing Models
```javascript
// Recommended way (after associations loaded)
const { NguoiDung, HoaDon, MonAn } = require('../models');
```

### Example: Creating a Complete Transaction
```javascript
// Create invoice with items
const hoadon = await HoaDon.create({
  ID_KH: khachhang.ID_KH,
  ID_NV: nhanvien.ID_NV,
  TrangThai: 'dang_mo',
  TongTienMon: 70000
});

// Add items via CTHD (Chi Tiết Hóa Đơn)
await CTHD.create({
  ID_HoaDon: hoadon.ID_HoaDon,
  ID_MonAn: monan.ID_MonAn,
  SoLuong: 1,
  DonGia: 45000,
  ThanhTien: 45000
});

// Get with relationships
const detail = await HoaDon.findByPk(id, {
  include: ['khachhang', 'nhanvien', 'chitiethoadon']
});
```

### Important Enum Values
- **NguoiDung.VaiTro**: 'admin' | 'nhanvien' | 'khachhang'
- **HoaDon.TrangThai**: 'dang_mo' | 'da_thanh_toan' | 'da_huy'
- **Ban.TrangThai**: 'trong' | 'dang_su_dung' | 'da_dat'
- **MonAn.TrangThai**: 'available' | 'unavailable'
- **NhanVien.TinhTrang**: 'dang_lam' | 'nghi' | 'da_nghi'

See [docs/MODELS.md](docs/MODELS.md) for comprehensive usage examples and all associations.

## Key Conventions

### Model Definition Pattern
```javascript
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('ModelName', {
    // All fields with type, validation, comments
    ID_Model: { type: DataTypes.INTEGER, primaryKey: true },
    TenField: { 
      type: DataTypes.STRING(100), 
      allowNull: false,
      comment: 'Field description'
    }
  }, {
    tableName: 'ModelName',
    timestamps: false
  });
  return Model;
};
```

### Sequelize Configuration
- **Timezone**: +07:00 (Vietnam time) in `src/config/database.js`
- **Connection Pool**: Max 10, min 0 connections
- **Logging**: Disabled by default (set `logging: console.log` in database config to debug)

### Authentication
- **JWT Secret**: Stored in `.env` as `JWT_SECRET` (default: 'restaurant_secret_key')
- **Roles**: Enum in NguoiDung.VaiTro (admin, nhanvien, khachhang)
- **Password Hashing**: Uses bcrypt (see `src/utils/hash.js` pattern)

### Database Connection
Server startup (`src/server.js`):
1. Loads dotenv configuration
2. Requires associations (CRITICAL for model relationships)
3. Authenticates DB connection
4. Syncs models with database (`sequelize.sync({ alter: true })`)
5. Starts Express server

## Development Workflow

### Starting the Server
```bash
cd backend
npm install
npm start  # Uses nodemon with config: watches src/**/*.{js,json}
```
Nodemon is configured in `nodemon.json` to watch `src` folder and restart on changes.

### Database
- Host: localhost (port 3306)
- User: root
- Database: QuanLyNhaHang
- Config in `.env` file

### Seed Data
Test data is available in `src/database/seedData.js`:
```javascript
const { seedAll } = require('../database/seedData');
await seedAll(); // Creates sample users, invoices, menus, etc.
```

### Testing
Jest and supertest are installed but no tests exist yet. Pattern should follow:
```bash
npm test  # Currently just echoes error - implementation needed
```

## Implementation Priorities

1. **✅ Complete Models**: All models fully implemented with validations and associations
2. **✅ Complete Routes**: All 12 route files fully implemented and wired in app.js
3. **✅ Complete Middlewares**: Auth, role-based access control, and error handling middleware
4. **⏳ Implement Controllers**: Most are empty (auth.controller.js, monan.controller.js, etc.)
5. **⏳ Implement Services**: Only stubs exist (implement business logic)
6. **✅ Routes wired in app.js**: Routes are loaded and ready to handle requests

## Important Files Reference

| File | Purpose |
|------|---------|
| `src/app.js` | Express app setup (routes/middleware loading point) ✅ Updated |
| `src/server.js` | Server entry point, handles DB sync & startup |
| `src/config/database.js` | Sequelize connection & pool config |
| `src/associations/index.js` | **CRITICAL**: Model relationship definitions |
| `src/models/*.js` | Entity definitions (factory pattern) ✅ Complete |
| `src/models/index.js` | Convenient model export point |
| `src/routes/*.js` | All 12 route files ✅ Complete |
| `src/routes/index.js` | Route aggregator & setup function |
| `src/database/seedData.js` | Sample data for development |
| `src/controllers/` | Business logic handlers (awaiting implementation) |
| `src/services/` | Service layer (awaiting implementation) |
| `src/middlewares/` | Auth & role middleware ✅ Complete |
| `docs/MODELS.md` | Model usage guide |
| `docs/API_ROUTES.md` | Complete API endpoint documentation |
| `docs/MIDDLEWARES.md` | Middleware documentation |

## Common Patterns to Follow

- **Naming**: Vietnamese camelCase for variables (e.g., `ID_HoaDon`, `TenMonAn`)
- **Enum Values**: Use lowercase with underscores (e.g., 'dang_mo', 'da_thanh_toan')
- **Error Handling**: Implement middleware in `src/middlewares/error.middleware.js`
- **Validation**: Validate input in `src/utils/validate.js` before passing to services
- **Async/Await**: Preferred over callbacks; use try-catch for error handling
- **Transactions**: Use for multi-step operations that must succeed/fail together

## Next Steps for AI Agents

Before implementing features:
1. ✅ Models are imported and associations are loaded via `server.js`
2. ✅ Routes are fully wired in app.js and ready to handle requests
3. ✅ Middlewares (auth, role, error handler) are ready to use
4. Check `.env` has all required variables (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET)
5. ⏳ Implement Controllers using the route handlers as guides
6. ⏳ Implement Services with business logic
7. ⏳ Test with seedData for rapid development
