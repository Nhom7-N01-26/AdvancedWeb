import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Bookmark, Clock, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function NavbarBooking() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Navbar expand="lg" className="booking-navbar" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="booking-brand">
          <BookOpen size={28} className="text-warning" />
          <span>Phenikaa</span>Novel
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="booking-nav" />

        <Navbar.Collapse id="booking-nav">
          <Nav className="me-auto ms-3">
            <Nav.Link as={Link} to="/" className="text-white fw-semibold">
              Trang chủ
            </Nav.Link>
            <Nav.Link as={Link} to="/browse" className="text-white fw-semibold">
              Danh sách truyện
            </Nav.Link>
            {user && (
              <>
                <Nav.Link as={Link} to="/my-bookmarks" className="text-white d-flex align-items-center gap-1">
                  <Bookmark size={16} /> Yêu thích
                </Nav.Link>
                <Nav.Link as={Link} to="/my-history" className="text-white d-flex align-items-center gap-1">
                  <Clock size={16} /> Lịch sử đọc
                </Nav.Link>
              </>
            )}
            {user && user.role === 'admin' && (
              <Nav.Link as={Link} to="/admin" className="text-warning d-flex align-items-center gap-1 fw-bold">
                <Shield size={16} /> Quản trị
              </Nav.Link>
            )}
          </Nav>

          <Nav className="align-items-center gap-2">
            {user ? (
              <NavDropdown
                title={
                  <span className="text-white fw-semibold d-inline-flex align-items-center gap-2">
                    <img
                      src={user.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=Reader'}
                      alt="Avatar"
                      width={28}
                      height={28}
                      className="rounded-circle bg-light"
                    />
                    {user.full_name || user.username}
                  </span>
                }
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.ItemText className="text-muted small">
                  Vai trò: <strong className="text-primary text-uppercase">{user.role}</strong>
                </NavDropdown.ItemText>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/my-bookmarks">
                  <Bookmark size={15} className="me-2" /> Truyện đã lưu
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/my-history">
                  <Clock size={15} className="me-2" /> Lịch sử tiến trình
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="text-danger">
                  <LogOut size={15} className="me-2" /> Đăng xuất
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <div className="d-flex gap-2">
                <Button as={Link} to="/register" className="booking-nav-btn booking-nav-btn-outline">
                  Đăng ký
                </Button>
                <Button as={Link} to="/login" className="booking-nav-btn booking-nav-btn-gold">
                  Đăng nhập
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
