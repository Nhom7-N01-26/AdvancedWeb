import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, BookOpen } from 'lucide-react';
import NovelCard from '../components/NovelCard';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';

export default function BookmarksPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        const data = await axiosClient.get('/bookmarks/my');
        setBookmarks(data || []);
      } catch (err) {
        console.error('Lỗi khi tải bookmarks:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookmarks();
    }
  }, [user, authLoading, navigate]);

  const handleBookmarkToggle = (novelId, isBookmarked) => {
    if (!isBookmarked) {
      setBookmarks((prev) => prev.filter((b) => b.novel_id !== novelId));
    }
  };

  return (
    <Container className="py-4">
      <div className="bg-white p-4 rounded border mb-4 shadow-sm">
        <h4 className="fw-bold mb-1 d-flex align-items-center gap-2">
          <Bookmark className="text-warning fill-current" size={24} /> Tủ Sách Yêu Thích Của Tôi
        </h4>
        <div className="text-muted small">
          Theo dõi các bộ truyện đã lưu và nhận thông báo khi có chương mới.
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Đang tải tủ sách...</p>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-5 bg-white rounded border">
          <BookOpen size={48} className="text-muted mb-3" />
          <h5 className="fw-bold text-muted">Tủ sách của bạn đang trống</h5>
          <p className="text-muted small mb-3">Hãy khám phá thư viện và nhấn nút lưu bookmark để thêm truyện vào đây.</p>
          <Button as={Link} to="/browse" variant="primary" className="fw-bold">
            Khám phá truyện ngay
          </Button>
        </div>
      ) : (
        <Row className="g-3">
          {bookmarks.map((bm) => (
            <Col key={bm.id} xl={3} lg={4} sm={6}>
              <NovelCard
                novel={bm.novel}
                isBookmarkedInitial={true}
                onBookmarkToggle={handleBookmarkToggle}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
