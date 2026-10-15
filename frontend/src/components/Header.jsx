import React from 'react';
import { Container, Dropdown, Badge, Button } from 'react-bootstrap';
import { INITIAL_USERS } from '../data/initialData';

export default function Header({
  activeNav,
  setActiveNav,
  currentUser,
  setCurrentUser,
  bookmarkCount,
  onOpenCrud,
  onOpenCreateNovel,
  backendStatus
}) {
  return (
    <header className="booking-header">
      <Container>
        {/* Top bar with Logo and Utility actions */}
        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
          {/* Logo */}
          <div className="d-flex align-items-center gap-3">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                setActiveNav('novels');
              }}
              className="booking-brand"
            >
              <i className="bi bi-book-half text-warning"></i>
              <span>NovelBooking<span className="booking-brand-dot">.vn</span></span>
            </a>
            <span className="d-none d-md-inline-block text-white-50 border-start ps-3 py-1 small">
              Nhóm 7 · Quản Lý & Đọc Tiểu Thuyết (Web Nâng Cao)
            </span>
          </div>

          {/* Right utility items */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            {/* Backend status indicator */}
            <span
              className={`badge d-flex align-items-center gap-1 ${
                backendStatus.isOnline ? 'bg-success' : 'bg-secondary'
              }`}
              title={
                backendStatus.isOnline
                  ? 'Máy chủ Express (MySQL) đang kết nối: http://localhost:3000'
                  : 'Máy chủ Backend đang offline. Hệ thống tự động kích hoạt bộ nhớ LocalStorage & CSDL dự phòng'
              }
              style={{ padding: '6px 10px', fontSize: '0.78rem' }}
            >
              <span className="pulse-indicator" style={{ backgroundColor: backendStatus.isOnline ? '#22c55e' : '#cbd5e1' }}></span>
              {backendStatus.isOnline ? 'API Online :3000' : 'Offline Mode (Local Sync)'}
            </span>

            {/* Language */}
            <span className="btn btn-sm text-white border-0 d-flex align-items-center gap-1" title="Tiếng Việt">
              🇻🇳 <span className="small">VI</span>
            </span>

            {/* Post / Create novel button */}
            <Button
              variant="outline-light"
              size="sm"
              className="fw-bold px-3 py-1 rounded-1"
              onClick={onOpenCreateNovel}
            >
              <i className="bi bi-plus-circle me-1"></i>
              Đăng truyện mới
            </Button>

            {/* Management shortcut */}
            <Button
              variant="warning"
              size="sm"
              className="fw-bold px-3 py-1 text-dark rounded-1"
              onClick={onOpenCrud}
            >
              <i className="bi bi-kanban me-1"></i>
              Quản lý tác phẩm
            </Button>

            {/* User Profile & Role Switcher */}
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="outline-light"
                id="user-role-dropdown"
                size="sm"
                className="d-flex align-items-center gap-2 border-0 bg-white text-dark rounded-pill px-2 py-1 shadow-sm"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.full_name}
                  className="rounded-circle"
                  style={{ width: 24, height: 24, objectFit: 'cover' }}
                />
                <span className="fw-semibold small d-none d-sm-inline">{currentUser.full_name.split(' ')[0]}</span>
                <span className="badge bg-primary text-white" style={{ fontSize: '0.65rem' }}>
                  {currentUser.role.toUpperCase()}
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="shadow-lg border-0 p-2" style={{ minWidth: 260 }}>
                <div className="px-2 py-1 mb-2 border-bottom">
                  <div className="fw-bold text-dark">{currentUser.full_name}</div>
                  <div className="text-muted small">{currentUser.email}</div>
                  <div className="badge bg-primary mt-1">{currentUser.badge}</div>
                </div>

                <div className="text-muted small px-2 mb-1 fw-bold">CHUYỂN VAI TRÒ (DEMO PHÂN QUYỀN):</div>
                {INITIAL_USERS.map((u) => (
                  <Dropdown.Item
                    key={u.id}
                    active={currentUser.id === u.id}
                    onClick={() => setCurrentUser(u)}
                    className="rounded small py-1"
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <span>{u.full_name}</span>
                      <span className="badge bg-secondary ms-2">{u.role}</span>
                    </div>
                  </Dropdown.Item>
                ))}

                <Dropdown.Divider />
                <Dropdown.Item onClick={() => setActiveNav('bookmarks')} className="small">
                  <i className="bi bi-bookmark-heart text-danger me-2"></i>
                  Tủ sách đã lưu ({bookmarkCount})
                </Dropdown.Item>
                <Dropdown.Item onClick={onOpenCrud} className="small">
                  <i className="bi bi-sliders text-primary me-2"></i>
                  Quản lý tác phẩm
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        {/* Navigation Tabs (Booking.com signature navigation pills) */}
        <nav className="d-flex align-items-center gap-1 overflow-auto pb-2" style={{ whiteSpace: 'nowrap' }}>
          <button
            className={`booking-nav-pill ${activeNav === 'novels' ? 'active' : ''}`}
            onClick={() => setActiveNav('novels')}
          >
            <i className="bi bi-journals"></i>
            Tất cả tiểu thuyết
          </button>

          <button
            className={`booking-nav-pill ${activeNav === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveNav('categories')}
          >
            <i className="bi bi-grid-3x3-gap-fill"></i>
            Thể loại truyện
          </button>

          <button
            className={`booking-nav-pill ${activeNav === 'rankings' ? 'active' : ''}`}
            onClick={() => setActiveNav('rankings')}
          >
            <i className="bi bi-trophy-fill text-warning"></i>
            Bảng xếp hạng Hot
          </button>

          <button
            className={`booking-nav-pill ${activeNav === 'authors' ? 'active' : ''}`}
            onClick={() => setActiveNav('authors')}
          >
            <i className="bi bi-pen-fill"></i>
            Tác giả nổi tiếng
          </button>

          <button
            className={`booking-nav-pill ${activeNav === 'bookmarks' ? 'active' : ''}`}
            onClick={() => setActiveNav('bookmarks')}
          >
            <i className="bi bi-bookmark-star-fill text-warning"></i>
            Tủ sách của tôi
            {bookmarkCount > 0 && (
              <Badge bg="danger" pill className="ms-1" style={{ fontSize: '0.7rem' }}>
                {bookmarkCount}
              </Badge>
            )}
          </button>

          <button
            className={`booking-nav-pill ${activeNav === 'crud' ? 'active' : ''}`}
            onClick={onOpenCrud}
          >
            <i className="bi bi-kanban"></i>
            Quản lý tác phẩm
          </button>
        </nav>
      </Container>
    </header>
  );
}
