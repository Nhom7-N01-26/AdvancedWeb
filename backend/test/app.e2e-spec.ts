import { describe, it, expect } from 'vitest';

const BASE_URL = 'http://localhost:5000/api';

describe('Câu 7c: E2E Integration Tests (Toàn bộ luồng hệ thống API)', () => {
  it('E2E-01: Lấy danh sách tiểu thuyết có phân trang và metadata chuẩn RESTful', async () => {
    const res = await fetch(`${BASE_URL}/novels?page=1&limit=6`);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.items).toBeInstanceOf(Array);
    expect(json.data.total).toBe(12);
    expect(json.data.page).toBe(1);
    expect(json.data.limit).toBe(6);
  });

  it('E2E-02: Lấy danh mục thể loại (Categories) kèm thống kê số lượng truyện', async () => {
    const res = await fetch(`${BASE_URL}/categories`);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.length).toBeGreaterThanOrEqual(10);
    expect(json.data[0]).toHaveProperty('name');
    expect(json.data[0]).toHaveProperty('slug');
  });

  it('E2E-03: Lấy chi tiết tiểu thuyết theo slug không để lộ thông tin nhạy cảm', async () => {
    const res = await fetch(`${BASE_URL}/novels/akuma-koujo`);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.title).toBe('Akuma Koujo');
    expect(json.data.author).toBeDefined();
    // Bài học Gumtree F12: Tuyệt đối không để lộ mật khẩu băm của tác giả
    expect(json.data.author.password_hash).toBeUndefined();
  });

  it('E2E-04: Lấy danh sách chương và đọc nội dung chi tiết chương 1', async () => {
    const listRes = await fetch(`${BASE_URL}/chapters/novel/1`);
    expect(listRes.status).toBe(200);
    const listJson = await listRes.json();
    expect(listJson.data.length).toBeGreaterThan(0);

    const chapterId = listJson.data[0].id;
    const detailRes = await fetch(`${BASE_URL}/chapters/${chapterId}`);
    expect(detailRes.status).toBe(200);
    const detailJson = await detailRes.json();

    expect(detailJson.success).toBe(true);
    expect(detailJson.data.content).toBeDefined();
    expect(detailJson.data.content.length).toBeGreaterThan(10);
    expect(detailJson.data.nextChapter).toBeDefined();
  });

  it('E2E-05: Đăng nhập tài khoản Admin, nhận HttpOnly Cookie và kiểm tra loại bỏ mật khẩu', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@phenikaa-uni.edu.vn',
        password: 'Admin@123456',
      }),
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.user.role).toBe('admin');
    // Kiểm tra an toàn F12
    expect(json.data.user.password_hash).toBeUndefined();
  });

  it('E2E-06: Đăng nhập sai thông tin trả về lỗi chuẩn RESTful (Câu 7a)', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@phenikaa-uni.edu.vn',
        password: 'SaiMatKhau@123',
      }),
    });

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.statusCode).toBe(401);
    expect(json.message).toContain('không chính xác');
  });
});
