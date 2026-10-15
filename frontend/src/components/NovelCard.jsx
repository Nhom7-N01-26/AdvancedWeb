import React from 'react';
import { Row, Col, Badge } from 'react-bootstrap';

export default function NovelCard({
  novel,
  isBookmarked,
  rankNumber,
  onToggleBookmark,
  onViewDetail,
  onReadNow
}) {
  const chapterCount = novel.chapters ? novel.chapters.length : (novel.total_chapters || 1);
  const viewsCount = Number(novel.total_views) || 0;
  const hasRating = novel.total_ratings && novel.total_ratings > 0;

  return (
    <article className="novel-booking-card" id={`novel-${novel.id}`}>
      <Row className="g-3">
        {/* Left Column: Cover Image & Badges */}
        <Col xs={12} sm={4} md={3} lg={3}>
          <div className="novel-cover-wrapper">
            <img
              src={novel.cover_image}
              alt={novel.title}
              className="novel-cover-img"
              loading="lazy"
            />

            {/* Status Badge */}
            <span
              className={`novel-badge-tag ${
                novel.status === 'completed'
                  ? 'badge-completed'
                  : novel.status === 'ongoing'
                  ? 'badge-ongoing'
                  : 'badge-draft'
              }`}
            >
              {novel.status === 'completed'
                ? 'Đã Hoàn Thành'
                : novel.status === 'ongoing'
                ? 'Đang Ra'
                : 'Bản Thảo'}
            </span>

            {/* Bookmark button */}
            <button
              className="novel-bookmark-btn"
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(novel.id);
              }}
              title={isBookmarked ? 'Bỏ lưu truyện' : 'Lưu vào tủ sách'}
              aria-label="Đánh dấu tiểu thuyết"
            >
              <i className={`bi ${isBookmarked ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i>
            </button>
          </div>
        </Col>

        {/* Middle Column: Details & Real Metrics */}
        <Col xs={12} sm={8} md={6} lg={6}>
          <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
            {rankNumber && (
              <span
                className={`badge fw-bold ${
                  rankNumber === 1
                    ? 'bg-warning text-dark'
                    : rankNumber === 2
                    ? 'bg-secondary text-white'
                    : rankNumber === 3
                    ? 'text-white'
                    : 'bg-light text-dark border'
                }`}
                style={rankNumber === 3 ? { backgroundColor: '#cd7f32' } : {}}
              >
                {rankNumber === 1 && <i className="bi bi-trophy-fill me-1"></i>}
                {rankNumber === 2 && <i className="bi bi-award-fill me-1"></i>}
                {rankNumber === 3 && <i className="bi bi-award me-1"></i>}
                Top {rankNumber}
              </span>
            )}
            {novel.is_featured && !rankNumber && (
              <Badge bg="warning" text="dark" className="fw-bold">
                <i className="bi bi-star-fill me-1"></i>Đề cử
              </Badge>
            )}
            {/* LƯỢT XEM THỰC TẾ: Tăng +1 khi người dùng vào đọc */}
            <span className="badge bg-light text-primary border fw-semibold">
              <i className="bi bi-eye-fill me-1"></i>
              {viewsCount} lượt xem
            </span>
            <span className="text-muted small">
              · {chapterCount} chương
            </span>
          </div>

          {/* Title */}
          <a
            href={`#novel-${novel.id}`}
            className="novel-title-link"
            onClick={(e) => {
              e.preventDefault();
              onViewDetail(novel);
            }}
          >
            {novel.title}
          </a>

          {/* Author line */}
          <div className="novel-author-line">
            <i className="bi bi-person-fill text-primary"></i>
            <span>Tác giả: <strong>{novel.author_name}</strong></span>
            <i className="bi bi-patch-check-fill text-primary" title="Tác giả"></i>
          </div>

          {/* Location line (Booking style) */}
          <div className="novel-location-line">
            <i className="bi bi-geo-alt-fill"></i>
            <span>{novel.location_label || 'Bối cảnh giả tưởng'}</span>
          </div>

          {/* Tags / Categories */}
          <div className="mb-2">
            <span className="badge bg-primary-subtle text-primary border me-1">
              {novel.category}
            </span>
            {novel.tags && novel.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="novel-tag-chip">
                #{tag}
              </span>
            ))}
          </div>

          {/* Excerpt */}
          <p className="text-muted small mb-2 text-truncate-2" style={{ lineHeight: '1.45' }}>
            {novel.description}
          </p>

          {/* Booking perks / Recent update highlight */}
          <div className="small text-success fw-medium mb-1">
            <i className="bi bi-check-circle-fill me-1"></i>
            {novel.discount_label || 'Đọc miễn phí toàn bộ'}
          </div>

          <div className="small text-muted">
            <i className="bi bi-clock me-1"></i>
            Tình trạng: <span className="text-dark fw-medium">{novel.latest_update || `${chapterCount} chương`}</span>
          </div>
        </Col>

        {/* Right Column: Score Box & Action Buttons (Booking signature) */}
        <Col xs={12} sm={12} md={3} lg={3}>
          <div className="novel-action-col h-100">
            {/* Top Score Box: Tính toán từ reviews */}
            <div className="d-flex align-items-center justify-content-end gap-2 mb-3">
              <div className="text-end">
                <div className="booking-score-label">
                  {hasRating ? novel.booking_badge : 'Chưa có đánh giá'}
                </div>
                <div className="booking-score-sub">
                  {hasRating ? `${novel.total_ratings} đánh giá` : 'Chưa có nhận xét'}
                </div>
              </div>
              <div
                className={`booking-score-box ${!hasRating ? 'bg-secondary' : ''}`}
                style={{ fontSize: hasRating ? '1.1rem' : '0.85rem' }}
              >
                {hasRating ? novel.booking_score?.toFixed(1) : 'Mới'}
              </div>
            </div>

            {/* Middle chapter count & stats */}
            <div className="my-auto py-2">
              <div className="text-muted small">Kho nội dung</div>
              <div className="fw-bold text-dark fs-6">
                {chapterCount} chương hoàn chỉnh
              </div>
              <div className="text-success small fw-semibold">
                ✓ Miễn phí đọc
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="d-flex flex-column gap-2 mt-auto">
              <button
                className="btn-booking-primary w-100"
                onClick={() => onReadNow(novel)}
                title="Đọc tác phẩm ngay"
              >
                <i className="bi bi-book-half"></i>
                <span>Đọc ngay</span>
              </button>

              <button
                className="btn-booking-secondary w-100"
                onClick={() => onViewDetail(novel)}
              >
                <i className="bi bi-info-circle"></i>
                <span>Xem chi tiết</span>
              </button>
            </div>
          </div>
        </Col>
      </Row>
    </article>
  );
}
