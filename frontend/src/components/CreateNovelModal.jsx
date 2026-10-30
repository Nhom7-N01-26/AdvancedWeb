import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert, Spinner, Card } from 'react-bootstrap';

export default function CreateNovelModal({
  show,
  onHide,
  categories = [],
  authors = [],
  currentUser = null,
  onCreateNovel,
}) {
  const PRESET_COVERS = [
    { label: 'Anime / Fantasy', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80' },
    { label: 'Huyền bí / Kỳ ảo', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80' },
    { label: 'Kiếm hiệp / Cổ trang', url: 'https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?w=600&auto=format&fit=crop&q=80' },
    { label: 'Đô thị / Hiện đại', url: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=600&auto=format&fit=crop&q=80' },
  ];

  const [formData, setFormData] = useState({
    title: '',
    author_name: '',
    category: '',
    status: 'ongoing',
    description: '',
    cover_image: PRESET_COVERS[0].url,
    tags: '',
    hasFirstChapter: true,
    chapterTitle: 'Chương 1: Khởi đầu mới',
    chapterContent: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (show) {
      const defaultAuthor = currentUser?.full_name || currentUser?.username || 'Tác Giả';
      const defaultCategory = categories[0]?.name || 'Light Novel';
      setFormData({
        title: '',
        author_name: defaultAuthor,
        category: defaultCategory,
        status: 'ongoing',
        description: '',
        cover_image: PRESET_COVERS[0].url,
        tags: 'Light Novel, Phiêu Lưu',
        hasFirstChapter: true,
        chapterTitle: 'Chương 1: Khởi đầu mới',
        chapterContent: '',
      });
      setErrorMsg(null);
    }
  }, [show, currentUser, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.title.trim()) {
      setErrorMsg('Vui lòng nhập tiêu đề tiểu thuyết!');
      return;
    }

    if (formData.hasFirstChapter && !formData.chapterContent.trim()) {
      setErrorMsg('Vui lòng nhập nội dung cho Chương 1 hoặc bỏ tích chọn đăng kèm chương.');
      return;
    }

    const matchedCat = categories.find((c) => c.name === formData.category);
    const categoryIds = matchedCat ? [matchedCat.id] : [1];

    const payload = {
      title: formData.title.trim(),
      author_name: formData.author_name.trim() || currentUser?.full_name || 'Tác Giả',
      author_id: currentUser?.id || 1,
      category: formData.category || 'Light Novel',
      category_id: categoryIds[0],
      category_ids: categoryIds,
      status: formData.status,
      description: formData.description.trim() || `Tác phẩm ${formData.title.trim()} sáng tác bởi ${formData.author_name.trim()}.`,
      cover_image: formData.cover_image || PRESET_COVERS[0].url,
      tags: formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [formData.category],
      chapters: formData.hasFirstChapter && formData.chapterContent.trim()
        ? [
            {
              chapter_number: 1,
              title: formData.chapterTitle.trim() || 'Chương 1: Khởi đầu mới',
              content: formData.chapterContent.trim(),
              word_count: formData.chapterContent.trim().split(/\s+/).length,
            },
          ]
        : [],
    };

    setLoading(true);
    try {
      await onCreateNovel(payload);
      onHide();
    } catch (err) {
      setErrorMsg(err.message || 'Có lỗi xảy ra khi đăng truyện. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered backdrop="static" keyboard={false}>
      <Modal.Header closeButton className="bg-primary text-white py-3">
        <Modal.Title className="fs-5 fw-bold d-flex align-items-center gap-2">
          <i className="bi bi-pencil-square text-warning"></i>
          <span>Đăng Bộ Truyện Mới</span>
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-4 bg-light">
          {errorMsg && (
            <Alert variant="danger" dismissible onClose={() => setErrorMsg(null)} className="small py-2 mb-3">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {errorMsg}
            </Alert>
          )}

          <div className="bg-white p-3 rounded-3 border shadow-sm mb-3">
            <h6 className="fw-bold text-dark border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-info-circle text-primary"></i>
              Thông tin cơ bản của tác phẩm
            </h6>

            <Row className="g-3">
              <Col md={8}>
                <Form.Group>
                  <Form.Label className="small fw-bold">
                    Tiêu đề tiểu thuyết <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    required
                    placeholder="Ví dụ: Tôi Trùng Sinh Thành Dũng Giả Vô Địch..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Bút danh tác giả</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Tên bút danh..."
                    value={formData.author_name}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Thể loại chính</Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.emoji || '📖'} {c.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Tình trạng ra chương</Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="ongoing">🟢 Đang tiến hành (Ongoing)</option>
                    <option value="completed">🔵 Đã hoàn thành (Completed)</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Thẻ / Từ khóa (phân cách bằng dấu phẩy)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="vd: Huyễn Tưởng, Trùng Sinh, Hài Hước, Hành Động"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Tóm tắt nội dung cốt truyện</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Giới thiệu sơ lược bối cảnh, nhân vật chính, hành trình phiêu lưu..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>

          <div className="bg-white p-3 rounded-3 border shadow-sm mb-3">
            <h6 className="fw-bold text-dark border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-image text-primary"></i>
              Ảnh bìa tác phẩm
            </h6>

            <Row className="align-items-center g-3">
              <Col xs={3} sm={2} className="text-center">
                <img
                  src={formData.cover_image || PRESET_COVERS[0].url}
                  alt="Ảnh bìa"
                  className="rounded border shadow-sm"
                  style={{ width: '100%', height: '110px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.src = PRESET_COVERS[0].url;
                  }}
                />
                <span className="small text-muted d-block mt-1">Xem trước</span>
              </Col>

              <Col xs={9} sm={10}>
                <Form.Group className="mb-2">
                  <Form.Label className="small fw-bold">Đường dẫn ảnh bìa (URL)</Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="https://example.com/cover.jpg"
                    value={formData.cover_image}
                    onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                  />
                </Form.Group>

                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <span className="small text-muted fw-semibold">Chọn nhanh ảnh mẫu:</span>
                  {PRESET_COVERS.map((preset, idx) => (
                    <Button
                      key={idx}
                      size="sm"
                      variant={formData.cover_image === preset.url ? 'primary' : 'outline-secondary'}
                      className="py-0 px-2"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => setFormData({ ...formData, cover_image: preset.url })}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </Col>
            </Row>
          </div>

          <div className="bg-white p-3 rounded-3 border shadow-sm">
            <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-3">
              <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <i className="bi bi-book text-primary"></i>
                Chương mở đầu (Chương 1)
              </h6>
              <Form.Check
                type="switch"
                id="toggle-first-chapter"
                label="Đăng kèm Chương 1"
                checked={formData.hasFirstChapter}
                onChange={(e) => setFormData({ ...formData, hasFirstChapter: e.target.checked })}
                className="fw-semibold small text-primary"
              />
            </div>

            {formData.hasFirstChapter && (
              <Row className="g-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="small fw-bold">Tiêu đề chương 1</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="vd: Chương 1: Sự khởi đầu định mệnh"
                      value={formData.chapterTitle}
                      onChange={(e) => setFormData({ ...formData, chapterTitle: e.target.value })}
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="small fw-bold">
                      Nội dung chương 1 <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={6}
                      placeholder="Nhập nội dung chương 1 của tiểu thuyết tại đây..."
                      value={formData.chapterContent}
                      onChange={(e) => setFormData({ ...formData, chapterContent: e.target.value })}
                    />
                    <Form.Text className="text-muted small">
                      Độ dài dự kiến:{' '}
                      {formData.chapterContent.trim()
                        ? formData.chapterContent.trim().split(/\s+/).length
                        : 0}{' '}
                      từ.
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer className="bg-light py-2">
          <Button variant="secondary" onClick={onHide} disabled={loading} size="sm" className="px-3">
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            variant="warning"
            disabled={loading}
            size="sm"
            className="fw-bold px-4 text-dark shadow-sm"
          >
            {loading ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Đang xuất bản truyện...
              </>
            ) : (
              <>
                <i className="bi bi-send-fill me-2"></i>
                Đăng tác phẩm ngay 🚀
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

