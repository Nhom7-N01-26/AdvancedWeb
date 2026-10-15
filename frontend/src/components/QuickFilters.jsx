import React from 'react';
import { Container, Button, ProgressBar } from 'react-bootstrap';

export default function QuickFilters({
  readingHistory,
  novels,
  onOpenReader,
  onQuickCategorySelect
}) {
  // Tìm truyện trong lịch sử đọc
  const recentNovel = readingHistory.length > 0
    ? novels.find(n => n.id === readingHistory[0].novel_id)
    : null;

  return (
    <Container className="mt-2">
      {/* Genius Loyalty Banner */}
      <div className="genius-banner">
        <div className="d-flex align-items-center gap-3">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
            style={{ width: 48, height: 48, flexShrink: 0 }}
          >
            <i className="bi bi-gem text-warning fs-4"></i>
          </div>
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="genius-badge">GENIUS READER</span>
              <span className="fw-bold text-dark">Chương trình Độc Giả Thân Thiết Nhóm 7</span>
            </div>
            <p className="text-muted small mb-0">
              Tiết kiệm từ 10% đến 20% khi mở khóa chương đặc biệt, nhận phù hiệu độc giả danh dự và đồng bộ tiến độ đọc xuyên suốt mọi thiết bị.
            </p>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2 flex-shrink-0">
          <Button
            variant="outline-primary"
            size="sm"
            className="fw-bold text-nowrap rounded-1"
            onClick={() => onQuickCategorySelect && onQuickCategorySelect('Tiên Hiệp')}
          >
            Xem tuyển tập Hot
          </Button>
        </div>
      </div>

      {/* Continue Reading Bar (nếu có lịch sử) */}
      {recentNovel && (
        <div
          className="p-3 mb-4 rounded-3 border bg-white shadow-sm d-flex align-items-center justify-content-between flex-wrap gap-3"
          style={{ borderLeft: '5px solid #006ce4' }}
        >
          <div className="d-flex align-items-center gap-3">
            <img
              src={recentNovel.cover_image}
              alt={recentNovel.title}
              style={{ width: 44, height: 58, objectFit: 'cover', borderRadius: 4 }}
            />
            <div>
              <div className="text-muted small">
                <i className="bi bi-clock-history me-1"></i>
                Đang đọc dở · {readingHistory[0].updated_at}
              </div>
              <div className="fw-bold text-dark fs-6">{recentNovel.title}</div>
              <div className="small text-primary">
                Chương {readingHistory[0].chapter_number}: {recentNovel.chapters?.[readingHistory[0].chapter_number - 1]?.title || 'Chương hiện tại'}
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div style={{ width: 140 }} className="d-none d-sm-block">
              <div className="d-flex justify-content-between text-muted small mb-1">
                <span>Tiến độ</span>
                <span className="fw-bold">{readingHistory[0].progress || 65}%</span>
              </div>
              <ProgressBar now={readingHistory[0].progress || 65} variant="primary" style={{ height: 6 }} />
            </div>

            <Button
              variant="primary"
              size="sm"
              className="fw-bold px-3 py-1 rounded-1"
              onClick={() => onOpenReader(recentNovel, readingHistory[0].chapter_id)}
            >
              <i className="bi bi-book-half me-1"></i>
              Đọc tiếp
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
}
