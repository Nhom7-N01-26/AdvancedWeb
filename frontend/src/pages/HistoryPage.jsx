import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Play, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await axiosClient.get('/history/my');
        setHistoryList(data || []);
      } catch (err) {
        console.error('Lỗi khi tải reading history:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchHistory();
    }
  }, [user, authLoading, navigate]);

  return (
    <Container className="py-4">
      <div className="bg-white p-4 rounded border mb-4 shadow-sm">
        <h4 className="fw-bold mb-1 d-flex align-items-center gap-2">
          <Clock className="text-primary" size={24} /> Lịch Sử Đọc & Tiến Trình Tự Động
        </h4>
        <div className="text-muted small">
          Hệ thống tự động ghi nhớ chương gần nhất để bạn tiếp tục đọc bất cứ lúc nào (Quy tắc Usability ≤ 4 clicks).
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Đang tải lịch sử đọc...</p>
        </div>
      ) : historyList.length === 0 ? (
        <div className="text-center py-5 bg-white rounded border">
          <BookOpen size={48} className="text-muted mb-3" />
          <h5 className="fw-bold text-muted">Bạn chưa đọc bộ truyện nào</h5>
          <p className="text-muted small mb-3">Bắt đầu đọc để hệ thống tự động ghi nhớ tiến trình đọc sách của bạn.</p>
          <Button as={Link} to="/browse" variant="primary" className="fw-bold">
            Khám phá truyện ngay
          </Button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {historyList.map((item) => {
            const novel = item.novel;
            const chapter = item.chapter;
            if (!novel) return null;

            const coverUrl = novel.cover_image && novel.cover_image.startsWith('/public')
              ? `http://localhost:5000${novel.cover_image}`
              : novel.cover_image && novel.cover_image.startsWith('/assets')
              ? `http://localhost:5000${novel.cover_image.replace('/assets', '/public')}`
              : novel.cover_image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400';

            return (
              <div key={item.id} className="p-3 bg-white border rounded shadow-sm d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={coverUrl}
                    alt={novel.title}
                    width={56}
                    height={76}
                    className="rounded object-fit-cover shadow-xs flex-shrink-0"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400';
                    }}
                  />
                  <div>
                    <h6 className="fw-bold mb-1">
                      <Link to={`/novel/${novel.slug}`} className="text-dark text-decoration-none">
                        {novel.title}
                      </Link>
                    </h6>
                    <div className="text-muted small mb-1">
                      Tác giả: {novel.author?.pen_name || 'Khuyết Danh'}
                    </div>
                    <div className="small text-primary fw-semibold">
                      Đang đọc: Chương {chapter?.chapter_number || '?'}: {chapter?.title || 'Chương hiện tại'}
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3 ms-auto">
                  <div className="text-muted small text-end d-none d-sm-block">
                    <div>Lần đọc cuối:</div>
                    <strong className="text-dark">{new Date(item.read_at).toLocaleString('vi-VN')}</strong>
                  </div>
                  {chapter ? (
                    <Button
                      as={Link}
                      to={`/read/${chapter.id}`}
                      variant="success"
                      className="fw-bold d-flex align-items-center gap-2 px-3 py-2"
                    >
                      <Play size={16} /> Tiếp tục đọc
                    </Button>
                  ) : (
                    <Button as={Link} to={`/novel/${novel.slug}`} variant="outline-primary" size="sm">
                      Xem chi tiết
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Container>
  );
}
