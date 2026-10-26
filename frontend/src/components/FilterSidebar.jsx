import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { Filter, RotateCcw } from 'lucide-react';

export default function FilterSidebar({
  categories = [],
  selectedCategory = '',
  selectedStatus = '',
  selectedRating = '',
  selectedSort = 'created_at',
  onCategoryChange,
  onStatusChange,
  onRatingChange,
  onSortChange,
  onReset,
}) {
  return (
    <div className="booking-filter-box">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold m-0 d-flex align-items-center gap-2">
          <Filter size={18} className="text-primary" /> Bộ lọc tìm kiếm
        </h6>
        <Button variant="link" size="sm" className="p-0 text-decoration-none text-muted" onClick={onReset}>
          <RotateCcw size={14} className="me-1" /> Đặt lại
        </Button>
      </div>

      {/* Sắp xếp */}
      <div className="mb-4">
        <div className="booking-filter-title">Sắp xếp theo</div>
        <Form.Select
          size="sm"
          value={selectedSort}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="created_at">Mới cập nhật</option>
          <option value="total_views">Lượt xem nhiều nhất</option>
          <option value="avg_rating">Điểm đánh giá cao nhất</option>
        </Form.Select>
      </div>

      {/* Điểm đánh giá Booking.com */}
      <div className="mb-4">
        <div className="booking-filter-title">Điểm đánh giá</div>
        <Form.Check
          type="radio"
          id="rating-all"
          name="filter-rating"
          label="Tất cả đánh giá"
          checked={selectedRating === ''}
          onChange={() => onRatingChange('')}
          className="small mb-1"
        />
        <Form.Check
          type="radio"
          id="rating-9"
          name="filter-rating"
          label="9.0+ Xuất sắc"
          checked={selectedRating === '4.5'}
          onChange={() => onRatingChange('4.5')}
          className="small mb-1 text-primary fw-semibold"
        />
        <Form.Check
          type="radio"
          id="rating-8"
          name="filter-rating"
          label="8.0+ Tuyệt vời"
          checked={selectedRating === '4.0'}
          onChange={() => onRatingChange('4.0')}
          className="small mb-1 text-primary"
        />
        <Form.Check
          type="radio"
          id="rating-7"
          name="filter-rating"
          label="7.0+ Rất tốt"
          checked={selectedRating === '3.5'}
          onChange={() => onRatingChange('3.5')}
          className="small mb-1"
        />
      </div>

      {/* Trạng thái phát hành */}
      <div className="mb-4">
        <div className="booking-filter-title">Trạng thái phát hành</div>
        <Form.Check
          type="radio"
          id="status-all"
          name="filter-status"
          label="Tất cả trạng thái"
          checked={selectedStatus === ''}
          onChange={() => onStatusChange('')}
          className="small mb-1"
        />
        <Form.Check
          type="radio"
          id="status-ongoing"
          name="filter-status"
          label="Đang tiến hành"
          checked={selectedStatus === 'ongoing'}
          onChange={() => onStatusChange('ongoing')}
          className="small mb-1"
        />
        <Form.Check
          type="radio"
          id="status-completed"
          name="filter-status"
          label="Đã hoàn thành"
          checked={selectedStatus === 'completed'}
          onChange={() => onStatusChange('completed')}
          className="small mb-1"
        />
      </div>

      {/* Thể loại */}
      <div>
        <div className="booking-filter-title">Thể loại tiểu thuyết</div>
        <div style={{ maxHeight: '240px', overflowY: 'auto' }} className="pe-1">
          <Form.Check
            type="radio"
            id="cat-all"
            name="filter-cat"
            label="Tất cả thể loại"
            checked={selectedCategory === ''}
            onChange={() => onCategoryChange('')}
            className="small mb-1"
          />
          {categories.map((cat) => (
            <Form.Check
              key={cat.id}
              type="radio"
              id={`cat-${cat.id}`}
              name="filter-cat"
              label={`${cat.name} (${cat.novel_count || 0})`}
              checked={String(selectedCategory) === String(cat.id)}
              onChange={() => onCategoryChange(cat.id)}
              className="small mb-1"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
