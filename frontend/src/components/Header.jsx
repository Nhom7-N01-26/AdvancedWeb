import React, { useState, useRef } from 'react';
import { Container, Dropdown, Badge, Button, Modal, Row, Col } from 'react-bootstrap';
import { INITIAL_USERS } from '../data/initialData';

export default function Header({
  activeNav,
  setActiveNav,
  currentUser,
  setCurrentUser,
  onUpdateAvatar,
  bookmarkCount,
  onOpenCrud,
  onOpenCreateNovel,
  backendStatus,
  onOpenAuth,
  onLogout
}) {
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [tempAvatar, setTempAvatar] = useState('');
  const fileInputRef = useRef(null);

  // Danh sách avatar mẫu phong phú để người dùng chọn nhanh nếu không muốn tải ảnh
  const PRESET_AVATARS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80'
  ];

  // Xử lý khi người dùng chọn ảnh từ máy tính / điện thoại / thư viện
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn tệp định dạng hình ảnh (PNG, JPG, JPEG, WEBP, GIF)');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setTempAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = () => {
    if (tempAvatar && onUpdateAvatar) {
      onUpdateAvatar(tempAvatar);
    }
    setShowAvatarModal(false);
    setTempAvatar('');
  };

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
              className={`badge d-flex align-items-center gap-1 ${backendStatus.isOnline ? 'bg-success' : 'bg-secondary'}`}
              title={backendStatus.isOnline ? 'API NestJS Cloud MySQL đang kết nối: http://localhost:5000' : 'Offline Mode'}
              style={{ padding: '6px 10px', fontSize: '0.78rem' }}
            >
              <span className="pulse-indicator" style={{ backgroundColor: backendStatus.isOnline ? '#22c55e' : '#cbd5e1' }}></span>
              {backendStatus.isOnline ? 'Cloud Aiven :5000' : 'Offline Mode'}
            </span>

            {/* Language */}
            <span className="btn btn-sm text-white border-0 d-flex align-items-center gap-1" title="Tiếng Việt">
              🇻🇳 <span className="small">VI</span>
            </span>

            {/* ===== NẾU CHƯA ĐĂNG NHẬP ===== */}
            {!currentUser ? (
              <>
                <Button
                  variant="outline-light"
                  size="sm"
                  className="fw-bold px-3 py-1 rounded-1"
                  onClick={onOpenAuth}
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  Đăng nhập
                </Button>
                <Button
                  variant="warning"
                  size="sm"
                  className="fw-bold px-3 py-1 text-dark rounded-1"
                  onClick={onOpenAuth}
                >
                  <i className="bi bi-person-plus me-1"></i>
                  Đăng ký
                </Button>
              </>
            ) : (
              <>
                {/* ONLY ADMIN: Post / Create novel & Management shortcut */}
                {currentUser.role === 'admin' && (
                  <>
                    <Button
                      variant="outline-light"
                      size="sm"
                      className="fw-bold px-3 py-1 rounded-1"
                      onClick={onOpenCreateNovel}
                    >
                      <i className="bi bi-plus-circle me-1"></i>
                      Đăng truyện mới
                    </Button>

                    <Button
                      variant="warning"
                      size="sm"
                      className="fw-bold px-3 py-1 text-dark rounded-1"
                      onClick={onOpenCrud}
                    >
                      <i className="bi bi-kanban me-1"></i>
                      Quản lý tác phẩm
                    </Button>
                  </>
                )}

                {/* User Profile Dropdown */}
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
                    <span className="fw-semibold small d-none d-sm-inline">{currentUser.full_name?.split(' ').pop()}</span>
                    <span className={`badge text-white ${currentUser.role === 'admin' ? 'bg-danger' : 'bg-primary'}`} style={{ fontSize: '0.65rem' }}>
                      {currentUser.role?.toUpperCase()}
                    </span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="shadow-lg border-0 p-2" style={{ minWidth: 270 }}>
                    <div className="px-2 py-1 mb-2 border-bottom">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.full_name}
                          className="rounded-circle border"
                          style={{ width: 36, height: 36, objectFit: 'cover' }}
                        />
                        <div>
                          <div className="fw-bold text-dark small">{currentUser.full_name}</div>
                          <div className="text-muted" style={{ fontSize: '0.72rem' }}>{currentUser.email}</div>
                        </div>
                      </div>
                      <div className={`badge mt-1 ${currentUser.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>{currentUser.badge}</div>
                    </div>

                    {/* NÚT ĐỔI AVATAR TỪ THƯ VIỆN ẢNH NGƯỜI DÙNG */}
                    <div className="px-2 mb-2">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="w-100 d-flex align-items-center justify-content-center gap-2 py-1 fw-semibold"
                        style={{ fontSize: '0.8rem' }}
                        onClick={() => {
                          setTempAvatar(currentUser.avatar);
                          setShowAvatarModal(true);
                        }}
                      >
                        <i className="bi bi-camera-fill"></i>
                        Đổi avatar từ thư viện ảnh
                      </Button>
                    </div>

                    <Dropdown.Item onClick={() => setActiveNav('bookmarks')} className="small">
                      <i className="bi bi-bookmark-heart text-danger me-2"></i>
                      Tủ sách đã lưu ({bookmarkCount})
                    </Dropdown.Item>
                    {currentUser.role === 'admin' && (
                      <Dropdown.Item onClick={onOpenCrud} className="small">
                        <i className="bi bi-sliders text-primary me-2"></i>
                        Quản lý tác phẩm
                      </Dropdown.Item>
                    )}

                    <Dropdown.Divider />
                    <Dropdown.Item onClick={onLogout} className="small text-danger fw-semibold">
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Đăng xuất
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            )}
          </div>
        </div>

        {/* Modal Đổi Avatar từ thư viện thiết bị / mẫu */}
        <Modal
          show={showAvatarModal}
          onHide={() => setShowAvatarModal(false)}
          centered
          size="md"
        >
          <Modal.Header closeButton className="bg-light">
            <Modal.Title className="fs-6 fw-bold">
              <i className="bi bi-camera-fill me-2 text-primary"></i>
              Đổi Ảnh Đại Diện (Thư Viện Ảnh Người Dùng)
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            {/* Xem trước Avatar */}
            <div className="text-center mb-4">
              <div className="position-relative d-inline-block">
                <img
                  src={tempAvatar || currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt="Avatar Preview"
                  className="rounded-circle shadow-sm border border-3 border-primary"
                  style={{ width: 110, height: 110, objectFit: 'cover' }}
                />
                <button
                  type="button"
                  className="btn btn-sm btn-primary rounded-circle position-absolute bottom-0 end-0 p-2 shadow"
                  onClick={() => fileInputRef.current?.click()}
                  title="Tải ảnh mới từ máy"
                >
                  <i className="bi bi-upload"></i>
                </button>
              </div>
              <div className="small text-muted mt-2">
                Ảnh đại diện hiện tại của <strong>{currentUser?.full_name || 'Bạn'}</strong>
              </div>
            </div>

            {/* Input file ẩn để người dùng chọn tệp từ máy / thư viện */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            {/* Nút bấm chọn từ máy */}
            <div className="mb-4 text-center">
              <Button
                variant="primary"
                className="w-100 fw-bold py-2 mb-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <i className="bi bi-folder-symlink-fill me-2"></i>
                Chọn ảnh từ thư viện thiết bị của bạn...
              </Button>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                Hỗ trợ tệp PNG, JPG, GIF, WebP từ máy tính hoặc điện thoại
              </div>
            </div>

            {/* Hoặc chọn từ danh mục ảnh mẫu có sẵn */}
            <div className="border-top pt-3">
              <div className="fw-semibold small text-muted mb-2">Hoặc chọn nhanh từ bộ sưu tập:</div>
              <Row className="g-2">
                {PRESET_AVATARS.map((url, idx) => (
                  <Col xs={3} key={idx} className="text-center">
                    <img
                      src={url}
                      alt={`Preset ${idx + 1}`}
                      className={`rounded-circle border ${tempAvatar === url ? 'border-primary border-3 shadow' : 'border-light'}`}
                      style={{ width: 50, height: 50, objectFit: 'cover', cursor: 'pointer', transition: 'transform 0.2s' }}
                      onClick={() => setTempAvatar(url)}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                  </Col>
                ))}
              </Row>
            </div>
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button variant="secondary" size="sm" onClick={() => setShowAvatarModal(false)}>
              Hủy
            </Button>
            <Button variant="success" size="sm" className="fw-bold px-3" onClick={handleSaveAvatar}>
              <i className="bi bi-check-lg me-1"></i>
              Lưu ảnh đại diện
            </Button>
          </Modal.Footer>
        </Modal>

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

          {currentUser?.role === 'admin' && (
            <button
              className={`booking-nav-pill ${activeNav === 'crud' ? 'active' : ''}`}
              onClick={onOpenCrud}
            >
              <i className="bi bi-kanban"></i>
              Quản lý tác phẩm
            </button>
          )}
        </nav>
      </Container>
    </header>
  );
}
