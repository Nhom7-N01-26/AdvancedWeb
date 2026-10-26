import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);

    try {
      await register({
        username,
        full_name: fullName,
        email,
        password,
      });
      alert('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Không thể tạo tài khoản');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: '480px' }}>
      <div className="text-center mb-4">
        <Link to="/" className="text-decoration-none d-inline-flex align-items-center gap-2 text-dark fs-3 fw-bold">
          <BookOpen className="text-primary" size={32} />
          <span>Phenikaa Novel</span>
        </Link>
        <div className="text-muted small mt-1">Đăng ký tài khoản người đọc mới</div>
      </div>

      <Card className="shadow-sm border">
        <Card.Body className="p-4">
          <h4 className="fw-bold mb-3">Tạo tài khoản</h4>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold">Tên đăng nhập (Username)</Form.Label>
              <Form.Control
                type="text"
                placeholder="nguyenvana"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold">Họ và tên</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nguyễn Văn A"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold">Địa chỉ Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold">Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ít nhất 6 ký tự"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="small fw-semibold">Xác nhận mật khẩu</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập lại mật khẩu"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100 fw-bold booking-search-btn py-2 mb-3"
              disabled={loading}
            >
              {loading ? 'Đang tạo tài khoản...' : 'Đăng ký thành viên'}
            </Button>
          </Form>

          <div className="text-center small text-muted">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-primary fw-semibold text-decoration-none">
              Đăng nhập tại đây
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
