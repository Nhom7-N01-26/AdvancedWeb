import React, { useState, useEffect, useMemo } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import Header from './components/Header';
import HeroSearch from './components/HeroSearch';
import QuickFilters from './components/QuickFilters';
import CategorySection from './components/CategorySection';
import NovelList from './components/NovelList';
import AuthorSection from './components/AuthorSection';
import NovelDetailModal from './components/NovelDetailModal';
import ReaderModal from './components/ReaderModal';
import CrudManagerModal from './components/CrudManagerModal';
import CreateNovelModal from './components/CreateNovelModal';
import AuthModal from './components/AuthModal';
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
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      // Ưu tiên lấy từ auth (đã đăng nhập)
      const authUser = localStorage.getItem('novel_manager_auth_user');
      if (authUser) {
        const parsed = JSON.parse(authUser);
        return {
          id: parsed.id,
          username: parsed.username,
          email: parsed.email,
          full_name: parsed.full_name,
          role: parsed.role || 'reader',
          avatar: parsed.avatar_url || parsed.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${parsed.username}`,
          badge: parsed.role === 'admin' ? 'Quản trị viên' : parsed.role === 'author' ? 'Tác giả' : 'Độc giả',
          isAuthenticated: true,
        };
      }
      const saved = localStorage.getItem('novel_manager_user_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null; // Chưa đăng nhập
  });
  const [backendStatus, setBackendStatus] = useState({ isOnline: false });

  // Cập nhật avatar từ thư viện ảnh máy người dùng
  const handleUpdateAvatar = (newAvatarUrl) => {
    const updated = { ...currentUser, avatar: newAvatarUrl };
    setCurrentUser(updated);
    try {
      localStorage.setItem('novel_manager_user_profile', JSON.stringify(updated));
    } catch {}
    showToast('Đã đổi ảnh đại diện từ thư viện thành công! ✨', 'success');
  };


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
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCreateNovelModal, setShowCreateNovelModal] = useState(false);

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

      // Tải danh mục, tác giả và tiểu thuyết
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
    const totalChaps = updatedNovel.chapters?.length || updatedNovel.total_chapters || 1;
    setReadingSession({ novel: updatedNovel, chapterId: firstChapterId });
    apiService.saveReadingProgress(novel.id, firstChapterId, 1, totalChaps);
    setReadingHistory(apiService.getReadingHistory());
    showToast(`Đang mở đọc "${novel.title}" (+1 lượt xem thực tế)`, 'info');
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
    const chapNum = chapterObj?.chapter_number || 1;
    const totalChaps = updatedNovel.chapters?.length || updatedNovel.total_chapters || 1;
    apiService.saveReadingProgress(novel.id, chapterId, chapNum, totalChaps);
    setReadingHistory(apiService.getReadingHistory());
    showToast(`Đang đọc Chương ${chapNum} (+1 lượt xem thực tế)`, 'info');
  };

  const handleViewDetail = async (novel) => {
    let fullNovel = novel;
    const [chaps, revs] = await Promise.all([
      (!novel.chapters || novel.chapters.length === 0)
        ? apiService.getChaptersByNovelId(novel.id)
        : Promise.resolve(novel.chapters),
      apiService.getReviewsByNovelId(novel.id)
    ]);
    const ratingInfo = apiService.calculateRealRating(revs);
    fullNovel = {
      ...novel,
      chapters: chaps,
      reviews: revs,
      ...ratingInfo
    };
    setDetailNovel(fullNovel);
  };

  const handleChapterChange = async (newChapterId) => {
    if (readingSession) {
      // Tăng lượt xem khi đọc chương
      const newViews = await apiService.incrementNovelViews(readingSession.novel.id);
      const updatedNovel = { ...readingSession.novel, total_views: newViews };
      setReadingSession({ novel: updatedNovel, chapterId: newChapterId });

      const ch = updatedNovel.chapters?.find((c) => c.id === newChapterId);
      const chapNum = ch?.chapter_number || 1;
      const totalChaps = updatedNovel.chapters?.length || updatedNovel.total_chapters || 1;

      apiService.saveReadingProgress(
        updatedNovel.id,
        newChapterId,
        chapNum,
        totalChaps
      );
      setReadingHistory(apiService.getReadingHistory());
      setNovels((prev) =>
        prev.map((n) => (n.id === updatedNovel.id ? updatedNovel : n))
      );
      if (detailNovel && detailNovel.id === updatedNovel.id) {
        setDetailNovel(updatedNovel);
      }
    }
  };

  // Gửi đánh giá
  const handleAddReview = async (novelId, reviewData) => {
    const updatedNovel = await apiService.addReview(novelId, reviewData);
    if (updatedNovel) {
      setNovels((prev) => prev.map((n) => (n.id === novelId ? updatedNovel : n)));
      if (detailNovel && detailNovel.id === novelId) {
        setDetailNovel(updatedNovel);
      }
      showToast('Cảm ơn bạn đã gửi đánh giá cho tác phẩm! Điểm số đã được cập nhật ⭐', 'success');
    }
  };


  // Auth & Role Guard
  const handleOpenCrud = () => {
    if (!currentUser) {
      showToast('Vui lòng đăng nhập với tài khoản Quản trị viên (Admin) để quản lý tác phẩm!', 'warning');
      setShowAuthModal(true);
      return;
    }
    if (currentUser.role !== 'admin') {
      showToast('Chỉ Quản trị viên (Admin) mới có quyền quản lý tác phẩm!', 'danger');
      return;
    }
    setShowCrudModal(true);
  };

  const handleOpenCreateNovel = () => {
    if (!currentUser) {
      showToast('Vui lòng đăng nhập để đăng truyện mới!', 'warning');
      setShowAuthModal(true);
      return;
    }
    setShowCreateNovelModal(true);
  };

  // CRUD Handlers
  const handleCreateNovel = async (newNovelData) => {
    if (!currentUser) {
      showToast('Vui lòng đăng nhập để đăng tác phẩm!', 'warning');
      setShowAuthModal(true);
      return;
    }
    const created = await apiService.createNovel(newNovelData);
    setNovels((prev) => [created, ...prev]);
    showToast(`Đã xuất bản tiểu thuyết "${created.title}" thành công! 🎉`, 'success');
  };

  const handleUpdateNovel = async (id, updatedData) => {
    if (currentUser?.role !== 'admin') {
      showToast('Chỉ Quản trị viên (Admin) mới có quyền sửa tác phẩm!', 'danger');
      return;
    }
    const updated = await apiService.updateNovel(id, updatedData);
    setNovels((prev) => prev.map((n) => (n.id === id ? updated : n)));
    if (detailNovel && detailNovel.id === id) {
      setDetailNovel(updated);
    }
    showToast(`Đã cập nhật tiểu thuyết "${updated.title}"!`, 'info');
  };

  const handleDeleteNovel = async (id) => {
    if (currentUser?.role !== 'admin') {
      showToast('Chỉ Quản trị viên (Admin) mới có quyền xóa tác phẩm!', 'danger');
      return;
    }
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

  // ============ AUTH HANDLERS ============
  const handleLoginSuccess = (user) => {
    const mappedUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      role: user.role || 'reader',
      avatar: user.avatar_url || user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`,
      badge: user.role === 'admin' ? 'Quản trị viên hệ thống' : user.role === 'author' ? 'Tác giả' : 'Độc giả thân thiết',
      isAuthenticated: true,
    };
    setCurrentUser(mappedUser);
    try {
      localStorage.setItem('novel_manager_user_profile', JSON.stringify(mappedUser));
    } catch {}
    showToast(`Chào mừng ${mappedUser.full_name}! Đăng nhập thành công 🎉`, 'success');
  };

  const handleLogout = async () => {
    await apiService.logout();
    setCurrentUser(null);
    setShowCrudModal(false);
    showToast('Đã đăng xuất thành công. Hẹn gặp lại! 👋', 'secondary');
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
      handleOpenCrud();
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
      {/* 1. Header (Booking topbar + navigation pills + auth) */}
      <Header
        activeNav={activeNav}
        setActiveNav={handleNavSelect}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        onUpdateAvatar={handleUpdateAvatar}
        bookmarkCount={bookmarks.length}
        onOpenCrud={handleOpenCrud}
        onOpenCreateNovel={handleOpenCreateNovel}
        backendStatus={backendStatus}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
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



      {/* Featured Authors Section */}
      <AuthorSection
        authors={authors}
        novels={novels}
        onSelectAuthor={(authorName) => {
          setSearchQuery(authorName);
          const el = document.getElementById('novel-list-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        onSelectAuthor={(authorName) => {
          setSearchQuery(authorName);
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        onOpenCreateNovel={handleOpenCreateNovel}
      />

      {/* Novel Detail Modal */}
      <NovelDetailModal
        show={Boolean(detailNovel)}
        onHide={() => setDetailNovel(null)}
        novel={detailNovel}
        isBookmarked={detailNovel ? bookmarks.includes(detailNovel.id) : false}
        onToggleBookmark={handleToggleBookmark}
        onReadChapter={handleReadChapter}
        onAddReview={handleAddReview}
        currentUser={currentUser}
      />

      {/* Full Chapter Reader */}
      <ReaderModal
        show={Boolean(readingSession)}
        onHide={() => setReadingSession(null)}
        novel={readingSession?.novel}
        chapterId={readingSession?.chapterId}
        onChapterChange={handleChapterChange}
      />

      {/* Auth Modal */}
      <AuthModal
        show={showAuthModal}
        onHide={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
        authService={apiService}
      />

      {/* CRUD Management Panel */}
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

      {/* Create Novel Modal */}
      <CreateNovelModal
        show={showCreateNovelModal}
        onHide={() => setShowCreateNovelModal(false)}
        categories={categories}
        authors={authors}
        currentUser={currentUser}
        onCreateNovel={handleCreateNovel}
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
