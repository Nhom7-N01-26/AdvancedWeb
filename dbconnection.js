/**
 * dbconnection.js
 * Quản lý kết nối Cơ sở dữ liệu MySQL - Nhóm 7 (Advanced Web)
 * Database: novel_manager
 */

const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Khởi tạo Connection Pool kết nối MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'novel_manager',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

/**
 * Hàm kiểm tra kết nối CSDL và hiển thị thông tin chi tiết
 */
async function testConnection() {
  console.log('====================================================');
  console.log('  Đang kiểm tra kết nối Cơ sở dữ liệu MySQL...');
  console.log('====================================================');
  try {
    const connection = await pool.getConnection();
    console.log('[SUCCESS] Kết nối đến CSDL MySQL thành công!');
    
    // Lấy thông tin cơ sở dữ liệu hiện tại
    const [dbInfo] = await connection.query('SELECT DATABASE() AS db_name, VERSION() AS version');
    console.log(`- Database Name   : ${dbInfo[0].db_name}`);
    console.log(`- MySQL Version   : ${dbInfo[0].version}`);
    console.log(`- Host            : ${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || 3306}`);

    // Đếm số lượng bảng trong database
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`- Tổng số bảng    : ${tables.length} bảng`);
    console.log('----------------------------------------------------');
    console.log('Danh sách các bảng trong CSDL novel_manager:');
    tables.forEach((t, i) => {
      const tableName = Object.values(t)[0];
      console.log(`  ${(i + 1).toString().padStart(2, ' ')}. ${tableName}`);
    });
    console.log('====================================================');
    
    connection.release();
    return true;
  } catch (error) {
    console.error('[ERROR] Kết nối CSDL thất bại!');
    console.error('Chi tiết lỗi:', error.message);
    console.log('Vui lòng kiểm tra lại:');
    console.log('1. MySQL server đã khởi động chưa? (XAMPP / Docker / Service)');
    console.log('2. Đã import file sql_nhom_7.sql vào MySQL chưa?');
    console.log('3. Thông tin cấu hình trong file .env đã chính xác chưa?');
    return false;
  }
}

// Chạy trực tiếp qua lệnh: node dbconnection.js
if (require.main === module) {
  testConnection().then((success) => {
    if (!success) process.exit(1);
    process.exit(0);
  });
}

module.exports = {
  pool,
  testConnection,
  query: (sql, params) => pool.query(sql, params)
};
