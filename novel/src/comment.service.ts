import { Injectable } from '@nestjs/common';
import { Comment } from './entities';
import { CollectionService } from './domain.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService extends CollectionService<Comment> {
	constructor(@InjectRepository(Comment) repository: Repository<Comment>) { super(repository); }
}