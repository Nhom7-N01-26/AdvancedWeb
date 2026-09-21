/**
 * category.controller.js
 * Quản lý CRUD cho thực thể Category (categories table)
 */

const db = require('../../dbconnection');

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
    res.status(500).json({ success: false, message: error.message });
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
    res.status(500).json({ success: false, message: error.message });
  }
};

// [POST] /api/categories
exports.createCategory = async (req, res) => {
  try {
    const { name, slug, description = '', icon = '📚' } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp name và slug cho danh mục' });
    }

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
    res.status(500).json({ success: false, message: error.message });
  }
};

// [PUT] /api/categories/:id
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, icon } = req.body;

    const updates = [];
    const params = [];
    if (name) { updates.push('name = ?'); params.push(name); }
    if (slug) { updates.push('slug = ?'); params.push(slug); }
    if (description !== undefined) { updates.push('description = ?'); params.push(description); }
    if (icon !== undefined) { updates.push('icon = ?'); params.push(icon); }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'Không có trường nào cần cập nhật' });
    }

    params.push(id);
    await db.query(`UPDATE categories SET ${updates.join(', ')} WHERE id = ?`, params);

    res.status(200).json({ success: true, message: 'Cập nhật danh mục thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [DELETE] /api/categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM categories WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: `Đã xóa danh mục ID = ${id} thành công` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
