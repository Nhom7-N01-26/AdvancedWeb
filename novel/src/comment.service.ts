import { Injectable } from '@nestjs/common';
import { Comment } from './entities';
import { CollectionService } from './domain.service';

@Injectable()
export class CommentService extends CollectionService<Comment> {}