import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Search, Tag, BookCheck } from 'lucide-react';
import axiosClient from '../api/axiosClient';

export default function BookingSearchBar({ initialKeyword = '', initialCategory = '', initialStatus = '' }) {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [categoryId, setCategoryId] = useState(initialCategory);
  const [status, setStatus] = useState(initialStatus);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await axiosClient.get('/categories');
        setCategories(data);
      } catch (err) {
        console.error('Lỗi khi tải danh mục thể loại:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.append('keyword', keyword.trim());
    if (categoryId) params.append('category_id', categoryId);
    if (status) params.append('status', status);

    navigate(`/browse?${params.toString()}`);
  };

  return (
    <div className="booking-search-card">
      <Form onSubmit={handleSearch}>
        <Row className="g-2 align-items-center">
          <Col lg={5} md={12}>
            <div className="d-flex align-items-center px-2 py-1">
              <Search size={20} className="text-muted me-2 flex-shrink-0" />
              <Form.Control
                type="text"
                placeholder="Bạn muốn đọc truyện gì? (Tên truyện, tác giả...)"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="booking-search-input"
              />
            </div>
          </Col>

          <Col lg={3} md={6}>
            <div className="d-flex align-items-center px-2 py-1 border-start border-md-0">
              <Tag size={18} className="text-muted me-2 flex-shrink-0" />
              <Form.Select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="booking-search-input"
              >
                <option value="">Tất cả thể loại</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon ? `${c.icon} ` : ''}{c.name}
                  </option>
                ))}
              </Form.Select>
            </div>
          </Col>

          <Col lg={2} md={6}>
            <div className="d-flex align-items-center px-2 py-1 border-start">
              <BookCheck size={18} className="text-muted me-2 flex-shrink-0" />
              <Form.Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="booking-search-input"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="ongoing">Đang tiến hành</option>
                <option value="completed">Đã hoàn thành</option>
              </Form.Select>
            </div>
          </Col>

          <Col lg={2} md={12}>
            <Button type="submit" className="booking-search-btn">
              Tìm kiếm
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
