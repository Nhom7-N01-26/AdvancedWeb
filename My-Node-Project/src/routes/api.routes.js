/**
 * api.routes.js
 * Định tuyến toàn bộ API CRUD cho hệ thống Novel Manager (Nhóm 7)
 */

const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const novelController = require('../controllers/novel.controller');
const categoryController = require('../controllers/category.controller');
const authorController = require('../controllers/author.controller');
const chapterController = require('../controllers/chapter.controller');
const tagController = require('../controllers/tag.controller');
const authController = require('../controllers/auth.controller');
const { requireAuth, authorize } = require('../middleware/auth.middleware');

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', requireAuth, authController.me);

// ==============================
// 1. USERS CRUD ROUTES
// ==============================
router.get('/users', requireAuth, authorize('admin'), userController.getAllUsers);
router.get('/users/:id', requireAuth, userController.getUserById);
router.post('/users', requireAuth, authorize('admin'), userController.createUser);
router.put('/users/:id', requireAuth, userController.updateUser);
router.delete('/users/:id', requireAuth, authorize('admin'), userController.deleteUser);

// ==============================
// 2. NOVELS CRUD ROUTES
// ==============================
router.get('/novels', novelController.getAllNovels);
router.get('/novels/:id', novelController.getNovelById);
router.post('/novels', requireAuth, authorize('admin', 'author'), novelController.createNovel);
router.put('/novels/:id', requireAuth, authorize('admin', 'author'), novelController.updateNovel);
router.delete('/novels/:id', requireAuth, authorize('admin', 'author'), novelController.deleteNovel);

// ==============================
// 3. CATEGORIES CRUD ROUTES
// ==============================
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.post('/categories', requireAuth, authorize('admin'), categoryController.createCategory);
router.put('/categories/:id', requireAuth, authorize('admin'), categoryController.updateCategory);
router.delete('/categories/:id', requireAuth, authorize('admin'), categoryController.deleteCategory);

// ==============================
// 4. AUTHORS CRUD ROUTES
// ==============================
router.get('/authors', authorController.getAllAuthors);
router.get('/authors/:id', authorController.getAuthorById);
router.post('/authors', requireAuth, authorize('admin'), authorController.createAuthor);
router.put('/authors/:id', requireAuth, authorize('admin'), authorController.updateAuthor);
router.delete('/authors/:id', requireAuth, authorize('admin'), authorController.deleteAuthor);

// ==============================
// 5. CHAPTERS CRUD ROUTES
// ==============================
router.get('/chapters', chapterController.getChaptersByNovel);
router.get('/chapters/:id', chapterController.getChapterById);
router.post('/chapters', requireAuth, authorize('admin', 'author'), chapterController.createChapter);
router.put('/chapters/:id', requireAuth, authorize('admin', 'author'), chapterController.updateChapter);
router.delete('/chapters/:id', requireAuth, authorize('admin', 'author'), chapterController.deleteChapter);

// ==============================
// 6. TAGS CRUD ROUTES
// ==============================
router.get('/tags', tagController.getAllTags);
router.get('/tags/:id', tagController.getTagById);
router.post('/tags', requireAuth, authorize('admin'), tagController.createTag);
router.put('/tags/:id', requireAuth, authorize('admin'), tagController.updateTag);
router.delete('/tags/:id', requireAuth, authorize('admin'), tagController.deleteTag);

module.exports = router;
