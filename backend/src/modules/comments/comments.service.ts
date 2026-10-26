import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from './entities/comment.entity';
import { CreateCommentDto } from './dto/comment.dto';
import { UserRole } from '../../common/enums';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepo: Repository<CommentEntity>,
  ) {}

  async findByNovel(novelId: number, chapterId?: number): Promise<any[]> {
    const query = this.commentRepo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.chapter', 'chapter')
      .leftJoinAndSelect('comment.replies', 'reply')
      .leftJoinAndSelect('reply.user', 'replyUser')
      .where('comment.parent_id IS NULL')
      .andWhere('comment.is_hidden = false');

    if (chapterId) {
      query.andWhere('comment.chapter_id = :chapterId', { chapterId });
    } else {
      query.andWhere('chapter.novel_id = :novelId', { novelId });
    }

    query.orderBy('comment.created_at', 'DESC');
    query.addOrderBy('reply.created_at', 'ASC');

    const comments = await query.getMany();

    return comments.map((c) => ({
      id: c.id,
      content: c.content,
      created_at: c.created_at,
      chapter_id: c.chapter_id,
      user: {
        id: c.user?.id,
        username: c.user?.username,
        full_name: c.user?.full_name,
        avatar_url: c.user?.avatar_url,
      },
      replies: (c.replies || []).map((r) => ({
        id: r.id,
        content: r.content,
        created_at: r.created_at,
        user: {
          id: r.user?.id,
          username: r.user?.username,
          full_name: r.user?.full_name,
          avatar_url: r.user?.avatar_url,
        },
      })),
    }));
  }

  async create(userId: number, dto: CreateCommentDto): Promise<CommentEntity> {
    const comment = this.commentRepo.create({
      chapter_id: dto.chapter_id || 1,
      parent_id: dto.parent_id || null,
      user_id: userId,
      content: dto.content,
    });

    return await this.commentRepo.save(comment);
  }

  async remove(commentId: number, userId: number, userRole: UserRole): Promise<{ message: string }> {
    const comment = await this.commentRepo.findOne({ where: { id: commentId } });
    if (!comment) {
      throw new NotFoundException('Không tìm thấy bình luận');
    }

    if (comment.user_id !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Bạn không có quyền xóa bình luận này');
    }

    await this.commentRepo.remove(comment);
    return { message: 'Đã xóa bình luận thành công' };
  }
}
