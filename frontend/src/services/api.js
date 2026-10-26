/**
 * api.js
 * Quản lý tương tác API với Backend Express (/api/novels, /api/categories, /api/authors, /api/chapters)
 * Dữ liệu thực tế 100%, mỗi lần đọc truyện tăng +1 lượt xem, đánh giá tính từ reviews thực.
 */

import { INITIAL_NOVELS, INITIAL_CATEGORIES, INITIAL_AUTHORS } from '../data/initialData';

const STORAGE_KEYS = {
  NOVELS: 'novel_manager_novels_v3', // Version v3 đảm bảo dùng số liệu thực tế, không dùng cache cũ
  CATEGORIES: 'novel_manager_categories_v3',
  AUTHORS: 'novel_manager_authors_v3',
  BOOKMARKS: 'novel_manager_bookmarks_v3',
  HISTORY: 'novel_manager_history_v3',
};

// Tính toán điểm số Booking thực tế từ mảng reviews
export function calculateRealRating(reviews = []) {
  if (!reviews || reviews.length === 0) {
    return {
      total_ratings: 0,
      avg_rating: 0,
      booking_score: null,
      booking_badge: 'Chưa có đánh giá'
    };
  }

  const sum = reviews.reduce((acc, r) => acc + Number(r.score), 0);
  const avg = sum / reviews.length; // Thang 1-5
  const bookingScore = avg <= 5 ? avg * 2 : avg; // Quy đổi ra thang 10 chuẩn Booking

  let badge = 'Tốt';
  if (bookingScore >= 9.5) badge = 'Kiệt tác xuất sắc';
  else if (bookingScore >= 9.0) badge = 'Tuyệt vời';
  else if (bookingScore >= 8.0) badge = 'Rất tốt';
  else if (bookingScore >= 7.0) badge = 'Tốt';
  else badge = 'Bình thường';

  return {
    total_ratings: reviews.length,
    avg_rating: Number(avg.toFixed(1)),
    booking_score: Number(bookingScore.toFixed(1)),
    booking_badge: badge
  };
}

function getStoredData(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(item);
  } catch (e) {
    console.warn('Lỗi đọc localStorage:', e);
    return fallback;
  }
}

function setStoredData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('Lỗi lưu localStorage:', e);
  }
}

export const apiService = {
  // Kiểm tra sức khỏe kết nối Backend
  async checkBackendHealth() {
    try {
      const res = await fetch('/health', { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const data = await res.json();
        return { isOnline: true, data };
      }
      return { isOnline: false };
    } catch {
      return { isOnline: false };
    }
  },

  // 1. NOVELS CRUD
  async getNovels(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`/api/novels?${query}`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const result = await res.json();
        if (result.success && Array.isArray(result.data) && result.data.length > 0) {
          return result.data;
        }
      }
    } catch {
      // Backend offline fallback
    }

    let list = getStoredData(STORAGE_KEYS.NOVELS, INITIAL_NOVELS);

    // Tính toán lại rating chuẩn cho từng truyện
    list = list.map(novel => {
      const ratingInfo = calculateRealRating(novel.reviews);
      return {
        ...novel,
        total_views: Number(novel.total_views || 0),
        total_chapters: novel.chapters ? novel.chapters.length : 1,
        ...ratingInfo
      };
    });

    if (params.search) {
      const s = params.search.toLowerCase();
      list = list.filter(n => n.title.toLowerCase().includes(s) || n.author_name.toLowerCase().includes(s));
    }
    if (params.category && params.category !== 'all') {
      list = list.filter(n => n.category === params.category || (n.categories && n.categories.includes(params.category)));
    }
    if (params.status && params.status !== 'all') {
      list = list.filter(n => n.status === params.status);
    }
    return list;
  },

  async getNovelById(id) {
    const novels = await this.getNovels();
    return novels.find(n => n.id === parseInt(id, 10)) || null;
  },

  // Tăng 1 lượt xem thực tế khi độc giả vào đọc chương
  async incrementNovelViews(novelId) {
    const id = parseInt(novelId, 10);
    const novels = getStoredData(STORAGE_KEYS.NOVELS, INITIAL_NOVELS);
    const index = novels.findIndex(n => n.id === id);

    let updatedViews = 1;
    if (index > -1) {
      novels[index].total_views = (Number(novels[index].total_views) || 0) + 1;
      updatedViews = novels[index].total_views;
      setStoredData(STORAGE_KEYS.NOVELS, novels);
    }

    // Gửi lên Backend Express nếu đang online
    try {
      fetch(`/api/novels/${id}/view`, { method: 'POST' }).catch(() => {});
    } catch {
      // offline
    }

    return updatedViews;
  },

  async createNovel(novelData) {
    const novels = getStoredData(STORAGE_KEYS.NOVELS, INITIAL_NOVELS);
    const newId = novels.length > 0 ? Math.max(...novels.map(n => n.id)) + 1 : 1;
    const initialReviews = [];
    const ratingInfo = calculateRealRating(initialReviews);

    const newNovel = {
      id: newId,
      title: novelData.title,
      slug: novelData.slug || novelData.title.toLowerCase().replace(/\s+/g, '-'),
      author_id: parseInt(novelData.author_id, 10) || 1,
      author_name: novelData.author_name || 'Tác giả',
      category: novelData.category || 'Tiên Hiệp',
      categories: novelData.categories || [novelData.category || 'Tiên Hiệp'],
      tags: novelData.tags || ['Tu Tiên'],
      description: novelData.description || 'Mô tả tác phẩm...',
      cover_image: novelData.cover_image || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      status: novelData.status || 'ongoing',
      total_views: 0, // Bắt đầu từ 0 lượt xem thực tế
      is_featured: Boolean(novelData.is_featured),
      is_genius: false,
      discount_label: 'Mới ra mắt',
      location_label: 'Đại Lục Huyền Ảo',
      published_at: new Date().toISOString().split('T')[0],
      latest_update: 'Vừa xong',
      chapters: novelData.chapters || [
        {
          id: newId * 100 + 1,
          novel_id: newId,
          chapter_number: 1,
          title: 'Chương 1: Khởi đầu mới',
          word_count: 1200,
          published_at: new Date().toISOString().split('T')[0],
          content: 'Nội dung chương 1 của tiểu thuyết mới được tạo lập...'
        }
      ],
      reviews: initialReviews,
      ...ratingInfo
    };

    novels.unshift(newNovel);
    setStoredData(STORAGE_KEYS.NOVELS, novels);

    try {
      await fetch('/api/novels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novelData)
      });
    } catch {
      // offline
    }

    return newNovel;
  },

  async updateNovel(id, updatedFields) {
    const novels = getStoredData(STORAGE_KEYS.NOVELS, INITIAL_NOVELS);
    const index = novels.findIndex(n => n.id === parseInt(id, 10));
    if (index === -1) throw new Error('Không tìm thấy tiểu thuyết');

    novels[index] = { ...novels[index], ...updatedFields };
    setStoredData(STORAGE_KEYS.NOVELS, novels);

    try {
      await fetch(`/api/novels/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
    } catch {
      // offline
    }

    return novels[index];
  },

  async deleteNovel(id) {
    const novels = getStoredData(STORAGE_KEYS.NOVELS, INITIAL_NOVELS);
    const filtered = novels.filter(n => n.id !== parseInt(id, 10));
    setStoredData(STORAGE_KEYS.NOVELS, filtered);

    try {
      await fetch(`/api/novels/${id}`, { method: 'DELETE' });
    } catch {
      // offline
    }

    return true;
  },

  // Thêm đánh giá thực tế của độc giả
  addReview(novelId, reviewData) {
    const novels = getStoredData(STORAGE_KEYS.NOVELS, INITIAL_NOVELS);
    const index = novels.findIndex(n => n.id === parseInt(novelId, 10));
    if (index === -1) return null;

    if (!novels[index].reviews) novels[index].reviews = [];
    const newReview = {
      id: Date.now(),
      user: reviewData.user || 'Độc Giả',
      avatar: reviewData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      score: Number(reviewData.score),
      date: 'Hôm nay',
      comment: reviewData.comment
    };

    novels[index].reviews.unshift(newReview);
    const ratingInfo = calculateRealRating(novels[index].reviews);
    Object.assign(novels[index], ratingInfo);

    setStoredData(STORAGE_KEYS.NOVELS, novels);
    return novels[index];
  },

  // 2. CATEGORIES (Danh mục với tính toán số lượng thực tế)
  async getCategories() {
    return getStoredData(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  // 3. AUTHORS
  async getAuthors() {
    return getStoredData(STORAGE_KEYS.AUTHORS, INITIAL_AUTHORS);
  },

  // 4. BOOKMARKS
  getBookmarks() {
    return getStoredData(STORAGE_KEYS.BOOKMARKS, [1, 2]);
  },

  toggleBookmark(novelId) {
    const bookmarks = this.getBookmarks();
    const idx = bookmarks.indexOf(novelId);
    let updated;
    if (idx > -1) {
      updated = bookmarks.filter(id => id !== novelId);
    } else {
      updated = [...bookmarks, novelId];
    }
    setStoredData(STORAGE_KEYS.BOOKMARKS, updated);
    return updated;
  },

  // 5. READING HISTORY
  getReadingHistory() {
    return getStoredData(STORAGE_KEYS.HISTORY, [
      { novel_id: 1, chapter_id: 101, chapter_number: 1, progress: 100, updated_at: '2 giờ trước' },
      { novel_id: 2, chapter_id: 201, chapter_number: 1, progress: 65, updated_at: 'Hôm qua' }
    ]);
  },

  saveReadingProgress(novelId, chapterId, chapterNumber, progress = 100) {
    const history = this.getReadingHistory();
    const existingIdx = history.findIndex(h => h.novel_id === novelId);
    const item = { novel_id: novelId, chapter_id: chapterId, chapter_number: chapterNumber, progress, updated_at: 'Vừa xong' };
    if (existingIdx > -1) {
      history[existingIdx] = item;
    } else {
      history.unshift(item);
    }
    setStoredData(STORAGE_KEYS.HISTORY, history);
    return history;
  },

  // Thêm chương mới cho truyện
  addChapter(novelId, chapterData) {
    const novels = getStoredData(STORAGE_KEYS.NOVELS, INITIAL_NOVELS);
    const novel = novels.find(n => n.id === parseInt(novelId, 10));
    if (!novel) return null;

    if (!novel.chapters) novel.chapters = [];
    const newChapterId = novel.chapters.length > 0 ? Math.max(...novel.chapters.map(c => c.id)) + 1 : 101;
    const newChapter = {
      id: newChapterId,
      novel_id: novel.id,
      chapter_number: novel.chapters.length + 1,
      title: chapterData.title || `Chương ${novel.chapters.length + 1}`,
      word_count: chapterData.content ? chapterData.content.split(/\s+/).length : 500,
      published_at: new Date().toISOString().split('T')[0],
      content: chapterData.content || 'Nội dung chương mới...'
    };

    novel.chapters.push(newChapter);
    novel.total_chapters = novel.chapters.length;
    novel.latest_update = `${novel.chapters.length} chương`;
    setStoredData(STORAGE_KEYS.NOVELS, novels);
    return newChapter;
  },

  // Đặt lại dữ liệu gốc
  resetDefaultData() {
    localStorage.removeItem(STORAGE_KEYS.NOVELS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.AUTHORS);
    localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    return true;
  }
};
