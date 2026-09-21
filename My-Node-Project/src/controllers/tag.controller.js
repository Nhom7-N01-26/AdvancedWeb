/**
 * tag.controller.js
 * Quản lý CRUD cho thực thể Tag (tags table)
 */

const db = require('../../dbconnection');

// [GET] /api/tags
exports.getAllTags = async (req, res) => {
  try {
    const [tags] = await db.query('SELECT * FROM tags ORDER BY id ASC');
    res.status(200).json({ success: true, count: tags.length, data: tags });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
    res.status(500).json({ success: false, message: error.message });
  }
};

// [POST] /api/tags
exports.createTag = async (req, res) => {
  try {
    const { name, slug } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp name và slug cho tag' });
    }

    const [result] = await db.query('INSERT INTO tags (name, slug) VALUES (?, ?)', [name, slug]);
    res.status(201).json({
      success: true,
      message: 'Tạo thẻ tag mới thành công',
      data: { id: result.insertId, name, slug }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [PUT] /api/tags/:id
exports.updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;

    const updates = [];
    const params = [];
    if (name) { updates.push('name = ?'); params.push(name); }
    if (slug) { updates.push('slug = ?'); params.push(slug); }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'Không có dữ liệu cần cập nhật' });
    }

    params.push(id);
    await db.query(`UPDATE tags SET ${updates.join(', ')} WHERE id = ?`, params);

    res.status(200).json({ success: true, message: 'Cập nhật tag thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [DELETE] /api/tags/:id
exports.deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM tags WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: `Đã xóa tag ID = ${id} thành công` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
