/**
 * chapter.controller.js
 * Quản lý CRUD cho thực thể Chapter (chapters table)
 */

const db = require('../../dbconnection');
const { sendError, requireFields, requireEnum } = require('../utils/http');

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
    return sendError(res, error);
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
    return sendError(res, error);
  }
};

// [POST] /api/chapters - Thêm chương mới
exports.createChapter = async (req, res) => {
  try {
    const { novel_id, chapter_number, title, content, status = 'published' } = req.body;
    requireFields(req.body, ['novel_id', 'chapter_number', 'title', 'content']);
    requireEnum(status, 'status', ['draft', 'published']);

    const novelQuery = req.user.role === 'admin'
      ? 'SELECT id FROM novels WHERE id = ?'
      : 'SELECT n.id FROM novels n JOIN authors a ON a.id = n.author_id WHERE n.id = ? AND a.user_id = ?';
    const novelParams = req.user.role === 'admin' ? [novel_id] : [novel_id, req.user.id];
    const [novels] = await db.query(novelQuery, novelParams);
    if (novels.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tiểu thuyết hoặc bạn không có quyền truy cập' });
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
    return sendError(res, error);
  }
};

// [PUT] /api/chapters/:id - Cập nhật chương truyện
exports.updateChapter = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, status } = req.body;

    const chapterQuery = req.user.role === 'admin'
      ? 'SELECT c.id FROM chapters c WHERE c.id = ?'
      : 'SELECT c.id FROM chapters c JOIN novels n ON n.id = c.novel_id JOIN authors a ON a.id = n.author_id WHERE c.id = ? AND a.user_id = ?';
    const chapterParams = req.user.role === 'admin' ? [id] : [id, req.user.id];
    const [chapters] = await db.query(chapterQuery, chapterParams);
    if (chapters.length === 0) return res.status(404).json({ success: false, message: 'Không tìm thấy chương hoặc bạn không có quyền truy cập' });

    const updates = [];
    const params = [];
    requireEnum(status, 'status', ['draft', 'published']);
    if (title !== undefined) { updates.push('title = ?'); params.push(title); }
    if (content !== undefined) {
      updates.push('content = ?');
      params.push(content);
      updates.push('word_count = ?');
      params.push(content.trim().split(/\s+/).length);
    }
    if (status !== undefined) { updates.push('status = ?'); params.push(status); }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'Không có dữ liệu cần cập nhật' });
    }

    params.push(id);
    await db.query(`UPDATE chapters SET ${updates.join(', ')} WHERE id = ?`, params);

    res.status(200).json({ success: true, message: 'Cập nhật chương thành công' });
  } catch (error) {
    return sendError(res, error);
  }
};

// [DELETE] /api/chapters/:id - Xóa chương truyện
exports.deleteChapter = async (req, res) => {
  try {
    const { id } = req.params;
    const chapterQuery = req.user.role === 'admin'
      ? 'SELECT id FROM chapters WHERE id = ?'
      : 'SELECT c.id FROM chapters c JOIN novels n ON n.id = c.novel_id JOIN authors a ON a.id = n.author_id WHERE c.id = ? AND a.user_id = ?';
    const chapterParams = req.user.role === 'admin' ? [id] : [id, req.user.id];
    const [existing] = await db.query(chapterQuery, chapterParams);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'Không tìm thấy chương' });
    await db.query('DELETE FROM chapters WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: `Đã xóa chương ID = ${id} thành công` });
  } catch (error) {
    return sendError(res, error);
  }
};
