import { Injectable } from '@nestjs/common';
import { Rating } from './entities';
import { CollectionService } from './domain.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RatingService extends CollectionService<Rating> {
	constructor(@InjectRepository(Rating) repository: Repository<Rating>) { super(repository); }
}