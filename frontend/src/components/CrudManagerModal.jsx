import React, { useState } from 'react';
import { Modal, Button, Table, Form, Row, Col, Badge, Tabs, Tab, Alert } from 'react-bootstrap';

export default function CrudManagerModal({
  show,
  onHide,
  novels,
  categories,
  authors,
  onCreateNovel,
  onUpdateNovel,
  onDeleteNovel,
  onAddChapter,
  onResetData,
  backendStatus
}) {
  const [activeTab, setActiveTab] = useState('novels');
  const [editingNovel, setEditingNovel] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddChapterForm, setShowAddChapterForm] = useState(false);
  const [selectedNovelForChapter, setSelectedNovelForChapter] = useState(null);

  // Form State for Novel
  const [formData, setFormData] = useState({
    title: '',
    author_id: 1,
    author_name: 'Mặc Hương Đồng Xứ',
    category: 'Tiên Hiệp',
    status: 'ongoing',
    description: '',
    cover_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    is_featured: false,
    tags: 'Tu Tiên, Huyền Huyễn'
  });

  // Form State for Chapter
  const [chapterForm, setChapterForm] = useState({
    title: '',
    content: ''
  });

  const [alertMsg, setAlertMsg] = useState(null);

  const resetNovelForm = () => {
    setFormData({
      title: '',
      author_id: 1,
      author_name: authors[0]?.pen_name || 'Mặc Hương Đồng Xứ',
      category: categories[0]?.name || 'Tiên Hiệp',
      status: 'ongoing',
      description: '',
      cover_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      is_featured: false,
      tags: 'Tu Tiên, Huyền Huyễn'
    });
    setEditingNovel(null);
  };

  const handleOpenCreate = () => {
    resetNovelForm();
    setShowEditForm(true);
  };

  const handleOpenEdit = (novel) => {
    setEditingNovel(novel);
    setFormData({
      title: novel.title,
      author_id: novel.author_id || 1,
      author_name: novel.author_name,
      category: novel.category,
      status: novel.status,
      description: novel.description,
      cover_image: novel.cover_image,
      is_featured: Boolean(novel.is_featured),
      tags: novel.tags ? novel.tags.join(', ') : 'Tu Tiên'
    });
    setShowEditForm(true);
  };

  const handleSaveNovel = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setAlertMsg({ type: 'danger', text: 'Vui lòng nhập tiêu đề tiểu thuyết!' });
      return;
    }

    const matchedCat = categories?.find(
      (c) => c.name === formData.category || c.id === Number(formData.category_id)
    );
    const payload = {
      ...formData,
      category_ids: matchedCat ? [matchedCat.id] : [1],
      tags: typeof formData.tags === 'string' ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean) : (formData.tags || [])
    };

    if (editingNovel) {
      await onUpdateNovel(editingNovel.id, payload);
      setAlertMsg({ type: 'success', text: `Đã cập nhật tiểu thuyết "${formData.title}" thành công!` });
    } else {
      await onCreateNovel(payload);
      setAlertMsg({ type: 'success', text: `Đã thêm tiểu thuyết mới "${formData.title}" vào hệ thống!` });
    }

    setShowEditForm(false);
    resetNovelForm();
  };

  const handleDelete = async (novel) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tiểu thuyết "${novel.title}" không?`)) {
      await onDeleteNovel(novel.id);
      setAlertMsg({ type: 'warning', text: `Đã xóa tiểu thuyết "${novel.title}"!` });
    }
  };

  const handleOpenAddChapter = (novel) => {
    setSelectedNovelForChapter(novel);
    setChapterForm({
      title: `Chương ${(novel.chapters?.length || 0) + 1}: `,
      content: ''
    });
    setShowAddChapterForm(true);
  };

  const handleSaveChapter = async (e) => {
    e.preventDefault();
    if (!chapterForm.title.trim() || !chapterForm.content.trim()) {
      alert('Vui lòng nhập tiêu đề và nội dung chương!');
      return;
    }

    await onAddChapter(selectedNovelForChapter.id, chapterForm);
    setAlertMsg({
      type: 'success',
      text: `Đã thêm ${chapterForm.title} vào tác phẩm "${selectedNovelForChapter.title}"!`
    });
    setShowAddChapterForm(false);
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      scrollable
      contentClassName="border-0 shadow-lg"
    >
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title className="fw-bold fs-5 d-flex align-items-center gap-2">
          <i className="bi bi-kanban text-warning"></i>
          <span>Bảng Quản Lý Tác Phẩm & Nội Dung (Nhóm 7)</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4 bg-light">
        {/* Backend & Environment notice */}
        <div className="d-flex justify-content-between align-items-center mb-3 p-3 bg-white border rounded-2 flex-wrap gap-2">
          <div>
            <span className="fw-bold text-dark">Trạng thái kết nối REST API: </span>
            <span className={`badge ${backendStatus.isOnline ? 'bg-success' : 'bg-secondary'} ms-1`}>
              {backendStatus.isOnline ? 'ONLINE: http://localhost:3000' : 'OFFLINE: Đồng bộ LocalStorage'}
            </span>
            <div className="text-muted small mt-1">
              Thực hiện đầy đủ các thao tác: Thêm (Create), Đọc (Read), Sửa (Update), Xóa (Delete) theo yêu cầu bài tập.
            </div>
          </div>

          <div className="d-flex gap-2">
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => {
                if (window.confirm('Khôi phục dữ liệu mẫu gốc từ sql_nhom_7.sql?')) {
                  onResetData();
                  setAlertMsg({ type: 'info', text: 'Đã khôi phục dữ liệu mẫu ban đầu!' });
                }
              }}
            >
              <i className="bi bi-arrow-counterclockwise me-1"></i>
              Khôi phục dữ liệu gốc
            </Button>

            <Button variant="primary" size="sm" className="fw-bold" onClick={handleOpenCreate}>
              <i className="bi bi-plus-lg me-1"></i>
              Thêm tiểu thuyết mới
            </Button>
          </div>
        </div>

        {alertMsg && (
          <Alert variant={alertMsg.type} dismissible onClose={() => setAlertMsg(null)}>
            {alertMsg.text}
          </Alert>
        )}

        {/* Tabs for CRUD entities */}
        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
          {/* TAB 1: NOVELS CRUD */}
          <Tab eventKey="novels" title={`Quản lý Tiểu Thuyết (${novels.length})`}>
            <div className="table-responsive bg-white rounded-2 border shadow-sm">
              <Table hover className="align-middle m-0">
                <thead className="table-light small text-muted">
                  <tr>
                    <th style={{ width: 50 }}>ID</th>
                    <th style={{ width: 60 }}>Bìa</th>
                    <th>Tiêu đề & Tác giả</th>
                    <th>Thể loại</th>
                    <th>Tình trạng</th>
                    <th>Chương</th>
                    <th>Điểm Booking</th>
                    <th className="text-end" style={{ width: 170 }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {novels.map((n) => (
                    <tr key={n.id}>
                      <td className="fw-bold text-muted">#{n.id}</td>
                      <td>
                        <img
                          src={n.cover_image}
                          alt={n.title}
                          style={{ width: 40, height: 52, objectFit: 'cover', borderRadius: 4 }}
                        />
                      </td>
                      <td>
                        <strong className="text-dark d-block">{n.title}</strong>
                        <span className="text-muted small">Tác giả: {n.author_name}</span>
                      </td>
                      <td>
                        <span className="badge bg-light text-primary border">{n.category}</span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            n.status === 'completed'
                              ? 'bg-success'
                              : n.status === 'ongoing'
                              ? 'bg-primary'
                              : 'bg-secondary'
                          }`}
                        >
                          {n.status === 'completed'
                            ? 'Hoàn thành'
                            : n.status === 'ongoing'
                            ? 'Đang ra'
                            : 'Bản thảo'}
                        </span>
                      </td>
                      <td className="small text-muted">{n.chapters?.length || n.total_chapters || 0}</td>
                      <td>
                        <span className="badge bg-dark">
                          {n.booking_score || (n.avg_rating * 2).toFixed(1)} / 10
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <Button
                            variant="outline-success"
                            title="Thêm chương mới"
                            onClick={() => handleOpenAddChapter(n)}
                          >
                            <i className="bi bi-file-earmark-plus"></i>
                          </Button>
                          <Button
                            variant="outline-primary"
                            title="Chỉnh sửa tiểu thuyết"
                            onClick={() => handleOpenEdit(n)}
                          >
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button
                            variant="outline-danger"
                            title="Xóa tiểu thuyết"
                            onClick={() => handleDelete(n)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Tab>

          {/* TAB 2: CATEGORIES VIEW */}
          <Tab eventKey="categories" title={`Danh mục Thể Loại (${categories.length})`}>
            <div className="table-responsive bg-white rounded-2 border shadow-sm">
              <Table hover className="align-middle m-0">
                <thead className="table-light small text-muted">
                  <tr>
                    <th>ID</th>
                    <th>Biểu tượng</th>
                    <th>Tên thể loại</th>
                    <th>Slug</th>
                    <th>Mô tả thể loại</th>
                    <th>Số tác phẩm</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c.id}>
                      <td className="fw-bold text-muted">#{c.id}</td>
                      <td className="fs-5">{c.emoji || '📖'}</td>
                      <td className="fw-bold text-dark">{c.name}</td>
                      <td className="text-muted small"><code>{c.slug}</code></td>
                      <td className="small text-secondary">{c.description}</td>
                      <td>
                        <span className="badge bg-primary-subtle text-primary">
                          {c.novel_count}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Tab>

          {/* TAB 3: AUTHORS VIEW */}
          <Tab eventKey="authors" title={`Hồ Sơ Tác Giả (${authors.length})`}>
            <div className="table-responsive bg-white rounded-2 border shadow-sm">
              <Table hover className="align-middle m-0">
                <thead className="table-light small text-muted">
                  <tr>
                    <th>ID</th>
                    <th>Ảnh</th>
                    <th>Bút danh</th>
                    <th>Tiểu sử tóm tắt</th>
                    <th>Số tác phẩm</th>
                    <th>Điểm đánh giá</th>
                  </tr>
                </thead>
                <tbody>
                  {authors.map((a) => (
                    <tr key={a.id}>
                      <td className="fw-bold text-muted">#{a.id}</td>
                      <td>
                        <img
                          src={a.avatar}
                          alt={a.pen_name}
                          className="rounded-circle"
                          style={{ width: 36, height: 36, objectFit: 'cover' }}
                        />
                      </td>
                      <td className="fw-bold text-dark">{a.pen_name}</td>
                      <td className="small text-secondary" style={{ maxWidth: 300 }}>
                        {a.bio}
                      </td>
                      <td>
                        <span className="badge bg-secondary">{a.total_novels} truyện</span>
                      </td>
                      <td className="fw-bold text-warning">⭐ {a.rating || 4.9}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Tab>
        </Tabs>
      </Modal.Body>

      <Modal.Footer className="bg-light">
        <Button variant="secondary" onClick={onHide}>
          Đóng cửa sổ quản lý
        </Button>
      </Modal.Footer>

      {/* SUB-MODAL 1: ADD / EDIT NOVEL FORM */}
      <Modal
        show={showEditForm}
        onHide={() => setShowEditForm(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold fs-5">
            {editingNovel ? `Chỉnh sửa: ${editingNovel.title}` : 'Đăng tải tiểu thuyết mới'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveNovel}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={8}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Tiêu đề tiểu thuyết (*)</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    placeholder="Nhập tên truyện..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Tác giả</Form.Label>
                  <Form.Select
                    value={formData.author_name}
                    onChange={(e) => {
                      const author = authors.find((a) => a.pen_name === e.target.value);
                      setFormData({
                        ...formData,
                        author_name: e.target.value,
                        author_id: author?.id || 1
                      });
                    }}
                  >
                    {authors.map((a) => (
                      <option key={a.id} value={a.pen_name}>
                        {a.pen_name}
                      </option>
                    ))}
                  </Form.Select>
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
                        {c.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Tình trạng</Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="ongoing">Đang ra chương (Ongoing)</option>
                    <option value="completed">Đã hoàn thành (Completed)</option>
                    <option value="draft">Bản thảo (Draft)</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Link ảnh bìa (Cover Image)</Form.Label>
                  <Form.Control
                    type="url"
                    value={formData.cover_image}
                    onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Thẻ Tag (phân cách bằng dấu phẩy)</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Tu Tiên, Dị Hỏa, Trọng Sinh..."
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Tóm tắt nội dung tác phẩm</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Giới thiệu cốt truyện hấp dẫn..."
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Check
                  type="checkbox"
                  label="Đề cử nổi bật trên trang chủ (Featured Novel)"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditForm(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" className="fw-bold">
              {editingNovel ? 'Lưu thay đổi' : 'Đăng tải truyện'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* SUB-MODAL 2: ADD CHAPTER FORM */}
      <Modal
        show={showAddChapterForm}
        onHide={() => setShowAddChapterForm(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold fs-5">
            Thêm chương cho: {selectedNovelForChapter?.title}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveChapter}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Tiêu đề chương</Form.Label>
              <Form.Control
                type="text"
                required
                value={chapterForm.title}
                onChange={(e) => setChapterForm({ ...chapterForm, title: e.target.value })}
                placeholder="Ví dụ: Chương 4: Đột Phá Đấu Giả"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Nội dung chương truyện</Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                required
                value={chapterForm.content}
                onChange={(e) => setChapterForm({ ...chapterForm, content: e.target.value })}
                placeholder="Nhập nội dung đầy đủ của chương..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddChapterForm(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="success" className="fw-bold">
              <i className="bi bi-check-circle me-1"></i>
              Lưu & Xuất bản chương
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Modal>
  );
}
