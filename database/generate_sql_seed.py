import os
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

DATA_DIR = r"E:\advancedWeb\Novel-Manager\data"
CHAPTERS_DIR = os.path.join(DATA_DIR, "chapters")
OUTPUT_SQL = os.path.join(DATA_DIR, "seed_data.sql")

with open(os.path.join(DATA_DIR, "novels.json"), encoding='utf-8') as f:
    novels = json.load(f)['novels']

with open(os.path.join(DATA_DIR, "categories.json"), encoding='utf-8') as f:
    categories = json.load(f)

with open(os.path.join(DATA_DIR, "authors.json"), encoding='utf-8') as f:
    authors = json.load(f)

def esc(text):
    if text is None:
        return "NULL"
    # Escape single quotes and backslashes
    clean = str(text).replace("\\", "\\\\").replace("'", "''")
    return f"'{clean}'"

sql_lines = []
sql_lines.append("-- =====================================================")
sql_lines.append("-- NOVEL MANAGER - SEED DATA TỰ ĐỘNG TỪ DATA DRIVE")
sql_lines.append("-- Trường Đại học Phenikaa - Thiết Kế Web Nâng Cao")
sql_lines.append("-- =====================================================\n")
sql_lines.append("USE novel_manager;\n")
sql_lines.append("SET FOREIGN_KEY_CHECKS = 0;\n")

# 1. USERS & AUTHORS
# bcrypt hash for password "Admin@123456" and "User@123456"
# bcrypt hash: $2b$10$wT1iGZ6v7Ue8O9GgN5f9e.Hq1E0q.w6.F8M9R7P1t5C4b3A2z1Y0X
PASS_HASH = "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW"

sql_lines.append("-- 1. SEED USERS")
sql_lines.append("TRUNCATE TABLE users;")
sql_lines.append(f"INSERT INTO users (id, username, email, password_hash, full_name, avatar_url, role, is_active) VALUES")
sql_lines.append(f"(1, 'admin', 'admin@phenikaa-uni.edu.vn', '{PASS_HASH}', 'Quản Trị Viên Phenikaa', '/assets/avatars/admin.png', 'admin', 1),")
sql_lines.append(f"(2, 'reader_vip', 'reader@phenikaa-uni.edu.vn', '{PASS_HASH}', 'Nguyễn Văn Độc Giả', '/assets/avatars/reader1.png', 'reader', 1),")

author_user_ids = {}
user_idx = 3
for a in authors:
    uid = user_idx
    author_user_ids[a['pen_name']] = uid
    uname = re.sub(r'[^a-zA-Z0-9_]', '_', a['pen_name']).lower()[:30] or f"author_{a['id']}"
    sql_lines.append(f"({uid}, '{uname}_{uid}', 'author_{uid}@novelmanager.vn', '{PASS_HASH}', {esc(a['pen_name'])}, '/assets/avatars/author.png', 'author', 1),")
    user_idx += 1

# Remove trailing comma from last user
sql_lines[-1] = sql_lines[-1][:-1] + ";\n"

sql_lines.append("-- 2. SEED AUTHORS")
sql_lines.append("TRUNCATE TABLE authors;")
sql_lines.append("INSERT INTO authors (id, user_id, pen_name, bio, avatar_url, total_novels) VALUES")
for a in authors:
    uid = author_user_ids[a['pen_name']]
    bio = f"Tác giả {a['pen_name']} - sáng tác trên nền tảng Novel Manager Phenikaa."
    sql_lines.append(f"({a['id']}, {uid}, {esc(a['pen_name'])}, {esc(bio)}, '/assets/avatars/author.png', 0),")
sql_lines[-1] = sql_lines[-1][:-1] + ";\n"

# 3. CATEGORIES
sql_lines.append("-- 3. SEED CATEGORIES")
sql_lines.append("TRUNCATE TABLE categories;")
sql_lines.append("INSERT INTO categories (id, name, slug, description, icon, novel_count) VALUES")
cat_name_to_id = {}
for c in categories:
    cat_name_to_id[c['name']] = c['id']
    icon = ''
    sql_lines.append(f"({c['id']}, {esc(c['name'])}, {esc(c['slug'])}, {esc('Thể loại ' + c['name'])}, '{icon}', 0),")
sql_lines[-1] = sql_lines[-1][:-1] + ";\n"

# 4. TAGS
sql_lines.append("-- 4. SEED TAGS")
sql_lines.append("TRUNCATE TABLE tags;")
sql_lines.append("INSERT INTO tags (id, name, slug) VALUES")
tags_list = [
    (1, 'Hệ Thống', 'he-thong'),
    (2, 'Xuyên Không', 'xuyen-khong'),
    (3, 'Trọng Sinh', 'trong-sinh'),
    (4, 'Ma Thuật', 'ma-thuat'),
    (5, 'Học Viện', 'hoc-vien'),
    (6, 'Vô Địch Lưu', 'vo-dich-luu'),
    (7, 'Ngọt Sủng', 'ngot-sung'),
    (8, 'Hài Hước', 'hai-huoc')
]
for tid, tname, tslug in tags_list:
    sql_lines.append(f"({tid}, '{tname}', '{tslug}'),")
sql_lines[-1] = sql_lines[-1][:-1] + ";\n"

# 5. NOVELS & CHAPTERS
sql_lines.append("-- 5. SEED NOVELS")
sql_lines.append("TRUNCATE TABLE novels;")
sql_lines.append("INSERT INTO novels (id, author_id, title, slug, description, cover_image, status, avg_rating, total_views, total_bookmarks, total_chapters, total_ratings, is_featured, published_at) VALUES")

author_name_to_id = {a['pen_name']: a['id'] for a in authors}
novel_id_map = {}

for idx, n in enumerate(novels, 1):
    nid = idx
    novel_id_map[n['slug']] = nid
    aid = author_name_to_id.get(n['author'], 1)
    cover = f"/assets/covers/{n['cover_image']}" if n['cover_image'] else "/assets/covers/default_cover.jpg"
    status = n['status']
    desc = n['description'] or f"Bộ tiểu thuyết {n['title']} đặc sắc của tác giả {n['author']}."
    is_featured = 1 if idx <= 6 else 0
    sql_lines.append(f"({nid}, {aid}, {esc(n['title'])}, {esc(n['slug'])}, {esc(desc)}, {esc(cover)}, '{status}', {n['avg_rating']}, {n['total_views']}, {n['total_bookmarks']}, {n['total_chapters']}, 150, {is_featured}, NOW()),")
sql_lines[-1] = sql_lines[-1][:-1] + ";\n"

# 6. NOVEL_CATEGORIES
sql_lines.append("-- 6. SEED NOVEL_CATEGORIES")
sql_lines.append("TRUNCATE TABLE novel_categories;")
sql_lines.append("INSERT INTO novel_categories (novel_id, category_id) VALUES")
for n in novels:
    nid = novel_id_map[n['slug']]
    for cname in n['categories']:
        cid = cat_name_to_id.get(cname)
        if cid:
            sql_lines.append(f"({nid}, {cid}),")
sql_lines[-1] = sql_lines[-1][:-1] + ";\n"

# 7. CHAPTERS
sql_lines.append("-- 7. SEED CHAPTERS (Trích xuất 10 chương đầu cho mỗi truyện để tối ưu hiệu năng)")
sql_lines.append("TRUNCATE TABLE chapters;")
sql_lines.append("INSERT INTO chapters (id, novel_id, chapter_number, title, content, word_count, views, status, published_at) VALUES")

chapter_global_id = 1
for n in novels:
    nid = novel_id_map[n['slug']]
    ch_file = os.path.join(CHAPTERS_DIR, f"{n['slug']}_chapters.json")
    if os.path.exists(ch_file):
        with open(ch_file, encoding='utf-8') as f:
            ch_data = json.load(f)
            # Insert first 10-15 chapters per novel for realistic fast seeding
            for ch in ch_data['chapters'][:12]:
                cid = chapter_global_id
                chapter_global_id += 1
                cnum = ch['chapter_number']
                ctitle = ch['title']
                # Limit content snippet if huge, keep first 10000 chars for DB seeding
                content = ch['content'][:15000]
                wcount = ch['word_count']
                views = 1200 + (cnum * 50)
                sql_lines.append(f"({cid}, {nid}, {cnum}, {esc(ctitle)}, {esc(content)}, {wcount}, {views}, 'published', NOW()),")

sql_lines[-1] = sql_lines[-1][:-1] + ";\n"

# 8. COMMENTS, RATINGS, BOOKMARKS, HISTORY
sql_lines.append("-- 8. SEED RATINGS & BOOKMARKS & HISTORY")
sql_lines.append("TRUNCATE TABLE ratings;")
sql_lines.append("INSERT INTO ratings (user_id, novel_id, score, review) VALUES")
sql_lines.append("(2, 1, 5, 'Bộ truyện quá tuyệt vời, dịch mượt mà!'),")
sql_lines.append("(2, 2, 5, 'Combat đỉnh chóp, tác giả viết cuốn hút.'),")
sql_lines.append("(2, 3, 4, 'Cốt truyện hay, mong ra chương mới nhanh hơn.');\n")

sql_lines.append("TRUNCATE TABLE bookmarks;")
sql_lines.append("INSERT INTO bookmarks (user_id, novel_id, last_chapter_id) VALUES")
sql_lines.append("(2, 1, 3),")
sql_lines.append("(2, 3, 5);\n")

sql_lines.append("TRUNCATE TABLE reading_history;")
sql_lines.append("INSERT INTO reading_history (user_id, novel_id, chapter_id, progress_percent) VALUES")
sql_lines.append("(2, 1, 3, 75.5),")
sql_lines.append("(2, 3, 5, 42.0);\n")

sql_lines.append("SET FOREIGN_KEY_CHECKS = 1;\n")
sql_lines.append("-- HOÀN TẤT SEED DATA THÀNH CÔNG!\n")

with open(OUTPUT_SQL, 'w', encoding='utf-8') as f:
    f.write("\n".join(sql_lines))

print(f"Da tao thanh cong file SQL seed: {OUTPUT_SQL} ({len(sql_lines)} dong)")
