/**
 * chapter.controller.js
 * Quản lý CRUD cho thực thể Chapter (chapters table)
 */

const db = require('../../dbconnection');

// [GET] /api/chapters - Lấy danh sách chương theo novel_id
exports.getChaptersByNovel = async (req, res) => {
  try {
    const { novel_id } = req.query;
    if (!novel_id) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp query param novel_id' });
    }

    const [chapters] = await db.query(
      'SELECT id, novel_id, chapter_number, title, word_count, views, status, published_at FROM chapters WHERE novel_id = ? ORDER BY chapter_number ASC',
      [novel_id]
    );

    res.status(200).json({ success: true, count: chapters.length, data: chapters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [GET] /api/chapters/:id - Chi tiết một chương truyện
exports.getChapterById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM chapters WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: `Không tìm thấy chương có ID = ${id}` });
    }

    // Tăng lượt xem (views)
    await db.query('UPDATE chapters SET views = views + 1 WHERE id = ?', [id]);

    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [POST] /api/chapters - Thêm chương mới
exports.createChapter = async (req, res) => {
  try {
    const { novel_id, chapter_number, title, content, status = 'published' } = req.body;
    if (!novel_id || !chapter_number || !title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp novel_id, chapter_number, title và content'
      });
    }

    const word_count = content.trim().split(/\s+/).length;

    const [result] = await db.query(
      `INSERT INTO chapters (novel_id, chapter_number, title, content, word_count, status, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [novel_id, chapter_number, title, content, word_count, status, status === 'published' ? new Date() : null]
    );

    res.status(201).json({
      success: true,
      message: 'Thêm chương truyện mới thành công',
      data: { id: result.insertId, novel_id, chapter_number, title, word_count }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [PUT] /api/chapters/:id - Cập nhật chương truyện
exports.updateChapter = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, status } = req.body;

    const updates = [];
    const params = [];
    if (title) { updates.push('title = ?'); params.push(title); }
    if (content) {
      updates.push('content = ?');
      params.push(content);
      updates.push('word_count = ?');
      params.push(content.trim().split(/\s+/).length);
    }
    if (status) { updates.push('status = ?'); params.push(status); }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'Không có dữ liệu cần cập nhật' });
    }

    params.push(id);
    await db.query(`UPDATE chapters SET ${updates.join(', ')} WHERE id = ?`, params);

    res.status(200).json({ success: true, message: 'Cập nhật chương thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [DELETE] /api/chapters/:id - Xóa chương truyện
exports.deleteChapter = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM chapters WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: `Đã xóa chương ID = ${id} thành công` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
