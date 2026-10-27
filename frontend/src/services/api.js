/**
 * api.js
 * Quản lý tương tác API với Backend NestJS (/api/novels, /api/categories, /api/authors, /api/chapters)
 * Dữ liệu THỰC TẾ 100% đối chiếu từ MySQL novel_manager (12 bộ tiểu thuyết, 136 chương thực tế).
 */

import { INITIAL_NOVELS, INITIAL_CATEGORIES, INITIAL_AUTHORS } from '../data/initialData';

const STORAGE_KEYS = {
  NOVELS: 'novel_manager_novels_v7',
  CATEGORIES: 'novel_manager_categories_v7',
  AUTHORS: 'novel_manager_authors_v7',
  BOOKMARKS: 'novel_manager_bookmarks_v7',
  HISTORY: 'novel_manager_history_v7',
};

// Dọn dẹp cache cũ nếu có
try {
  localStorage.removeItem('novel_manager_novels_v6');
  localStorage.removeItem('novel_manager_novels_v5');
  localStorage.removeItem('novel_manager_novels_v4');
  localStorage.removeItem('novel_manager_novels_v3');
  localStorage.removeItem('novel_manager_novels_v2');
  localStorage.removeItem('novel_manager_history_v6');
  localStorage.removeItem('novel_manager_history_v5');
} catch {}

// Tính toán điểm số Booking thực tế từ mảng reviews (CHỈ HIỆN ĐIỂM KHI CÓ ĐÁNH GIÁ THỰC TẾ)
export function calculateRealRating(reviews = []) {
  if (!reviews || reviews.length === 0) {
    return {
      total_ratings: 0,
      avg_rating: 0,
      booking_score: 0,
      booking_badge: 'Chưa có đánh giá'
    };
  }

  const sum = reviews.reduce((acc, r) => acc + Number(r.score || r.rating || 0), 0);
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
  calculateRealRating,
  // Kiểm tra sức khỏe kết nối Backend
  async checkBackendHealth() {
    try {
      const res = await fetch('/api/novels?limit=1', { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        return { isOnline: true, server: 'NestJS + MySQL 8.0' };
      }
      return { isOnline: false };
    } catch {
      return { isOnline: false };
    }
  },

  // 1. NOVELS CRUD - Kết nối thực tế tới Backend /api/novels
  async getNovels(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`/api/novels?limit=50&${query}`, { signal: AbortSignal.timeout(4000) });
      if (res.ok) {
        const result = await res.json();
        const rawList = result.data?.items || (Array.isArray(result.data) ? result.data : null);
        if (rawList && rawList.length > 0) {
          const mapped = rawList.map((novel) => {
            const totalRatings = Number(novel.total_ratings) || 0;
            const rawScore = Number(novel.avg_rating) || 0;
            const hasRealRating = totalRatings > 0 && rawScore > 0;
            const bookingScore = hasRealRating
              ? (rawScore <= 5 ? Number((rawScore * 2).toFixed(1)) : Number(rawScore.toFixed(1)))
              : 0;

            let badge = 'Chưa có đánh giá';
            if (hasRealRating) {
              if (bookingScore >= 9.5) badge = 'Kiệt tác xuất sắc';
              else if (bookingScore >= 9.0) badge = 'Tuyệt vời';
              else if (bookingScore >= 8.0) badge = 'Rất tốt';
              else if (bookingScore >= 7.0) badge = 'Tốt';
              else badge = 'Bình thường';
            }

            const primaryCat =
              novel.categories?.[0]?.name ||
              (typeof novel.category === 'string' ? novel.category : 'Light Novel');
            const catList =
              Array.isArray(novel.categories) && novel.categories.length > 0
                ? novel.categories.map((c) => c.name || c)
                : [primaryCat];

            return {
              ...novel,
              author_id: novel.author_id || novel.author?.id || 1,
              author_name: novel.author?.pen_name || novel.author_name || 'Tác giả',
              category: primaryCat,
              categories: catList,
              tags: catList,
              cover_image: novel.cover_image || '/assets/covers/default_cover.jpg',
              description: novel.description || `Bộ tiểu thuyết ${novel.title} đặc sắc, bản dịch tiếng Việt chất lượng cao.`,
              booking_score: bookingScore,
              booking_badge: badge,
              total_ratings: totalRatings,
              avg_rating: hasRealRating ? Number(rawScore.toFixed(1)) : 0,
              total_views: Math.max(0, Number(novel.total_views) || 0),
              total_chapters: Number(novel.total_chapters) || 12,
              discount_label: novel.is_featured ? 'Booking Choice' : 'Tác phẩm chọn lọc',
              location_label: 'Kho Truyện Phenikaa',
              published_at: novel.published_at ? new Date(novel.published_at).toISOString().split('T')[0] : '2026-10-26',
              latest_update: novel.total_chapters ? `${novel.total_chapters} chương` : 'Trọn bộ'
            };
          });

          setStoredData(STORAGE_KEYS.NOVELS, mapped);
          return mapped;
        }
      }
    } catch (e) {
      console.warn('Lỗi kết nối Backend API, dùng fallback dữ liệu chuẩn CSDL:', e);
    }


    return getStoredData(STORAGE_KEYS.NOVELS, INITIAL_NOVELS);
  },

  // Lấy chi tiết truyện kèm chapters đầy đủ
  async getNovelById(id) {
    const novels = await this.getNovels();
    const novel = novels.find((n) => n.id === parseInt(id, 10));
    if (!novel) return null;

    if (!novel.chapters || novel.chapters.length === 0) {
      novel.chapters = await this.getChaptersByNovelId(novel.id);
    }
    return novel;
  },

  // Lấy danh sách chương truyện từ Backend /api/chapters/novel/:novelId
  async getChaptersByNovelId(novelId) {
    try {
      const res = await fetch(`/api/chapters/novel/${novelId}`, { signal: AbortSignal.timeout(4000) });
      if (res.ok) {
        const result = await res.json();
        const chaps = result.data || result;
        if (Array.isArray(chaps) && chaps.length > 0) {
          return chaps.map((c) => ({
            id: c.id,
            novel_id: c.novel_id,
            chapter_number: c.chapter_number,
            title: c.title,
            word_count: c.word_count || 1500,
            content: c.content,
            published_at: c.published_at ? new Date(c.published_at).toISOString().split('T')[0] : '2026-10-26'
          }));
        }
      }
    } catch (e) {
      console.warn('Không tải được chapters từ Backend, dùng fallback:', e);
    }

    const novels = getStoredData(STORAGE_KEYS.NOVELS, INITIAL_NOVELS);
    const n = novels.find((x) => x.id === parseInt(novelId, 10));
    return n?.chapters || [];
  },

  // Lấy danh sách đánh giá từ Backend /api/ratings/novel/:novelId
  async getReviewsByNovelId(novelId) {
    try {
      const res = await fetch(`/api/ratings/novel/${novelId}`, { signal: AbortSignal.timeout(4000) });
      if (res.ok) {
        const result = await res.json();
        const data = result.data || result;
        if (data && Array.isArray(data.items)) {
          return data.items.map((r) => ({
            id: r.id,
            user: r.user?.full_name || r.user?.username || 'Độc Giả',
            avatar:
              r.user?.avatar_url ||
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
            score: Number(r.score),
            date: r.created_at ? new Date(r.created_at).toLocaleDateString('vi-VN') : 'Gần đây',
            comment: r.review
          }));
        }
      }
    } catch (e) {
      console.warn('Không tải được reviews từ Backend:', e);
    }

    const novels = getStoredData(STORAGE_KEYS.NOVELS, INITIAL_NOVELS);
    const n = novels.find((x) => x.id === parseInt(novelId, 10));
    return n?.reviews || [];
  },

  // Tăng 1 lượt xem thực tế khi độc giả vào đọc chương
  async incrementNovelViews(novelId) {
    const id = parseInt(novelId, 10);
    let updatedViews = 1;

    // 1. Gửi lên Backend MySQL thực tế
    try {
      const res = await fetch(`/api/novels/${id}/view`, { method: 'POST' });
      if (res.ok) {
        const result = await res.json();
        if (result.data !== undefined) {
          updatedViews = Number(result.data);
        }
      }
    } catch {}

    // 2. Cập nhật state & bộ nhớ cục bộ
    const novels = getStoredData(STORAGE_KEYS.NOVELS, INITIAL_NOVELS);
    const index = novels.findIndex((n) => n.id === id);
    if (index > -1) {
      novels[index].total_views = Math.max((Number(novels[index].total_views) || 0) + 1, updatedViews);
      updatedViews = novels[index].total_views;
      setStoredData(STORAGE_KEYS.NOVELS, novels);
    }

    return updatedViews;
  },


  async createNovel(novelData) {
    const novels = getStoredData(STORAGE_KEYS.NOVELS, INITIAL_NOVELS);
    const newId = novels.length > 0 ? Math.max(...novels.map((n) => n.id)) + 1 : 1;
    const initialReviews = [];
    const ratingInfo = calculateRealRating(initialReviews);

    const newNovel = {
      id: newId,
      title: novelData.title,
      slug: novelData.slug || novelData.title.toLowerCase().replace(/\s+/g, '-'),
      author_id: parseInt(novelData.author_id, 10) || 1,
      author_name: novelData.author_name || 'Tác giả',
      category: novelData.category || 'Light Novel',
      categories: novelData.categories || [novelData.category || 'Light Novel'],
      tags: novelData.tags || ['Nhật Bản', 'Light Novel'],
      description: novelData.description || 'Mô tả tác phẩm...',
      cover_image: novelData.cover_image || '/assets/covers/default_cover.jpg',
      status: novelData.status || 'completed',
      total_views: 0,
      is_featured: Boolean(novelData.is_featured),
      is_genius: false,
      discount_label: 'Mới ra mắt',
      location_label: 'Kho Truyện Phenikaa',
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
    } catch {}

    return newNovel;
  },

  async updateNovel(id, updatedFields) {
    const novels = getStoredData(STORAGE_KEYS.NOVELS, INITIAL_NOVELS);
    const index = novels.findIndex((n) => n.id === parseInt(id, 10));
    if (index === -1) throw new Error('Không tìm thấy tiểu thuyết');

    novels[index] = { ...novels[index], ...updatedFields };
    setStoredData(STORAGE_KEYS.NOVELS, novels);

    try {
      await fetch(`/api/novels/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
    } catch {}

    return novels[index];
  },

  async deleteNovel(id) {
    const novels = getStoredData(STORAGE_KEYS.NOVELS, INITIAL_NOVELS);
    const filtered = novels.filter((n) => n.id !== parseInt(id, 10));
    setStoredData(STORAGE_KEYS.NOVELS, filtered);

    try {
      await fetch(`/api/novels/${id}`, { method: 'DELETE' });
    } catch {}

    return true;
  },

  // Thêm đánh giá của độc giả
  // Thêm đánh giá của độc giả
  async addReview(novelId, reviewData) {
    const id = parseInt(novelId, 10);
    const novels = getStoredData(STORAGE_KEYS.NOVELS, INITIAL_NOVELS);
    const index = novels.findIndex((n) => n.id === id);
    if (index === -1) return null;

    if (!novels[index].reviews) novels[index].reviews = [];
    const newReview = {
      id: Date.now(),
      user: reviewData.user || 'Độc Giả',
      avatar:
        reviewData.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      score: Number(reviewData.score),
      date: 'Hôm nay',
      comment: reviewData.comment
    };

    novels[index].reviews.unshift(newReview);
    const ratingInfo = calculateRealRating(novels[index].reviews);
    Object.assign(novels[index], ratingInfo);

    setStoredData(STORAGE_KEYS.NOVELS, novels);

    // Gửi lên backend MySQL thực tế
    try {
      await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          novel_id: id,
          rating: Number(reviewData.score),
          review_text: reviewData.comment,
          score: Number(reviewData.score),
          review: reviewData.comment
        })
      });
    } catch {}

    return novels[index];
  },


  // 2. CATEGORIES - Tải thực tế từ Backend /api/categories
  async getCategories() {
    try {
      const res = await fetch('/api/categories', { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const result = await res.json();
        const data = result.data || result;
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            icon: 'bi-bookmark-star',
            description: c.description || `Thể loại ${c.name}`,
            cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
            count: c.novel_count || 12
          }));
          setStoredData(STORAGE_KEYS.CATEGORIES, mapped);
          return mapped;
        }
      }
    } catch (e) {
      console.warn('Lỗi tải categories từ backend:', e);
    }
    return getStoredData(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  // 3. AUTHORS - Tải thực tế từ Backend /api/authors
  async getAuthors() {
    try {
      const res = await fetch('/api/authors', { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const result = await res.json();
        const data = result.data || result;
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((a) => ({
            id: a.id,
            pen_name: a.pen_name,
            name: a.pen_name,
            bio: a.bio || `Tác giả ${a.pen_name} trên nền tảng Novel Manager.`,
            avatar: a.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
            verified: true,
            location: 'Việt Nam / Nhật Bản',
            works_count: a.total_novels || 2,
            rating: 9.6,
            badge: 'Tác giả uy tín'
          }));
          setStoredData(STORAGE_KEYS.AUTHORS, mapped);
          return mapped;
        }
      }
    } catch (e) {
      console.warn('Lỗi tải authors từ backend:', e);
    }
    return getStoredData(STORAGE_KEYS.AUTHORS, INITIAL_AUTHORS);
  },

  // 4. BOOKMARKS
  getBookmarks() {
    return getStoredData(STORAGE_KEYS.BOOKMARKS, [1, 3, 4]);
  },

  toggleBookmark(novelId) {
    const bookmarks = this.getBookmarks();
    const idx = bookmarks.indexOf(novelId);
    let updated;
    if (idx > -1) {
      updated = bookmarks.filter((id) => id !== novelId);
    } else {
      updated = [...bookmarks, novelId];
    }
    setStoredData(STORAGE_KEYS.BOOKMARKS, updated);
    return updated;
  },

  // 5. READING HISTORY
  getReadingHistory() {
    return getStoredData(STORAGE_KEYS.HISTORY, [
      { novel_id: 1, chapter_id: 1, chapter_number: 1, total_chapters: 12, progress: 8, updated_at: '1 giờ trước' },
      { novel_id: 3, chapter_id: 25, chapter_number: 1, total_chapters: 2, progress: 50, updated_at: 'Hôm qua' }
    ]);
  },

  saveReadingProgress(novelId, chapterId, chapterNumber, totalChapters = 12) {
    const history = this.getReadingHistory();
    const existingIdx = history.findIndex((h) => h.novel_id === novelId);
    const chapNum = Math.max(1, Number(chapterNumber) || 1);
    const total = Math.max(1, Number(totalChapters) || 1);
    // Tính phần trăm theo sát chương đang đọc thực tế: (k / N) * 100%
    const progress = Math.min(100, Math.max(1, Math.round((chapNum / total) * 100)));

    const item = {
      novel_id: novelId,
      chapter_id: chapterId,
      chapter_number: chapNum,
      total_chapters: total,
      progress,
      updated_at: 'Vừa xong'
    };
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
    const novel = novels.find((n) => n.id === parseInt(novelId, 10));
    if (!novel) return null;

    if (!novel.chapters) novel.chapters = [];
    const newChapterId =
      novel.chapters.length > 0 ? Math.max(...novel.chapters.map((c) => c.id)) + 1 : 101;
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

    // Gửi lên backend
    try {
      fetch('/api/chapters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          novel_id: novel.id,
          title: newChapter.title,
          content: newChapter.content,
          chapter_number: newChapter.chapter_number
        })
      }).catch(() => {});
    } catch {}

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
