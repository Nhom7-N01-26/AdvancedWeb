/**
 * category.controller.js
 * Quản lý CRUD cho thực thể Category (categories table)
 */

const db = require('../../dbconnection');
const { sendError, requireFields } = require('../utils/http');

// [GET] /api/categories
exports.getAllCategories = async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories ORDER BY id ASC');
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    return sendError(res, error);
  }
};

// [GET] /api/categories/:id
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: `Không tìm thấy danh mục có ID = ${id}` });
    }
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    return sendError(res, error);
  }
};

// [POST] /api/categories
exports.createCategory = async (req, res) => {
  try {
    const { name, slug, description = '', icon = '📚' } = req.body;
    requireFields(req.body, ['name', 'slug']);

    const [result] = await db.query(
      'INSERT INTO categories (name, slug, description, icon) VALUES (?, ?, ?, ?)',
      [name, slug, description, icon]
    );

    res.status(201).json({
      success: true,
      message: 'Tạo danh mục mới thành công',
      data: { id: result.insertId, name, slug, description, icon }
    });
  } catch (error) {
    return sendError(res, error);
  }
};

// [PUT] /api/categories/:id
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, icon } = req.body;
    const [existing] = await db.query('SELECT id FROM categories WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });

    const updates = [];
    const params = [];
    if (name !== undefined) { updates.push('name = ?'); params.push(name); }
    if (slug !== undefined) { updates.push('slug = ?'); params.push(slug); }
    if (description !== undefined) { updates.push('description = ?'); params.push(description); }
    if (icon !== undefined) { updates.push('icon = ?'); params.push(icon); }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'Không có trường nào cần cập nhật' });
    }

    params.push(id);
    await db.query(`UPDATE categories SET ${updates.join(', ')} WHERE id = ?`, params);

    res.status(200).json({ success: true, message: 'Cập nhật danh mục thành công' });
  } catch (error) {
    return sendError(res, error);
  }
};

// [DELETE] /api/categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await db.query('SELECT id FROM categories WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });
    await db.query('DELETE FROM categories WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: `Đã xóa danh mục ID = ${id} thành công` });
  } catch (error) {
    return sendError(res, error);
  }
};
