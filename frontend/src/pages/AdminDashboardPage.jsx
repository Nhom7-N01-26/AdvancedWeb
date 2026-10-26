import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Users, BookOpen, Layers, Eye, Shield, Lock, Unlock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        navigate('/');
        return;
      }

      const fetchDashboard = async () => {
        try {
          setLoading(true);
          const data = await axiosClient.get('/admin/dashboard');
          setDashboardData(data);
        } catch (err) {
          console.error('Lỗi tải admin dashboard:', err);
          setError('Không thể tải dữ liệu quản trị: ' + (err.message || 'Lỗi phân quyền'));
        } finally {
          setLoading(false);
        }
      };

      fetchDashboard();
    }
  }, [user, authLoading, navigate]);

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await axiosClient.patch(`/users/${userId}/status`, { is_active: !currentStatus });
      // Cập nhật lại state
      setDashboardData((prev) => ({
        ...prev,
        recentUsers: prev.recentUsers.map((u) =>
          u.id === userId ? { ...u, is_active: !currentStatus } : u
        ),
      }));
    } catch (err) {
      alert('Không thể cập nhật trạng thái người dùng: ' + (err.message || 'Lỗi hệ thống'));
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Đang tải bảng điều khiển quản trị viên...</p>
      </Container>
    );
  }

  if (error || !dashboardData) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error || 'Không có dữ liệu quản trị'}</Alert>
      </Container>
    );
  }

  const { kpi, topNovels, recentUsers } = dashboardData;

  return (
    <Container className="py-4">
      {/* Header */}
      <div className="bg-white p-4 rounded border mb-4 shadow-sm d-flex justify-content-between align-items-center">
        <div>
          <h4 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <Shield className="text-warning" size={24} /> Bảng Điều Khiển Quản Trị Hệ Thống
          </h4>
          <div className="text-muted small">
            Thống kê KPI hoạt động, giám sát nội dung và phân quyền người dùng (Câu 1 US-13, US-14, US-15).
          </div>
        </div>
        <Badge bg="danger" className="px-3 py-2 fs-7">
          ADMIN ACCESS
        </Badge>
      </div>

      {/* 4 Cards KPI */}
      <Row className="g-3 mb-4">
        <Col md={3} sm={6}>
          <Card className="border-0 shadow-sm bg-primary text-white h-100">
            <Card.Body className="d-flex align-items-center justify-content-between p-3">
              <div>
                <div className="text-white-50 small fw-semibold">TỔNG NGƯỜI DÙNG</div>
                <h3 className="fw-bolder mb-0 mt-1">{kpi.totalUsers}</h3>
              </div>
              <Users size={36} className="text-white-50" />
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} sm={6}>
          <Card className="border-0 shadow-sm text-dark h-100" style={{ backgroundColor: '#febb02' }}>
            <Card.Body className="d-flex align-items-center justify-content-between p-3">
              <div>
                <div className="text-dark-50 small fw-bold">TỔNG ĐẦU TRUYỆN</div>
                <h3 className="fw-bolder mb-0 mt-1">{kpi.totalNovels}</h3>
              </div>
              <BookOpen size={36} className="text-dark-50" />
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} sm={6}>
          <Card className="border-0 shadow-sm bg-success text-white h-100">
            <Card.Body className="d-flex align-items-center justify-content-between p-3">
              <div>
                <div className="text-white-50 small fw-semibold">TỔNG SỐ CHƯƠNG</div>
                <h3 className="fw-bolder mb-0 mt-1">{kpi.totalChapters}</h3>
              </div>
              <Layers size={36} className="text-white-50" />
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} sm={6}>
          <Card className="border-0 shadow-sm bg-dark text-white h-100">
            <Card.Body className="d-flex align-items-center justify-content-between p-3">
              <div>
                <div className="text-white-50 small fw-semibold">TỔNG LƯỢT XEM</div>
                <h3 className="fw-bolder mb-0 mt-1">{(kpi.totalViews || 0).toLocaleString()}</h3>
              </div>
              <Eye size={36} className="text-white-50" />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        {/* Top 5 Truyện xem nhiều */}
        <Col lg={6}>
          <div className="bg-white p-4 rounded border shadow-sm h-100">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <Eye size={20} className="text-primary" /> Top Tiểu Thuyết Xem Nhiều Nhất
            </h5>
            <Table hover responsive className="small align-middle">
              <thead>
                <tr>
                  <th>Tên truyện</th>
                  <th className="text-center">Đánh giá</th>
                  <th className="text-end">Lượt xem</th>
                </tr>
              </thead>
              <tbody>
                {topNovels.map((n) => (
                  <tr key={n.id}>
                    <td>
                      <Link to={`/novel/${n.slug}`} className="fw-bold text-dark text-decoration-none">
                        {n.title}
                      </Link>
                    </td>
                    <td className="text-center">
                      <span className="booking-score-badge py-1 px-2" style={{ fontSize: '0.75rem' }}>
                        {(Number(n.avg_rating || 0) * 2).toFixed(1)}
                      </span>
                    </td>
                    <td className="text-end fw-semibold text-primary">
                      {(n.total_views || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>

        {/* Quản lý người dùng gần đây */}
        <Col lg={6}>
          <div className="bg-white p-4 rounded border shadow-sm h-100">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <Users size={20} className="text-primary" /> Quản Lý Người Dùng & Phân Quyền
            </h5>
            <Table hover responsive className="small align-middle">
              <thead>
                <tr>
                  <th>Người dùng</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th className="text-end">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="fw-bold">{u.full_name || u.username}</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>{u.email}</div>
                    </td>
                    <td>
                      <Badge bg={u.role === 'admin' ? 'danger' : u.role === 'author' ? 'warning' : 'info'}>
                        {u.role.toUpperCase()}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={u.is_active ? 'success' : 'secondary'}>
                        {u.is_active ? 'Hoạt động' : 'Đã khóa'}
                      </Badge>
                    </td>
                    <td className="text-end">
                      {u.role !== 'admin' && (
                        <Button
                          variant={u.is_active ? 'outline-danger' : 'outline-success'}
                          size="sm"
                          className="p-1 px-2"
                          onClick={() => handleToggleUserStatus(u.id, u.is_active)}
                          title={u.is_active ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                        >
                          {u.is_active ? <Lock size={14} /> : <Unlock size={14} />}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
