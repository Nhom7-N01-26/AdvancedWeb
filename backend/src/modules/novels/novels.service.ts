import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { NovelEntity } from './entities/novel.entity';
import { CategoryEntity } from '../categories/entities/category.entity';
import { AuthorEntity } from '../authors/entities/author.entity';
import { CreateNovelDto, QueryNovelDto } from './dto/novel.dto';
import { NovelStatus } from '../../common/enums';

@Injectable()
export class NovelsService {
  constructor(
    @InjectRepository(NovelEntity)
    private novelRepo: Repository<NovelEntity>,
    @InjectRepository(CategoryEntity)
    private catRepo: Repository<CategoryEntity>,
    @InjectRepository(AuthorEntity)
    private authorRepo: Repository<AuthorEntity>,
  ) {}

  async findAll(query: QueryNovelDto): Promise<{
    items: NovelEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 12;
    const skip = (page - 1) * limit;

    // Xử lý tối ưu Eager Loading chống N+1 Query (Câu 6b)
    const qb = this.novelRepo
      .createQueryBuilder('novel')
      .leftJoinAndSelect('novel.author', 'author')
      .leftJoinAndSelect('novel.categories', 'category');

    // Tìm kiếm từ khóa (Full-Text Search Index - Câu 6b)
    if (query.keyword) {
      qb.andWhere(
        '(novel.title LIKE :kw OR novel.description LIKE :kw OR author.pen_name LIKE :kw)',
        { kw: `%${query.keyword}%` },
      );
    }

    // Lọc theo thể loại
    if (query.category_id) {
      qb.andWhere('category.id = :catId', { catId: query.category_id });
    }

    // Lọc theo trạng thái
    if (query.status) {
      qb.andWhere('novel.status = :status', { status: query.status });
    }

    // Lọc theo đánh giá tối thiểu (Phong cách Booking.com: ví dụ >= 8.0/10 hoặc >= 4.0/5 sao)
    if (query.min_rating) {
      qb.andWhere('novel.avg_rating >= :minRating', {
        minRating: query.min_rating,
      });
    }

    // Sắp xếp
    const sortField = query.sort_by || 'created_at';
    const sortOrder = query.sort_order || 'DESC';
    qb.orderBy(`novel.${sortField}`, sortOrder);

    qb.skip(skip).take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findFeatured(): Promise<NovelEntity[]> {
    return await this.novelRepo.find({
      where: { is_featured: true },
      relations: {
        author: true,
        categories: true,
      },
      order: { avg_rating: 'DESC', total_views: 'DESC' },
      take: 6,
    });
  }

  async findBySlug(slugOrId: string): Promise<NovelEntity> {
    const isId = /^\d+$/.test(slugOrId);
    const whereCondition = isId ? { id: parseInt(slugOrId, 10) } : { slug: slugOrId };

    const novel = await this.novelRepo.findOne({
      where: whereCondition,
      relations: {
        author: true,
        categories: true,
        tags: true,
        chapters: true,
      },
    });

    if (!novel) {
      throw new NotFoundException(`Không tìm thấy truyện với đường dẫn hoặc ID: ${slugOrId}`);
    }

    // Sắp xếp chapters theo số thứ tự
    if (novel.chapters) {
      novel.chapters.sort((a, b) => a.chapter_number - b.chapter_number);
    }

    return novel;
  }

  async findById(id: number): Promise<NovelEntity> {
    const novel = await this.novelRepo.findOne({
      where: { id },
      relations: {
        author: true,
        categories: true,
      },
    });
    if (!novel) {
      throw new NotFoundException('Không tìm thấy truyện');
    }
    return novel;
  }

  async incrementViews(id: number): Promise<number> {
    await this.novelRepo.increment({ id }, 'total_views', 1);
    const updated = await this.novelRepo.findOne({
      where: { id },
      select: { id: true, total_views: true },
    });
    return updated ? updated.total_views : 1;
  }

  async create(dto: CreateNovelDto, userId: number): Promise<NovelEntity> {
    let author = await this.authorRepo.findOne({ where: { user_id: userId } });
    if (!author) {
      author = this.authorRepo.create({
        user_id: userId,
        pen_name: 'Tác Giả Mới',
      });
      author = await this.authorRepo.save(author);
    }

    let slug = this.slugify(dto.title);
    const existing = await this.novelRepo.findOne({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    let categories: CategoryEntity[] = [];
    if (dto.category_ids && dto.category_ids.length > 0) {
      categories = await this.catRepo.findBy({ id: In(dto.category_ids) });
    }

    const novel = this.novelRepo.create({
      author_id: author.id,
      title: dto.title,
      slug,
      description: dto.description || '',
      cover_image: dto.cover_image || '/public/covers/default_cover.jpg',
      status: dto.status || NovelStatus.ONGOING,
      categories,
      published_at: new Date(),
    });

    return await this.novelRepo.save(novel);
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }
}
