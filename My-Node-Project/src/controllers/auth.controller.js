const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../dbconnection');
const { sendError, requireFields } = require('../utils/http');

function createToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
}

exports.register = async (req, res) => {
  try {
    requireFields(req.body, ['username', 'email', 'password', 'full_name']);
    const { username, email, password, full_name, avatar_url = null } = req.body;

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password phải có ít nhất 8 ký tự' });
    }

    const [existing] = await db.query('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Username hoặc email đã được sử dụng' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const [result] = await db.query(
      'INSERT INTO users (username, email, password_hash, full_name, avatar_url) VALUES (?, ?, ?, ?, ?)',
      [username.trim(), email.trim().toLowerCase(), passwordHash, full_name.trim(), avatar_url]
    );

    return res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: { id: result.insertId, username, email, full_name, role: 'reader' }
    });
  } catch (error) {
    return sendError(res, error);
  }
};

exports.login = async (req, res) => {
  try {
    requireFields(req.body, ['email', 'password']);
    const [rows] = await db.query(
      'SELECT id, username, email, password_hash, full_name, avatar_url, role, is_active FROM users WHERE email = ?',
      [req.body.email.trim().toLowerCase()]
    );
    const user = rows[0];

    if (!user || !user.is_active || !(await bcrypt.compare(req.body.password, user.password_hash))) {
      return res.status(401).json({ success: false, message: 'Email hoặc password không đúng' });
    }

    delete user.password_hash;
    return res.json({ success: true, token: createToken(user), data: user });
  } catch (error) {
    return sendError(res, error);
  }
};

exports.me = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, username, email, full_name, avatar_url, role, is_active, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    return res.json({ success: true, data: rows[0] });
  } catch (error) {
    return sendError(res, error);
  }
};
