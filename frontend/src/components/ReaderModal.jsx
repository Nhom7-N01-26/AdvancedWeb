import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function ReaderModal({
  show,
  onHide,
  novel,
  chapterId,
  onChapterChange
}) {
  const [theme, setTheme] = useState('light'); // light, sepia, dark
  const [fontSize, setFontSize] = useState(18); // pixels

  if (!novel || !novel.chapters || novel.chapters.length === 0) return null;

  // Tìm chapter hiện tại
  const currentChapter = novel.chapters.find((c) => c.id === chapterId) || novel.chapters[0];
  const currentIndex = novel.chapters.findIndex((c) => c.id === currentChapter.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < novel.chapters.length - 1;

  const goToPrev = () => {
    if (hasPrev) onChapterChange(novel.chapters[currentIndex - 1].id);
  };

  const goToNext = () => {
    if (hasNext) onChapterChange(novel.chapters[currentIndex + 1].id);
  };

  // Theme style classes
  const themeClass =
    theme === 'sepia'
      ? 'reader-theme-sepia'
      : theme === 'dark'
      ? 'reader-theme-dark'
      : 'reader-theme-light';

  return (
    <Modal
      show={show}
      onHide={onHide}
      fullscreen
      scrollable
      contentClassName={`reader-modal-content ${themeClass}`}
    >
      {/* Top Reading Toolbar */}
      <Modal.Header className="border-bottom py-2 px-3 sticky-top" style={{ backgroundColor: 'inherit' }}>
        <div className="d-flex align-items-center justify-content-between w-100 flex-wrap gap-2">
          {/* Back button & Title */}
          <div className="d-flex align-items-center gap-2">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={onHide}
              className="d-flex align-items-center gap-1 rounded-1"
            >
              <i className="bi bi-arrow-left"></i>
              <span className="d-none d-sm-inline">Trở lại</span>
            </Button>
            <div>
              <strong className="d-block text-truncate" style={{ maxWidth: 280 }}>
                {novel.title}
              </strong>
              <span className="text-muted small">
                Chương {currentChapter.chapter_number} / {novel.chapters.length}
              </span>
            </div>
          </div>

          {/* Chapter Selector Dropdown */}
          <div className="d-flex align-items-center gap-2">
            <Form.Select
              size="sm"
              value={currentChapter.id}
              onChange={(e) => onChapterChange(parseInt(e.target.value, 10))}
              style={{ width: 'auto', minWidth: 160 }}
            >
              {novel.chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  Chương {ch.chapter_number}: {ch.title}
                </option>
              ))}
            </Form.Select>
          </div>

          {/* Theme & Font Controls */}
          <div className="d-flex align-items-center gap-2">
            {/* Font size */}
            <div className="btn-group btn-group-sm">
              <Button
                variant="outline-secondary"
                onClick={() => setFontSize((s) => Math.max(14, s - 2))}
                title="Giảm cỡ chữ"
              >
                A-
              </Button>
              <Button variant="outline-secondary" disabled className="text-dark fw-bold px-2">
                {fontSize}
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => setFontSize((s) => Math.min(28, s + 2))}
                title="Tăng cỡ chữ"
              >
                A+
              </Button>
            </div>

            {/* Theme switcher */}
            <div className="btn-group btn-group-sm">
              <Button
                variant={theme === 'light' ? 'primary' : 'outline-secondary'}
                onClick={() => setTheme('light')}
                title="Chế độ sáng"
              >
                <i className="bi bi-sun"></i>
              </Button>
              <Button
                variant={theme === 'sepia' ? 'warning' : 'outline-secondary'}
                onClick={() => setTheme('sepia')}
                title="Chế độ giấy cổ (Sepia)"
              >
                <i className="bi bi-journal-richtext"></i>
              </Button>
              <Button
                variant={theme === 'dark' ? 'dark' : 'outline-secondary'}
                onClick={() => setTheme('dark')}
                title="Chế độ ban đêm"
              >
                <i className="bi bi-moon-stars"></i>
              </Button>
            </div>
          </div>
        </div>
      </Modal.Header>

      {/* Reader Body Text */}
      <Modal.Body className="py-5 px-3 px-md-5">
        <div className="reader-body-text">
          <div className="text-center mb-5 pb-3 border-bottom">
            <h1 className="fw-bold fs-3 mb-2">{currentChapter.title}</h1>
            <div className="text-muted small">
              Tác phẩm: <strong>{novel.title}</strong> · Tác giả: {novel.author_name} · {currentChapter.word_count || 2500} chữ
            </div>
          </div>

          {/* Chapter Content with custom styling */}
          <div
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: 1.85,
              letterSpacing: '0.2px',
              fontFamily: "'Segoe UI', Georgia, serif"
            }}
          >
            {currentChapter.content}
          </div>

          {/* Bottom navigation buttons */}
          <div className="d-flex justify-content-between align-items-center mt-5 pt-4 border-top">
            <Button
              variant="outline-primary"
              disabled={!hasPrev}
              onClick={goToPrev}
              className="fw-bold px-4"
            >
              <i className="bi bi-chevron-left me-1"></i>
              Chương trước
            </Button>

            <span className="small text-muted">
              Đọc xong Chương {currentChapter.chapter_number}
            </span>

            <Button
              variant="primary"
              disabled={!hasNext}
              onClick={goToNext}
              className="fw-bold px-4"
            >
              Chương sau
              <i className="bi bi-chevron-right ms-1"></i>
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
