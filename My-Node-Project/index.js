/**
 * index.js - Máy chủ Express chính của Nhóm 7 (Advanced Web)
 * Dự án: Novel Manager API & Web Service
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const db = require('./dbconnection');
const apiRoutes = require('./src/routes/api.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trang thông tin gốc & Danh sách API
app.get('/', (req, res) => {
  res.json({
    status: 'ONLINE',
    project: 'Novel Manager RESTful API - Nhom 7 Advanced Web',
    version: '1.0.0',
    database: process.env.DB_NAME || 'novel_manager',
    endpoints: {
      users: {
        list: 'GET /api/users',
        detail: 'GET /api/users/:id',
        create: 'POST /api/users',
        update: 'PUT /api/users/:id',
        delete: 'DELETE /api/users/:id'
      },
      novels: {
        list: 'GET /api/novels',
        detail: 'GET /api/novels/:id',
        create: 'POST /api/novels',
        update: 'PUT /api/novels/:id',
        delete: 'DELETE /api/novels/:id'
      },
      categories: {
        list: 'GET /api/categories',
        detail: 'GET /api/categories/:id',
        create: 'POST /api/categories',
        update: 'PUT /api/categories/:id',
        delete: 'DELETE /api/categories/:id'
      },
      authors: {
        list: 'GET /api/authors',
        detail: 'GET /api/authors/:id',
        create: 'POST /api/authors',
        update: 'PUT /api/authors/:id',
        delete: 'DELETE /api/authors/:id'
      },
      chapters: {
        list: 'GET /api/chapters?novel_id=:id',
        detail: 'GET /api/chapters/:id',
        create: 'POST /api/chapters',
        update: 'PUT /api/chapters/:id',
        delete: 'DELETE /api/chapters/:id'
      },
      tags: {
        list: 'GET /api/tags',
        detail: 'GET /api/tags/:id',
        create: 'POST /api/tags',
        update: 'PUT /api/tags/:id',
        delete: 'DELETE /api/tags/:id'
      }
    }
  });
});

// Endpoint kiểm tra sức khỏe hệ thống & CSDL
app.get('/health', async (req, res) => {
  try {
    const [result] = await db.query('SELECT 1 + 1 AS health_check, DATABASE() as db_name, VERSION() as version');
    res.status(200).json({
      status: 'HEALTHY',
      database: result[0].db_name,
      mysql_version: result[0].version,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'UNHEALTHY',
      database_error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Giữ lại endpoint test cũ để đảm bảo tương thích ngược
app.get('/aboutHikari', (req, res) => {
  res.json({ id: 0, name: "Hikari" });
});
app.post('/aboutHikari', (req, res) => {
  const { id, name } = req.body;
  res.json({ id, name });
});

// Đăng ký toàn bộ CRUD API routes
app.use('/api', apiRoutes);

// Xử lý route không tồn tại (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Không tìm thấy tài nguyên: ${req.method} ${req.originalUrl}`
  });
});

// Khởi động server
const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log(`====================================================`);
  console.log(`  🚀 Server đang chạy tại: http://localhost:${port}`);
  console.log(`  📖 Danh sách API Docs:  http://localhost:${port}/`);
  console.log(`====================================================`);
  
  // Tự động kiểm tra kết nối CSDL khi khởi động
  try {
    await db.testConnection();
  } catch (err) {
    console.warn('[WARNING] Chưa kết nối được MySQL ngay lúc khởi động:', err.message);
  }
});
