import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export default function CategorySection({ categories, novels = [], selectedCategory, onSelectCategory }) {
  // Tính toán số lượng tác phẩm thực tế cho từng thể loại
  const getCategoryCount = (catName) => {
    return novels.filter(
      (n) => n.category === catName || (n.categories && n.categories.includes(catName))
    ).length;
  };

  return (
    <section className="my-4" id="categories-section">
      <Container>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h2 className="fw-bold fs-4 mb-1 text-dark">Khám phá theo thể loại truyện</h2>
            <p className="text-muted small mb-0">
              Khám phá danh sách tiểu thuyết theo từng thể loại yêu thích ({novels.length} truyện)
            </p>
          </div>
          {selectedCategory !== 'all' && (
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => onSelectCategory('all')}
            >
              <i className="bi bi-x-circle me-1"></i>
              Bỏ lọc thể loại ({selectedCategory})
            </button>
          )}
        </div>

        <Row className="g-3">
          {categories.slice(0, 8).map((cat) => {
            const isSelected = selectedCategory === cat.name;
            const realCount = getCategoryCount(cat.name);

            return (
              <Col xs={6} sm={4} md={3} lg={3} key={cat.id}>
                <div
                  className={`category-card ${isSelected ? 'border-primary shadow-sm' : ''}`}
                  onClick={() => onSelectCategory(isSelected ? 'all' : cat.name)}
                  role="button"
                  tabIndex={0}
                  style={isSelected ? { transform: 'translateY(-4px)', borderColor: '#006ce4' } : {}}
                >
                  <img
                    src={cat.cover}
                    alt={cat.name}
                    className="category-card-img"
                    loading="lazy"
                  />
                  <div className="category-card-body">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="category-card-title d-flex align-items-center gap-1">
                        <span>{cat.emoji || '📖'}</span>
                        <span>{cat.name}</span>
                      </div>
                      {isSelected && (
                        <span className="badge bg-primary">Đang chọn</span>
                      )}
                    </div>
                    <div className="category-card-count text-primary fw-medium">
                      {realCount} tác phẩm
                    </div>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </Container>
    </section>
  );
}
