import React, { useState } from 'react';
import { Container, Nav, Row, Col } from 'react-bootstrap';

export default function PlannerTabs({ novels, onViewDetail, onReadNow }) {
  const [activeTab, setActiveTab] = useState('tutien');

  const plans = {
    tutien: {
      title: 'Tu Tiên Cày Cấp & Dị Hỏa',
      desc: 'Hành trình từ kẻ vô danh nghịch thiên cải mệnh, thu phục linh hỏa và bước lên đỉnh cao',
      filter: (n) => n.category === 'Tiên Hiệp' || (n.tags && n.tags.includes('Tu Tiên'))
    },
    giangho: {
      title: 'Nhiệt Huyết Giang Hồ & Trượng Nghĩa',
      desc: 'Những trận chiến rực lửa, bảo vệ gia tộc và người thân, tung hoành thập địa',
      filter: (n) => n.category === 'Kiếm Hiệp' || n.category === 'Huyền Huyễn'
    },
    dothi: {
      title: 'Đô Thị Phồn Hoa & Thần Y',
      desc: 'Y thuật cứu người, nắm đấm trừng trị cường hào ác bá, làm chủ thương trường',
      filter: (n) => n.category === 'Đô Thị'
    },
    esports: {
      title: 'eSports & Võng Du Đỉnh Cao',
      desc: 'Chiến thuật đỉnh cao, bàn tay vàng tốc độ và niềm đam mê rực cháy cùng đồng đội',
      filter: (n) => n.category === 'Võng Du' || (n.tags && n.tags.includes('eSports'))
    }
  };

  const currentPlan = plans[activeTab];
  const filteredNovels = novels.filter(currentPlan.filter).slice(0, 4);

  return (
    <section className="my-5 py-4 bg-white border-top border-bottom">
      <Container>
        <div className="mb-3">
          <h2 className="fw-bold fs-4 mb-1 text-dark">
            Lên kế hoạch đọc truyện nhanh chóng & dễ dàng
          </h2>
          <p className="text-muted small mb-0">
            Chọn thể loại cảm xúc bạn muốn trải nghiệm hôm nay và khám phá các bộ truyện tương thích
          </p>
        </div>

        {/* Tab pills */}
        <Nav
          variant="pills"
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4 gap-2 border-bottom pb-3 flex-nowrap overflow-auto"
        >
          <Nav.Item>
            <Nav.Link eventKey="tutien" className="rounded-pill fw-semibold px-3 py-2 small">
              🌟 Tu Tiên Cày Cấp
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="giangho" className="rounded-pill fw-semibold px-3 py-2 small">
              ⚔️ Nhiệt Huyết Giang Hồ
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="dothi" className="rounded-pill fw-semibold px-3 py-2 small">
              🏙️ Đô Thị Thần Y
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="esports" className="rounded-pill fw-semibold px-3 py-2 small">
              🎮 eSports & Võng Du
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {/* Cards Row */}
        <Row className="g-3">
          {filteredNovels.map((novel) => (
            <Col xs={12} sm={6} md={3} key={novel.id}>
              <div
                className="category-card h-100 d-flex flex-column"
                onClick={() => onViewDetail(novel)}
              >
                <div style={{ height: 160, overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={novel.cover_image}
                    alt={novel.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    className="position-absolute bottom-0 start-0 m-2 badge bg-dark bg-opacity-75"
                    style={{ fontSize: '0.72rem' }}
                  >
                    ⭐ {novel.booking_score || (novel.avg_rating * 2).toFixed(1)} / 10
                  </span>
                </div>
                <div className="p-3 d-flex flex-column flex-grow-1">
                  <h6 className="fw-bold text-dark mb-1 text-truncate" title={novel.title}>
                    {novel.title}
                  </h6>
                  <div className="text-muted small mb-2">{novel.author_name}</div>
                  <div className="small text-truncate-2 text-secondary mb-3 flex-grow-1">
                    {novel.description}
                  </div>
                  <div className="d-flex align-items-center justify-content-between mt-auto pt-2 border-top">
                    <span className="small text-primary fw-medium">
                      {novel.total_chapters || novel.chapters?.length} chương
                    </span>
                    <button
                      className="btn btn-sm btn-outline-primary fw-bold"
                      onClick={(e) => {
                        e.stopPropagation();
                        onReadNow(novel);
                      }}
                    >
                      Đọc ngay
                    </button>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
