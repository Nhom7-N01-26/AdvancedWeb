/**
 * tag.controller.js
 * Quản lý CRUD cho thực thể Tag (tags table)
 */

const db = require('../../dbconnection');
const { sendError, requireFields } = require('../utils/http');

// [GET] /api/tags
exports.getAllTags = async (req, res) => {
  try {
    const [tags] = await db.query('SELECT * FROM tags ORDER BY id ASC');
    res.status(200).json({ success: true, count: tags.length, data: tags });
  } catch (error) {
    return sendError(res, error);
  }
};

// [GET] /api/tags/:id
exports.getTagById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM tags WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: `Không tìm thấy tag có ID = ${id}` });
    }
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    return sendError(res, error);
  }
};

// [POST] /api/tags
exports.createTag = async (req, res) => {
  try {
    const { name, slug } = req.body;
    requireFields(req.body, ['name', 'slug']);

    const [result] = await db.query('INSERT INTO tags (name, slug) VALUES (?, ?)', [name, slug]);
    res.status(201).json({
      success: true,
      message: 'Tạo thẻ tag mới thành công',
      data: { id: result.insertId, name, slug }
    });
  } catch (error) {
    return sendError(res, error);
  }
};

// [PUT] /api/tags/:id
exports.updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;
    const [existing] = await db.query('SELECT id FROM tags WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'Không tìm thấy tag' });

    const updates = [];
    const params = [];
    if (name !== undefined) { updates.push('name = ?'); params.push(name); }
    if (slug !== undefined) { updates.push('slug = ?'); params.push(slug); }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'Không có dữ liệu cần cập nhật' });
    }

    params.push(id);
    await db.query(`UPDATE tags SET ${updates.join(', ')} WHERE id = ?`, params);

    res.status(200).json({ success: true, message: 'Cập nhật tag thành công' });
  } catch (error) {
    return sendError(res, error);
  }
};

// [DELETE] /api/tags/:id
exports.deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await db.query('SELECT id FROM tags WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'Không tìm thấy tag' });
    await db.query('DELETE FROM tags WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: `Đã xóa tag ID = ${id} thành công` });
  } catch (error) {
    return sendError(res, error);
  }
};
