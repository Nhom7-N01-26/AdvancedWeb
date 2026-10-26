import React from 'react';
import { Container } from 'react-bootstrap';

export default function HeroSearch({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  isFeaturedOnly,
  setIsFeaturedOnly,
  isCompletedOnly,
  setIsCompletedOnly,
  categories,
  onSearchSubmit
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) onSearchSubmit();
  };

  return (
    <>
      {/* Hero Section Banner */}
      <section className="booking-hero">
        <Container>
          <h1 className="booking-hero-title">Tìm kiếm tiểu thuyết tiếp theo của bạn</h1>
          <p className="booking-hero-subtitle">
            Khám phá thế giới tiên hiệp, huyền huyễn, kiếm hiệp, đô thị và eSports đặc sắc. Cập nhật chương mới mỗi ngày cùng cộng đồng độc giả Nhóm 7.
          </p>
        </Container>
      </section>

      {/* Floating Yellow Booking Search Box */}
      <section className="booking-search-wrapper">
        <Container>
          <form onSubmit={handleSubmit} className="booking-search-box">
            <div className="booking-search-inner">
              {/* Field 1: Query Keyword */}
              <div className="booking-search-field">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  placeholder="Bạn muốn đọc truyện gì? (Tên truyện, nhân vật, tác giả...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Tìm kiếm tiểu thuyết"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="btn btn-sm text-muted p-0 border-0"
                    onClick={() => setSearchQuery('')}
                    title="Xóa tìm kiếm"
                  >
                    <i className="bi bi-x-circle-fill"></i>
                  </button>
                )}
              </div>

              {/* Field 2: Category Selector */}
              <div className="booking-search-field">
                <i className="bi bi-tag-fill"></i>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  aria-label="Chọn thể loại"
                >
                  <option value="all">Tất cả thể loại</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.emoji || '📖'} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 3: Status / Filter */}
              <div className="booking-search-field">
                <i className="bi bi-filter-circle-fill"></i>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  aria-label="Chọn tình trạng"
                >
                  <option value="all">Mọi tình trạng</option>
                  <option value="completed">Đã hoàn thành (Full)</option>
                  <option value="ongoing">Đang ra chương</option>
                  <option value="draft">Bản thảo / Sắp ra mắt</option>
                </select>
              </div>

              {/* Field 4: Search Button */}
              <button type="submit" className="booking-search-btn">
                <i className="bi bi-search"></i>
                <span>Tìm kiếm</span>
              </button>
            </div>
          </form>

          {/* Quick filter checkboxes below search bar */}
          <div className="booking-quick-options">
            <label>
              <input
                type="checkbox"
                checked={isCompletedOnly}
                onChange={(e) => setIsCompletedOnly(e.target.checked)}
              />
              <span className="text-dark fw-medium">
                <i className="bi bi-check2-circle text-success me-1"></i>
                Chỉ truyện Full (Đã hoàn thành)
              </span>
            </label>

            <label>
              <input
                type="checkbox"
                checked={isFeaturedOnly}
                onChange={(e) => setIsFeaturedOnly(e.target.checked)}
              />
              <span className="text-dark fw-medium">
                <i className="bi bi-star-fill text-warning me-1"></i>
                Tác phẩm được đề cử hàng đầu
              </span>
            </label>

            <span className="ms-auto text-muted small d-none d-md-inline-block">
              <i className="bi bi-lightning-charge-fill text-warning me-1"></i>
              Gợi ý: Đấu Phá Thương Khung, Phàm Nhân Tu Tiên, Toàn Chức Cao Thủ
            </span>
          </div>
        </Container>
      </section>
    </>
  );
}
