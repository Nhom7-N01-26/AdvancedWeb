import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Email hoặc mật khẩu không chính xác');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: '440px' }}>
      <div className="text-center mb-4">
        <Link to="/" className="text-decoration-none d-inline-flex align-items-center gap-2 text-dark fs-3 fw-bold">
          <BookOpen className="text-primary" size={32} />
          <span>Phenikaa Novel</span>
        </Link>
        <div className="text-muted small mt-1">Đăng nhập tài khoản để đồng bộ tủ sách cá nhân</div>
      </div>

      <Card className="shadow-sm border">
        <Card.Body className="p-4">
          <h4 className="fw-bold mb-3">Đăng nhập</h4>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
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

            <Form.Group className="mb-4">
              <Form.Label className="small fw-semibold">Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập mật khẩu"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100 fw-bold booking-search-btn py-2 mb-3"
              disabled={loading}
            >
              {loading ? 'Đang xác thực...' : 'Đăng nhập'}
            </Button>
          </Form>

          <div className="text-center small text-muted">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-primary fw-semibold text-decoration-none">
              Đăng ký ngay
            </Link>
          </div>

          <div className="mt-3 p-2 bg-light rounded small text-muted">
            <strong>Tài khoản Demo Admin:</strong>
            <div>Email: <code>admin@phenikaa-uni.edu.vn</code></div>
            <div>Mật khẩu: <code>Admin@123456</code></div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
