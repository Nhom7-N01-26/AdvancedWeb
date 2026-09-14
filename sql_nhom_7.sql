DROP DATABASE IF EXISTS novel_manager;

CREATE DATABASE novel_manager
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE novel_manager;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500) DEFAULT NULL,
    role ENUM('admin', 'author', 'reader') NOT NULL DEFAULT 'reader',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_role (role),
    INDEX idx_users_active (is_active),
    INDEX idx_users_created (created_at)
) ENGINE=InnoDB;

CREATE TABLE authors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    pen_name VARCHAR(100) NOT NULL,
    bio TEXT DEFAULT NULL,
    avatar_url VARCHAR(500) DEFAULT NULL,
    total_novels INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_authors_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_authors_pen_name (pen_name)
) ENGINE=InnoDB;

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    icon VARCHAR(100) DEFAULT NULL,
    novel_count INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_categories_slug (slug)
) ENGINE=InnoDB;

CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tags_slug (slug)
) ENGINE=InnoDB;

CREATE TABLE novels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(280) NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    cover_image VARCHAR(500) DEFAULT NULL,
    status ENUM('draft', 'ongoing', 'completed', 'hiatus') NOT NULL DEFAULT 'draft',
    avg_rating DECIMAL(3,2) NOT NULL DEFAULT 0.00,
    total_views INT NOT NULL DEFAULT 0,
    total_bookmarks INT NOT NULL DEFAULT 0,
    total_chapters INT NOT NULL DEFAULT 0,
    total_ratings INT NOT NULL DEFAULT 0,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    published_at DATETIME DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_novels_author
        FOREIGN KEY (author_id) REFERENCES authors(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    INDEX idx_novels_author (author_id),
    INDEX idx_novels_status (status),
    INDEX idx_novels_slug (slug),
    INDEX idx_novels_featured (is_featured),
    INDEX idx_novels_rating (avg_rating DESC),
    INDEX idx_novels_views (total_views DESC),
    INDEX idx_novels_published (published_at DESC),
    INDEX idx_novels_created (created_at DESC),
    FULLTEXT INDEX ft_novels_search (title, description)
) ENGINE=InnoDB;

CREATE TABLE novel_categories (
    novel_id INT NOT NULL,
    category_id INT NOT NULL,

    PRIMARY KEY (novel_id, category_id),

    CONSTRAINT fk_nc_novel
        FOREIGN KEY (novel_id) REFERENCES novels(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_nc_category
        FOREIGN KEY (category_id) REFERENCES categories(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    INDEX idx_nc_category (category_id)
) ENGINE=InnoDB;

CREATE TABLE novel_tags (
    novel_id INT NOT NULL,
    tag_id INT NOT NULL,

    PRIMARY KEY (novel_id, tag_id),

    CONSTRAINT fk_nt_novel
        FOREIGN KEY (novel_id) REFERENCES novels(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_nt_tag
        FOREIGN KEY (tag_id) REFERENCES tags(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    INDEX idx_nt_tag (tag_id)
) ENGINE=InnoDB;

CREATE TABLE chapters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    novel_id INT NOT NULL,
    chapter_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    word_count INT NOT NULL DEFAULT 0,
    views INT NOT NULL DEFAULT 0,
    status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
    published_at DATETIME DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uk_chapter_number (novel_id, chapter_number),

    CONSTRAINT fk_chapters_novel
        FOREIGN KEY (novel_id) REFERENCES novels(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    INDEX idx_chapters_novel (novel_id),
    INDEX idx_chapters_status (status),
    INDEX idx_chapters_published (published_at DESC)
) ENGINE=InnoDB;

CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    chapter_id INT NOT NULL,
    parent_id INT DEFAULT NULL,
    content TEXT NOT NULL,
    likes INT NOT NULL DEFAULT 0,
    is_edited BOOLEAN NOT NULL DEFAULT FALSE,
    is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_comments_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_comments_chapter
        FOREIGN KEY (chapter_id) REFERENCES chapters(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_comments_parent
        FOREIGN KEY (parent_id) REFERENCES comments(id)
        ON DELETE SET NULL ON UPDATE CASCADE,

    INDEX idx_comments_user (user_id),
    INDEX idx_comments_chapter (chapter_id),
    INDEX idx_comments_parent (parent_id),
    INDEX idx_comments_created (created_at DESC)
) ENGINE=InnoDB;

CREATE TABLE ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    novel_id INT NOT NULL,
    score TINYINT NOT NULL,
    review TEXT DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uk_user_novel_rating (user_id, novel_id),

    CONSTRAINT chk_rating_score CHECK (score >= 1 AND score <= 5),

    CONSTRAINT fk_ratings_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_ratings_novel
        FOREIGN KEY (novel_id) REFERENCES novels(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    INDEX idx_ratings_novel (novel_id),
    INDEX idx_ratings_score (score)
) ENGINE=InnoDB;

CREATE TABLE bookmarks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    novel_id INT NOT NULL,
    last_chapter_id INT DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uk_user_novel_bookmark (user_id, novel_id),

    CONSTRAINT fk_bookmarks_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_bookmarks_novel
        FOREIGN KEY (novel_id) REFERENCES novels(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_bookmarks_chapter
        FOREIGN KEY (last_chapter_id) REFERENCES chapters(id)
        ON DELETE SET NULL ON UPDATE CASCADE,

    INDEX idx_bookmarks_user (user_id),
    INDEX idx_bookmarks_novel (novel_id)
) ENGINE=InnoDB;

CREATE TABLE reading_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    novel_id INT NOT NULL,
    chapter_id INT NOT NULL,
    progress_percent DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    read_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uk_user_chapter_history (user_id, chapter_id),

    CONSTRAINT chk_progress CHECK (progress_percent >= 0 AND progress_percent <= 100),

    CONSTRAINT fk_rh_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_rh_novel
        FOREIGN KEY (novel_id) REFERENCES novels(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_rh_chapter
        FOREIGN KEY (chapter_id) REFERENCES chapters(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    INDEX idx_rh_user (user_id),
    INDEX idx_rh_novel (novel_id),
    INDEX idx_rh_read_at (read_at DESC)
) ENGINE=InnoDB;

DELIMITER //

CREATE TRIGGER trg_chapter_insert_count
AFTER INSERT ON chapters
FOR EACH ROW
BEGIN
    IF NEW.status = 'published' THEN
        UPDATE novels
        SET total_chapters = (
            SELECT COUNT(*)
            FROM chapters
            WHERE novel_id = NEW.novel_id
            AND status = 'published'
        )
        WHERE id = NEW.novel_id;
    END IF;
END//

CREATE TRIGGER trg_chapter_update_count
AFTER UPDATE ON chapters
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        UPDATE novels
        SET total_chapters = (
            SELECT COUNT(*)
            FROM chapters
            WHERE novel_id = NEW.novel_id
            AND status = 'published'
        )
        WHERE id = NEW.novel_id;
    END IF;
END//

CREATE TRIGGER trg_chapter_delete_count
AFTER DELETE ON chapters
FOR EACH ROW
BEGIN
    UPDATE novels
    SET total_chapters = (
        SELECT COUNT(*)
        FROM chapters
        WHERE novel_id = OLD.novel_id
        AND status = 'published'
    )
    WHERE id = OLD.novel_id;
END//

CREATE TRIGGER trg_rating_insert
AFTER INSERT ON ratings
FOR EACH ROW
BEGIN
    UPDATE novels
    SET avg_rating = (
        SELECT ROUND(AVG(score), 2)
        FROM ratings
        WHERE novel_id = NEW.novel_id
    ),
    total_ratings = (
        SELECT COUNT(*)
        FROM ratings
        WHERE novel_id = NEW.novel_id
    )
    WHERE id = NEW.novel_id;
END//

CREATE TRIGGER trg_rating_update
AFTER UPDATE ON ratings
FOR EACH ROW
BEGIN
    UPDATE novels
    SET avg_rating = (
        SELECT ROUND(AVG(score), 2)
        FROM ratings
        WHERE novel_id = NEW.novel_id
    )
    WHERE id = NEW.novel_id;
END//

CREATE TRIGGER trg_rating_delete
AFTER DELETE ON ratings
FOR EACH ROW
BEGIN
    UPDATE novels
    SET avg_rating = COALESCE((
        SELECT ROUND(AVG(score), 2)
        FROM ratings
        WHERE novel_id = OLD.novel_id
    ), 0.00),
    total_ratings = (
        SELECT COUNT(*)
        FROM ratings
        WHERE novel_id = OLD.novel_id
    )
    WHERE id = OLD.novel_id;
END//

CREATE TRIGGER trg_bookmark_insert
AFTER INSERT ON bookmarks
FOR EACH ROW
BEGIN
    UPDATE novels
    SET total_bookmarks = (
        SELECT COUNT(*)
        FROM bookmarks
        WHERE novel_id = NEW.novel_id
    )
    WHERE id = NEW.novel_id;
END//

CREATE TRIGGER trg_bookmark_delete
AFTER DELETE ON bookmarks
FOR EACH ROW
BEGIN
    UPDATE novels
    SET total_bookmarks = (
        SELECT COUNT(*)
        FROM bookmarks
        WHERE novel_id = OLD.novel_id
    )
    WHERE id = OLD.novel_id;
END//

CREATE TRIGGER trg_novel_insert_author_count
AFTER INSERT ON novels
FOR EACH ROW
BEGIN
    UPDATE authors
    SET total_novels = (
        SELECT COUNT(*)
        FROM novels
        WHERE author_id = NEW.author_id
    )
    WHERE id = NEW.author_id;
END//

CREATE TRIGGER trg_novel_delete_author_count
AFTER DELETE ON novels
FOR EACH ROW
BEGIN
    UPDATE authors
    SET total_novels = (
        SELECT COUNT(*)
        FROM novels
        WHERE author_id = OLD.author_id
    )
    WHERE id = OLD.author_id;
END//

CREATE TRIGGER trg_nc_insert_count
AFTER INSERT ON novel_categories
FOR EACH ROW
BEGIN
    UPDATE categories
    SET novel_count = (
        SELECT COUNT(*)
        FROM novel_categories
        WHERE category_id = NEW.category_id
    )
    WHERE id = NEW.category_id;
END//

CREATE TRIGGER trg_nc_delete_count
AFTER DELETE ON novel_categories
FOR EACH ROW
BEGIN
    UPDATE categories
    SET novel_count = (
        SELECT COUNT(*)
        FROM novel_categories
        WHERE category_id = OLD.category_id
    )
    WHERE id = OLD.category_id;
END//

DELIMITER ;

INSERT INTO users
(username, email, password_hash, full_name, role)
VALUES
('admin', 'admin@novelmanager.vn', '$2b$10$HASH_PLACEHOLDER_ADMIN', 'Quản Trị Viên', 'admin'),
('nguyenvanA', 'nguyenvana@gmail.com', '$2b$10$HASH_PLACEHOLDER_AUTHOR1', 'Nguyễn Văn A', 'author'),
('tranvanB', 'tranvanb@gmail.com', '$2b$10$HASH_PLACEHOLDER_AUTHOR2', 'Trần Văn B', 'author'),
('lethiC', 'lethic@gmail.com', '$2b$10$HASH_PLACEHOLDER_READER1', 'Lê Thị C', 'reader'),
('phamvanD', 'phamvand@gmail.com', '$2b$10$HASH_PLACEHOLDER_READER2', 'Phạm Văn D', 'reader');

INSERT INTO authors
(user_id, pen_name, bio)
VALUES
(2, 'Mặc Hương Đồng Xứ', 'Tác giả chuyên viết truyện tiên hiệp và huyền huyễn. Đã xuất bản hơn 10 tác phẩm nổi tiếng.'),
(3, 'Thiên Tàm Thổ Đậu', 'Tác giả nổi tiếng với các tác phẩm kiếm hiệp và đô thị. Phong cách viết hấp dẫn, lôi cuốn.');

INSERT INTO categories
(name, slug, description, icon)
VALUES
('Tiên Hiệp', 'tien-hiep', 'Truyện về tu tiên, thần tiên trong thế giới huyền ảo', '🌟'),
('Kiếm Hiệp', 'kiem-hiep', 'Truyện về hiệp khách, võ lâm, giang hồ', '⚔️'),
('Ngôn Tình', 'ngon-tinh', 'Truyện tình cảm lãng mạn', '💕'),
('Đô Thị', 'do-thi', 'Truyện lấy bối cảnh thành phố hiện đại', '🏙️'),
('Huyền Huyễn', 'huyen-huyen', 'Truyện thần thoại, ma thuật, thế giới kỳ ảo', '🔮'),
('Khoa Huyễn', 'khoa-huyen', 'Truyện khoa học viễn tưởng', '🚀'),
('Lịch Sử', 'lich-su', 'Truyện dựa trên các sự kiện lịch sử', '📜'),
('Quân Sự', 'quan-su', 'Truyện về chiến tranh, quân đội', '🎖️'),
('Kinh Dị', 'kinh-di', 'Truyện rùng rợn, kinh dị, ma quái', '👻'),
('Trinh Thám', 'trinh-tham', 'Truyện phá án, điều tra, bí ẩn', '🔍'),
('Trọng Sinh', 'trong-sinh', 'Truyện nhân vật được sống lại từ đầu', '🔄'),
('Hài Hước', 'hai-huoc', 'Truyện vui nhộn, giải trí', '😂'),
('Đam Mỹ', 'dam-my', 'Truyện tình cảm nam-nam', '🌈'),
('Nữ Cường', 'nu-cuong', 'Truyện nữ chính mạnh mẽ', '💪'),
('Võng Du', 'vong-du', 'Truyện game, thế giới ảo, MMORPG', '🎮');

INSERT INTO tags
(name, slug)
VALUES
('Hệ Thống', 'he-thong'),
('Xuyên Không', 'xuyen-khong'),
('Trọng Sinh', 'trong-sinh'),
('Nữ Phụ', 'nu-phu'),
('Sủng', 'sung'),
('Ngược', 'nguoc'),
('Báo Thù', 'bao-thu'),
('Tu Tiên', 'tu-tien'),
('Đấu Trí', 'dau-tri'),
('Chế Tạo', 'che-tao'),
('Phế Vật Nghịch Thiên', 'phe-vat-nghich-thien'),
('Hậu Cung', 'hau-cung'),
('Già Lão Biến Trẻ', 'gia-lao-bien-tre'),
('Mạt Thế', 'mat-the'),
('Dị Năng', 'di-nang');

INSERT INTO novels
(author_id, title, slug, description, status, published_at)
VALUES
(1, 'Đấu Phá Thương Khung', 'dau-pha-thuong-khung',
'Tam thập niên Hà Đông, tam thập niên Hà Tây, chớ khinh thiếu niên nghèo! Thiếu niên Tiêu Viêm, bị coi là phế vật, nhưng ẩn giấu linh hồn của Dược Tôn...',
'completed', NOW()),

(1, 'Vũ Động Càn Khôn', 'vu-dong-can-khon',
'Thiếu niên Lâm Động, sống tại một thị trấn nhỏ. Tình cờ nhặt được một viên đá bí ẩn, từ đó bước vào con đường tu luyện đầy gian nan...',
'completed', NOW()),

(2, 'Đô Thị Cực Phẩm Cuồng Y', 'do-thi-cuc-pham-cuong-y',
'Một thần y trẻ tuổi bước vào thành phố phồn hoa, với y thuật thần kỳ và tài năng phi thường...',
'ongoing', NOW()),

(1, 'Đại Chúa Tể', 'dai-chu-te',
'Thiên Địa đại loạn, chư hầu hùng cứ. Thiếu niên Mục Trần, vì bảo vệ người mình yêu thương mà bước vào thế giới tu luyện...',
'ongoing', NOW()),

(2, 'Nhất Niệm Vĩnh Hằng', 'nhat-niem-vinh-hang',
'Một niệm vĩnh hằng, một niệm sinh diệt. Thiếu niên Bạch Tiểu Thuần bước vào thế giới tu tiên...',
'draft', NULL);

INSERT INTO novel_categories
(novel_id, category_id)
VALUES
(1, 1),
(1, 5),
(2, 1),
(2, 5),
(3, 4),
(4, 1),
(4, 5),
(5, 1),
(5, 5);

INSERT INTO novel_tags
(novel_id, tag_id)
VALUES
(1, 11),
(1, 8),
(2, 8),
(2, 9),
(3, 5),
(3, 15),
(4, 8),
(4, 9),
(5, 8),
(5, 3);

INSERT INTO chapters
(novel_id, chapter_number, title, content, word_count, status, published_at)
VALUES
(1, 1, 'Chương 1: Phế Vật Tiêu Viêm',
'Trên quảng trường rộng lớn của gia tộc Tiêu, thiếu niên Tiêu Viêm đứng lặng lẽ ở một góc. Ba năm trước, cậu còn được xưng tụng là thiên tài tu luyện hiếm có trong trăm năm của gia tộc. Thế nhưng, ba năm qua, thực lực của cậu không tiến mà lùi, từ Đấu Khí tầng chín tụt xuống tầng bảy, trở thành trò cười cho cả gia tộc...\n\nTiêu Viêm ngẩng đầu nhìn lên bầu trời, ánh mắt cậu tối tăm nhưng ẩn chứa một ngọn lửa không bao giờ tắt. "Tam thập niên Hà Đông, tam thập niên Hà Tây. Chớ khinh thiếu niên nghèo!" Cậu thầm nhủ trong lòng.',
280, 'published', NOW()),

(1, 2, 'Chương 2: Dược Lão',
'Chiếc nhẫn cổ trên ngón tay Tiêu Viêm bỗng phát ra một luồng ánh sáng kỳ dị. Một giọng nói già nua vang lên trong đầu cậu: "Tiểu tử, ngươi đã đánh thức ta rồi..."\n\nTiêu Viêm giật mình, nhìn chiếc nhẫn trong kinh ngạc. "Ngươi... ngươi là ai?"\n\n"Ta là Dược Trần, Dược Tôn đời thứ nhất. Ngươi có muốn lấy lại sức mạnh đã mất không?"',
250, 'published', NOW()),

(1, 3, 'Chương 3: Khế Ước Tu Luyện',
'Dược Lão giải thích cho Tiêu Viêm biết nguyên nhân thực sự khiến thực lực của cậu suy giảm. Hóa ra, có một loại dị hỏa đang ẩn náu trong cơ thể cậu, liên tục hấp thu Đấu Khí...\n\n"Dị Hỏa Phệ Nghiệt?" Tiêu Viêm kinh hoàng.\n\n"Đúng vậy, nhưng đây không phải là tai họa, mà là cơ duyên lớn nhất đời ngươi. Chỉ cần ngươi có thể thuần phục nó, thực lực sẽ tăng vọt!" Dược Lão cười ha hả.',
260, 'published', NOW());

INSERT INTO chapters
(novel_id, chapter_number, title, content, word_count, status, published_at)
VALUES
(2, 1, 'Chương 1: Lâm Động',
'Thanh Dương Trấn, một thị trấn nhỏ nằm ở rìa Đại Viêm Vương Triều. Nơi đây không có những cao thủ Đấu Khí đỉnh phong, chỉ có những gia tộc nhỏ tranh giành ảnh hưởng...\n\nThiếu niên Lâm Động ngồi bên bờ suối, tay cầm một viên đá đen bóng loáng. Viên đá này cậu nhặt được từ một hang động bí ẩn, và từ khi có nó, cậu luôn cảm thấy có một luồng năng lượng kỳ lạ chảy trong cơ thể.',
250, 'published', NOW()),

(2, 2, 'Chương 2: Thạch Phù Bí Ẩn',
'Đêm khuya, Lâm Động đột nhiên phát hiện viên đá đen phát ra ánh sáng huyền bí. Một hình bóng mờ ảo hiện ra từ viên đá...\n\n"Tiểu tử, ngươi đã tìm được Tổ Phù Thạch!" Giọng nói đầy uy nghiêm vang lên.',
220, 'published', NOW());

INSERT INTO chapters
(novel_id, chapter_number, title, content, word_count, status, published_at)
VALUES
(3, 1, 'Chương 1: Thần Y Xuất Sơn',
'Trên đỉnh núi mây phủ, một thanh niên khoảng hai mươi lăm tuổi đứng trước mộ sư phụ. Gió thổi mạnh làm tung bay tà áo trắng.\n\n"Sư phụ, con sẽ xuống núi theo lời dặn của người. Hẹn gặp lại người ở kiếp sau."\n\nNói xong, thanh niên quay người, bước đi dứt khoát. Y thuật thần kỳ, một thân võ công cao cường, thế nhưng thành phố dưới chân núi mới là chiến trường thực sự của anh.',
260, 'published', NOW());

INSERT INTO ratings
(user_id, novel_id, score, review)
VALUES
(4, 1, 5, 'Truyện hay tuyệt vời! Nhân vật Tiêu Viêm rất có cá tính.'),
(5, 1, 4, 'Nội dung hấp dẫn, cốt truyện cuốn hút. Khuyên đọc!'),
(4, 2, 5, 'Vũ Động Càn Khôn xứng danh kinh điển.'),
(5, 3, 4, 'Truyện đô thị hay, nhưng hơi chậm ở đầu.');

INSERT INTO bookmarks
(user_id, novel_id, last_chapter_id)
VALUES
(4, 1, 3),
(5, 1, 2),
(4, 2, 5),
(5, 3, 6);

INSERT INTO reading_history
(user_id, novel_id, chapter_id, progress_percent)
VALUES
(4, 1, 1, 100.00),
(4, 1, 2, 100.00),
(4, 1, 3, 45.50),
(5, 1, 1, 100.00),
(5, 1, 2, 78.30),
(4, 2, 4, 100.00),
(4, 2, 5, 60.00);

INSERT INTO comments
(user_id, chapter_id, parent_id, content)
VALUES
(4, 1, NULL, 'Chương đầu đã rất cuốn hút! Tiêu Viêm quá ngầu.'),
(5, 1, NULL, 'Mở đầu rất hay, nhịp truyện nhanh gọn.'),
(4, 1, 2, 'Đồng ý! Nhất là câu "Chớ khinh thiếu niên nghèo" rất kinh điển.'),
(5, 2, NULL, 'Dược Lão xuất hiện rồi, truyện bắt đầu vào cao trào!'),
(4, 4, NULL, 'Vũ Động Càn Khôn cũng hay không kém gì Đấu Phá.');

CREATE VIEW v_novel_details AS
SELECT
    n.id,
    n.title,
    n.slug,
    n.description,
    n.cover_image,
    n.status,
    n.avg_rating,
    n.total_views,
    n.total_bookmarks,
    n.total_chapters,
    n.total_ratings,
    n.is_featured,
    n.published_at,
    n.created_at,
    a.pen_name AS author_name,
    a.id AS author_id,
    u.avatar_url AS author_avatar
FROM novels n
JOIN authors a ON n.author_id = a.id
JOIN users u ON a.user_id = u.id;

CREATE VIEW v_novel_with_categories AS
SELECT
    n.id AS novel_id,
    n.title,
    n.slug,
    GROUP_CONCAT(c.name ORDER BY c.name SEPARATOR ', ') AS categories
FROM novels n
LEFT JOIN novel_categories nc ON n.id = nc.novel_id
LEFT JOIN categories c ON nc.category_id = c.id
GROUP BY n.id, n.title, n.slug;

CREATE VIEW v_novel_with_tags AS
SELECT
    n.id AS novel_id,
    n.title,
    GROUP_CONCAT(t.name ORDER BY t.name SEPARATOR ', ') AS tags
FROM novels n
LEFT JOIN novel_tags nt ON n.id = nt.novel_id
LEFT JOIN tags t ON nt.tag_id = t.id
GROUP BY n.id, n.title;

CREATE VIEW v_chapter_comment_stats AS
SELECT
    ch.id AS chapter_id,
    ch.novel_id,
    ch.chapter_number,
    ch.title,
    ch.views,
    COUNT(cm.id) AS total_comments
FROM chapters ch
LEFT JOIN comments cm
    ON ch.id = cm.chapter_id
    AND cm.is_hidden = FALSE
GROUP BY
    ch.id,
    ch.novel_id,
    ch.chapter_number,
    ch.title,
    ch.views;

CREATE VIEW v_novel_rankings AS
SELECT
    n.id,
    n.title,
    a.pen_name AS author_name,
    n.avg_rating,
    n.total_views,
    n.total_bookmarks,
    n.total_chapters,
    n.status,
    (n.avg_rating * 20 + n.total_views * 0.01 + n.total_bookmarks * 2) AS ranking_score
FROM novels n
JOIN authors a ON n.author_id = a.id
WHERE n.status IN ('ongoing', 'completed')
ORDER BY ranking_score DESC;

DELIMITER //

CREATE PROCEDURE sp_get_novels(
    IN p_category_id INT,
    IN p_status VARCHAR(20),
    IN p_sort_by VARCHAR(20),
    IN p_page INT,
    IN p_page_size INT
)
BEGIN
    DECLARE v_offset INT;

    SET v_offset = (p_page - 1) * p_page_size;

    SELECT
        n.id,
        n.title,
        n.slug,
        n.cover_image,
        n.status,
        n.avg_rating,
        n.total_views,
        n.total_chapters,
        a.pen_name AS author_name,
        GROUP_CONCAT(DISTINCT c.name SEPARATOR ', ') AS categories
    FROM novels n
    JOIN authors a ON n.author_id = a.id
    LEFT JOIN novel_categories nc ON n.id = nc.novel_id
    LEFT JOIN categories c ON nc.category_id = c.id
    WHERE
        (p_category_id IS NULL OR nc.category_id = p_category_id)
        AND (p_status IS NULL OR n.status = p_status)
    GROUP BY
        n.id,
        n.title,
        n.slug,
        n.cover_image,
        n.status,
        n.avg_rating,
        n.total_views,
        n.total_chapters,
        a.pen_name,
        n.published_at,
        n.created_at
    ORDER BY
        CASE p_sort_by
            WHEN 'rating' THEN n.avg_rating
            WHEN 'views' THEN n.total_views
            ELSE NULL
        END DESC,
        CASE p_sort_by
            WHEN 'newest' THEN n.published_at
            WHEN 'updated' THEN n.updated_at
            ELSE n.created_at
        END DESC
    LIMIT p_page_size OFFSET v_offset;
END//

CREATE PROCEDURE sp_search_novels(
    IN p_keyword VARCHAR(255),
    IN p_page INT,
    IN p_page_size INT
)
BEGIN
    DECLARE v_offset INT;

    SET v_offset = (p_page - 1) * p_page_size;

    SELECT
        n.id,
        n.title,
        n.slug,
        n.cover_image,
        n.status,
        n.avg_rating,
        n.total_views,
        a.pen_name AS author_name,
        MATCH(n.title, n.description)
            AGAINST(p_keyword IN NATURAL LANGUAGE MODE) AS relevance
    FROM novels n
    JOIN authors a ON n.author_id = a.id
    WHERE MATCH(n.title, n.description)
        AGAINST(p_keyword IN NATURAL LANGUAGE MODE)
    ORDER BY relevance DESC
    LIMIT p_page_size OFFSET v_offset;
END//

DELIMITER ;

SELECT 'Database novel_manager đã được tạo thành công!' AS message;

SELECT CONCAT(
    'Tổng số bảng: ',
    COUNT(*)
) AS info
FROM information_schema.tables
WHERE table_schema = 'novel_manager'
AND table_type = 'BASE TABLE';
