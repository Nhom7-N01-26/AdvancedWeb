/**
 * initialData.js
 * Dữ liệu chuẩn xác 100% đối chiếu từ CSDL sql_nhom_7.sql của Nhóm 7 (Novel Manager)
 * Tuyệt đối không bịa đặt số liệu: Lượt xem, đánh giá, số chương đều dựa trên dữ liệu thực tế!
 */

export const INITIAL_USERS = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@novelmanager.vn',
    full_name: 'Quản Trị Viên (Admin Nhóm 7)',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    badge: 'Quản trị viên hệ thống'
  },
  {
    id: 2,
    username: 'nguyenvanA',
    email: 'nguyenvana@gmail.com',
    full_name: 'Nguyễn Văn A',
    role: 'author',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    badge: 'Tác giả'
  },
  {
    id: 3,
    username: 'tranvanB',
    email: 'tranvanb@gmail.com',
    full_name: 'Trần Văn B',
    role: 'author',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    badge: 'Tác giả'
  },
  {
    id: 4,
    username: 'lethiC',
    email: 'lethic@gmail.com',
    full_name: 'Lê Thị C',
    role: 'reader',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    badge: 'Độc giả thân thiết'
  },
  {
    id: 5,
    username: 'phamvanD',
    email: 'phamvand@gmail.com',
    full_name: 'Phạm Văn D',
    role: 'reader',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    badge: 'Độc giả thân thiết'
  }
];

// Danh mục chuẩn từ bảng categories trong sql_nhom_7.sql
export const INITIAL_CATEGORIES = [
  {
    id: 1,
    name: 'Tiên Hiệp',
    slug: 'tien-hiep',
    icon: 'bi-stars',
    emoji: '🌟',
    description: 'Truyện về tu tiên, thần tiên trong thế giới huyền ảo',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    name: 'Kiếm Hiệp',
    slug: 'kiem-hiep',
    icon: 'bi-shield-shaded',
    emoji: '⚔️',
    description: 'Truyện về hiệp khách, võ lâm, giang hồ',
    cover: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    name: 'Huyền Huyễn',
    slug: 'huyen-huyen',
    icon: 'bi-magic',
    emoji: '🔮',
    description: 'Truyện thần thoại, ma thuật, thế giới kỳ ảo',
    cover: 'https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 4,
    name: 'Đô Thị',
    slug: 'do-thi',
    icon: 'bi-buildings',
    emoji: '🏙️',
    description: 'Truyện lấy bối cảnh thành phố hiện đại',
    cover: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 5,
    name: 'Ngôn Tình',
    slug: 'ngon-tinh',
    icon: 'bi-heart-fill',
    emoji: '💕',
    description: 'Truyện tình cảm lãng mạn',
    cover: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 6,
    name: 'Khoa Huyễn',
    slug: 'khoa-huyen',
    icon: 'bi-rocket-takeoff',
    emoji: '🚀',
    description: 'Truyện khoa học viễn tưởng',
    cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 7,
    name: 'Võng Du',
    slug: 'vong-du',
    icon: 'bi-controller',
    emoji: '🎮',
    description: 'Truyện game, thế giới ảo, MMORPG',
    cover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 8,
    name: 'Trọng Sinh',
    slug: 'trong-sinh',
    icon: 'bi-arrow-repeat',
    emoji: '🔄',
    description: 'Truyện nhân vật được sống lại từ đầu',
    cover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80'
  }
];

// Tác giả chuẩn từ bảng authors trong sql_nhom_7.sql
export const INITIAL_AUTHORS = [
  {
    id: 1,
    pen_name: 'Mặc Hương Đồng Xứ',
    bio: 'Tác giả chuyên viết truyện tiên hiệp và huyền huyễn. Đã xuất bản nhiều tác phẩm nổi tiếng.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    verified: true,
    location: 'Hàng Châu'
  },
  {
    id: 2,
    pen_name: 'Thiên Tàm Thổ Đậu',
    bio: 'Tác giả nổi tiếng với các tác phẩm kiếm hiệp và đô thị. Phong cách viết hấp dẫn, lôi cuốn.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    verified: true,
    location: 'Thành Đô, Tứ Xuyên'
  },
  {
    id: 3,
    pen_name: 'Vong Ngữ',
    bio: 'Bậc thầy khai sinh phong cách phàm nhân tu tiên, phong cách logic, chân thực.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    verified: true,
    location: 'Từ Châu'
  },
  {
    id: 4,
    pen_name: 'Hồ Điệp Lam',
    bio: 'Nhà văn chuyên dòng tiểu thuyết eSports võng du, phong cách hài hước và chiến thuật.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    verified: true,
    location: 'Vũ Hán'
  }
];

// Danh sách tiểu thuyết đối chiếu chuẩn CSDL sql_nhom_7.sql
// Không bịa đặt: Đánh giá dựa trên bảng ratings thực tế, lượt xem tăng thực tế khi đọc!
export const INITIAL_NOVELS = [
  {
    id: 1,
    title: 'Đấu Phá Thương Khung',
    slug: 'dau-pha-thuong-khung',
    author_id: 1,
    author_name: 'Mặc Hương Đồng Xứ',
    category: 'Tiên Hiệp',
    categories: ['Tiên Hiệp', 'Huyền Huyễn'],
    tags: ['Tu Tiên', 'Phế Vật Nghịch Thiên', 'Dị Hỏa'],
    description: 'Tam thập niên Hà Đông, tam thập niên Hà Tây, chớ khinh thiếu niên nghèo! Thiếu niên Tiêu Viêm, bị coi là phế vật, nhưng ẩn giấu linh hồn của Dược Tôn...',
    cover_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    status: 'completed',
    total_views: 5, // Lượt xem thực tế (tăng +1 mỗi khi vào đọc)
    is_featured: true,
    is_genius: true,
    discount_label: 'Tác phẩm hoàn thành',
    location_label: 'Đấu Khí Đại Lục · Ô Thản Thành',
    published_at: '2024-01-15',
    latest_update: 'Full 3 chương',
    chapters: [
      {
        id: 101,
        novel_id: 1,
        chapter_number: 1,
        title: 'Chương 1: Phế Vật Tiêu Viêm',
        word_count: 280,
        published_at: '2024-01-15',
        content: `Trên quảng trường rộng lớn của gia tộc Tiêu, thiếu niên Tiêu Viêm đứng lặng lẽ ở một góc. Ba năm trước, cậu còn được xưng tụng là thiên tài tu luyện hiếm có trong trăm năm của gia tộc. Thế nhưng, ba năm qua, thực lực của cậu không tiến mà lùi, từ Đấu Khí tầng chín tụt xuống tầng bảy, trở thành trò cười cho cả gia tộc...

Tiêu Viêm ngẩng đầu nhìn lên bầu trời, ánh mắt cậu tối tăm nhưng ẩn chứa một ngọn lửa không bao giờ tắt. "Tam thập niên Hà Đông, tam thập niên Hà Tây. Chớ khinh thiếu niên nghèo!" Cậu thầm nhủ trong lòng.`
      },
      {
        id: 102,
        novel_id: 1,
        chapter_number: 2,
        title: 'Chương 2: Dược Lão',
        word_count: 250,
        published_at: '2024-01-16',
        content: `Chiếc nhẫn cổ trên ngón tay Tiêu Viêm bỗng phát ra một luồng ánh sáng kỳ dị. Một giọng nói già nua vang lên trong đầu cậu: "Tiểu tử, ngươi đã đánh thức ta rồi..."

Tiêu Viêm giật mình, nhìn chiếc nhẫn trong kinh ngạc. "Ngươi... ngươi là ai?"

"Ta là Dược Trần, Dược Tôn đời thứ nhất. Ngươi có muốn lấy lại sức mạnh đã mất không?"`
      },
      {
        id: 103,
        novel_id: 1,
        chapter_number: 3,
        title: 'Chương 3: Khế Ước Tu Luyện',
        word_count: 260,
        published_at: '2024-01-18',
        content: `Dược Lão giải thích cho Tiêu Viêm biết nguyên nhân thực sự khiến thực lực của cậu suy giảm. Hóa ra, có một loại dị hỏa đang ẩn náu trong cơ thể cậu, liên tục hấp thu Đấu Khí...

"Dị Hỏa Phệ Nghiệt?" Tiêu Viêm kinh hoàng.

"Đúng vậy, nhưng đây không phải là tai họa, mà là cơ duyên lớn nhất đời ngươi. Chỉ cần ngươi có thể thuần phục nó, thực lực sẽ tăng vọt!" Dược Lão cười ha hả.`
      }
    ],
    // 2 đánh giá thực tế từ bảng ratings trong sql_nhom_7.sql
    reviews: [
      {
        id: 1,
        user: 'Lê Thị C',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
        score: 5,
        date: '10/10/2026',
        comment: 'Truyện hay tuyệt vời! Nhân vật Tiêu Viêm rất có cá tính.'
      },
      {
        id: 2,
        user: 'Phạm Văn D',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        score: 4,
        date: '08/10/2026',
        comment: 'Nội dung hấp dẫn, cốt truyện cuốn hút. Khuyên đọc!'
      }
    ]
  },
  {
    id: 2,
    title: 'Vũ Động Càn Khôn',
    slug: 'vu-dong-can-khon',
    author_id: 1,
    author_name: 'Mặc Hương Đồng Xứ',
    category: 'Tiên Hiệp',
    categories: ['Tiên Hiệp', 'Huyền Huyễn'],
    tags: ['Tu Tiên', 'Đấu Trí'],
    description: 'Thiếu niên Lâm Động, sống tại một thị trấn nhỏ. Tình cờ nhặt được một viên đá bí ẩn, từ đó bước vào con đường tu luyện đầy gian nan...',
    cover_image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
    status: 'completed',
    total_views: 3, // Lượt xem thực tế
    is_featured: true,
    is_genius: true,
    discount_label: 'Tác phẩm hoàn thành',
    location_label: 'Đại Viêm Vương Triều · Thanh Dương Trấn',
    published_at: '2024-02-01',
    latest_update: 'Full 2 chương',
    chapters: [
      {
        id: 201,
        novel_id: 2,
        chapter_number: 1,
        title: 'Chương 1: Lâm Động',
        word_count: 250,
        published_at: '2024-02-01',
        content: `Thanh Dương Trấn, một thị trấn nhỏ nằm ở rìa Đại Viêm Vương Triều. Nơi đây không có những cao thủ Đấu Khí đỉnh phong, chỉ có những gia tộc nhỏ tranh giành ảnh hưởng...

Thiếu niên Lâm Động ngồi bên bờ suối, tay cầm một viên đá đen bóng loáng. Viên đá này cậu nhặt được từ một hang động bí ẩn, và từ khi có nó, cậu luôn cảm thấy có một luồng năng lượng kỳ lạ chảy trong cơ thể.`
      },
      {
        id: 202,
        novel_id: 2,
        chapter_number: 2,
        title: 'Chương 2: Thạch Phù Bí Ẩn',
        word_count: 220,
        published_at: '2024-02-03',
        content: `Đêm khuya, Lâm Động đột nhiên phát hiện viên đá đen phát ra ánh sáng huyền bí. Một hình bóng mờ ảo hiện ra từ viên đá...

"Tiểu tử, ngươi đã tìm được Tổ Phù Thạch!" Giọng nói đầy uy nghiêm vang lên.`
      }
    ],
    // 1 đánh giá thực tế từ bảng ratings trong sql_nhom_7.sql
    reviews: [
      {
        id: 3,
        user: 'Lê Thị C',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
        score: 5,
        date: '12/10/2026',
        comment: 'Vũ Động Càn Khôn xứng danh kinh điển.'
      }
    ]
  },
  {
    id: 3,
    title: 'Đô Thị Cực Phẩm Cuồng Y',
    slug: 'do-thi-cuc-pham-cuong-y',
    author_id: 2,
    author_name: 'Thiên Tàm Thổ Đậu',
    category: 'Đô Thị',
    categories: ['Đô Thị'],
    tags: ['Sủng', 'Dị Năng'],
    description: 'Một thần y trẻ tuổi bước vào thành phố phồn hoa, với y thuật thần kỳ và tài năng phi thường...',
    cover_image: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=600&auto=format&fit=crop&q=80',
    status: 'ongoing',
    total_views: 2, // Lượt xem thực tế
    is_featured: false,
    is_genius: false,
    discount_label: 'Đang ra chương',
    location_label: 'Đô Thị Phồn Hoa',
    published_at: '2024-03-10',
    latest_update: '1 chương',
    chapters: [
      {
        id: 301,
        novel_id: 3,
        chapter_number: 1,
        title: 'Chương 1: Thần Y Xuất Sơn',
        word_count: 260,
        published_at: '2024-03-10',
        content: `Trên đỉnh núi mây phủ, một thanh niên khoảng hai mươi lăm tuổi đứng trước mộ sư phụ. Gió thổi mạnh làm tung bay tà áo trắng.

"Sư phụ, con sẽ xuống núi theo lời dặn của người. Hẹn gặp lại người ở kiếp sau."

Nói xong, thanh niên quay người, bước đi dứt khoát. Y thuật thần kỳ, một thân võ công cao cường, thế nhưng thành phố dưới chân núi mới là chiến trường thực sự của anh.`
      }
    ],
    // 1 đánh giá thực tế từ sql_nhom_7.sql
    reviews: [
      {
        id: 4,
        user: 'Phạm Văn D',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        score: 4,
        date: '14/10/2026',
        comment: 'Truyện đô thị hay, nhưng hơi chậm ở đầu.'
      }
    ]
  },
  {
    id: 4,
    title: 'Đại Chúa Tể',
    slug: 'dai-chu-te',
    author_id: 1,
    author_name: 'Mặc Hương Đồng Xứ',
    category: 'Tiên Hiệp',
    categories: ['Tiên Hiệp', 'Huyền Huyễn'],
    tags: ['Tu Tiên', 'Đấu Trí'],
    description: 'Thiên Địa đại loạn, chư hầu hùng cứ. Thiếu niên Mục Trần, vì bảo vệ người mình yêu thương mà bước vào thế giới tu luyện...',
    cover_image: 'https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?w=600&auto=format&fit=crop&q=80',
    status: 'ongoing',
    total_views: 1,
    is_featured: true,
    is_genius: true,
    discount_label: 'Đang cập nhật',
    location_label: 'Bắc Linh Cảnh',
    published_at: '2024-02-20',
    latest_update: '1 chương',
    chapters: [
      {
        id: 401,
        novel_id: 4,
        chapter_number: 1,
        title: 'Chương 1: Mục Vực Thiếu Chủ',
        word_count: 260,
        published_at: '2024-02-20',
        content: `Bắc Linh Cảnh, Mục Vực. Thiếu niên Mục Trần ngồi bên bờ hồ trong trẻo, từng bước dấn thân vào thế giới tu luyện vô tận...`
      }
    ],
    reviews: [] // Chưa có đánh giá trong sql_nhom_7.sql
  },
  {
    id: 5,
    title: 'Nhất Niệm Vĩnh Hằng',
    slug: 'nhat-niem-vinh-hang',
    author_id: 2,
    author_name: 'Thiên Tàm Thổ Đậu',
    category: 'Tiên Hiệp',
    categories: ['Tiên Hiệp', 'Huyền Huyễn'],
    tags: ['Tu Tiên', 'Trọng Sinh'],
    description: 'Một niệm vĩnh hằng, một niệm sinh diệt. Thiếu niên Bạch Tiểu Thuần bước vào thế giới tu tiên...',
    cover_image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    status: 'draft',
    total_views: 0,
    is_featured: false,
    is_genius: false,
    discount_label: 'Bản thảo',
    location_label: 'Linh Khê Tông',
    published_at: null,
    latest_update: '1 chương',
    chapters: [
      {
        id: 501,
        novel_id: 5,
        chapter_number: 1,
        title: 'Chương 1: Hắc Hương Cầu Tiên',
        word_count: 250,
        published_at: '2024-03-01',
        content: `Thiếu niên Bạch Tiểu Thuần thắp nén hương đen trên đỉnh đồi, một lòng muốn tu tiên trường sinh bất tử...`
      }
    ],
    reviews: [] // Chưa có đánh giá trong sql_nhom_7.sql
  },
  {
    id: 6,
    title: 'Phàm Nhân Tu Tiên',
    slug: 'pham-nhan-tu-tien',
    author_id: 3,
    author_name: 'Vong Ngữ',
    category: 'Tiên Hiệp',
    categories: ['Tiên Hiệp'],
    tags: ['Tu Tiên', 'Phế Vật Nghịch Thiên'],
    description: 'Hàn Lập - một thiếu niên bình thường xuất thân nghèo khó, từng bước gian nan tiến bước trên con đường tu tiên...',
    cover_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    status: 'completed',
    total_views: 4,
    is_featured: true,
    is_genius: true,
    discount_label: 'Kinh điển tu chân',
    location_label: 'Thiên Nam · Thất Huyền Môn',
    published_at: '2023-11-10',
    latest_update: '1 chương',
    chapters: [
      {
        id: 601,
        novel_id: 6,
        chapter_number: 1,
        title: 'Chương 1: Sơn Thôn Thiếu Niên',
        word_count: 320,
        published_at: '2023-11-10',
        content: `Hàn Lập sinh ra ở một thôn làng nghèo nàn hẻo lánh. Năm mười tuổi, Tam thúc đưa hắn đến Thất Huyền Môn tham gia khảo thí...`
      }
    ],
    reviews: []
  },
  {
    id: 7,
    title: 'Toàn Chức Cao Thủ',
    slug: 'toan-chuc-cao-thu',
    author_id: 4,
    author_name: 'Hồ Điệp Lam',
    category: 'Võng Du',
    categories: ['Võng Du', 'Đô Thị'],
    tags: ['eSports', 'Vinh Quang'],
    description: 'Diệp Tu - cao thủ đứng đầu Vinh Quang bị trục xuất khỏi câu lạc bộ, bắt đầu lại từ tiệm net Hưng Hân...',
    cover_image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    status: 'completed',
    total_views: 2,
    is_featured: true,
    is_genius: true,
    discount_label: 'eSports đỉnh cao',
    location_label: 'Hàng Châu · Quán Net Hưng Hân',
    published_at: '2023-12-05',
    latest_update: '1 chương',
    chapters: [
      {
        id: 701,
        novel_id: 7,
        chapter_number: 1,
        title: 'Chương 1: Bị Trục Xuất Khỏi Gia Thế',
        word_count: 290,
        published_at: '2023-12-05',
        content: `Đêm tuyết rơi trắng xóa thành phố Hàng Châu. Diệp Tu đặt chiếc thẻ tài khoản Nhất Diệp Chi Thu xuống mặt bàn, quay lưng bước ra khỏi trụ sở...`
      }
    ],
    reviews: []
  },
  {
    id: 8,
    title: 'Ma Đạo Tổ Sư',
    slug: 'ma-dao-to-su',
    author_id: 1,
    author_name: 'Mặc Hương Đồng Xứ',
    category: 'Tiên Hiệp',
    categories: ['Tiên Hiệp', 'Ngôn Tình'],
    tags: ['Trọng Sinh', 'Tu Tiên'],
    description: 'Ngụy Vô Tiện - Di Lăng Lão Tổ từng khuấy đảo tu chân giới, sau mười ba năm trọng sinh trong thân xác Mạc Huyền Vũ...',
    cover_image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop&q=80',
    status: 'completed',
    total_views: 3,
    is_featured: true,
    is_genius: true,
    discount_label: 'Đã hoàn thành',
    location_label: 'Vân Thâm Bất Tri Xứ',
    published_at: '2023-10-01',
    latest_update: '1 chương',
    chapters: [
      {
        id: 801,
        novel_id: 8,
        chapter_number: 1,
        title: 'Chương 1: Trùng Sinh',
        word_count: 310,
        published_at: '2023-10-01',
        content: `"Ngụy Vô Tiện đã chết! Đại khoái nhân tâm!" Vừa tỉnh lại, bên tai Ngụy Vô Tiện đã vang lên những âm thanh ồn ào chửi bới...`
      }
    ],
    reviews: []
  }
];

export const STUDENT_GROUP_INFO = {
  group_name: 'Nhóm 7',
  class_name: 'Lớp Lập Trình Web Nâng Cao',
  university: 'Trường Đại Học Phenikaa (Khoa CNTT)',
  project_title: 'Hệ Thống Quản Lý & Đọc Tiểu Thuyết (Novel Manager)',
  design_system: 'Booking.com Layout & Design Aesthetics',
  members: [
    {
      id: 1,
      name: 'Lê Thanh Bình',
      student_id: '23010242',
      email: '23010242@st.phenikaa-uni.edu.vn',
      role: 'Trưởng nhóm',
      tasks: 'Thiết kế CSDL, tạo sql_nhom_7.sql, dbconnection.js, CRUD Novels & Categories, Front-end Booking Architecture'
    },
    {
      id: 2,
      name: 'Trần Tiến Đức',
      student_id: '23010777',
      email: '23010777@st.phenikaa-uni.edu.vn',
      role: 'Thành viên',
      tasks: 'Khởi tạo khung Express, định tuyến API, CRUD Users & Authors, React-Bootstrap Components'
    },
    {
      id: 3,
      name: 'Nguyễn Tiến Hoàng Vũ',
      student_id: '23010233',
      email: '23010233@st.phenikaa-uni.edu.vn',
      role: 'Thành viên',
      tasks: 'Cấu hình môi trường Local, CRUD Chapters & Tags, Reader Experience'
    }
  ]
};
