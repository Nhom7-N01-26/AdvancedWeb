import React, { useState, useEffect } from 'react';
import { Container, Button, ButtonGroup, Form, Spinner, Alert, Dropdown } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Settings, ArrowLeft, Send, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';

export default function ReaderPage() {
  const { chapterId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [chapter, setChapter] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Zen Mode Reading Settings (Tự nhớ vào localStorage)
  const [fontSize, setFontSize] = useState(() => parseInt(localStorage.getItem('reader_font_size') || '18', 10));
  const [theme, setTheme] = useState(() => localStorage.getItem('reader_theme') || 'sepia'); // light, sepia, dark
  const [fontFamily, setFontFamily] = useState(() => localStorage.getItem('reader_font_family') || 'Georgia, serif');

  const updateSetting = (key, value, setter) => {
    setter(value);
    localStorage.setItem(key, value);
  };

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        setLoading(true);
        window.scrollTo({ top: 0, behavior: 'instant' });

        // 1. Lấy chi tiết chương (Tự động tăng views)
        const data = await axiosClient.get(`/chapters/${chapterId}`);
        setChapter(data);

        // Ghi nhận lịch sử đọc tự động
        if (user && data.novel_id) {
          try {
            await axiosClient.post('/history/record', {
              novel_id: data.novel_id,
              chapter_id: data.id,
              progress_percent: 100,
            });
          } catch (e) {
            // bỏ qua lỗi record
          }
        }

        // 3. Lấy bình luận của chương này
        if (data.novel_id) {
          const cData = await axiosClient.get(`/comments/novel/${data.novel_id}?chapterId=${data.id}`);
          setComments(cData || []);
        }
      } catch (err) {
        console.error('Lỗi tải chương:', err);
        setError('Không thể tải nội dung chương truyện. Chương có thể không tồn tại.');
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [chapterId, user]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      await axiosClient.post('/comments', {
        novel_id: chapter.novel_id,
        chapter_id: chapter.id,
        content: newComment.trim(),
      });
      setNewComment('');

      // Tải lại danh sách comment
      const cData = await axiosClient.get(`/comments/novel/${chapter.novel_id}?chapterId=${chapter.id}`);
      setComments(cData || []);
    } catch (err) {
      alert('Không thể đăng bình luận: ' + (err.message || 'Lỗi hệ thống'));
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Đang tải chương truyện...</p>
      </Container>
    );
  }

  if (error || !chapter) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error || 'Không tìm thấy chương truyện'}</Alert>
        <Button as={Link} to="/browse" variant="primary">
          Về danh sách truyện
        </Button>
      </Container>
    );
  }

  return (
    <div className={`py-4 min-vh-100 reader-theme-${theme}`}>
      <Container>
        {/* Navigation Bar Trên Đầu */}
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
          <Link
            to={`/novel/${chapter.novel?.slug || ''}`}
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
          >
            <ArrowLeft size={16} /> Quay lại truyện
          </Link>

          {/* Quick Settings Panel */}
          <div className="d-flex align-items-center gap-2">
            {/* Đổi Theme */}
            <ButtonGroup size="sm">
              <Button
                variant={theme === 'light' ? 'primary' : 'outline-secondary'}
                onClick={() => updateSetting('reader_theme', 'light', setTheme)}
                title="Giao diện Sáng"
              >
                Sáng
              </Button>
              <Button
                variant={theme === 'sepia' ? 'warning' : 'outline-secondary'}
                onClick={() => updateSetting('reader_theme', 'sepia', setTheme)}
                title="Giao diện Vàng Sepia dịu mắt"
              >
                Vàng
              </Button>
              <Button
                variant={theme === 'dark' ? 'dark' : 'outline-secondary'}
                onClick={() => updateSetting('reader_theme', 'dark', setTheme)}
                title="Giao diện Tối"
              >
                Tối
              </Button>
            </ButtonGroup>

            {/* Cỡ chữ */}
            <ButtonGroup size="sm">
              <Button
                variant="outline-secondary"
                onClick={() => updateSetting('reader_font_size', Math.max(14, fontSize - 2), setFontSize)}
                title="Giảm cỡ chữ"
              >
                A-
              </Button>
              <Button variant="outline-secondary" disabled className="px-2">
                {fontSize}
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => updateSetting('reader_font_size', Math.min(28, fontSize + 2), setFontSize)}
                title="Tăng cỡ chữ"
              >
                A+
              </Button>
            </ButtonGroup>

            {/* Chọn Font */}
            <Dropdown align="end">
              <Dropdown.Toggle variant="outline-secondary" size="sm" id="font-dropdown">
                Font
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => updateSetting('reader_font_family', 'Georgia, serif', setFontFamily)}>
                  Georgia (Serif)
                </Dropdown.Item>
                <Dropdown.Item onClick={() => updateSetting('reader_font_family', 'system-ui, -apple-system, sans-serif', setFontFamily)}>
                  Sans-serif Hiện Đại
                </Dropdown.Item>
                <Dropdown.Item onClick={() => updateSetting('reader_font_family', 'Courier New, monospace', setFontFamily)}>
                  Monospace
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        {/* Nội dung chương Zen Mode */}
        <div
          className={`reader-container reader-theme-${theme} mb-5`}
          style={{
            fontSize: `${fontSize}px`,
            fontFamily: fontFamily,
          }}
        >
          <div className="text-center mb-5 pb-3 border-bottom">
            <h5 className="text-muted mb-1">{chapter.novel?.title}</h5>
            <h2 className="fw-bolder mb-2">Chương {chapter.chapter_number}: {chapter.title}</h2>
            <div className="small text-muted">
              Độ dài: ~{chapter.word_count || 0} từ • {chapter.views || 0} lượt xem
            </div>
          </div>

          {/* Text Content */}
          <div className="reader-content">
            {(chapter.content || '').split('\n').map((paragraph, idx) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;
              return <p key={idx}>{trimmed}</p>;
            })}
          </div>

          {/* Điều hướng Chương Trước / Sau (Usability) */}
          <div className="d-flex justify-content-between align-items-center mt-5 pt-4 border-top">
            {chapter.prevChapter ? (
              <Button
                as={Link}
                to={`/read/${chapter.prevChapter.id}`}
                variant="outline-primary"
                className="d-flex align-items-center gap-1"
              >
                <ChevronLeft size={18} /> Chương trước
              </Button>
            ) : (
              <Button variant="outline-secondary" disabled>
                <ChevronLeft size={18} /> Chương đầu
              </Button>
            )}

            <Button
              as={Link}
              to={`/novel/${chapter.novel?.slug}`}
              variant="outline-secondary"
            >
              Mục lục
            </Button>

            {chapter.nextChapter ? (
              <Button
                as={Link}
                to={`/read/${chapter.nextChapter.id}`}
                className="booking-nav-btn-gold text-dark fw-bold d-flex align-items-center gap-1 border-0"
              >
                Chương sau <ChevronRight size={18} />
              </Button>
            ) : (
              <Button variant="outline-secondary" disabled>
                Hết truyện <ChevronRight size={18} />
              </Button>
            )}
          </div>
        </div>

        {/* Khu vực Bình luận / Thảo luận dưới chương */}
        <div className="reader-container bg-white p-4 rounded border mb-5">
          <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
            <MessageSquare size={20} className="text-primary" /> Bình luận ({comments.length})
          </h5>

          {/* Form gửi bình luận */}
          {user ? (
            <Form onSubmit={handlePostComment} className="mb-4">
              <Form.Group className="mb-2">
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Để lại cảm nghĩ của bạn về chương truyện này..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
              </Form.Group>
              <div className="text-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="fw-bold d-inline-flex align-items-center gap-1"
                  disabled={submittingComment || !newComment.trim()}
                >
                  <Send size={14} /> {submittingComment ? 'Đang gửi...' : 'Gửi bình luận'}
                </Button>
              </div>
            </Form>
          ) : (
            <div className="p-3 bg-light rounded text-center mb-4">
              <span className="text-muted small me-2">Bạn cần đăng nhập để tham gia thảo luận.</span>
              <Button as={Link} to="/login" variant="primary" size="sm">
                Đăng nhập
              </Button>
            </div>
          )}

          {/* Danh sách bình luận */}
          {comments.length > 0 ? (
            <div className="d-flex flex-column gap-3">
              {comments.map((cm) => (
                <div key={cm.id} className="p-3 border-bottom">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <img
                      src={cm.user?.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=Reader'}
                      alt="Avatar"
                      width={28}
                      height={28}
                      className="rounded-circle"
                    />
                    <strong className="small text-dark">{cm.user?.full_name || cm.user?.username || 'Độc giả'}</strong>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {new Date(cm.created_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <p className="small text-dark mb-0 ps-4">{cm.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted text-center py-3 small">Chưa có bình luận nào cho chương này.</p>
          )}
        </div>
      </Container>
    </div>
  );
}
