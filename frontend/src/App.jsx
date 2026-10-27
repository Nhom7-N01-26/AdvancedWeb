import React, { useState, useEffect, useMemo } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import Header from './components/Header';
import HeroSearch from './components/HeroSearch';
import QuickFilters from './components/QuickFilters';
import CategorySection from './components/CategorySection';
import NovelList from './components/NovelList';
import PlannerTabs from './components/PlannerTabs';
import AuthorSection from './components/AuthorSection';
import NovelDetailModal from './components/NovelDetailModal';
import ReaderModal from './components/ReaderModal';
import CrudManagerModal from './components/CrudManagerModal';
import Footer from './components/Footer';

import { apiService } from './services/api';
import { INITIAL_USERS } from './data/initialData';

export default function App() {
  // Data state
  const [novels, setNovels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [readingHistory, setReadingHistory] = useState([]);
  const [currentUser, setCurrentUser] = useState(INITIAL_USERS[0]);
  const [backendStatus, setBackendStatus] = useState({ isOnline: false });

  // Navigation & Filter state
  const [activeNav, setActiveNav] = useState('novels');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isFeaturedOnly, setIsFeaturedOnly] = useState(false);
  const [isCompletedOnly, setIsCompletedOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);

  // Modals state
  const [detailNovel, setDetailNovel] = useState(null);
  const [readingSession, setReadingSession] = useState(null); // { novel, chapterId }
  const [showCrudModal, setShowCrudModal] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState({ show: false, message: '', variant: 'primary' });

  const showToast = (message, variant = 'primary') => {
    setToast({ show: true, message, variant });
  };

  // Khởi nạp dữ liệu ban đầu
  useEffect(() => {
    const initData = async () => {
      // 1. Kiểm tra backend
      const health = await apiService.checkBackendHealth();
      setBackendStatus(health);

      // 2. Tải danh mục & tác giả & tiểu thuyết (thực tế 100%)
      const cats = await apiService.getCategories();
      const auths = await apiService.getAuthors();
      const novs = await apiService.getNovels();
      const bmarks = apiService.getBookmarks();
      const hist = apiService.getReadingHistory();

      setCategories(cats);
      setAuthors(auths);
      setNovels(novs);
      setBookmarks(bmarks);
      setReadingHistory(hist);
    };

    initData();
  }, []);

  // Lọc tiểu thuyết theo các tiêu chí tìm kiếm
  const filteredNovels = useMemo(() => {
    return novels.filter((novel) => {
      // Tab tủ sách của tôi
      if (activeNav === 'bookmarks' && !bookmarks.includes(novel.id)) {
        return false;
      }

      // Tìm kiếm từ khóa
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const inTitle = novel.title.toLowerCase().includes(query);
        const inAuthor = novel.author_name.toLowerCase().includes(query);
        const inDesc = novel.description.toLowerCase().includes(query);
        const inTags = novel.tags && novel.tags.some((t) => t.toLowerCase().includes(query));
        if (!inTitle && !inAuthor && !inDesc && !inTags) return false;
      }

      // Thể loại
      if (selectedCategory !== 'all') {
        const matchCat =
          novel.category === selectedCategory ||
          (novel.categories && novel.categories.includes(selectedCategory));
        if (!matchCat) return false;
      }

      // Tình trạng
      if (selectedStatus !== 'all' && novel.status !== selectedStatus) {
        return false;
      }

      // Đã hoàn thành (Full)
      if (isCompletedOnly && novel.status !== 'completed') {
        return false;
      }

      // Đề cử (Featured)
      if (isFeaturedOnly && !novel.is_featured) {
        return false;
      }

      // Điểm đánh giá thực tế
      if (minRating > 0) {
        const score = novel.booking_score || 0;
        if (score < minRating) return false;
      }

      return true;
    });
  }, [
    novels,
    activeNav,
    bookmarks,
    searchQuery,
    selectedCategory,
    selectedStatus,
    isCompletedOnly,
    isFeaturedOnly,
    minRating
  ]);

  // Handlers
  const handleToggleBookmark = (novelId) => {
    const updated = apiService.toggleBookmark(novelId);
    setBookmarks(updated);
    const isAdded = updated.includes(novelId);
    showToast(
      isAdded ? 'Đã thêm tiểu thuyết vào Tủ sách của bạn ❤️' : 'Đã bỏ tiểu thuyết khỏi Tủ sách',
      isAdded ? 'danger' : 'secondary'
    );
  };

  // MỖI LẦN VÀO ĐỌC LÀ 1 LƯỢT XEM THỰC TẾ
  const handleReadNow = async (novel) => {
    let fullNovel = novel;
    if (!novel.chapters || novel.chapters.length === 0) {
      const chaps = await apiService.getChaptersByNovelId(novel.id);
      fullNovel = { ...novel, chapters: chaps };
    }
    const newViews = await apiService.incrementNovelViews(novel.id);
    const updatedNovel = { ...fullNovel, total_views: newViews };

    setNovels((prev) =>
      prev.map((n) => (n.id === novel.id ? updatedNovel : n))
    );

    const firstChapterId = updatedNovel.chapters?.[0]?.id || 1;
    setReadingSession({ novel: updatedNovel, chapterId: firstChapterId });
    apiService.saveReadingProgress(novel.id, firstChapterId, 1, 10);
    setReadingHistory(apiService.getReadingHistory());
    showToast(`Đang mở đọc "${novel.title}"`, 'info');
  };

  const handleReadChapter = async (novel, chapterId) => {
    let fullNovel = novel;
    if (!novel.chapters || novel.chapters.length === 0) {
      const chaps = await apiService.getChaptersByNovelId(novel.id);
      fullNovel = { ...novel, chapters: chaps };
    }
    const newViews = await apiService.incrementNovelViews(novel.id);
    const updatedNovel = { ...fullNovel, total_views: newViews };

    setNovels((prev) =>
      prev.map((n) => (n.id === novel.id ? updatedNovel : n))
    );
    if (detailNovel && detailNovel.id === novel.id) {
      setDetailNovel(updatedNovel);
    }

    setReadingSession({ novel: updatedNovel, chapterId });
    const chapterObj = updatedNovel.chapters?.find((c) => c.id === chapterId);
    apiService.saveReadingProgress(novel.id, chapterId, chapterObj?.chapter_number || 1, 100);
    setReadingHistory(apiService.getReadingHistory());
    showToast(`Đang đọc Chương ${chapterObj?.chapter_number || 1}`, 'info');
  };

  const handleViewDetail = async (novel) => {
    let fullNovel = novel;
    if (!novel.chapters || novel.chapters.length === 0) {
      const chaps = await apiService.getChaptersByNovelId(novel.id);
      fullNovel = { ...novel, chapters: chaps };
    }
    setDetailNovel(fullNovel);
  };

  const handleChapterChange = (newChapterId) => {
    if (readingSession) {
      setReadingSession({ ...readingSession, chapterId: newChapterId });
      const ch = readingSession.novel.chapters?.find((c) => c.id === newChapterId);
      apiService.saveReadingProgress(
        readingSession.novel.id,
        newChapterId,
        ch?.chapter_number || 1,
        100
      );
      setReadingHistory(apiService.getReadingHistory());
    }
  };

  // ĐÁNH GIÁ: Tính toán chuẩn từ review gửi lên
  const handleAddReview = (novelId, reviewData) => {
    const updatedNovel = apiService.addReview(novelId, reviewData);
    if (updatedNovel) {
      setNovels((prev) => prev.map((n) => (n.id === novelId ? updatedNovel : n)));
      if (detailNovel && detailNovel.id === novelId) {
        setDetailNovel(updatedNovel);
      }
      showToast('Cảm ơn bạn đã gửi đánh giá cho tác phẩm! ⭐', 'success');
    }
  };

  // CRUD Handlers
  const handleCreateNovel = async (newNovelData) => {
    const created = await apiService.createNovel(newNovelData);
    setNovels((prev) => [created, ...prev]);
    showToast(`Đã thêm tiểu thuyết "${created.title}" thành công!`, 'success');
  };

  const handleUpdateNovel = async (id, updatedData) => {
    const updated = await apiService.updateNovel(id, updatedData);
    setNovels((prev) => prev.map((n) => (n.id === id ? updated : n)));
    if (detailNovel && detailNovel.id === id) {
      setDetailNovel(updated);
    }
    showToast(`Đã cập nhật tiểu thuyết "${updated.title}"!`, 'info');
  };

  const handleDeleteNovel = async (id) => {
    await apiService.deleteNovel(id);
    setNovels((prev) => prev.filter((n) => n.id !== id));
    if (detailNovel && detailNovel.id === id) {
      setDetailNovel(null);
    }
    showToast('Đã xóa tiểu thuyết khỏi hệ thống!', 'warning');
  };

  const handleAddChapter = async (novelId, chapterData) => {
    const newChapter = apiService.addChapter(novelId, chapterData);
    if (newChapter) {
      const refreshedNovels = await apiService.getNovels();
      setNovels(refreshedNovels);
      if (detailNovel && detailNovel.id === novelId) {
        const updatedTarget = refreshedNovels.find((n) => n.id === novelId);
        if (updatedTarget) setDetailNovel(updatedTarget);
      }
      showToast(`Đã thêm ${chapterData.title} thành công!`, 'success');
    }
  };

  const handleResetData = () => {
    apiService.resetDefaultData();
    window.location.reload();
  };

  // Điều hướng khi bấm các tab trên Header
  const handleNavSelect = (navKey) => {
    setActiveNav(navKey);

    if (navKey === 'novels') {
      setSelectedCategory('all');
      setSelectedStatus('all');
      setIsFeaturedOnly(false);
      setIsCompletedOnly(false);
      setMinRating(0);
      setSearchQuery('');
      setTimeout(() => {
        const el = document.getElementById('novel-list-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      showToast('Hiển thị tất cả tiểu thuyết', 'info');
    } else if (navKey === 'categories') {
      setTimeout(() => {
        const el = document.getElementById('categories-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      showToast('Khám phá danh mục Thể loại truyện', 'info');
    } else if (navKey === 'rankings') {
      setTimeout(() => {
        const el = document.getElementById('novel-list-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      showToast('🏆 Bảng xếp hạng tiểu thuyết Hot nhất', 'warning');
    } else if (navKey === 'authors') {
      setTimeout(() => {
        const el = document.getElementById('authors-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      showToast('Khám phá danh sách Tác giả nổi tiếng', 'info');
    } else if (navKey === 'bookmarks') {
      setTimeout(() => {
        const el = document.getElementById('novel-list-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      if (bookmarks.length > 0) {
        showToast(`Tủ sách của bạn (${bookmarks.length} tác phẩm đã lưu)`, 'info');
      } else {
        showToast('Tủ sách của bạn hiện đang trống', 'secondary');
      }
    } else if (navKey === 'crud') {
      setShowCrudModal(true);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setIsFeaturedOnly(false);
    setIsCompletedOnly(false);
    setMinRating(0);
    setActiveNav('novels');
    setTimeout(() => {
      const el = document.getElementById('novel-list-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* 1. Header (Booking topbar + navigation pills + user switcher) */}
      <Header
        activeNav={activeNav}
        setActiveNav={handleNavSelect}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        bookmarkCount={bookmarks.length}
        onOpenCrud={() => setShowCrudModal(true)}
        onOpenCreateNovel={() => setShowCrudModal(true)}
        backendStatus={backendStatus}
      />

      {/* 2. Hero Section + Iconic Yellow Floating Search Bar */}
      <HeroSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        isFeaturedOnly={isFeaturedOnly}
        setIsFeaturedOnly={setIsFeaturedOnly}
        isCompletedOnly={isCompletedOnly}
        setIsCompletedOnly={setIsCompletedOnly}
        categories={categories}
        onSearchSubmit={() => {
          const el = document.getElementById('novel-list-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 3. Genius Loyalty Banner + Recent Reading Bar */}
      <QuickFilters
        readingHistory={readingHistory}
        novels={novels}
        onOpenReader={(novel, chapterId) => handleReadChapter(novel, chapterId)}
        onQuickCategorySelect={(cat) => {
          setSelectedCategory(cat);
          const el = document.getElementById('novel-list-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 4. Browse by Property Type equivalent: Category Section */}
      <CategorySection
        categories={categories}
        novels={novels}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          const el = document.getElementById('novel-list-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 5. Main Novel Results List + Filter Sidebar */}
      <NovelList
        novels={filteredNovels}
        allNovels={novels}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        isFeaturedOnly={isFeaturedOnly}
        setIsFeaturedOnly={setIsFeaturedOnly}
        isCompletedOnly={isCompletedOnly}
        setIsCompletedOnly={setIsCompletedOnly}
        minRating={minRating}
        setMinRating={setMinRating}
        bookmarks={bookmarks}
        activeNav={activeNav}
        setActiveNav={handleNavSelect}
        onToggleBookmark={handleToggleBookmark}
        onViewDetail={handleViewDetail}
        onReadNow={handleReadNow}
        onResetFilters={handleResetFilters}
      />

      {/* 6. Quick Trip Planner equivalent: Planner Tabs */}
      <PlannerTabs
        novels={novels}
        onViewDetail={handleViewDetail}
        onReadNow={handleReadNow}
      />

      {/* 7. Featured Authors Section (Số tác phẩm & lượt xem thực tế) */}
      <AuthorSection
        authors={authors}
        novels={novels}
        onSelectAuthor={(authorName) => {
          setSearchQuery(authorName);
          const el = document.getElementById('novel-list-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 8. Booking.com Footer with Group 7 Credentials */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        onSelectAuthor={(authorName) => {
          setSearchQuery(authorName);
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        onOpenCreateNovel={() => setShowCrudModal(true)}
      />

      {/* MODAL 1: Novel Detail Modal (Số liệu thực tế, bình luận thực tế) */}
      <NovelDetailModal
        show={Boolean(detailNovel)}
        onHide={() => setDetailNovel(null)}
        novel={detailNovel}
        isBookmarked={detailNovel ? bookmarks.includes(detailNovel.id) : false}
        onToggleBookmark={handleToggleBookmark}
        onReadChapter={handleReadChapter}
        onAddReview={handleAddReview}
      />

      {/* MODAL 2: Full Chapter Reader (Mỗi lần đọc là 1 lượt xem) */}
      <ReaderModal
        show={Boolean(readingSession)}
        onHide={() => setReadingSession(null)}
        novel={readingSession?.novel}
        chapterId={readingSession?.chapterId}
        onChapterChange={handleChapterChange}
      />

      {/* MODAL 3: CRUD Management Panel */}
      <CrudManagerModal
        show={showCrudModal}
        onHide={() => setShowCrudModal(false)}
        novels={novels}
        categories={categories}
        authors={authors}
        onCreateNovel={handleCreateNovel}
        onUpdateNovel={handleUpdateNovel}
        onDeleteNovel={handleDeleteNovel}
        onAddChapter={handleAddChapter}
        onResetData={handleResetData}
        backendStatus={backendStatus}
      />

      {/* Global Toast Notification */}
      <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 9999 }}>
        <Toast
          show={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
          delay={3500}
          autohide
          bg={toast.variant}
        >
          <Toast.Body className="text-white fw-medium d-flex align-items-center gap-2">
            <i className="bi bi-info-circle-fill"></i>
            <span>{toast.message}</span>
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}
