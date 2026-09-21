/**
 * user.controller.js
 * Quản lý CRUD cho thực thể User (users table)
 */

const db = require('../../dbconnection');

// [GET] /api/users - Lấy danh sách người dùng
exports.getAllUsers = async (req, res) => {
  try {
    const { role, limit = 50, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, username, email, full_name, avatar_url, role, is_active, created_at FROM users';
    const params = [];

    if (role) {
      query += ' WHERE role = ?';
      params.push(role);
    }

    query += ' ORDER BY id ASC LIMIT ? OFFSET ?';
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const [users] = await db.query(query, params);
    const [[{ total }]] = await db.query(
      'SELECT COUNT(*) as total FROM users' + (role ? ' WHERE role = ?' : ''),
      role ? [role] : []
    );

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách người dùng thành công',
      total,
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [GET] /api/users/:id - Lấy chi tiết một người dùng
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      'SELECT id, username, email, full_name, avatar_url, role, is_active, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: `Không tìm thấy người dùng có ID = ${id}` });
    }

    res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [POST] /api/users - Tạo người dùng mới
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, full_name, role = 'reader', avatar_url = null } = req.body;

    if (!username || !email || !password || !full_name) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ username, email, password và full_name'
      });
    }

    // Kiểm tra username hoặc email trùng lặp
    const [existing] = await db.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Username hoặc Email đã được sử dụng'
      });
    }

    const password_hash = `$2b$10$HASH_${Buffer.from(password).toString('base64').substring(0, 20)}`;

    const [result] = await db.query(
      `INSERT INTO users (username, email, password_hash, full_name, role, avatar_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [username, email, password_hash, full_name, role, avatar_url]
    );

    res.status(201).json({
      success: true,
      message: 'Tạo người dùng mới thành công',
      data: {
        id: result.insertId,
        username,
        email,
        full_name,
        role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [PUT] /api/users/:id - Cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, avatar_url, role, is_active } = req.body;

    const [existing] = await db.query('SELECT id FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: `Không tìm thấy người dùng có ID = ${id}` });
    }

    const updates = [];
    const params = [];

    if (full_name !== undefined) {
      updates.push('full_name = ?');
      params.push(full_name);
    }
    if (avatar_url !== undefined) {
      updates.push('avatar_url = ?');
      params.push(avatar_url);
    }
    if (role !== undefined) {
      updates.push('role = ?');
      params.push(role);
    }
    if (is_active !== undefined) {
      updates.push('is_active = ?');
      params.push(is_active);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'Không có dữ liệu nào cần cập nhật' });
    }

    params.push(id);
    await db.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);

    const [updatedUser] = await db.query(
      'SELECT id, username, email, full_name, avatar_url, role, is_active, updated_at FROM users WHERE id = ?',
      [id]
    );

    res.status(200).json({
      success: true,
      message: 'Cập nhật người dùng thành công',
      data: updatedUser[0]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [DELETE] /api/users/:id - Xóa người dùng
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query('SELECT id, username FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: `Không tìm thấy người dùng có ID = ${id}` });
    }

    await db.query('DELETE FROM users WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: `Đã xóa người dùng '${existing[0].username}' (ID = ${id}) thành công`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
