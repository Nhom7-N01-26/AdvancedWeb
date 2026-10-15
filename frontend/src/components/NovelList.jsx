import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import NovelCard from './NovelCard';

export default function NovelList({
  novels,
  allNovels = [],
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  isFeaturedOnly,
  setIsFeaturedOnly,
  isCompletedOnly,
  setIsCompletedOnly,
  minRating,
  setMinRating,
  bookmarks,
  activeNav,
  setActiveNav,
  onToggleBookmark,
  onViewDetail,
  onReadNow,
  onResetFilters
}) {
  const [sortBy, setSortBy] = useState('views');

  // Đếm số lượng trong toàn bộ danh sách tác phẩm
  const getRealCategoryCount = (catName) => {
    return allNovels.filter(
      (n) => n.category === catName || (n.categories && n.categories.includes(catName))
    ).length;
  };

  // Sắp xếp danh sách
  const sortedNovels = [...novels].sort((a, b) => {
    if (activeNav === 'rankings') {
      const viewsDiff = (Number(b.total_views) || 0) - (Number(a.total_views) || 0);
      if (viewsDiff !== 0) return viewsDiff;
      return (b.booking_score || 0) - (a.booking_score || 0);
    }
    if (sortBy === 'views') {
      return (Number(b.total_views) || 0) - (Number(a.total_views) || 0);
    }
    if (sortBy === 'rating') {
      const scoreA = a.booking_score || 0;
      const scoreB = b.booking_score || 0;
      return scoreB - scoreA;
    }
    if (sortBy === 'chapters') {
      return (b.chapters?.length || 0) - (a.chapters?.length || 0);
    }
    if (sortBy === 'newest') {
      return b.id - a.id;
    }
    // recommended
    return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
  });

  return (
    <section className="my-4" id="novel-list-section">
      <Container>
        <Row>
          {/* LEFT SIDEBAR: FILTERS */}
          <Col lg={3} md={4} className="mb-4">
            <div className="booking-filter-card">
              <div className="booking-filter-header">
                <span>
                  <i className="bi bi-funnel-fill text-primary me-2"></i>
                  Bộ lọc tìm kiếm
                </span>
                <button
                  className="btn btn-sm btn-link text-decoration-none p-0 text-muted"
                  onClick={onResetFilters}
                  title="Đặt lại tất cả bộ lọc"
                >
                  Đặt lại
                </button>
              </div>

              {/* Filter 1: Thể loại */}
              <div className="booking-filter-group">
                <div className="booking-filter-title">Thể loại</div>
                <div
                  className="booking-checkbox-item"
                  onClick={() => setSelectedCategory('all')}
                >
                  <label className="m-0 d-flex align-items-center">
                    <input
                      type="radio"
                      name="filter_cat"
                      checked={selectedCategory === 'all'}
                      onChange={() => setSelectedCategory('all')}
                    />
                    <span>Tất cả thể loại</span>
                  </label>
                  <span className="badge bg-secondary-subtle text-secondary">{allNovels.length}</span>
                </div>
                {categories.map((c) => {
                  const count = getRealCategoryCount(c.name);
                  return (
                    <div
                      key={c.id}
                      className="booking-checkbox-item"
                      onClick={() => setSelectedCategory(c.name)}
                    >
                      <label className="m-0 d-flex align-items-center">
                        <input
                          type="radio"
                          name="filter_cat"
                          checked={selectedCategory === c.name}
                          onChange={() => setSelectedCategory(c.name)}
                        />
                        <span>{c.name}</span>
                      </label>
                      <span className={`badge ${count > 0 ? 'bg-primary-subtle text-primary' : 'bg-light text-muted'}`}>
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Filter 2: Tình trạng tác phẩm */}
              <div className="booking-filter-group">
                <div className="booking-filter-title">Tình trạng ra chương</div>
                <div className="booking-checkbox-item">
                  <label className="m-0 d-flex align-items-center">
                    <input
                      type="checkbox"
                      checked={isCompletedOnly}
                      onChange={(e) => setIsCompletedOnly(e.target.checked)}
                    />
                    <span>Đã hoàn thành (Full)</span>
                  </label>
                  <span className="badge bg-success-subtle text-success">
                    {allNovels.filter((n) => n.status === 'completed').length}
                  </span>
                </div>
                <div className="booking-checkbox-item">
                  <label className="m-0 d-flex align-items-center">
                    <input
                      type="checkbox"
                      checked={selectedStatus === 'ongoing'}
                      onChange={(e) => setSelectedStatus(e.target.checked ? 'ongoing' : 'all')}
                    />
                    <span>Đang cập nhật (Ongoing)</span>
                  </label>
                  <span className="badge bg-primary-subtle text-primary">
                    {allNovels.filter((n) => n.status === 'ongoing').length}
                  </span>
                </div>
                <div className="booking-checkbox-item">
                  <label className="m-0 d-flex align-items-center">
                    <input
                      type="checkbox"
                      checked={isFeaturedOnly}
                      onChange={(e) => setIsFeaturedOnly(e.target.checked)}
                    />
                    <span>Tác phẩm đề cử (Featured)</span>
                  </label>
                  <span className="badge bg-warning-subtle text-warning-emphasis">
                    {allNovels.filter((n) => n.is_featured).length}
                  </span>
                </div>
              </div>

              {/* Filter 3: Điểm đánh giá */}
              <div className="booking-filter-group">
                <div className="booking-filter-title">Điểm đánh giá từ độc giả</div>
                {[
                  {
                    label: 'Được đánh giá cao (>= 9.0 điểm)',
                    value: 9.0,
                    count: allNovels.filter((n) => n.booking_score >= 9.0).length
                  },
                  {
                    label: 'Có đánh giá (>= 8.0 điểm)',
                    value: 8.0,
                    count: allNovels.filter((n) => n.booking_score >= 8.0).length
                  },
                  {
                    label: 'Tất cả (Bao gồm chưa đánh giá)',
                    value: 0,
                    count: allNovels.length
                  }
                ].map((item, idx) => (
                  <div key={idx} className="booking-checkbox-item">
                    <label className="m-0 d-flex align-items-center">
                      <input
                        type="radio"
                        name="rating_filter"
                        checked={minRating === item.value}
                        onChange={() => setMinRating(item.value)}
                      />
                      <span className="small">{item.label}</span>
                    </label>
                    <span className="badge bg-light text-muted">{item.count}</span>
                  </div>
                ))}
              </div>

              {/* Nhóm 7 Credentials box inside sidebar */}
              <div className="p-3 bg-light text-muted small border-top">
                <div className="fw-bold text-dark mb-1">
                  <i className="bi bi-info-circle me-1 text-primary"></i>
                  Đề tài Nhóm 7 - Novel Manager
                </div>
                <div>Lập trình Web Nâng Cao</div>
              </div>
            </div>
          </Col>

          {/* RIGHT COLUMN: NOVEL RESULTS */}
          <Col lg={9} md={8}>
            {/* Banner: Tủ sách cá nhân */}
            {activeNav === 'bookmarks' && (
              <div
                className="p-3 mb-3 rounded-3 border d-flex align-items-center justify-content-between flex-wrap gap-2 shadow-sm"
                style={{ backgroundColor: '#e7f1ff', borderColor: '#b6d4fe' }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center shadow-sm"
                    style={{ width: 44, height: 44, flexShrink: 0 }}
                  >
                    <i className="bi bi-bookmark-heart-fill fs-5"></i>
                  </div>
                  <div>
                    <h4 className="fw-bold mb-0 text-dark fs-6">Tủ Sách Cá Nhân Của Bạn</h4>
                    <div className="text-muted small">
                      {sortedNovels.length > 0
                        ? `Đang lưu ${sortedNovels.length} tác phẩm yêu thích của bạn`
                        : 'Chưa có tác phẩm nào trong tủ sách'}
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-outline-primary fw-semibold"
                  onClick={() => setActiveNav && setActiveNav('novels')}
                >
                  <i className="bi bi-journals me-1"></i> Xem tất cả tiểu thuyết
                </button>
              </div>
            )}

            {/* Banner: Bảng xếp hạng Hot */}
            {activeNav === 'rankings' && (
              <div
                className="p-3 mb-3 rounded-3 border d-flex align-items-center justify-content-between flex-wrap gap-2 shadow-sm"
                style={{ backgroundColor: '#fff9e6', borderColor: '#ffe69c' }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle bg-warning text-dark d-flex align-items-center justify-content-center shadow-sm"
                    style={{ width: 44, height: 44, flexShrink: 0 }}
                  >
                    <i className="bi bi-trophy-fill fs-5"></i>
                  </div>
                  <div>
                    <h4 className="fw-bold mb-0 text-dark fs-6">Bảng Xếp Hạng Tiểu Thuyết Hot Nhất</h4>
                    <div className="text-muted small">
                      Sắp xếp tự động theo lượt đọc nhiều nhất và điểm đánh giá cao nhất
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-outline-dark fw-semibold"
                  onClick={() => setActiveNav && setActiveNav('novels')}
                >
                  <i className="bi bi-arrow-left me-1"></i> Trở về xem tất cả
                </button>
              </div>
            )}

            {/* Top results bar with Sorting */}
            <div className="d-flex align-items-center justify-content-between mb-3 p-3 bg-white border rounded-3 shadow-sm flex-wrap gap-2">
              <div>
                <h3 className="fs-5 fw-bold mb-0 text-dark">
                  {activeNav === 'bookmarks'
                    ? `Tủ sách: ${sortedNovels.length} tác phẩm`
                    : activeNav === 'rankings'
                    ? `Bảng xếp hạng: ${sortedNovels.length} tác phẩm Hot`
                    : `Hiển thị ${sortedNovels.length} / ${allNovels.length} tác phẩm`}
                </h3>
                <div className="text-muted small">
                  {selectedCategory !== 'all' && `Thể loại: ${selectedCategory} · `}
                  {isCompletedOnly && 'Đã hoàn thành · '}
                  Danh sách tác phẩm phù hợp
                </div>
              </div>

              {/* Sorting selector */}
              <div className="d-flex align-items-center gap-2">
                <span className="text-muted small text-nowrap fw-medium">Sắp xếp theo:</span>
                <Form.Select
                  size="sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ width: 'auto', minWidth: 200 }}
                  disabled={activeNav === 'rankings'}
                >
                  <option value="views">Lượt xem nhiều nhất</option>
                  <option value="rating">Điểm đánh giá cao nhất</option>
                  <option value="chapters">Nhiều chương nhất</option>
                  <option value="newest">Mới đăng tải</option>
                </Form.Select>
              </div>
            </div>

            {/* List of cards */}
            {sortedNovels.length > 0 ? (
              sortedNovels.map((novel, idx) => (
                <NovelCard
                  key={novel.id}
                  novel={novel}
                  rankNumber={activeNav === 'rankings' ? idx + 1 : undefined}
                  isBookmarked={bookmarks.includes(novel.id)}
                  onToggleBookmark={onToggleBookmark}
                  onViewDetail={onViewDetail}
                  onReadNow={onReadNow}
                />
              ))
            ) : activeNav === 'bookmarks' ? (
              <div className="text-center py-5 bg-white border rounded-3 p-4 shadow-sm">
                <div className="rounded-circle bg-light d-inline-flex p-3 mb-3 text-danger">
                  <i className="bi bi-bookmark-heart fs-1"></i>
                </div>
                <h4 className="fw-bold text-dark">Tủ sách của bạn hiện đang trống</h4>
                <p className="text-muted" style={{ maxWidth: 450, margin: '0 auto 1.5rem auto' }}>
                  Bạn chưa lưu tiểu thuyết nào vào tủ sách. Khi duyệt danh sách, hãy nhấn vào biểu tượng trái tim để lưu lại và đọc bất cứ lúc nào!
                </p>
                <button
                  className="btn btn-primary fw-semibold px-4"
                  onClick={() => setActiveNav && setActiveNav('novels')}
                >
                  <i className="bi bi-journals me-1"></i> Khám phá tất cả tiểu thuyết
                </button>
              </div>
            ) : (
              <div className="text-center py-5 bg-white border rounded-3 p-4 shadow-sm">
                <i className="bi bi-search text-muted fs-1 mb-3 d-block"></i>
                <h4 className="fw-bold text-dark">Không có tiểu thuyết nào thỏa mãn điều kiện</h4>
                <p className="text-muted">
                  Hiện tại thể loại hoặc bộ lọc này chưa có truyện. Hãy thử chọn thể loại khác!
                </p>
                <button className="btn btn-primary" onClick={onResetFilters}>
                  <i className="bi bi-arrow-counterclockwise me-1"></i>
                  Xem tất cả tiểu thuyết
                </button>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
}
