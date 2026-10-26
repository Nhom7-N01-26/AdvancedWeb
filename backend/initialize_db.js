import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

async function init() {
  console.log('Dang ket noi toi MySQL...');
  const conn = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '2550330533',
    multipleStatements: true
  });
  console.log('Da ket noi MySQL!');

  // 1. Chạy file schema: novel_manager_db.sql
  const schemaPath = path.resolve('E:/advancedWeb/Novel-Manager/novel_manager_db.sql');
  console.log(`Dang thuc thi schema: ${schemaPath}`);
  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
  await conn.query(schemaSql);
  console.log('Khoi tao CSDL novel_manager va 12 bang thanh cong!');

  // 2. Chạy file seed data: seed_data.sql
  const seedPath = path.resolve('E:/advancedWeb/Novel-Manager/data/seed_data.sql');
  if (fs.existsSync(seedPath)) {
    console.log(`Dang nap du lieu truyen that tu: ${seedPath}`);
    const seedSql = fs.readFileSync(seedPath, 'utf-8');
    await conn.query(seedSql);
    console.log('Nap du lieu seed thanh cong!');
  }

  // 3. Kiểm tra số lượng bản ghi
  await conn.query('USE novel_manager;');
  const [novels] = await conn.query('SELECT COUNT(*) AS total FROM novels;');
  const [chapters] = await conn.query('SELECT COUNT(*) AS total FROM chapters;');
  const [categories] = await conn.query('SELECT COUNT(*) AS total FROM categories;');
  const [users] = await conn.query('SELECT COUNT(*) AS total FROM users;');

  console.log('\nTHONG KE CO SO DU LIEU NOVEL_MANAGER:');
  console.log(` - Số bộ truyện (Novels):       ${novels[0].total}`);
  console.log(` - Số chương truyện (Chapters): ${chapters[0].total}`);
  console.log(` - Số thể loại (Categories):     ${categories[0].total}`);
  console.log(` - Số tài khoản (Users):         ${users[0].total}`);

  await conn.end();
  console.log('\nHoan tat khoi tao CSDL MySQL!');
}

init().catch(err => {
  console.error('Loi khoi tao CSDL:', err);
  process.exit(1);
});
