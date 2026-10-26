import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, BookOpen, ChevronRight, Award } from 'lucide-react';
import BookingSearchBar from '../components/BookingSearchBar';
import NovelCard from '../components/NovelCard';
import axiosClient from '../api/axiosClient';

export default function HomePage() {
  const [featuredNovels, setFeaturedNovels] = useState([]);
  const [recentNovels, setRecentNovels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [featured, recent, cats] = await Promise.all([
          axiosClient.get('/novels/featured'),
          axiosClient.get('/novels?sort_by=created_at&limit=8'),
          axiosClient.get('/categories'),
        ]);

        setFeaturedNovels(featured || []);
        setRecentNovels(recent?.items || []);
        setCategories((cats || []).slice(0, 6));
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu trang chủ:', err);
        setError('Không thể kết nối đến máy chủ API. Vui lòng kiểm tra lại dịch vụ Backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section Booking.com Style */}
      <section className="booking-hero">
        <Container>
          <div className="py-4">
            <h1 className="fw-bolder display-6 mb-2">
              Khám Phá Hàng Ngàn Bộ Tiểu Thuyết Đặc Sắc
            </h1>
            <p className="fs-5 opacity-90 mb-0">
              Trải nghiệm đọc sách chuẩn phong cách Booking.com: Tối giản, mượt mà, lưu tiến trình tự động và hoàn toàn không quảng cáo.
            </p>
          </div>
        </Container>
      </section>

      {/* Floating Search Bar */}
      <Container className="mb-5">
        <BookingSearchBar />
      </Container>

      <Container className="mb-5">
        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Đang tải thư viện truyện...</p>
          </div>
        ) : (
          <>
            {/* Section 1: Thể loại nổi bật */}
            <div className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold m-0 d-flex align-items-center gap-2">
                  <BookOpen className="text-primary" size={24} /> Khám phá theo Thể loại
                </h4>
                <Link to="/browse" className="text-decoration-none fw-semibold d-flex align-items-center gap-1 text-primary">
                  Xem tất cả <ChevronRight size={16} />
                </Link>
              </div>

              <Row className="g-3">
                {categories.map((cat) => (
                  <Col key={cat.id} lg={2} md={4} sm={6}>
                    <Link
                      to={`/browse?category_id=${cat.id}`}
                      className="text-decoration-none"
                    >
                      <div className="p-3 bg-white border rounded text-center h-100 shadow-sm hover-shadow transition">
                        <div className="fs-2 mb-1">{cat.icon || '📚'}</div>
                        <div className="fw-bold text-dark">{cat.name}</div>
                        <div className="text-muted small">{cat.novel_count || 0} truyện</div>
                      </div>
                    </Link>
                  </Col>
                ))}
              </Row>
            </div>

            {/* Section 2: Tiểu Thuyết Nổi Bật (Featured) */}
            <div className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h4 className="fw-bold m-0 d-flex align-items-center gap-2">
                    <Sparkles className="text-warning" size={24} /> Tuyển Chọn Nổi Bật
                  </h4>
                  <div className="text-muted small">Những bộ tiểu thuyết được đánh giá cao nhất trên hệ thống</div>
                </div>
                <Link to="/browse?sort_by=avg_rating" className="text-decoration-none fw-semibold d-flex align-items-center gap-1 text-primary">
                  Xem thêm <ChevronRight size={16} />
                </Link>
              </div>

              <Row className="g-3">
                {featuredNovels.map((novel) => (
                  <Col key={novel.id} xl={3} lg={4} md={6}>
                    <NovelCard novel={novel} />
                  </Col>
                ))}
              </Row>
            </div>

            {/* Section 3: Mới Cập Nhật */}
            <div className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h4 className="fw-bold m-0 d-flex align-items-center gap-2">
                    <TrendingUp className="text-success" size={24} /> Truyện Mới Cập Nhật
                  </h4>
                  <div className="text-muted small">Cập nhật liên tục các chương mới nhất từ tác giả</div>
                </div>
                <Link to="/browse?sort_by=created_at" className="text-decoration-none fw-semibold d-flex align-items-center gap-1 text-primary">
                  Xem toàn bộ <ChevronRight size={16} />
                </Link>
              </div>

              <Row className="g-3">
                {recentNovels.map((novel) => (
                  <Col key={novel.id} xl={3} lg={4} md={6}>
                    <NovelCard novel={novel} />
                  </Col>
                ))}
              </Row>
            </div>

            {/* Section 4: Banner Cam Kết Chất Lượng Phenikaa */}
            <div className="p-4 rounded bg-primary text-white mb-5 shadow-sm">
              <Row className="align-items-center">
                <Col md={8}>
                  <h4 className="fw-bold d-flex align-items-center gap-2 mb-2">
                    <Award size={28} className="text-warning" /> Trải Nghiệm Đọc Tiểu Thuyết Thuần Khiết
                  </h4>
                  <p className="mb-0 opacity-90">
                    Tuân thủ tiêu chuẩn Usability: Không cửa sổ bật lên (popup), tự động ghi nhớ trang đọc,
                    đồng bộ danh sách yêu thích và bảo mật tài khoản tuyệt đối.
                  </p>
                </Col>
                <Col md={4} className="text-md-end mt-3 mt-md-0">
                  <Button as={Link} to="/browse" variant="warning" className="fw-bold px-4 py-2">
                    Khám phá ngay
                  </Button>
                </Col>
              </Row>
            </div>
          </>
        )}
      </Container>
    </div>
  );
}
