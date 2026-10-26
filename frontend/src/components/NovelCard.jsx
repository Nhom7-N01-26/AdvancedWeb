import React, { useState } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, Eye, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';

export default function NovelCard({ novel, onBookmarkToggle, isBookmarkedInitial = false }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(isBookmarkedInitial);
  const [loadingBookmark, setLoadingBookmark] = useState(false);

  // Tính điểm Booking.com thang điểm 10
  const numericRating = Number(novel.avg_rating || 4.5);
  const bookingScore = (numericRating * 2).toFixed(1);

  const getScoreLabel = (score) => {
    if (score >= 9.0) return 'Xuất sắc';
    if (score >= 8.0) return 'Tuyệt vời';
    if (score >= 7.0) return 'Rất tốt';
    return 'Tốt';
  };

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setLoadingBookmark(true);
      const res = await axiosClient.post(`/bookmarks/toggle/${novel.id}`);
      setIsBookmarked(res.isBookmarked);
      if (onBookmarkToggle) onBookmarkToggle(novel.id, res.isBookmarked);
    } catch (err) {
      console.error('Lỗi khi bookmark:', err);
    } finally {
      setLoadingBookmark(false);
    }
  };

  // Chuẩn hóa đường dẫn ảnh bìa
  const coverUrl = novel.cover_image && novel.cover_image.startsWith('/public')
    ? `http://localhost:5000${novel.cover_image}`
    : novel.cover_image && novel.cover_image.startsWith('/assets')
    ? `http://localhost:5000${novel.cover_image.replace('/assets', '/public')}`
    : novel.cover_image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400';

  return (
    <Card className="booking-novel-card shadow-sm">
      <Link to={`/novel/${novel.slug}`} className="text-decoration-none">
        <div className="booking-novel-cover-wrapper">
          <img
            src={coverUrl}
            alt={novel.title}
            className="booking-novel-cover"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400';
            }}
          />
          {novel.status === 'completed' && (
            <Badge bg="success" className="position-absolute top-0 start-0 m-2 px-2 py-1 shadow-sm">
              Hoàn thành
            </Badge>
          )}
        </div>
      </Link>

      <Card.Body className="d-flex flex-direction-column p-3">
        {/* Rating Section - Booking Hotel Style */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <div className="booking-score-text">{getScoreLabel(Number(bookingScore))}</div>
            <div className="booking-review-count">{novel.total_ratings || 0} lượt đánh giá</div>
          </div>
          <div className="booking-score-badge">
            {bookingScore}
          </div>
        </div>

        {/* Tiêu đề & Tác giả */}
        <Card.Title as="h6" className="fw-bold mb-1 text-truncate" title={novel.title}>
          <Link to={`/novel/${novel.slug}`} className="text-dark text-decoration-none">
            {novel.title}
          </Link>
        </Card.Title>

        <p className="text-muted small mb-2 text-truncate">
          Tác giả: <strong>{novel.author?.pen_name || 'Khuyết Danh'}</strong>
        </p>

        {/* Categories */}
        <div className="d-flex flex-wrap gap-1 mb-3">
          {(novel.categories || []).slice(0, 2).map((cat) => (
            <span key={cat.id} className="booking-tag">
              {cat.name}
            </span>
          ))}
        </div>

        {/* Stats & Actions */}
        <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2 text-muted small">
            <span className="d-flex align-items-center gap-1" title="Lượt xem">
              <Eye size={14} /> {(novel.total_views || 0).toLocaleString()}
            </span>
            <span>•</span>
            <span title="Số chương">
              {novel.total_chapters || 0} chương
            </span>
          </div>

          <div className="d-flex gap-1">
            <Button
              variant={isBookmarked ? 'warning' : 'outline-secondary'}
              size="sm"
              className="p-1 px-2"
              onClick={handleBookmark}
              disabled={loadingBookmark}
              title={isBookmarked ? 'Bỏ lưu' : 'Lưu yêu thích'}
            >
              <Bookmark size={15} className={isBookmarked ? 'fill-current' : ''} />
            </Button>
            <Button
              as={Link}
              to={`/novel/${novel.slug}`}
              variant="primary"
              size="sm"
              className="fw-semibold px-2 py-1 booking-nav-btn-gold text-dark"
              style={{ fontSize: '0.8rem' }}
            >
              <BookOpen size={14} className="me-1" /> Đọc
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
