import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Badge, Tabs, Tab, Spinner, Alert, Form } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BookOpen, Bookmark, Star, Eye, Calendar, User, MessageSquare, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';

export default function NovelDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [novel, setNovel] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [ratings, setRatings] = useState({ total_ratings: 0, avg_rating: 0, booking_score: 0, items: [] });
  const [userRating, setUserRating] = useState(null);
  const [readingHistory, setReadingHistory] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form review state
  const [newScore, setNewScore] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchNovelData = async () => {
      try {
        setLoading(true);
        // 1. Lấy thông tin truyện theo slug
        const novelData = await axiosClient.get(`/novels/${slug}`);
        setNovel(novelData);

        // 2. Lấy danh sách chương & ratings
        const [chData, ratingData] = await Promise.all([
          axiosClient.get(`/chapters/novel/${novelData.id}`),
          axiosClient.get(`/ratings/novel/${novelData.id}`),
        ]);
        setChapters(chData || []);
        setRatings(ratingData || { total_ratings: 0, avg_rating: 0, booking_score: 0, items: [] });

        // 3. Nếu đã đăng nhập: kiểm tra bookmark & reading history & user rating
        if (user) {
          try {
            const [bmStatus, history, myRating] = await Promise.all([
              axiosClient.get(`/bookmarks/check/${novelData.id}`),
              axiosClient.get(`/history/novel/${novelData.id}`),
              axiosClient.get(`/ratings/novel/${novelData.id}/my`),
            ]);
            setIsBookmarked(bmStatus?.isBookmarked || false);
            setReadingHistory(history || null);
            if (myRating) {
              setUserRating(myRating);
              setNewScore(myRating.score);
              setNewReviewText(myRating.review || '');
            }
          } catch (e) {
            // bỏ qua lỗi nếu chưa có dữ liệu user
          }
        }
      } catch (err) {
        console.error('Lỗi tải chi tiết truyện:', err);
        setError('Không thể tìm thấy truyện hoặc truyện đã bị gỡ bỏ.');
      } finally {
        setLoading(false);
      }
    };

    fetchNovelData();
  }, [slug, user]);

  const handleToggleBookmark = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await axiosClient.post(`/bookmarks/toggle/${novel.id}`);
      setIsBookmarked(res.isBookmarked);
    } catch (err) {
      console.error('Lỗi toggle bookmark:', err);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setSubmittingReview(true);
      await axiosClient.post('/ratings', {
        novel_id: novel.id,
        rating: Number(newScore),
        review_text: newReviewText,
      });

      // Tải lại đánh giá
      const updatedRatings = await axiosClient.get(`/ratings/novel/${novel.id}`);
      setRatings(updatedRatings);
      alert('Cảm ơn bạn đã gửi đánh giá!');
    } catch (err) {
      alert('Không thể lưu đánh giá: ' + (err.message || 'Lỗi hệ thống'));
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Đang tải thông tin tiểu thuyết...</p>
      </Container>
    );
  }

  if (error || !novel) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error || 'Không tìm thấy truyện'}</Alert>
        <Button as={Link} to="/browse" variant="primary">
          Quay lại danh sách truyện
        </Button>
      </Container>
    );
  }

  const coverUrl = novel.cover_image && novel.cover_image.startsWith('/public')
    ? `http://localhost:5000${novel.cover_image}`
    : novel.cover_image && novel.cover_image.startsWith('/assets')
    ? `http://localhost:5000${novel.cover_image.replace('/assets', '/public')}`
    : novel.cover_image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400';

  const bookingScore = ratings.booking_score || ((Number(novel.avg_rating || 0) * 2).toFixed(1));

  return (
    <Container className="py-4">
      {/* Header Info Card */}
      <div className="bg-white p-4 rounded border shadow-sm mb-4">
        <Row className="g-4">
          <Col md={3} sm={4} xs={12} className="text-center">
            <img
              src={coverUrl}
              alt={novel.title}
              className="rounded shadow-sm img-fluid"
              style={{ maxHeight: '380px', objectFit: 'cover', width: '100%' }}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400';
              }}
            />
          </Col>

          <Col md={9} sm={8} xs={12} className="d-flex flex-column">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h2 className="fw-bolder mb-1">{novel.title}</h2>
                <div className="text-muted d-flex align-items-center gap-2 mb-2">
                  <User size={16} /> Tác giả: <strong className="text-dark">{novel.author?.pen_name || 'Khuyết danh'}</strong>
                </div>
              </div>

              {/* Booking Score Badge */}
              <div className="text-end">
                <div className="booking-score-badge fs-4 px-3 py-2">
                  {bookingScore}
                </div>
                <div className="small fw-bold text-primary mt-1">
                  {Number(bookingScore) >= 9.0 ? 'Xuất sắc' : Number(bookingScore) >= 8.0 ? 'Tuyệt vời' : 'Tốt'}
                </div>
                <div className="text-muted small">{ratings.total_ratings} đánh giá</div>
              </div>
            </div>

            {/* Tags / Categories */}
            <div className="d-flex flex-wrap gap-2 mb-3">
              {(novel.categories || []).map((cat) => (
                <Badge key={cat.id} bg="light" text="dark" className="border px-2 py-1 fs-7">
                  {cat.icon || '📚'} {cat.name}
                </Badge>
              ))}
              <Badge bg={novel.status === 'completed' ? 'success' : 'primary'} className="px-2 py-1 fs-7">
                {novel.status === 'completed' ? 'Đã hoàn thành' : 'Đang tiến hành'}
              </Badge>
            </div>

            {/* Quick Stats */}
            <div className="d-flex flex-wrap gap-4 text-muted small py-2 border-top border-bottom mb-3">
              <div><Eye size={16} className="me-1" /> {(novel.total_views || 0).toLocaleString()} lượt xem</div>
              <div><BookOpen size={16} className="me-1" /> {chapters.length} chương</div>
              <div><Calendar size={16} className="me-1" /> Cập nhật: {new Date(novel.updated_at || novel.created_at).toLocaleDateString('vi-VN')}</div>
            </div>

            {/* Action Buttons (Usability <= 4 clicks) */}
            <div className="d-flex flex-wrap gap-2 mt-auto">
              {readingHistory && readingHistory.chapter_id ? (
                <Button
                  as={Link}
                  to={`/read/${readingHistory.chapter_id}`}
                  variant="success"
                  className="fw-bold px-4 py-2 d-flex align-items-center gap-2"
                >
                  <Play size={18} /> Đọc tiếp (Chương {readingHistory.chapter?.chapter_number || 'đã lưu'})
                </Button>
              ) : null}

              {chapters.length > 0 && (
                <Button
                  as={Link}
                  to={`/read/${chapters[0].id}`}
                  className="booking-nav-btn-gold text-dark fw-bold px-4 py-2 d-flex align-items-center gap-2 border-0"
                >
                  <BookOpen size={18} /> Đọc từ đầu (Chương 1)
                </Button>
              )}

              <Button
                variant={isBookmarked ? 'warning' : 'outline-secondary'}
                className="fw-semibold px-3 py-2 d-flex align-items-center gap-2"
                onClick={handleToggleBookmark}
              >
                <Bookmark size={18} className={isBookmarked ? 'fill-current' : ''} />
                {isBookmarked ? 'Đã trong tủ sách' : 'Lưu vào tủ sách'}
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {/* Tabs: Nội dung, Mục lục, Đánh giá */}
      <div className="bg-white p-4 rounded border shadow-sm">
        <Tabs defaultActiveKey="chapters" className="mb-4">
          {/* Tab 1: Mục lục chương */}
          <Tab eventKey="chapters" title={`Mục Lục Chương (${chapters.length})`}>
            {chapters.length === 0 ? (
              <p className="text-muted text-center py-4">Chưa có chương nào được xuất bản cho truyện này.</p>
            ) : (
              <Row className="g-2">
                {chapters.map((ch) => (
                  <Col md={6} key={ch.id}>
                    <Link
                      to={`/read/${ch.id}`}
                      className="p-3 border rounded d-flex justify-content-between align-items-center text-decoration-none text-dark hover-bg-light transition"
                      style={{ backgroundColor: '#fcfcfc' }}
                    >
                      <div className="text-truncate pe-2">
                        <strong className="text-primary me-2">Chương {ch.chapter_number}:</strong>
                        <span>{ch.title}</span>
                      </div>
                      <span className="text-muted small flex-shrink-0">
                        {ch.views || 0} xem
                      </span>
                    </Link>
                  </Col>
                ))}
              </Row>
            )}
          </Tab>

          {/* Tab 2: Tóm tắt giới thiệu */}
          <Tab eventKey="description" title="Giới Thiệu Nội Dung">
            <div className="lh-lg text-dark" style={{ whiteSpace: 'pre-line' }}>
              {novel.description || 'Chưa có thông tin tóm tắt chi tiết cho bộ tiểu thuyết này.'}
            </div>
          </Tab>

          {/* Tab 3: Đánh giá & Reviews (Booking.com style) */}
          <Tab eventKey="reviews" title={`Đánh Giá & Nhận Xét (${ratings.total_ratings})`}>
            <Row className="gy-4">
              {/* Form gửi đánh giá */}
              <Col md={5}>
                <div className="p-3 border rounded bg-light">
                  <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                    <Star size={18} className="text-warning fill-current" /> Viết Đánh Giá Của Bạn
                  </h6>
                  {user ? (
                    <Form onSubmit={handleSubmitReview}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-semibold">
                          Điểm số đánh giá: <strong className="text-primary">{newScore} sao</strong> ({newScore * 2}/10 điểm)
                        </Form.Label>
                        <Form.Range
                          min={1}
                          max={5}
                          step={1}
                          value={newScore}
                          onChange={(e) => setNewScore(parseInt(e.target.value, 10))}
                        />
                        <div className="d-flex justify-content-between text-muted small">
                          <span>1 sao (Tệ)</span>
                          <span>3 sao (Ổn)</span>
                          <span>5 sao (Tuyệt phẩm)</span>
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-semibold">Cảm nhận chi tiết:</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Chia sẻ nhận xét của bạn về cốt truyện, nhân vật..."
                          value={newReviewText}
                          onChange={(e) => setNewReviewText(e.target.value)}
                        />
                      </Form.Group>

                      <Button
                        type="submit"
                        variant="primary"
                        className="w-100 fw-bold"
                        disabled={submittingReview}
                      >
                        {submittingReview ? 'Đang gửi...' : 'Gửi Đánh Giá'}
                      </Button>
                    </Form>
                  ) : (
                    <div className="text-center py-3">
                      <p className="text-muted small mb-2">Vui lòng đăng nhập để gửi đánh giá và nhận xét.</p>
                      <Button as={Link} to="/login" variant="primary" size="sm" className="fw-bold">
                        Đăng nhập ngay
                      </Button>
                    </div>
                  )}
                </div>
              </Col>

              {/* Danh sách các review đã có */}
              <Col md={7}>
                <h6 className="fw-bold mb-3">Tất cả nhận xét từ độc giả</h6>
                {ratings.items && ratings.items.length > 0 ? (
                  <div className="d-flex flex-column gap-3">
                    {ratings.items.map((r) => (
                      <div key={r.id} className="p-3 border rounded bg-white shadow-xs">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div className="d-flex align-items-center gap-2">
                            <img
                              src={r.user?.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=Reader'}
                              alt="Avatar"
                              width={32}
                              height={32}
                              className="rounded-circle"
                            />
                            <div>
                              <div className="fw-bold small">{r.user?.full_name || r.user?.username || 'Độc giả'}</div>
                              <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                {new Date(r.created_at).toLocaleDateString('vi-VN')}
                              </div>
                            </div>
                          </div>
                          <div className="booking-score-badge" style={{ fontSize: '0.85rem' }}>
                            {r.score * 2}.0
                          </div>
                        </div>
                        <p className="small m-0 text-dark">{r.review || 'Độc giả đã chấm điểm truyện này.'}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted py-3">Chưa có nhận xét nào. Hãy là người đầu tiên đánh giá!</p>
                )}
              </Col>
            </Row>
          </Tab>
        </Tabs>
      </div>
    </Container>
  );
}
