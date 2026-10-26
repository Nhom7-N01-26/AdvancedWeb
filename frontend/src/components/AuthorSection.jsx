import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

export default function AuthorSection({ authors, novels = [], onSelectAuthor }) {
  return (
    <section className="my-5" id="authors-section">
      <Container>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h2 className="fw-bold fs-4 mb-1 text-dark">Tác giả nổi bật</h2>
            <p className="text-muted small mb-0">
              Khám phá các tác giả với nhiều tác phẩm hấp dẫn và được yêu thích
            </p>
          </div>
        </div>

        <Row className="g-3">
          {authors.map((author) => {
            const authorNovels = novels.filter(
              (n) => n.author_id === author.id || n.author_name === author.pen_name
            );
            const totalViews = authorNovels.reduce(
              (sum, n) => sum + (Number(n.total_views) || 0),
              0
            );
            const ratedNovels = authorNovels.filter((n) => n.avg_rating > 0);
            const avgRating =
              ratedNovels.length > 0
                ? (ratedNovels.reduce((sum, n) => sum + n.avg_rating, 0) / ratedNovels.length).toFixed(1)
                : 'Chưa có';

            return (
              <Col xs={12} sm={6} md={3} key={author.id}>
                <div className="author-card">
                  <div>
                    <img
                      src={author.avatar}
                      alt={author.pen_name}
                      className="author-avatar"
                    />
                    <div className="d-flex align-items-center justify-content-center gap-1 mb-1">
                      <h5 className="fw-bold mb-0 text-dark fs-6">{author.pen_name}</h5>
                      {author.verified && (
                        <i className="bi bi-patch-check-fill text-primary" title="Tác giả xác minh"></i>
                      )}
                    </div>
                    <div className="text-muted small mb-2">{author.location || 'Hội Nhà Văn'}</div>
                    <p className="small text-secondary mb-3 text-truncate-3" style={{ fontSize: '0.82rem', lineHeight: '1.4' }}>
                      {author.bio}
                    </p>
                  </div>

                  <div className="border-top pt-3 mt-auto">
                    <div className="d-flex justify-content-around text-center mb-3">
                      <div>
                        <div className="fw-bold text-dark">{authorNovels.length}</div>
                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>Tác phẩm</div>
                      </div>
                      <div className="border-end"></div>
                      <div>
                        <div className="fw-bold text-primary">{totalViews}</div>
                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>Lượt xem</div>
                      </div>
                      <div className="border-end"></div>
                      <div>
                        <div className="fw-bold text-warning">
                          {avgRating !== 'Chưa có' ? `⭐ ${avgRating}` : '—'}
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>Đánh giá</div>
                      </div>
                    </div>

                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="w-100 fw-semibold"
                      onClick={() => onSelectAuthor(author.pen_name)}
                    >
                      Xem {authorNovels.length} tác phẩm
                    </Button>
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
