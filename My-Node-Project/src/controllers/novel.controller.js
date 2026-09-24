/**
 * novel.controller.js
 * Quản lý CRUD cho thực thể Novel (novels table)
 */

const db = require('../../dbconnection');
const { sendError, parsePagination, requireFields, requireEnum } = require('../utils/http');

// [GET] /api/novels - Lấy danh sách tiểu thuyết
exports.getAllNovels = async (req, res) => {
  try {
    const { status, author_id, search } = req.query;
    const { limit, offset } = parsePagination(req.query, { limit: 20, page: 1 });
    requireEnum(status, 'status', ['draft', 'ongoing', 'completed', 'hiatus']);

    let query = `
      SELECT n.id, n.title, n.slug, n.description, n.cover_image, n.status,
             n.avg_rating, n.total_views, n.total_bookmarks, n.total_chapters, n.total_ratings,
             n.is_featured, n.published_at, n.created_at,
             a.id AS author_id, a.pen_name
      FROM novels n
      JOIN authors a ON n.author_id = a.id
    `;
    const conditions = [];
    const params = [];

    if (status) {
      conditions.push('n.status = ?');
      params.push(status);
    }
    if (author_id) {
      conditions.push('n.author_id = ?');
      params.push(author_id);
    }
    if (search) {
      conditions.push('(n.title LIKE ? OR n.description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY n.id DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const [novels] = await db.query(query, params);

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách tiểu thuyết thành công',
      count: novels.length,
      data: novels
    });
  } catch (error) {
    return sendError(res, error);
  }
};

// [GET] /api/novels/:id - Lấy chi tiết tiểu thuyết kèm danh mục & tags
exports.getNovelById = async (req, res) => {
  try {
    const { id } = req.params;

    const [novels] = await db.query(`
      SELECT n.*, a.pen_name, a.bio as author_bio
      FROM novels n
      JOIN authors a ON n.author_id = a.id
      WHERE n.id = ?
    `, [id]);

    if (novels.length === 0) {
      return res.status(404).json({ success: false, message: `Không tìm thấy tiểu thuyết có ID = ${id}` });
    }

    const novel = novels[0];

    // Lấy danh mục
    const [categories] = await db.query(`
      SELECT c.id, c.name, c.slug
      FROM categories c
      JOIN novel_categories nc ON c.id = nc.category_id
      WHERE nc.novel_id = ?
    `, [id]);

    // Lấy tags
    const [tags] = await db.query(`
      SELECT t.id, t.name, t.slug
      FROM tags t
      JOIN novel_tags nt ON t.id = nt.tag_id
      WHERE nt.novel_id = ?
    `, [id]);

    // Lấy 5 chương mới nhất
    const [recentChapters] = await db.query(`
      SELECT id, chapter_number, title, published_at
      FROM chapters
      WHERE novel_id = ? AND status = 'published'
      ORDER BY chapter_number DESC LIMIT 5
    `, [id]);

    novel.categories = categories;
    novel.tags = tags;
    novel.recent_chapters = recentChapters;

    res.status(200).json({
      success: true,
      data: novel
    });
  } catch (error) {
    return sendError(res, error);
  }
};

// [POST] /api/novels - Tạo tiểu thuyết mới
exports.createNovel = async (req, res) => {
  let connection;
  try {
    const { author_id, title, slug, description, cover_image = null, status = 'draft', category_ids = [], tag_ids = [] } = req.body;
    requireFields(req.body, ['author_id', 'title', 'slug']);
    requireEnum(status, 'status', ['draft', 'ongoing', 'completed', 'hiatus']);
    if (!Array.isArray(category_ids) || !Array.isArray(tag_ids)) {
      return res.status(400).json({ success: false, message: 'category_ids và tag_ids phải là mảng' });
    }

    const authorQuery = req.user.role === 'admin'
      ? 'SELECT id FROM authors WHERE id = ?'
      : 'SELECT id FROM authors WHERE id = ? AND user_id = ?';
    const authorParams = req.user.role === 'admin' ? [author_id] : [author_id, req.user.id];
    const [authors] = await db.query(authorQuery, authorParams);
    if (authors.length === 0) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền sử dụng tác giả này' });
    }

    connection = await db.pool.getConnection();
    await connection.beginTransaction();
    const [result] = await connection.query(`
      INSERT INTO novels (author_id, title, slug, description, cover_image, status, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [author_id, title, slug, description, cover_image, status, status === 'ongoing' || status === 'completed' ? new Date() : null]);

    const novelId = result.insertId;

    // Gán danh mục nếu có
    if (Array.isArray(category_ids) && category_ids.length > 0) {
      for (const catId of category_ids) {
        await connection.query('INSERT INTO novel_categories (novel_id, category_id) VALUES (?, ?)', [novelId, catId]);
      }
    }

    // Gán tags nếu có
    if (Array.isArray(tag_ids) && tag_ids.length > 0) {
      for (const tagId of tag_ids) {
        await connection.query('INSERT INTO novel_tags (novel_id, tag_id) VALUES (?, ?)', [novelId, tagId]);
      }
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Tạo tiểu thuyết mới thành công',
      data: { id: novelId, title, slug, status }
    });
  } catch (error) {
    if (connection) await connection.rollback();
    return sendError(res, error);
  } finally {
    if (connection) connection.release();
  }
};

// [PUT] /api/novels/:id - Cập nhật tiểu thuyết
exports.updateNovel = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, description, cover_image, status, is_featured } = req.body;

    const existingQuery = req.user.role === 'admin'
      ? 'SELECT id FROM novels WHERE id = ?'
      : 'SELECT n.id FROM novels n JOIN authors a ON a.id = n.author_id WHERE n.id = ? AND a.user_id = ?';
    const existingParams = req.user.role === 'admin' ? [id] : [id, req.user.id];
    const [existing] = await db.query(existingQuery, existingParams);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tiểu thuyết hoặc bạn không có quyền truy cập' });
    }

    const updates = [];
    const params = [];

    if (title !== undefined) { updates.push('title = ?'); params.push(title); }
    if (slug !== undefined) { updates.push('slug = ?'); params.push(slug); }
    if (description !== undefined) { updates.push('description = ?'); params.push(description); }
    if (cover_image !== undefined) { updates.push('cover_image = ?'); params.push(cover_image); }
    requireEnum(status, 'status', ['draft', 'ongoing', 'completed', 'hiatus']);
    if (status !== undefined) { updates.push('status = ?'); params.push(status); }
    if (is_featured !== undefined) { updates.push('is_featured = ?'); params.push(is_featured); }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'Không có thông tin nào cần cập nhật' });
    }

    params.push(id);
    await db.query(`UPDATE novels SET ${updates.join(', ')} WHERE id = ?`, params);

    res.status(200).json({
      success: true,
      message: 'Cập nhật tiểu thuyết thành công',
      updated_id: id
    });
  } catch (error) {
    return sendError(res, error);
  }
};

// [DELETE] /api/novels/:id - Xóa tiểu thuyết
exports.deleteNovel = async (req, res) => {
  try {
    const { id } = req.params;

    const existingQuery = req.user.role === 'admin'
      ? 'SELECT id, title FROM novels WHERE id = ?'
      : 'SELECT n.id, n.title FROM novels n JOIN authors a ON a.id = n.author_id WHERE n.id = ? AND a.user_id = ?';
    const existingParams = req.user.role === 'admin' ? [id] : [id, req.user.id];
    const [existing] = await db.query(existingQuery, existingParams);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tiểu thuyết hoặc bạn không có quyền truy cập' });
    }

    await db.query('DELETE FROM novels WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: `Đã xóa tiểu thuyết '${existing[0].title}' (ID = ${id}) thành công`
    });
  } catch (error) {
    return sendError(res, error);
  }
};
