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

// ==============================
// 1. USERS CRUD ROUTES
// ==============================
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// ==============================
// 2. NOVELS CRUD ROUTES
// ==============================
router.get('/novels', novelController.getAllNovels);
router.get('/novels/:id', novelController.getNovelById);
router.post('/novels', novelController.createNovel);
router.put('/novels/:id', novelController.updateNovel);
router.delete('/novels/:id', novelController.deleteNovel);

// ==============================
// 3. CATEGORIES CRUD ROUTES
// ==============================
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.post('/categories', categoryController.createCategory);
router.put('/categories/:id', categoryController.updateCategory);
router.delete('/categories/:id', categoryController.deleteCategory);

// ==============================
// 4. AUTHORS CRUD ROUTES
// ==============================
router.get('/authors', authorController.getAllAuthors);
router.get('/authors/:id', authorController.getAuthorById);
router.post('/authors', authorController.createAuthor);
router.put('/authors/:id', authorController.updateAuthor);
router.delete('/authors/:id', authorController.deleteAuthor);

// ==============================
// 5. CHAPTERS CRUD ROUTES
// ==============================
router.get('/chapters', chapterController.getChaptersByNovel);
router.get('/chapters/:id', chapterController.getChapterById);
router.post('/chapters', chapterController.createChapter);
router.put('/chapters/:id', chapterController.updateChapter);
router.delete('/chapters/:id', chapterController.deleteChapter);

// ==============================
// 6. TAGS CRUD ROUTES
// ==============================
router.get('/tags', tagController.getAllTags);
router.get('/tags/:id', tagController.getTagById);
router.post('/tags', tagController.createTag);
router.put('/tags/:id', tagController.updateTag);
router.delete('/tags/:id', tagController.deleteTag);

module.exports = router;
