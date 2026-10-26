import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Pagination, Form } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import FilterSidebar from '../components/FilterSidebar';
import NovelCard from '../components/NovelCard';
import axiosClient from '../api/axiosClient';

export default function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [novels, setNovels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy các tham số lọc từ URL
  const keyword = searchParams.get('keyword') || '';
  const categoryId = searchParams.get('category_id') || '';
  const status = searchParams.get('status') || '';
  const minRating = searchParams.get('min_rating') || '';
  const sortBy = searchParams.get('sort_by') || 'created_at';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Tải danh mục thể loại
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await axiosClient.get('/categories');
        setCategories(data || []);
      } catch (err) {
        console.error('Lỗi khi tải categories:', err);
      }
    };
    fetchCats();
  }, []);

  // Tải danh sách truyện theo bộ lọc
  useEffect(() => {
    const fetchNovels = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (categoryId) params.append('category_id', categoryId);
        if (status) params.append('status', status);
        if (minRating) params.append('min_rating', minRating);
        if (sortBy) params.append('sort_by', sortBy);
        params.append('page', String(page));
        params.append('limit', '12');

        const res = await axiosClient.get(`/novels?${params.toString()}`);
        setNovels(res?.items || []);
        setTotal(res?.total || 0);
        setTotalPages(res?.totalPages || 1);
      } catch (err) {
        console.error('Lỗi tải danh sách novels:', err);
        setError('Có lỗi xảy ra khi tải dữ liệu truyện.');
      } finally {
        setLoading(false);
      }
    };

    fetchNovels();
  }, [searchParams]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // Reset về trang 1 khi đổi bộ lọc
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(newPage));
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <Container className="py-4">
      {/* Search Header Banner */}
      <div className="bg-white p-3 p-md-4 rounded border mb-4 shadow-sm">
        <Row className="align-items-center g-3">
          <Col md={6}>
            <h4 className="fw-bold mb-1">
              {keyword ? `Kết quả tìm kiếm cho "${keyword}"` : 'Thư Viện Tiểu Thuyết'}
            </h4>
            <div className="text-muted small">
              Tìm thấy <strong className="text-primary">{total}</strong> bộ truyện phù hợp
            </div>
          </Col>
          <Col md={6}>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="Tìm kiếm nhanh tên truyện hoặc tác giả..."
                defaultValue={keyword}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') updateParam('keyword', e.target.value.trim());
                }}
              />
            </div>
          </Col>
        </Row>
      </div>

      <Row className="g-4">
        {/* Cột trái: Bộ lọc Sidebar */}
        <Col lg={3} md={4}>
          <FilterSidebar
            categories={categories}
            selectedCategory={categoryId}
            selectedStatus={status}
            selectedRating={minRating}
            selectedSort={sortBy}
            onCategoryChange={(catId) => updateParam('category_id', catId)}
            onStatusChange={(st) => updateParam('status', st)}
            onRatingChange={(rt) => updateParam('min_rating', rt)}
            onSortChange={(sb) => updateParam('sort_by', sb)}
            onReset={handleResetFilters}
          />
        </Col>

        {/* Cột phải: Grid kết quả */}
        <Col lg={9} md={8}>
          {error && <Alert variant="danger">{error}</Alert>}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Đang áp dụng bộ lọc...</p>
            </div>
          ) : novels.length === 0 ? (
            <div className="text-center py-5 bg-white rounded border">
              <Search size={48} className="text-muted mb-3" />
              <h5 className="fw-bold text-muted">Không tìm thấy tiểu thuyết phù hợp</h5>
              <p className="text-muted small">Vui lòng thử điều chỉnh lại từ khóa hoặc các tiêu chí bộ lọc.</p>
            </div>
          ) : (
            <>
              <Row className="g-3">
                {novels.map((novel) => (
                  <Col key={novel.id} lg={4} sm={6}>
                    <NovelCard novel={novel} />
                  </Col>
                ))}
              </Row>

              {/* Phân trang Booking Style */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-5">
                  <Pagination>
                    <Pagination.Prev
                      disabled={page <= 1}
                      onClick={() => handlePageChange(page - 1)}
                    />
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Pagination.Item
                        key={p}
                        active={p === page}
                        onClick={() => handlePageChange(p)}
                      >
                        {p}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      disabled={page >= totalPages}
                      onClick={() => handlePageChange(page + 1)}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}
