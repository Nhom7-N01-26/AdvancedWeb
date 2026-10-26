import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { STUDENT_GROUP_INFO } from '../data/initialData';

export default function Footer({ onSelectCategory, onSelectAuthor, onOpenCreateNovel }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="mt-5">
      {/* Top Banner: Newsletter subscription (Booking style) */}
      <div className="booking-footer-top">
        <Container>
          <h3 className="fw-bold fs-4 mb-2">Tiết kiệm thời gian, đắm chìm vào từng trang sách!</h3>
          <p className="text-white-50 small mb-3">
            Đăng ký email để nhận thông báo chương mới ra mắt và danh sách đề cử tác phẩm độc quyền mỗi tuần
          </p>

          <form onSubmit={handleSubscribe} className="booking-newsletter-box">
            <Form.Control
              type="email"
              placeholder="Địa chỉ e-mail của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="py-2"
            />
            <Button type="submit" variant="primary" className="fw-bold px-4 text-nowrap">
              {subscribed ? 'Đã đăng ký ✓' : 'Đăng ký'}
            </Button>
          </form>

          {subscribed && (
            <div className="text-warning small mt-2">
              🎉 Cảm ơn bạn đã đăng ký nhận thông báo từ NovelBooking Nhóm 7!
            </div>
          )}

          {/* Property partner equivalent: "Đăng tải tiểu thuyết của bạn" */}
          <div className="mt-4 pt-3 border-top border-white border-opacity-10">
            <Button
              variant="outline-light"
              size="sm"
              className="fw-bold rounded-1 px-4 py-2"
              onClick={onOpenCreateNovel}
            >
              <i className="bi bi-pen-fill me-2 text-warning"></i>
              Bạn là tác giả? Đăng tải tác phẩm của bạn ngay hôm nay
            </Button>
          </div>
        </Container>
      </div>

      {/* Main Footer Directory */}
      <div className="booking-footer-main">
        <Container>
          <Row className="gy-4">
            {/* Column 1: Thể loại */}
            <Col xs={6} sm={6} md={3} lg={2}>
              <div className="booking-footer-title">Thể loại phổ biến</div>
              {['Tiên Hiệp', 'Kiếm Hiệp', 'Huyền Huyễn', 'Đô Thị', 'Võng Du', 'Trọng Sinh'].map((cat, i) => (
                <a
                  key={i}
                  href={`#${cat}`}
                  className="booking-footer-link"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory(cat);
                  }}
                >
                  {cat}
                </a>
              ))}
            </Col>

            {/* Column 2: Tác giả */}
            <Col xs={6} sm={6} md={3} lg={3}>
              <div className="booking-footer-title">Tác giả hàng đầu</div>
              {['Mặc Hương Đồng Xứ', 'Thiên Tàm Thổ Đậu', 'Vong Ngữ', 'Hồ Điệp Lam'].map((auth, i) => (
                <a
                  key={i}
                  href={`#${auth}`}
                  className="booking-footer-link"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectAuthor(auth);
                  }}
                >
                  {auth}
                </a>
              ))}
              <div className="mt-2 text-muted small">
                <i className="bi bi-patch-check-fill text-primary me-1"></i>
                Tác giả Bạch Kim đối tác
              </div>
            </Col>

            {/* Column 3: Khám phá */}
            <Col xs={6} sm={6} md={3} lg={2}>
              <div className="booking-footer-title">Khám phá nhanh</div>
              <a href="#featured" className="booking-footer-link">Truyện đề cử</a>
              <a href="#completed" className="booking-footer-link">Truyện đã hoàn thành (Full)</a>
              <a href="#rankings" className="booking-footer-link">Bảng xếp hạng lượt đọc</a>
              <a href="#reviews" className="booking-footer-link">Độc giả đánh giá</a>
              <a href="#genius" className="booking-footer-link">Chương trình Genius</a>
            </Col>

            {/* Column 4 & 5: Student Project Information (Nhóm 7) */}
            <Col xs={12} sm={6} md={3} lg={5}>
              <div className="p-3 rounded-2 bg-light border">
                <div className="fw-bold text-dark fs-6 mb-1 d-flex align-items-center gap-2">
                  <i className="bi bi-mortarboard-fill text-primary"></i>
                  <span>{STUDENT_GROUP_INFO.group_name} · {STUDENT_GROUP_INFO.class_name}</span>
                </div>
                <div className="text-muted small mb-2">{STUDENT_GROUP_INFO.university}</div>
                <div className="text-secondary small fw-medium mb-2">
                  Đề tài: <strong>{STUDENT_GROUP_INFO.project_title}</strong>
                </div>

                <div className="table-responsive">
                  <table className="table table-sm table-borderless m-0" style={{ fontSize: '0.78rem' }}>
                    <thead>
                      <tr className="border-bottom text-muted">
                        <th>STT</th>
                        <th>Họ và tên</th>
                        <th>Mã sinh viên</th>
                        <th>Nhiệm vụ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {STUDENT_GROUP_INFO.members.map((m) => (
                        <tr key={m.id}>
                          <td className="fw-bold">{m.id}</td>
                          <td className="fw-semibold text-dark">{m.name}</td>
                          <td className="text-muted"><code>{m.student_id}</code></td>
                          <td className="text-secondary">{m.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Col>
          </Row>

          {/* Copyright & Disclaimer */}
          <div className="booking-copyright">
            <p className="mb-1">
              Bản quyền © 2026 <strong>NovelBooking.vn</strong> · Sản phẩm bài tập môn Lập trình Web Nâng Cao của <strong>Nhóm 7</strong>.
            </p>
            <p className="text-muted m-0" style={{ fontSize: '0.75rem' }}>
              Giao diện được xây dựng tuân theo bố cục và phong cách thiết kế đặc trưng của Booking.com (Links to an external site.) với thư viện React-Bootstrap.
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
