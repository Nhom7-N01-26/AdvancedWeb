# Novel Manager - Web Quản Lý & Đọc Tiểu Thuyết Trực Tuyến

Dự án môn học **Thiết kế Web Nâng Cao** - Khoa Công nghệ Thông tin, Trường Đại học Phenikaa.

Hệ thống được xây dựng theo kiến trúc phân lớp bảo mật (NestJS + TypeORM + MySQL 8.0) và giao diện phong cách **Booking.com** (React + react-bootstrap).

### 👥 Thành Viên Nhóm 7
- **Nguyễn Tiến Hoàng Vũ** - MSSV: `23010233`
- **Lê Thanh Bình** - MSSV: `23010242`
- **Trần Tiến Đức** - MSSV: `23010777`

---


## 1. Cấu Trúc Dự Án

- `backend/`: Mã nguồn RESTful API viết bằng NestJS, TypeORM, xác thực JWT HttpOnly Cookie, Swagger OpenAPI.
- `frontend/`: Mã nguồn ứng dụng giao diện người dùng React (Vite) sử dụng `react-bootstrap`.
- `database/`: Tệp khởi tạo CSDL MySQL (`novel_manager_db.sql`) và dữ liệu mẫu (`seed_data.sql`).

---

## 2. Hướng Dẫn Khởi Chạy

### 2.1. Thiết Lập Cơ Sở Dữ Liệu
1. Cài đặt MySQL 8.0.
2. Tạo database và nạp schema:
   ```bash
   mysql -u root -p < database/novel_manager_db.sql
   mysql -u root -p novel_manager < database/seed_data.sql
   ```

### 2.2. Khởi Chạy Backend (NestJS)
1. Di chuyển vào thư mục backend:
   ```bash
   cd backend
   ```
2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
3. Tạo file cấu hình môi trường `.env` từ `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Cập nhật thông tin kết nối CSDL MySQL và secrets.
4. Chạy Backend ở chế độ phát triển:
   ```bash
   npm run start:dev
   ```
   - API Server: `http://localhost:5000/api`
   - Tài liệu Swagger OpenAPI: `http://localhost:5000/api/docs`

### 2.3. Khởi Chạy Frontend (React)
1. Di chuyển vào thư mục frontend:
   ```bash
   cd frontend
   ```
2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
3. Chạy Frontend dev server:
   ```bash
   npm run dev
   ```
   - Ứng dụng Web: `http://localhost:5173/`

---

## 3. Kiểm Thử (Testing)

Trong thư mục `backend/`:
- Chạy toàn bộ Unit Tests (16 User Stories):
  ```bash
  npm test
  ```
- Chạy E2E Integration Tests:
  ```bash
  npm run test:e2e
  ```
