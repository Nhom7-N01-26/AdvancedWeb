import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BookOpen, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FooterBooking() {
  return (
    <footer className="booking-footer">
      <Container>
        <Row className="gy-4 mb-4">
          <Col lg={4} md={6}>
            <div className="d-flex align-items-center gap-2 mb-2 text-white fw-bold fs-5">
              <BookOpen size={24} className="text-warning" />
              <span>Phenikaa Novel Manager</span>
            </div>
            <p className="text-light opacity-75 small">
              Hệ thống đọc và quản lý tiểu thuyết trực tuyến xây dựng theo phong cách giao diện Booking.com,
              tập trung vào tốc độ, độ tin cậy và trải nghiệm đọc Zen mode không quảng cáo phiền toái.
            </p>
            <div className="d-flex align-items-center gap-2 text-warning small">
              <ShieldCheck size={16} /> Tuân thủ Nghị định 13/2023/NĐ-CP & Luật Sở hữu Trí tuệ
            </div>
          </Col>

          <Col lg={2} md={3} sm={6}>
            <h6 className="text-white fw-bold mb-3">Khám phá</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li><Link to="/browse">Danh sách truyện</Link></li>
              <li><Link to="/browse?sort_by=total_views">Xem nhiều nhất</Link></li>
              <li><Link to="/browse?sort_by=avg_rating">Đánh giá cao</Link></li>
              <li><Link to="/browse?status=completed">Đã hoàn thành</Link></li>
            </ul>
          </Col>

          <Col lg={3} md={3} sm={6}>
            <h6 className="text-white fw-bold mb-3">Học thuật & Đồ án</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li>Trường Đại học Phenikaa</li>
              <li>Khoa Công nghệ Thông tin</li>
              <li>Thiết kế Web Nâng Cao (2026)</li>
              <li>Giảng viên: TS. Nguyễn Lệ Thu</li>
            </ul>
          </Col>

          <Col lg={3} md={12}>
            <h6 className="text-white fw-bold mb-3">Bảo mật & Giấy phép</h6>
            <p className="text-light opacity-75 small mb-2">
              Bảo mật toàn diện với HttpOnly Cookie, bcrypt 10 salt rounds, ngăn ngừa rò rỉ dữ liệu F12.
            </p>
            <div className="p-2 rounded bg-dark border border-secondary small text-warning font-monospace">
              Open Source under MIT License
            </div>
          </Col>
        </Row>

        <hr className="border-secondary my-3 opacity-25" />

        <div className="d-flex flex-wrap justify-content-between align-items-center small text-light opacity-75">
          <div>
            © 2026 Phenikaa University. Dự án Thiết kế Web Nâng Cao.
          </div>
          <div className="d-flex gap-3">
            <span>Usability ≤ 4 clicks</span>
            <span>•</span>
            <span>Zero Aggressive Ads</span>
            <span>•</span>
            <span>Booking.com UI Style</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
