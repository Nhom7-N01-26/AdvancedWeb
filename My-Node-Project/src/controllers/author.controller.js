/**
 * author.controller.js
 * Quản lý CRUD cho thực thể Author (authors table)
 */

const db = require('../../dbconnection');
const { sendError, requireFields } = require('../utils/http');

// [GET] /api/authors
exports.getAllAuthors = async (req, res) => {
  try {
    const [authors] = await db.query(`
      SELECT a.id, a.user_id, a.pen_name, a.bio, a.avatar_url, a.total_novels, a.created_at,
             u.username, u.email, u.full_name
      FROM authors a
      JOIN users u ON a.user_id = u.id
      ORDER BY a.total_novels DESC
    `);
    res.status(200).json({ success: true, count: authors.length, data: authors });
  } catch (error) {
    return sendError(res, error);
  }
};

// [GET] /api/authors/:id
exports.getAuthorById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT a.*, u.username, u.email, u.full_name
      FROM authors a
      JOIN users u ON a.user_id = u.id
      WHERE a.id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: `Không tìm thấy tác giả có ID = ${id}` });
    }

    const [novels] = await db.query('SELECT id, title, slug, status, avg_rating FROM novels WHERE author_id = ?', [id]);
    const author = rows[0];
    author.novels = novels;

    res.status(200).json({ success: true, data: author });
  } catch (error) {
    return sendError(res, error);
  }
};

// [POST] /api/authors
exports.createAuthor = async (req, res) => {
  try {
    const { user_id, pen_name, bio = null, avatar_url = null } = req.body;
    requireFields(req.body, ['user_id', 'pen_name']);

    const [result] = await db.query(
      'INSERT INTO authors (user_id, pen_name, bio, avatar_url) VALUES (?, ?, ?, ?)',
      [user_id, pen_name, bio, avatar_url]
    );

    res.status(201).json({
      success: true,
      message: 'Tạo tác giả mới thành công',
      data: { id: result.insertId, user_id, pen_name }
    });
  } catch (error) {
    return sendError(res, error);
  }
};

// [PUT] /api/authors/:id
exports.updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const { pen_name, bio, avatar_url } = req.body;
    const [existing] = await db.query('SELECT id FROM authors WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'Không tìm thấy tác giả' });

    const updates = [];
    const params = [];
    if (pen_name !== undefined) { updates.push('pen_name = ?'); params.push(pen_name); }
    if (bio !== undefined) { updates.push('bio = ?'); params.push(bio); }
    if (avatar_url !== undefined) { updates.push('avatar_url = ?'); params.push(avatar_url); }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'Không có thông tin nào cần cập nhật' });
    }

    params.push(id);
    await db.query(`UPDATE authors SET ${updates.join(', ')} WHERE id = ?`, params);

    res.status(200).json({ success: true, message: 'Cập nhật tác giả thành công' });
  } catch (error) {
    return sendError(res, error);
  }
};

// [DELETE] /api/authors/:id
exports.deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await db.query('SELECT id FROM authors WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'Không tìm thấy tác giả' });
    await db.query('DELETE FROM authors WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: `Đã xóa tác giả ID = ${id} thành công` });
  } catch (error) {
    return sendError(res, error);
  }
};
