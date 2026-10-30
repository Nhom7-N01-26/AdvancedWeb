import React, { useState } from 'react';
import { Modal, Button, Row, Col, Table, ProgressBar, Form } from 'react-bootstrap';

export default function NovelDetailModal({
  show,
  onHide,
  novel,
  isBookmarked,
  onToggleBookmark,
  onReadChapter,
  onAddReview,
  currentUser
}) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, chapters, reviews
  const [newReviewText, setNewReviewText] = useState('');
  const [newRatingScore, setNewRatingScore] = useState(5);

  if (!novel) return null;

  const hasRating = Number(novel.total_ratings) > 0 && Number(novel.avg_rating) > 0;
  const chapterCount = novel.chapters ? novel.chapters.length : (novel.total_chapters || 1);
  const viewsCount = Math.max(0, Number(novel.total_views) || 0);


  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;
    if (onAddReview) {
      onAddReview(novel.id, {
        user: currentUser?.full_name || 'Bạn (Độc Giả)',
        avatar:
          currentUser?.avatar ||
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        score: Number(newRatingScore),
        date: 'Hôm nay',
        comment: newReviewText.trim()
      });
      setNewReviewText('');
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      scrollable
      contentClassName="border-0 shadow-lg"
    >
      <Modal.Header closeButton className="bg-light border-bottom">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <Modal.Title className="fw-bold fs-5 text-dark m-0">
            {novel.title}
          </Modal.Title>
          <span className="badge bg-primary">{novel.category}</span>
          {novel.status === 'completed' ? (
            <span className="badge bg-success">Đã Hoàn Thành</span>
          ) : (
            <span className="badge bg-info text-dark">Đang Ra Chương</span>
          )}
        </div>
      </Modal.Header>

      <Modal.Body className="p-0">
        {/* Booking Style Top Details Banner */}
        <div className="p-4 bg-white border-bottom">
          <Row className="g-4">
            {/* Cover Column */}
            <Col md={4} lg={3} className="text-center">
              <div className="rounded-3 overflow-hidden shadow-sm border mb-3">
                <img
                  src={novel.cover_image}
                  alt={novel.title}
                  className="w-100"
                  style={{ maxHeight: 360, objectFit: 'cover' }}
                />
              </div>

              <div className="d-flex gap-2">
                <Button
                  variant={isBookmarked ? 'danger' : 'outline-danger'}
                  className="w-100 fw-bold d-flex align-items-center justify-content-center gap-1"
                  onClick={() => onToggleBookmark(novel.id)}
                >
                  <i className={`bi ${isBookmarked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                  {isBookmarked ? 'Đã lưu truyện' : 'Lưu vào tủ sách'}
                </Button>
              </div>
            </Col>

            {/* Main Info Column */}
            <Col md={8} lg={9}>
              <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-2">
                <div>
                  <h2 className="fw-bold text-dark fs-3 mb-1">{novel.title}</h2>
                  <div className="text-muted small d-flex align-items-center gap-2 mb-2">
                    <span>Tác giả: <strong className="text-dark">{novel.author_name}</strong></span>
                    <span>·</span>
                    <span className="text-primary">
                      <i className="bi bi-geo-alt-fill me-1"></i>
                      {novel.location_label || 'Văn đàn Tiên Hiệp'}
                    </span>
                  </div>
                </div>

                {/* Score badge: CHỈ KHI CÓ ĐÁNH GIÁ MỚI HIỆN ĐIỂM */}
                <div className="d-flex align-items-center gap-2 bg-light p-2 rounded-2 border">
                  <div className="text-end">
                    <div className="fw-bold text-dark small">
                      {hasRating ? novel.booking_badge : 'Chưa có đánh giá'}
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                      {hasRating ? `${novel.total_ratings} đánh giá` : 'Chờ đánh giá đầu tiên'}
                    </div>
                  </div>
                  {hasRating ? (
                    <div className="booking-score-box" style={{ fontSize: '1.1rem' }}>
                      {novel.booking_score?.toFixed(1)}
                    </div>
                  ) : (
                    <div className="booking-score-box bg-light text-muted border" style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                      Mới
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="mb-3">
                {novel.tags && novel.tags.map((t, idx) => (
                  <span key={idx} className="badge bg-light text-dark border me-1 mb-1 p-2">
                    #{t}
                  </span>
                ))}
              </div>

              {/* Metrics */}
              <Row className="g-2 text-center my-3 p-2 bg-light rounded-2 border">
                <Col xs={4}>
                  <div className="fw-bold text-dark fs-5">{chapterCount}</div>
                  <div className="text-muted small">Tổng số chương</div>
                </Col>
                <Col xs={4} className="border-start border-end">
                  <div className="fw-bold text-primary fs-5">{viewsCount}</div>
                  <div className="text-muted small">Lượt xem thực tế</div>
                </Col>
                <Col xs={4}>
                  <div className="fw-bold text-danger fs-5">
                    {novel.total_ratings || novel.reviews?.length || 0}
                  </div>
                  <div className="text-muted small">Lượt đánh giá</div>
                </Col>
              </Row>

              {/* Synopsis */}
              <div className="mb-3">
                <h6 className="fw-bold text-dark">Tóm tắt nội dung tác phẩm:</h6>
                <p className="text-secondary small leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                  {novel.description}
                </p>
              </div>

              {/* Booking-style review metrics */}
              {hasRating ? (
                <div className="p-3 rounded-2 bg-light border">
                  <h6 className="fw-bold text-dark small mb-2">Điểm đánh giá thực tế từ độc giả:</h6>
                  <div className="d-flex align-items-center gap-3">
                    <div className="display-6 fw-bold text-primary">
                      {novel.booking_score?.toFixed(1)} <span className="fs-6 text-muted">/ 10</span>
                    </div>
                    <div className="small text-muted">
                      <div>Điểm trung bình thực tế: <strong>{novel.avg_rating} ⭐</strong></div>
                      <div>Dựa trên <strong>{novel.total_ratings}</strong> nhận xét đã gửi.</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-2 bg-light border text-muted small d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <div>
                    <i className="bi bi-star me-2 text-warning"></i>
                    Tác phẩm này hiện chưa có đánh giá nào. Hãy là người đầu tiên trải nghiệm và chấm điểm!
                  </div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="fw-bold"
                    onClick={() => setActiveTab('reviews')}
                  >
                    Viết đánh giá ngay
                  </Button>
                </div>
              )}

            </Col>
          </Row>
        </div>

        {/* Tab switcher: Chapters & Reviews */}
        <div className="px-4 pt-3 bg-white border-bottom">
          <div className="d-flex gap-3">
            <button
              className={`btn btn-link text-decoration-none fw-bold pb-2 border-bottom border-3 rounded-0 ${
                activeTab === 'chapters' ? 'border-primary text-primary' : 'border-transparent text-muted'
              }`}
              onClick={() => setActiveTab('chapters')}
            >
              <i className="bi bi-list-ol me-1"></i>
              Danh sách chương ({chapterCount})
            </button>
            <button
              className={`btn btn-link text-decoration-none fw-bold pb-2 border-bottom border-3 rounded-0 ${
                activeTab === 'reviews' ? 'border-primary text-primary' : 'border-transparent text-muted'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              <i className="bi bi-chat-square-quote me-1"></i>
              Bình luận & Đánh giá ({novel.reviews?.length || 0})
            </button>
          </div>
        </div>

        {/* Tab 1: Chapters Table */}
        {activeTab === 'chapters' && (
          <div className="p-4 bg-light">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-dark m-0">Kho chương tiểu thuyết</h5>
              <span className="small text-muted">Đọc miễn phí toàn bộ các chương đã phát hành</span>
            </div>

            {novel.chapters && novel.chapters.length > 0 ? (
              <div className="table-responsive bg-white rounded-2 shadow-sm border">
                <Table hover className="m-0 align-middle">
                  <thead className="table-light text-muted small">
                    <tr>
                      <th style={{ width: 80 }}>Số chương</th>
                      <th>Tên chương</th>
                      <th>Độ dài</th>
                      <th>Ngày đăng</th>
                      <th>Quyền truy cập</th>
                      <th className="text-end" style={{ width: 140 }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {novel.chapters.map((ch) => (
                      <tr key={ch.id}>
                        <td className="fw-bold text-muted">#{ch.chapter_number}</td>
                        <td className="fw-semibold text-dark">{ch.title}</td>
                        <td className="small text-muted">{ch.word_count || 250} chữ</td>
                        <td className="small text-muted">{ch.published_at || 'Mới cập nhật'}</td>
                        <td>
                          <span className="badge bg-success-subtle text-success">
                            ✓ Miễn phí
                          </span>
                        </td>
                        <td className="text-end">
                          <Button
                            variant="primary"
                            size="sm"
                            className="fw-bold px-3 py-1 rounded-1"
                            onClick={() => onReadChapter(novel, ch.id)}
                            title="Đọc chương này"
                          >
                            <i className="bi bi-book-half me-1"></i>
                            Đọc
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div className="p-4 text-center bg-white rounded-2 border">
                <p className="text-muted m-0">Chưa có chương nào được cập nhật cho tác phẩm này.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Reviews & Reader Comments */}
        {activeTab === 'reviews' && (
          <div className="p-4 bg-light">
            {/* Add Review Box */}
            <div className="bg-white p-3 rounded-2 border shadow-sm mb-4">
              <h6 className="fw-bold text-dark mb-2">Để lại nhận xét của bạn:</h6>
              <Form onSubmit={handleReviewSubmit}>
                <Row className="g-2 mb-2">
                  <Col sm={8}>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Chia sẻ cảm nghĩ của bạn về cốt truyện, nhân vật..."
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      required
                    />
                  </Col>
                  <Col sm={4}>
                    <Form.Label className="small text-muted mb-1">
                      Đánh giá: <strong>{newRatingScore} ⭐ ({newRatingScore * 2} / 10 Booking)</strong>
                    </Form.Label>
                    <Form.Select
                      size="sm"
                      value={newRatingScore}
                      onChange={(e) => setNewRatingScore(e.target.value)}
                    >
                      <option value="5">⭐⭐⭐⭐⭐ 5 sao - Xuất sắc</option>
                      <option value="4">⭐⭐⭐⭐ 4 sao - Rất tốt</option>
                      <option value="3">⭐⭐⭐ 3 sao - Tốt</option>
                      <option value="2">⭐⭐ 2 sao - Bình thường</option>
                      <option value="1">⭐ 1 sao - Kém</option>
                    </Form.Select>
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      className="w-100 fw-bold mt-2"
                    >
                      Gửi đánh giá
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>

            {/* List of Real Reviews */}
            <div className="d-flex flex-column gap-3">
              {novel.reviews && novel.reviews.length > 0 ? (
                novel.reviews.map((rev) => (
                  <div key={rev.id} className="bg-white p-3 rounded-2 border shadow-sm">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={rev.avatar}
                          alt={rev.user}
                          className="rounded-circle"
                          style={{ width: 36, height: 36, objectFit: 'cover' }}
                        />
                        <div>
                          <strong className="text-dark d-block small">{rev.user}</strong>
                          <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                            {rev.date} · {rev.score} ⭐
                          </span>
                        </div>
                      </div>
                      <div className="booking-score-box" style={{ width: 32, height: 32, fontSize: '0.9rem' }}>
                        {rev.score <= 5 ? (rev.score * 2) : rev.score}
                      </div>
                    </div>
                    <p className="small text-secondary m-0">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center bg-white rounded-2 border text-muted">
                  Chưa có nhận xét nào trong CSDL. Hãy là người đầu tiên gửi đánh giá!
                </div>
              )}
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="bg-light border-top d-flex justify-content-between">
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
        <Button
          variant="primary"
          className="fw-bold px-4"
          onClick={() => {
            onHide();
            if (novel.chapters && novel.chapters.length > 0) {
              onReadChapter(novel, novel.chapters[0].id);
            }
          }}
        >
          <i className="bi bi-book-half me-1"></i>
          Đọc Chương 1
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
